package org.pockettts.android.engine

import org.junit.Assert.*
import org.junit.Test
import java.io.File

class DeepFilterRecordingTest {
    @Test fun canonicalRecordingAndWaveformPreservePcm() {
        val file = File.createTempFile("denoise-test", ".wav")
        try {
            val pcm = FloatArray(ReferenceRate.WORKING_RATE * 3) { if (it < 1500) -.5f else .25f }
            PcmWav.Writer(file, ReferenceRate.WORKING_RATE).use { it.write(pcm) }
            val original = file.readBytes()
            val decoded = DeepFilterNet3Denoiser.readRecording(file)
            assertEquals(pcm.size, decoded.size)
            val waveform = DeepFilterNet3Denoiser.waveform(decoded)
            assertEquals(48, waveform.size)
            assertEquals(.5f, waveform.first(), .0001f)
            assertEquals(.25f, waveform.last(), .0001f)
            assertArrayEquals(original, file.readBytes())
            java.io.RandomAccessFile(file, "rw").use { it.seek(24); it.writeInt(0) }
            assertTrue(runCatching { DeepFilterNet3Denoiser.readRecording(file) }.isFailure)
        } finally { file.delete() }
    }

    @Test fun workingRateRecordingIsRejectedAtConditioningRate() {
        // A 48 kHz buffer is not a valid 24 kHz recording. The reader must
        // refuse it rather than resample silently.
        val file = File.createTempFile("denoise-rate-test", ".wav")
        try {
            val pcm = FloatArray(ReferenceRate.WORKING_RATE * 3) { .1f }
            PcmWav.Writer(file, ReferenceRate.WORKING_RATE).use { it.write(pcm) }
            val header = file.readBytes().copyOf(44)
            assertTrue(runCatching { DeepFilterNet3Denoiser.readRecording(file) }.isSuccess)
            assertFalse(header.contentEquals(PcmWav.header(pcm.size * 2L, ReferenceRate.CONDITIONING_RATE)))
        } finally { file.delete() }
    }
}
