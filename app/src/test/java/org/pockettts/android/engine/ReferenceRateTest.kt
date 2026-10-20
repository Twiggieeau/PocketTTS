package org.pockettts.android.engine

import org.junit.Assert.*
import org.junit.Test
import kotlin.math.abs
import kotlin.math.sin

/**
 * The reference pipeline has three rates, and conflating them costs quality:
 * DeepFilterNet3 needs 48 kHz, the model needs 24 kHz.
 */
class ReferenceRateTest {
    @Test fun resamplerPreservesLengthRatio() {
        val input = FloatArray(4800) { (it % 100) / 100f }
        val half = Resampler.resample(input, 48_000, 24_000)
        assertEquals(2400, half.size)
        val double = Resampler.resample(input, 24_000, 48_000)
        assertEquals(9600, double.size)
    }

    @Test fun resamplerIsIdentityAtTheSameRate() {
        val input = FloatArray(64) { it / 64f }
        assertArrayEquals(input, Resampler.resample(input, 24_000, 24_000), 0f)
    }

    @Test fun resamplerPreservesAContinuousTone() {
        val rate = 48_000
        val frequency = 440.0
        val input = FloatArray(rate / 2) { sin(2.0 * Math.PI * frequency * it / rate).toFloat() }
        val output = Resampler.resample(input, rate, 24_000)
        assertEquals(input.size / 2, output.size)
        // Measure the zero-crossing rate of the output. A 440 Hz tone stays
        // 440 Hz after a correct conversion.
        var crossings = 0
        for (i in 1 until output.size) {
            if (output[i - 1] <= 0f && output[i] > 0f) crossings++
        }
        val seconds = output.size.toDouble() / 24_000
        val measured = crossings / seconds
        assertTrue("measured $measured Hz, expected about $frequency Hz", abs(measured - frequency) < 5.0)
    }

    @Test fun resamplerDoesNotCreateSilentAudio() {
        val input = FloatArray(4_800) { sin(it * 0.05).toFloat() }
        val output = Resampler.resample(input, 48_000, 24_000)
        assertTrue(output.any { abs(it) > 0.1f })
    }

    @Test fun conditioningConversionHalvesTheSampleCount() {
        val working = FloatArray(ReferenceRate.WORKING_RATE * 2) { .25f }
        val conditioning = ReferenceRate.toConditioning(working, ReferenceRate.WORKING_RATE)
        assertEquals(ReferenceRate.CONDITIONING_RATE * 2, conditioning.size)
    }

    @Test fun workingConversionDoublesTheSampleCount() {
        val conditioning = FloatArray(ReferenceRate.CONDITIONING_RATE * 2) { .25f }
        val working = ReferenceRate.toWorking(conditioning, ReferenceRate.CONDITIONING_RATE)
        assertEquals(ReferenceRate.WORKING_RATE * 2, working.size)
    }

    @Test fun conditioningRateIsTheModelRate() {
        // The Pocket TTS decoder and the stored reference files are 24 kHz.
        assertEquals(24_000, ReferenceRate.CONDITIONING_RATE)
        assertEquals(24_000, PcmWav.RATE)
    }

    @Test fun workingRateIsTheDenoiserRate() {
        // DeepFilterNet3 is calibrated for 48 kHz: 960-sample STFT frames.
        assertEquals(48_000, ReferenceRate.WORKING_RATE)
    }
}
