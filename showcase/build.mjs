#!/usr/bin/env node
/* Build the Pocket TTS showcase gallery: one PNG per screen + a contact sheet.
   Usage: node build.mjs [--out out] */

import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { phone, statusBar } from "./src/lib.js";
import * as A from "./src/screens-a.js";
import * as B from "./src/screens-b.js";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.argv.includes("--out")
  ? process.argv[process.argv.indexOf("--out") + 1]
  : join(here, "out");
const tmpDir = join(outDir, ".tmp");

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
mkdirSync(tmpDir, { recursive: true });

/* Every entry: [slug, caption, note, tag, theme, body, overlay] */
const SHOTS = [
  ["01-reader", "Reader", "Long-form text, playback and export", "Core", "dark", A.reader()],
  ["02-reader-playing", "Reader, playing", "Sentence highlight, follow-scroll, speed", "Core", "dark", A.readerPlaying()],
  ["03-multi-voice", "Multi-voice script", "One voice per speaker, per-line timing", "Advanced", "dark", A.multiVoice()],
  ["04-voices", "Voice library", "Cloned voices with quality score", "Core", "dark", A.voiceLibrary()],
  ["05-voice-detail", "Voice detail", "Reference preview, gain, provenance", "Core", "dark", A.voiceDetail()],
  ["06-add-voice", "Add a voice", "Record, import, extract, model pack", "Core", "dark", A.addVoice()],
  ["07-record", "Record a sample", "Live level, duration, read-along prompt", "Core", "dark", A.recordStudio()],
  ["08-import", "Import audio", "Auto-detected region and analysis", "Core", "dark", A.importAudio()],
  ["09-video", "Extract from video", "Speech band detection, mute music", "Advanced", "dark", A.videoExtract()],
  ["10-trim", "Trim the reference", "Waveform trim with 0.1 s handles", "Core", "dark", A.trimEditor()],
  ["11-enhance", "Before / after", "DeepFilterNet3 noise reduction", "Core", "dark", A.enhance()],
  ["12-loudness", "Loudness master", "LUFS measurement and normalisation", "Advanced", "dark", A.loudness()],
  ["13-quality", "Reference quality", "Scored report with suggested fixes", "Advanced", "dark", A.qualityReport()],
  ["14-consent", "Consent & provenance", "Permission captured with the voice", "Ethics", "dark", A.consent()],
  ["15-prosody", "Prosody lab", "Pitch, pace, warmth, energy per voice", "Advanced", "dark", A.prosody()],
  ["16-queue", "Batch project", "Long jobs queued on device", "Advanced", "dark", A.queue()],
  ["17-export", "Export", "Format, loudness target, provenance embed", "Advanced", "dark", A.exportScreen()],
  ["18-settings", "Settings", "Appearance, engine, privacy, storage", "Core", "dark", A.settings()],
  ["19-lockscreen", "Background playback", "Lock-screen and media-session controls", "System", "dark", A.lockScreen()],

  ["20-sheet-voice-picker", "Voice picker", "Pick or create a voice inline", "Overlay", "dark", A.reader(), B.voicePickerSheet()],
  ["21-sheet-recording", "Recording sheet", "Live capture with a stop-first layout", "Overlay", "dark", A.addVoice(), B.recordSheet()],
  ["22-sheet-before-after", "Before / after sheet", "A/B the enhanced reference", "Overlay", "dark", A.trimEditor(), B.beforeAfterSheet()],
  ["23-dialog-delete", "Confirm delete", "Destructive action with consequences", "Overlay", "dark", A.voiceLibrary(), B.deleteDialog()],
  ["24-notification", "Export notification", "Result after a long export", "Overlay", "dark", A.exportScreen(), B.exportNotification()],
  ["25-sheet-system-engine", "System TTS engine", "Offer the engine to other apps", "Overlay", "dark", A.settings(), B.systemEngineSheet()],

  ["26-light-voices", "Light theme", "The same library in the light palette", "Light", "light", B.lightVoiceLibrary()],
  ["27-light-trim", "Light theme, trim & enhance", "The core cloning-prep step", "Light", "light", B.lightTrimEditor()],
  ["28-light-reader", "Light theme, reader", "Playback and fine speed control", "Light", "light", B.lightReader()],
  ["29-light-consent", "Light theme, consent", "Permission and provenance", "Light", "light", B.lightConsent()],
];

