package org.pockettts.android.engine

/**
 * Splits a script into spoken lines and assigns a speaker to each one.
 *
 * A script is plain text. Speakers come from three common conventions, all
 * of which are common in screenplay and stage-play formats:
 *
 *  - `Ada:` at the start of a line.
 *  - `ADA` (upper case, alone on a line) as a stage direction heading.
 *  - `Ada: "…"` with the dialogue in quotes.
 *
 * Lines that carry no speaker tag continue the previous speaker, which is how
 * a script normally reads. Text before any speaker is narration.
 */
internal object ScriptParser {
    const val NARRATOR = "Narrator"

    data class Line(
        /** Zero-based index within the script. */
        val index: Int,
        /** The speaker, or [NARRATOR] for untagged text. */
        val speaker: String,
        /** The text to speak, with the speaker tag removed. */
        val text: String,
        /** True when the line is a stage direction rather than dialogue. */
        val stageDirection: Boolean = false,
    )

    data class Script(
        val lines: List<Line>,
        /** Speakers in the order they first appear. */
        val speakers: List<String>,
    ) {
        val isEmpty get() = lines.isEmpty()
    }

    /** `Ada:` or `ADA:` at the start of a line. */
    private val tagged = Regex("^\\s*([\\p{L}][\\p{L} '\\-.]*?)\\s*:\\s*(.*)$")

    /** `ADA` alone on a line, in upper case, as a heading. */
    private val heading = Regex("^\\s*([\\p{Lu}][\\p{L} '\\-.]*?)\\s*$")

    private val quoted = Regex("^\\s*[\\\"“](.*)[\\\"”]\\s*$")

    /**
     * A speaker tag is a short name, not an ordinary sentence that happens to
     * contain a colon. "The note said: bring the key." is narration; "Ada:" is
     * a tag. Anything longer than [MAX_SPEAKER_LENGTH] is treated as prose.
     */
    private const val MAX_SPEAKER_LENGTH = 40

    /** Words that appear before a colon in prose and are never a speaker. */
    private val notASpeaker = setOf(
        "the", "a", "an", "and", "or", "but", "then", "so", "note", "said", "he", "she", "it", "they", "we", "i",
    )

    fun parse(text: String): Script {
        val lines = mutableListOf<Line>()
        val speakers = mutableListOf<String>()
        var current = NARRATOR

        text.split('\n').forEach { raw ->
            val line = raw.trim()
            if (line.isEmpty()) return@forEach

            val tag = tagged.matchEntire(line)
            if (tag != null) {
                val name = tag.groupValues[1].trim()
                if (isSpeakerName(name)) {
                    current = name
                    if (current !in speakers) speakers += current
                    val spoken = tag.groupValues[2].trim()
                    if (spoken.isNotEmpty()) {
                        lines += Line(lines.size, current, stripQuotes(spoken))
                    }
                    return@forEach
                }
            }

            val head = heading.matchEntire(line)
            if (head != null && line == line.uppercase() && line.any { it.isLetter() }) {
                val name = head.groupValues[1].trim()
                current = name
                if (current !in speakers) speakers += current
                // A heading is a stage direction, not something to speak.
                lines += Line(lines.size, current, "", stageDirection = true)
                return@forEach
            }

            // Untagged text continues the current speaker.
            lines += Line(lines.size, current, stripQuotes(line))
        }

        if (NARRATOR in speakers || lines.any { it.speaker == NARRATOR }) {
            if (NARRATOR !in speakers) speakers.add(0, NARRATOR)
        }
        return Script(lines, speakers)
    }

    private fun stripQuotes(value: String): String {
        val match = quoted.matchEntire(value) ?: return value
        return match.groupValues[1].trim()
    }

    /**
     * Decide whether a leading `Name:` really is a speaker tag.
     *
     * A name is short, is not a common prose word, and does not read as a
     * sentence. This keeps "The note said: bring the key." as narration.
     */
    private fun isSpeakerName(name: String): Boolean {
        if (name.isEmpty() || name.length > MAX_SPEAKER_LENGTH) return false
        if (name.split(' ').size > 3) return false
        val first = name.substringBefore(' ').lowercase()
        if (first in notASpeaker) return false
        // A sentence-like fragment usually contains a verb or several words.
        if (name.contains(' ') && name.split(' ').size >= 4) return false
        return true
    }

    /**
     * Suggest a better region to speak from a line.
     * A stage direction is skipped so the reader does not speak the heading.
     */
    fun spokenText(line: Line): String? = if (line.stageDirection || line.text.isBlank()) null else line.text
}
