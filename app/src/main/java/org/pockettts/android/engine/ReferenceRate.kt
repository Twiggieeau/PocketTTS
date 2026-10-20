package org.pockettts.android.engine

/**
 * Sample-rate contract for the voice-reference pipeline.
 *
 * The stages have different native rates, and conflating them costs quality:
 *
 *  - **DeepFilterNet3** runs at 48 kHz. Its STFT uses 960-sample frames and its
 *    ERB bands are calibrated for 48 kHz. Feeding it 24 kHz audio leaves the
 *    12–24 kHz band empty, which biases the noise estimate.
 *  - **Pocket TTS** conditions and synthesises at 24 kHz. The reference that
 *    reaches the speaker encoder must be 24 kHz mono PCM16.
 *
 * So the pipeline keeps audio at [WORKING_RATE] through trim and denoise, and
 * converts to [CONDITIONING_RATE] exactly once, when the reference file is
 * written for the model.
 */
internal object ReferenceRate {
    /** Native rate for DeepFilterNet3. Trim and enhance happen at this rate. */
    const val WORKING_RATE = 48_000

    /** Native rate for the Pocket TTS model and for stored reference files. */
    const val CONDITIONING_RATE = 24_000

    /** Native rate for exported delivery audio. */
    const val OUTPUT_RATE = 24_000

    /** Convert a [WORKING_RATE] buffer down to the conditioning rate. */
    fun toConditioning(samples: FloatArray, rate: Int = WORKING_RATE): FloatArray {
        if (rate == CONDITIONING_RATE) return samples
        require(rate > 0 && samples.all { it.isFinite() }) { "Invalid reference audio" }
        return Resampler.resample(samples, rate, CONDITIONING_RATE)
    }

    /** Convert a conditioning-rate buffer up to the working rate. */
    fun toWorking(samples: FloatArray, rate: Int = CONDITIONING_RATE): FloatArray {
        if (rate == WORKING_RATE) return samples
        require(rate > 0 && samples.all { it.isFinite() }) { "Invalid reference audio" }
        return Resampler.resample(samples, rate, WORKING_RATE)
    }
}

/**
 * Options for a Reader export.
 *
 * The default is the model's native rate. [rate] of 48 kHz is an explicit
 * opt-in for video editing workflows; it doubles the file size without adding
 * information, because the decoder already produces 24 kHz.
 */
internal data class ExportOptions(
    val rate: Int = ReferenceRate.OUTPUT_RATE,
    val provenance: Boolean = true,
)

/**
 * Pure-Kotlin polyphase resampler used where the native pipeline has no
 * equivalent, or where a sample-rate conversion must be explicit and
 * testable on the JVM.
 *
 * This is a windowed-sinc interpolator with a Blackman window, matching the
 * quality bar of the native resampler without pulling in a native dependency.
 */
internal object Resampler {
    private const val TAPS = 24
    private const val OVERSAMPLE = 64

    /** Blackman window over the kernel support. */
    private fun blackman(x: Double, half: Int): Double {
        val n = (x + half) / (2.0 * half)
        if (n < 0.0 || n > 1.0) return 0.0
        return 0.42 - 0.5 * kotlin.math.cos(2.0 * Math.PI * n) +
            0.08 * kotlin.math.cos(4.0 * Math.PI * n)
    }

    /**
     * Resample mono [samples] from [fromRate] to [toRate].
     * Returns a buffer of `round(samples.size * toRate / fromRate)` samples.
     */
    fun resample(samples: FloatArray, fromRate: Int, toRate: Int): FloatArray {        require(fromRate > 0 && toRate > 0) { "Invalid sample rate" }
        require(samples.all { it.isFinite() }) { "Invalid samples" }
        if (fromRate == toRate) return samples.copyOf()
        if (samples.isEmpty()) return FloatArray(0)

        val ratio = toRate.toDouble() / fromRate.toDouble()
        // Anti-alias cutoff: the lower of the two Nyquist limits.
        val cutoff = minOf(1.0, ratio).coerceAtLeast(1e-6)
        val outSize = Math.round(samples.size * ratio).toInt().coerceAtLeast(1)
        val out = FloatArray(outSize)
        val half = TAPS / 2
        val kernel = FloatArray(TAPS * OVERSAMPLE)

        // Precompute the fractional-delay kernel table.
        for (phase in 0 until OVERSAMPLE) {
            val frac = phase.toDouble() / OVERSAMPLE
            var sum = 0.0
            for (tap in 0 until TAPS) {
                val t = tap - half - frac
                // The cutoff belongs inside the sinc argument. Scaling it
                // outside would leave the anti-alias filter in the wrong place.
                val scaled = cutoff * t
                val sinc = if (kotlin.math.abs(scaled) < 1e-9) 1.0
                else kotlin.math.sin(Math.PI * scaled) / (Math.PI * scaled)
                val value = sinc * blackman(t, half) * cutoff
                kernel[phase * TAPS + tap] = value.toFloat()
                sum += value
            }
            // Normalise so the kernel sums to one and introduces no gain error.
            if (kotlin.math.abs(sum) > 1e-12) {
                val inverse = (1.0 / sum).toFloat()
                for (tap in 0 until TAPS) kernel[phase * TAPS + tap] *= inverse
            }
        }

        for (index in 0 until outSize) {
            // Position in the source stream for this output sample.
            val position = index / ratio
            val base = kotlin.math.floor(position).toInt()
            val frac = position - base
            val phase = ((frac * OVERSAMPLE).toInt()).coerceIn(0, OVERSAMPLE - 1)
            val offset = phase * TAPS
            var accumulator = 0f
            for (tap in 0 until TAPS) {
                val source = base + tap - half
                if (source in samples.indices) accumulator += samples[source] * kernel[offset + tap]
            }
            out[index] = accumulator
        }
        return out
    }
}