/* ------------------------------------------------------------- render --- */
function renderShot(slug, theme, body, overlay) {
  const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${join(here, "src/tokens.css")}">
<link rel="stylesheet" href="${join(here, "src/base.css")}">
<style>
  html,body{background:transparent;margin:0;padding:0}
  body{width:360px;height:800px;overflow:hidden}
  .phone{border-radius:0;box-shadow:none;width:360px;height:800px}
  .phone::after{display:none}
</style>
</head><body>${phone({ theme, body, overlay })}</body></html>`;

  const htmlPath = join(tmpDir, `${slug}.html`);
  writeFileSync(htmlPath, html);

  const png = join(outDir, `${slug}.png`);
  const args = [
    "--headless", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage",
    "--hide-scrollbars", "--force-device-scale-factor=3",
    "--no-first-run", "--no-default-browser-check", "--disable-extensions",
    "--disable-background-networking", "--disable-sync", "--mute-audio",
    // Keep the renderer at full speed even if the device screen turns off.
    "--disable-background-timer-throttling", "--disable-renderer-backgrounding",
    "--disable-backgrounding-occluded-windows", "--disable-ipc-flooding-protection",
    "--window-size=360,800", `--screenshot=${png}`, htmlPath,
  ];
  // A sleeping device can abort a capture; one retry is enough.
  try {
    execFileSync("chromium", args, { stdio: ["ignore", "ignore", "pipe"], timeout: 90000 });
  } catch {
    execFileSync("chromium", args, { stdio: ["ignore", "ignore", "pipe"], timeout: 90000 });
  }
  return png;
}

const t0 = Date.now();
const only = process.argv.find((a) => a.startsWith("--only="));
const filter = only ? only.slice(7).split(",") : null;
for (const [slug, title, note, tag, theme, body, overlay] of SHOTS) {
  if (filter && !filter.some((f) => slug.includes(f))) continue;
  const png = renderShot(slug, theme, body, overlay || "");
  process.stdout.write(`  ✓ ${slug}.png\n`);
}
rmSync(tmpDir, { recursive: true, force: true });
console.log(`\nRendered in ${((Date.now() - t0) / 1000).toFixed(1)}s → ${outDir}`);

/* ------------------------------------------------------- gallery html --- */
const shotsHtml = SHOTS.map(([slug, title, note, tag, theme, body, overlay]) => `
  <figure class="shot">
    <div class="phone-wrap">${phone({ theme, body, overlay: overlay || "" })}</div>
    <figcaption>
      <span class="cap-tag">${tag}</span>
      <div class="cap-title">${title}</div>
      <div class="cap-note">${note}</div>
    </figcaption>
  </figure>`).join("");

const html = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Pocket TTS — design showcase</title>
<link rel="stylesheet" href="../src/tokens.css">
<link rel="stylesheet" href="../src/base.css">
<style>
  body{padding:56px 0 90px}
  .gallery{max-width:1560px}
</style>
</head><body>
  <header class="showcase-head">
    <p class="eyebrow">Design showcase · mockup</p>
    <h1>Pocket TTS — on-device text to speech with voice cloning</h1>
    <p>Twenty-nine screens covering reading, voice creation, audio editing before cloning,
       prosody, batch synthesis, export and privacy. Every frame is a static mockup built to
       the app's own design system: Material&nbsp;3 surfaces, indigo accent, 24&nbsp;dp cards,
       26&nbsp;dp navigation dock, and the same light, dark and AMOLED palettes.</p>
    <div class="legend">
      <span class="legend-chip"><b>360×800&nbsp;dp</b> frame</span>
      <span class="legend-chip"><b>3×</b> device pixel ratio</span>
      <span class="legend-chip">Tokens mirror <b>PocketTheme.kt</b></span>
      <span class="legend-chip">No image assets — pure HTML/CSS/SVG</span>
    </div>
  </header>
  <div class="gallery">${shotsHtml}</div>
</body></html>`;

writeFileSync(join(outDir, "index.html"), html);
console.log(`Gallery → ${join(outDir, "index.html")}`);
