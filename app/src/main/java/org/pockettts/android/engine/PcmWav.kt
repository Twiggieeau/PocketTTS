package org.pockettts.android.engine

import java.io.File
import java.io.OutputStream
import java.io.RandomAccessFile
import java.nio.ByteBuffer
import java.nio.ByteOrder

/** Canonical 44-byte PCM16 header (mono 24 kHz by default). Imported WAVs are not assumed to match. */
internal object PcmWav {
    const val RATE = 24_000
    // Uncompressed WAV bytes, not compressed video size or a single heap allocation.
    const val MAX_VOICE_BYTES = 256L * 1024 * 1024
    const val MAX_SOURCE_SECONDS = 30 * 60
    const val MAX_SOURCE_MS = MAX_SOURCE_SECONDS * 1000L
    const val SIZE_ERROR = "WAV audio exceeds the 256 MB (256 MiB) limit"
    const val DURATION_ERROR = "Choose audio of 30 minutes or less"
    /** Validate the uncompressed formats understood by the native reference-voice loader. */
    fun isVoiceSample(file: File): Boolean = runCatching { validateVoiceSample(file) }.isSuccess
    fun validateVoiceSample(file: File) {
        require(file.length() <= MAX_VOICE_BYTES) { SIZE_ERROR }
        RandomAccessFile(file, "r").use { input ->
            fun tag(): String = ByteArray(4).also(input::readFully).toString(Charsets.US_ASCII)
            fun u32(): Long = Integer.reverseBytes(input.readInt()).toLong() and 0xffff_ffffL
            fun u16(): Int = java.lang.Short.reverseBytes(input.readShort()).toInt() and 0xffff
            require(tag() == "RIFF") { "Select a valid uncompressed WAV file" }
            val limit = u32() + 8
            require(limit in 44..input.length() && tag() == "WAVE") { "The WAV file is incomplete or invalid" }
            var alignment = 0
            var sampleRate = 0L
            var dataBytes = 0L
            while (input.filePointer + 8 <= limit) {
                val kind = tag()
                val size = u32()
                val start = input.filePointer
                require(size <= limit - start) { "The WAV file is incomplete or invalid" }
                if (kind == "fmt ") {
                    require(size >= 16) { "The WAV format header is incomplete" }
                    val format = u16(); val channels = u16(); val rate = u32(); val byteRate = u32()
                    sampleRate = rate
                    alignment = u16(); val bits = u16()
                    require(channels in 1..8 && rate in 8000..192000) { "Unsupported WAV sample rate or channel count" }
                    require((format == 1 && bits in listOf(8, 16, 24, 32)) || (format == 3 && bits in listOf(32, 64))) { "Choose an uncompressed PCM or float WAV file" }
                    require(alignment == channels * bits / 8 && byteRate == rate * alignment) { "The WAV format header is invalid" }
                } else if (kind == "data") dataBytes += size
                input.seek(start + size + (size and 1))
            }
            require(alignment > 0 && dataBytes >= alignment && dataBytes % alignment == 0L) { "The WAV contains no valid audio frames" }
            require(dataBytes / alignment <= sampleRate * MAX_SOURCE_SECONDS) { DURATION_ERROR }
        }
    }

    fun header(bytes: Long, rate: Int = RATE, channels: Int = 1): ByteArray {
        require(rate in 8000..192000 && channels in 1..8)
        require(bytes in 0..0xffff_ffffL - 36 && bytes % (2 * channels) == 0L) { "WAV exceeds the RIFF size limit" }
        return ByteBuffer.allocate(44).order(ByteOrder.LITTLE_ENDIAN).apply {
            put("RIFF".toByteArray()); putInt((bytes + 36).toInt()); put("WAVEfmt ".toByteArray())
            putInt(16); putShort(1); putShort(channels.toShort()); putInt(rate); putInt(rate * channels * 2)
            putShort((channels * 2).toShort()); putShort(16); put("data".toByteArray()); putInt(bytes.toInt())
        }.array()
    }

    class Writer(file: File, private val rate: Int = RATE, private val channels: Int = 1) : AutoCloseable {
        private val output = RandomAccessFile(file, "rw").apply { setLength(0); write(header(0, rate, channels)) }
        var bytes = 0L
            private set
        fun write(samples: FloatArray) {
            val buffer = ByteBuffer.allocate(samples.size * 2).order(ByteOrder.LITTLE_ENDIAN)
            samples.forEach { buffer.putShort((it.coerceIn(-1f, 1f) * 32767f).toInt().toShort()) }
            write(buffer.array(), buffer.position())
        }
        fun write(buffer: ByteArray, count: Int) {
            require(count in 0..buffer.size && count % 2 == 0)
            require(bytes + count <= 0xffff_ffffL - 36)
            output.write(buffer, 0, count)
            bytes += count
        }
        override fun close() {
            try { output.seek(0); output.write(header(bytes, rate, channels)) } finally { output.close() }
        }
    }

    /**
     * Concatenate chunk files into one WAV stream.
     *
     * [rate] is the output sample rate. The default is the model's native
     * [RATE]; a higher rate is an explicit choice for video editing and does
     * not add information, because the decoder already produces [RATE].
     */
    fun concatenate(files: List<File>, output: OutputStream, rate: Int = RATE) {
        require(rate == RATE || rate == ReferenceRate.WORKING_RATE) { "Unsupported export rate" }
        if (rate == RATE) {
            val size = files.sumOf { it.length() - 44 }
            output.write(header(size))
            files.forEach { file ->
                file.inputStream().buffered().use { input ->
                    val actual = ByteArray(44)
                    require(input.read(actual) == 44 && actual.contentEquals(header(file.length() - 44)))
                    input.copyTo(output)
                }
            }
            return
        }
        // Resample each chunk and emit a single 48 kHz stream.
        val samples = ArrayList<Float>(files.size * 4096)
        files.forEach { file ->
            val pcm = readSamples(file)
            samples.addAll(ReferenceRate.toWorking(pcm, RATE).toList())
        }
        val merged = samples.toFloatArray()
        val size = merged.size * 2L
        output.write(header(size, rate))
        val buffer = ByteBuffer.allocate(merged.size * 2).order(ByteOrder.LITTLE_ENDIAN)
        merged.forEach { buffer.putShort((it.coerceIn(-1f, 1f) * 32767f).toInt().toShort()) }
        output.write(buffer.array())
    }

    /** Read a canonical PCM16 mono WAV file into normalised floats. */
    fun readSamples(file: File): FloatArray {
        RandomAccessFile(file, "r").use { input ->
            val header = ByteArray(44); input.readFully(header)
            val bytes = (file.length() - 44).toInt()
            require(bytes >= 0 && bytes % 2 == 0) { "Invalid WAV length" }
            val pcm = ByteArray(bytes); input.readFully(pcm)
            return FloatArray(pcm.size / 2) { index ->
                ((pcm[index * 2].toInt() and 255) or (pcm[index * 2 + 1].toInt() shl 8)).toShort() / 32768f
            }
        }
    }
}
