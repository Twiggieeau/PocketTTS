@file:OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class, androidx.compose.foundation.layout.ExperimentalLayoutApi::class)

package org.pockettts.android.engine

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import org.pockettts.android.engine.StudioButton as Button
import org.pockettts.android.engine.StudioOutlinedButton as OutlinedButton
import org.pockettts.android.engine.StudioTonalButton as FilledTonalButton

/**
 * The script screen: a full-screen destination reached from the Reader.
 *
 * It deliberately has no bottom navigation dock. The Reader, Voices and
 * Settings tabs are siblings of the script, not of a line inside it, and a
 * persistent dock on a wizard step invites an accidental tab switch halfway
 * through editing. The commit actions live in a sticky bottom bar instead.
 */
@Composable
internal fun MultiVoiceScriptScreen(app: MainActivity, onBack: () -> Unit) {
    val script = remember(app.scriptText) { ScriptParser.parse(app.scriptText) }
    val selectedLine = app.scriptSelectedLine
    var assigning by remember { mutableStateOf(-1) }

    Column(Modifier.fillMaxSize().testTag("script-screen")) {
        // Header
        Row(Modifier.fillMaxWidth().padding(start = 4.dp, end = StudioTokens.PageInset, top = 4.dp),
            verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack, modifier = Modifier.size(48.dp).testTag("script-back")) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, stringResource(R.string.ui_back))
            }
            Text(stringResource(R.string.script_title), Modifier.weight(1f).semantics { heading() },
                style = MaterialTheme.typography.headlineSmall)
        }

        // Speaker summary
        if (script.speakers.isNotEmpty()) {
            FlowRow(Modifier.fillMaxWidth().padding(horizontal = StudioTokens.PageInset),
                horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                script.speakers.forEach { speaker ->
                    FilterChip(selected = false, onClick = {},
                        label = { Text(speaker, style = MaterialTheme.typography.labelMedium) },
                        modifier = Modifier.testTag("script-speaker-$speaker"))
                }
            }
        }

        LazyColumn(Modifier.weight(1f).fillMaxWidth().testTag("script-lines"),
            contentPadding = androidx.compose.foundation.layout.PaddingValues(
                start = StudioTokens.PageInset, end = StudioTokens.PageInset, top = 10.dp, bottom = 10.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)) {
            if (script.isEmpty) {
                item {
                    Text(stringResource(R.string.script_empty), style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
            items(script.lines) { line ->
                ScriptLineRow(line = line, selected = selectedLine == line.index,
                    onSelect = { app.selectScriptLine(line.index) },
                    modifier = Modifier.testTag("script-line-${line.index}"))
            }
        }

        // Sticky action bar. Replaces the bottom dock on this screen.
        Surface(Modifier.fillMaxWidth(), color = LocalGlass.current.card,
            border = androidx.compose.foundation.BorderStroke(.75.dp, LocalGlass.current.border)) {
            Column(Modifier.fillMaxWidth().padding(horizontal = StudioTokens.PageInset, vertical = 10.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedButton(onClick = { app.splitSelectedLine() }, enabled = selectedLine >= 0,
                        modifier = Modifier.weight(1f).testTag("script-split")) {
                        Text(stringResource(R.string.script_split))
                    }
                    OutlinedButton(onClick = { app.mergeSelectedLine() }, enabled = selectedLine >= 0,
                        modifier = Modifier.weight(1f).testTag("script-merge")) {
                        Text(stringResource(R.string.script_merge))
                    }
                }
                Button(onClick = { app.sheet = "script-voice" }, enabled = script.speakers.isNotEmpty(),
                    modifier = Modifier.fillMaxWidth().testTag("script-assign")) {
                    Icon(Icons.Default.PlayArrow, null, Modifier.size(18.dp))
                    Spacer(Modifier.width(6.dp))
                    Text(stringResource(R.string.script_assign))
                }
            }
        }
    }
}

@Composable
private fun ScriptLineRow(line: ScriptParser.Line, selected: Boolean, onSelect: () -> Unit, modifier: Modifier = Modifier) {
    val tone = remember(line.speaker) { speakerTone(line.speaker) }
    Surface(modifier = modifier.fillMaxWidth().clip(RoundedCornerShape(18.dp))
        .clickable(onClick = onSelect)
        .background(if (selected) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceContainerLow)
        .border(if (selected) 1.dp else .75.dp,
            if (selected) MaterialTheme.colorScheme.primary else LocalGlass.current.border, RoundedCornerShape(18.dp)),
        shape = RoundedCornerShape(18.dp), color = Color.Transparent) {
        Row(Modifier.fillMaxWidth().padding(horizontal = 14.dp, vertical = 12.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(Modifier.size(8.dp).clip(RoundedCornerShape(4.dp)).background(tone))
            Spacer(Modifier.width(10.dp))
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(3.dp)) {
                Text(line.speaker.uppercase(), style = MaterialTheme.typography.labelSmall,
                    color = tone, fontWeight = FontWeight.SemiBold)
                Text(
                    if (line.stageDirection) stringResource(R.string.script_stage_direction)
                    else line.text.ifBlank { stringResource(R.string.script_stage_direction) },
                    style = MaterialTheme.typography.bodyMedium,
                    color = if (line.stageDirection) MaterialTheme.colorScheme.onSurfaceVariant
                    else MaterialTheme.colorScheme.onSurface)
            }
        }
    }
}

/** A stable colour per speaker, so a voice keeps its identity across the script. */
private fun speakerTone(name: String): Color {
    val tones = listOf(
        Color(0xFF477AE8), Color(0xFF765ACD), Color(0xFF307890),
        Color(0xFF986129), Color(0xFF3F8F5C), Color(0xFFA8457A),
    )
    var hash = 0
    name.forEach { hash = hash * 31 + it.code }
    return tones[Math.floorMod(hash, tones.size)]
}
