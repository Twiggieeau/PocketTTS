package org.pockettts.android.engine

import org.junit.Assert.*
import org.junit.Test

class ScriptParserTest {
    @Test fun colonTagAssignsSpeaker() {
        val script = ScriptParser.parse("""
            The station was empty when the lights failed.
            Ada: You always said the quiet was the interesting part.
            Marcus: I said the opposite.
        """.trimIndent())
        assertEquals(3, script.lines.size)
        assertEquals(ScriptParser.NARRATOR, script.lines[0].speaker)
        assertEquals("Ada", script.lines[1].speaker)
        assertEquals("Marcus", script.lines[2].speaker)
        assertEquals(listOf(ScriptParser.NARRATOR, "Ada", "Marcus"), script.speakers)
    }

    @Test fun untaggedTextContinuesThePreviousSpeaker() {
        val script = ScriptParser.parse("""
            Ada: First line.
            Still Ada speaking.
        """.trimIndent())
        assertEquals(2, script.lines.size)
        assertEquals("Ada", script.lines[1].speaker)
    }

    @Test fun uppercaseHeadingIsAStageDirection() {
        val script = ScriptParser.parse("""
            NARRATOR
            The wind picked up.
        """.trimIndent())
        assertEquals(2, script.lines.size)
        assertTrue(script.lines[0].stageDirection)
        assertNull(ScriptParser.spokenText(script.lines[0]))
        // The heading names the speaker for the lines that follow it.
        assertEquals("NARRATOR", script.lines[1].speaker)
        assertEquals("The wind picked up.", script.lines[1].text)
    }

    @Test fun anUppercaseHeadingStartsANewSpeaker() {
        val script = ScriptParser.parse("""
            ADA
            The lighthouse was cold.
        """.trimIndent())
        assertEquals("ADA", script.lines[1].speaker)
    }

    @Test fun quotedDialogueIsUnwrapped() {
        val script = ScriptParser.parse("""
            Ada: "The lighthouse keeper counted the ships."
        """.trimIndent())
        assertEquals("The lighthouse keeper counted the ships.", script.lines[0].text)
    }

    @Test fun emptyScriptHasNoLines() {
        val script = ScriptParser.parse("")
        assertTrue(script.isEmpty)
        assertTrue(script.speakers.isEmpty())
    }

    @Test fun blankLinesAreIgnored() {
        val script = ScriptParser.parse("\n\n\nAda: Hello.\n\n\n")
        assertEquals(1, script.lines.size)
    }

    @Test fun speakerOrderFollowsFirstAppearance() {
        val script = ScriptParser.parse("""
            Zoe: One.
            Ada: Two.
            Zoe: Three.
        """.trimIndent())
        assertEquals(listOf("Zoe", "Ada"), script.speakers)
    }

    @Test fun narrationBeforeAnySpeakerIsNarrator() {
        val script = ScriptParser.parse("""
            The station was empty.
            Ada: Hello.
        """.trimIndent())
        assertEquals(ScriptParser.NARRATOR, script.lines[0].speaker)
        assertEquals(listOf(ScriptParser.NARRATOR, "Ada"), script.speakers)
    }

    @Test fun colonsInsideALineAreNotTreatedAsTags() {
        // A tag must start the line; a colon in the middle is ordinary text.
        val script = ScriptParser.parse("The note said: bring the key.")
        assertEquals(1, script.lines.size)
        assertEquals(ScriptParser.NARRATOR, script.lines[0].speaker)
        assertEquals("The note said: bring the key.", script.lines[0].text)
    }

    @Test fun aTimeLikeLineIsNotAHeading() {
        val script = ScriptParser.parse("12:30 the train arrived.")
        assertEquals(1, script.lines.size)
        assertEquals(ScriptParser.NARRATOR, script.lines[0].speaker)
    }
}
