package org.pockettts.android.engine

import java.io.File

/** Background-only WAV scan/selection using the decoder already bundled for DeepFilter. */
internal object WavSamples {
    init { System.loadLibrary("deepfilter_jni") }
    data class Info(val durationMs: Int, val peaks: List<Float>)

    /**
     * Decode [startMs]..[endMs] of [file] at [rate].
     *
     * Use [ReferenceRate.WORKING_RATE] for audio that still has to pass through
     * DeepFilterNet3, and [ReferenceRate.CONDITIONING_RATE] for the reference
     * handed to the model.
     */
    fun decode(file: File, startMs: Int, endMs: Int, rate: Int = ReferenceRate.CONDITIONING_RATE): FloatArray {
        PcmWav.validateVoiceSample(file)
        return nativeDecode(file.absolutePath, startMs, endMs, rate)
    }

    fun inspect(file: File, cancellation: java.util.concurrent.atomic.AtomicBoolean? = null): Info {
        PcmWav.validateVoiceSample(file)
        val data = nativeInspect(file.absolutePath, PcmWav.MAX_SOURCE_SECONDS, cancellation)
        return Info(data[0].toInt(), data.drop(1))
    }

    /**
     * Cut [startMs]..[endMs] out of [source] and write mono PCM16 at [rate].
     * The selection is never resampled back down before enhancement.
     */
    fun trim(source: File, target: File, startMs: Int = 0, endMs: Int = -1, gain: Float = 1f,
             rate: Int = ReferenceRate.WORKING_RATE): Float {
        require(source.canonicalFile != target.canonicalFile)
        PcmWav.validateVoiceSample(source)
        val pcm = nativeDecode(source.absolutePath, startMs, endMs, rate)
        val minimum = rate * 3
        val maximum = rate * 30
        require(pcm.size in minimum..maximum && pcm.all { it.isFinite() })
        val applied = if (gain == 1f) 1f else PcmGain.apply(pcm, gain)
        try { PcmWav.Writer(target, rate).use { it.write(pcm) } }
        catch (error: Throwable) { target.delete(); throw error }
        return applied
    }

    private external fun nativeInspect(path: String, maxSeconds: Int, cancellation: java.util.concurrent.atomic.AtomicBoolean?): FloatArray
    private external fun nativeDecode(path: String, startMs: Int, endMs: Int, targetRate: Int): FloatArray
}
