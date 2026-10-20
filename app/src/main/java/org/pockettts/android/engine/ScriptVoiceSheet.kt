@file:OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)

package org.pockettts.android.engine

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp

/**
 * Assign a voice to each speaker in the script.
 *
 * Speakers are listed in the order they appear. A speaker without a voice is
 * read by the currently selected voice, so a script always plays.
 */
@Composable
internal fun ScriptVoiceSheet(app: MainActivity) {
    val script = ScriptParser.parse(app.scriptText)
    val allVoices = app.packs.flatMap { pack -> pack.voices.map { pack to it } }
    GlassSheet(stringResource(R.string.script_voice_picker), { app.sheet = null }) {
        item { Text(stringResource(R.string.script_voice_hint), color = MaterialTheme.colorScheme.onSurfaceVariant) }
        script.speakers.forEach { speaker ->
            item(key = "speaker-$speaker") {
                GlassCard(Modifier.fillMaxWidth().testTag("script-assign-$speaker"), padding = 14.dp, spacing = 8.dp) {
                    val assigned = app.scriptAssignments[speaker]
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        VoiceIdentity(speaker, compact = true)
                        Text(speaker, style = MaterialTheme.typography.titleMedium, modifier = Modifier.weight(1f))
                        if (assigned != null) {
                            Icon(Icons.Default.CheckCircle, null, Modifier.size(18.dp), tint = MaterialTheme.colorScheme.primary)
                        }
                    }
                    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        allVoices.forEach { (pack, voice) ->
                            val id = ModelPackRepository.voiceName(pack, voice)
                            ChoiceRow(voice.displayName, pack.displayName, selected = assigned == id) {
                                app.assignScriptVoice(speaker, id)
                            }
                        }
                        if (allVoices.isEmpty()) {
                            Text(stringResource(R.string.script_speaker_none), style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }
        }
    }
}
