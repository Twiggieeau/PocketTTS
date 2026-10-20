package org.pockettts.android.engine

import java.io.File
import java.io.RandomAccessFile
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.time.LocalDate

/**
 * Provenance stamping for exported audio.
 *
 * Two mechanisms exist and they are not equivalent:
 *
 *  - **Metadata tags** (RIFF `LIST`/`INFO` or ID3) are readable, removable, and
 *    are stripped by most re-encoders. They describe the file, they do not
 *    travel with the audio.
 *  - **Acoustic watermarking** embeds an imperceptible signal in the samples
 *    themselves. It survives format conversion, but it is not verifiable by
 *    eye and is not implemented here.
 *
 * This app writes the metadata tag only, and the UI says so. A file exported
 * with this stamp is identifiable as synthetic speech by anyone who inspects
 * the container, but the stamp is not a tamper-proof watermark and should not
 * be presented as one.
 */
internal object Provenance {
    /** Describes what the tag means, so the UI never overclaims. */
    const val TAG_SCOPE = "metadata"

    /**
     * Build the human-readable stamp written into exported files.
     * Format: `synthetic speech; engine=PocketTTS; created=<date>; kind=on-device-voice-clone`
     */
    fun stamp(kind: String = "on-device-voice-clone", date: LocalDate = LocalDate.now()): String =
        "synthetic speech; engine=PocketTTS; created=${date}; kind=$kind"

    /**
     * Write a RIFF `LIST`/`INFO` chunk carrying [text] into [file].
     *
     * The chunk is appended after the `data` chunk, so readers that only look
     * for audio still work. Readers that understand LIST/INFO surface it as
     * comment metadata.
     */
    fun tag(file: File, text: String) {
        val payload = text.toByteArray(Charsets.UTF_8)
        val chunk = ByteBuffer.allocate(8 + payload.size).order(ByteOrder.LITTLE_ENDIAN).apply {
            put("LIST".toByteArray(Charsets.US_ASCII))
            putInt(payload.size + 4)
            put("INFO".toByteArray(Charsets.US_ASCII))
            put("ICMT".toByteArray(Charsets.US_ASCII))
            putInt(payload.size)
            put(payload)
            // Chunks are word aligned.
            if (payload.size % 2 == 1) put(0)
        }.array()

        RandomAccessFile(file, "rw").use { output ->
            output.seek(output.length())
            output.write(chunk)
            // Patch the RIFF size field to include the new chunk.
            output.seek(4)
            val size = output.readInt().let { Integer.reverseBytes(it) }.toLong() + chunk.size
            output.seek(4)
            output.writeInt(Integer.reverseBytes(size.toInt()))
        }
    }
}
