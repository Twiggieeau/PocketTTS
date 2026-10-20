#pragma once

// Graph invocation adapted from speech-core DeepFilterEnhancer::enhance.
// DSP routines and tensor layouts are upstream; only ORT/session ownership differs.
#include "deepfilter_dsp.h"
#include "speech_core/audio/resampler.h"
#include <onnxruntime_cxx_api.h>
#include <array>
#include <cmath>
#include <stdexcept>

namespace pocket_denoise {
namespace dsp = speech_core::deepfilter_dsp;
class Denoiser {
    Ort::Env env_{ORT_LOGGING_LEVEL_WARNING, "DeepFilterNet3"};
    Ort::Session session_{nullptr};
    dsp::Config config_;
    std::vector<int> widths_ = dsp::make_erb_widths(config_);
    std::vector<float> window_ = dsp::make_vorbis_window(config_.fft_size);
public:
    explicit Denoiser(const ORTCHAR_T* path) {
        Ort::SessionOptions options;
        options.SetIntraOpNumThreads(2);
        options.SetInterOpNumThreads(1);
        options.SetGraphOptimizationLevel(GraphOptimizationLevel::ORT_ENABLE_ALL);
        session_ = Ort::Session(env_, path, options);
    }
    // Denoise mono PCM at the DeepFilterNet3 native rate (48 kHz).
    //
    // The graph is calibrated for 48 kHz: 960-sample STFT frames and ERB bands
    // sized for that rate. Audio arrives already at 48 kHz, so no resampling
    // happens here. A 24 kHz path exists for compatibility but is not used by
    // the reference pipeline, which would otherwise hand the network an empty
    // 12-24 kHz band.
    static constexpr int kNativeRate = 48000;

    std::vector<float> process(const std::vector<float>& pcm) {
        if (pcm.size() < kNativeRate * 3 || pcm.size() > kNativeRate * 30)
            throw std::invalid_argument("Record between 3 and 30 seconds at 48000 Hz");
        for (float sample : pcm) if (!std::isfinite(sample) || std::abs(sample) > 1.001f)
            throw std::invalid_argument("Invalid PCM sample");
        const auto& input = pcm;
        std::vector<float> re, im, erb, spec;
        dsp::analyze(input.data(), input.size(), config_, window_, re, im);
        const int frames = dsp::frame_count(input.size(), config_);
        dsp::compute_features(re, im, frames, config_, widths_, erb, spec);
        auto memory = Ort::MemoryInfo::CreateCpu(OrtArenaAllocator, OrtMemTypeDefault);
        const std::array<int64_t, 4> erbShape{1, 1, frames, 32}, specShape{1, 2, frames, 96};
        std::array<Ort::Value, 2> tensors{
            Ort::Value::CreateTensor<float>(memory, erb.data(), erb.size(), erbShape.data(), 4),
            Ort::Value::CreateTensor<float>(memory, spec.data(), spec.size(), specShape.data(), 4)};
        const char* inputs[] = {"feat_erb", "feat_spec"};
        const char* outputs[] = {"erb_mask", "df_coefs"};
        auto result = session_.Run(Ort::RunOptions{nullptr}, inputs, tensors.data(), 2, outputs, 2);
        const std::vector<std::vector<int64_t>> expected{{1, 1, frames, 32}, {1, 5, frames, 96, 2}};
        for (size_t i = 0; i < result.size(); ++i) {
            const auto info = result[i].GetTensorTypeAndShapeInfo();
            if (info.GetShape() != expected[i] || info.GetElementType() != ONNX_TENSOR_ELEMENT_DATA_TYPE_FLOAT)
                throw std::runtime_error("DeepFilterNet3 tensor contract mismatch");
        }
        std::vector<float> enhancedRe, enhancedIm;
        dsp::apply_network_output(re, im, result[0].GetTensorData<float>(), result[1].GetTensorData<float>(),
                                 frames, config_, widths_, enhancedRe, enhancedIm);
        dsp::synthesize(enhancedRe, enhancedIm, frames, config_, window_, input.data(), input.size());
        const auto& output = input;
        if (output.size() != pcm.size()) throw std::runtime_error("Denoising changed sample count");
        for (float sample : output) if (!std::isfinite(sample))
            throw std::runtime_error("DeepFilterNet3 returned non-finite audio");
        return output;
    }
};
} // namespace pocket_denoise
