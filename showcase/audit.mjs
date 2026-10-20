#!/usr/bin/env node
/* Audit every screen for vertical overflow.
   Measures each .body's scrollHeight vs clientHeight and reports:
     - screens whose content is taller than the viewport (scrollable)
     - elements (primary CTAs, cards) that sit below the visible fold
   Usage: node audit.mjs [--verbose] */

import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { phone } from "./src/lib.js";
import * as A from "./src/screens-a.js";
import * as B from "./src/screens-b.js";

const here = dirname(fileURLToPath(import.meta.url));
const tmp = join(here, "out", ".audit");
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });

const SHOTS = [
  ["01-reader", A.reader()], ["02-reader-playing", A.readerPlaying()],
  ["03-multi-voice", A.multiVoice()], ["04-voices", A.voiceLibrary()],
  ["05-voice-detail", A.voiceDetail()], ["06-add-voice", A.addVoice()],
  ["07-record", A.recordStudio()], ["08-import", A.importAudio()],
  ["09-video", A.videoExtract()], ["10-trim", A.trimEditor()],
  ["11-enhance", A.enhance()], ["12-loudness", A.loudness()],
  ["13-quality", A.qualityReport()], ["14-consent", A.consent()],
  ["15-prosody", A.prosody()], ["16-queue", A.queue()],
  ["17-export", A.exportScreen()], ["18-settings", A.settings()],
  ["19-lockscreen", A.lockScreen()],
  ["20-sheet-voice-picker", A.reader(), B.voicePickerSheet()],
  ["21-sheet-recording", A.addVoice(), B.recordSheet()],
  ["22-sheet-before-after", A.trimEditor(), B.beforeAfterSheet()],
  ["23-dialog-delete", A.voiceLibrary(), B.deleteDialog()],
  ["24-notification", A.exportScreen(), B.exportNotification()],
  ["25-sheet-system-engine", A.settings(), B.systemEngineSheet()],
  ["26-light-voices", B.lightVoiceLibrary()], ["27-light-trim", B.lightTrimEditor()],
  ["28-light-reader", B.lightReader()], ["29-light-consent", B.lightConsent()],
];

const verbose = process.argv.includes("--verbose");
let problems = 0;

for (const [slug, body, overlay] of SHOTS) {
  const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${join(here, "src/tokens.css")}">
<link rel="stylesheet" href="${join(here, "src/base.css")}">
<style>html,body{background:transparent;margin:0;padding:0}
body{width:360px;height:800px;overflow:hidden}
.phone{border-radius:0;box-shadow:none;width:360px;height:800px}
.phone::after{display:none}</style>
</head><body>${phone({ theme: slug.includes("light") ? "light" : "dark", body, overlay: overlay || "" })}
<script>
window.onload = () => {
  const out = [];
  const screen = document.querySelector('.screen');
  const bodyEl = document.querySelector('.body');
  const sr = screen.getBoundingClientRect();
  const br = bodyEl.getBoundingClientRect();
  out.push('bodyOverflow=' + (bodyEl.scrollHeight - bodyEl.clientHeight));
  out.push('bodyClient=' + bodyEl.clientHeight);
  // Anything whose bottom edge is below the visible body area.
  const fold = br.bottom;
  const ctas = [];
  bodyEl.querySelectorAll('.btn.primary, .card, .item').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.bottom > fold + 0.5) {
      const label = (el.textContent || '').trim().replace(/\\s+/g,' ').slice(0, 34);
      ctas.push({ tag: el.className.split(' ')[0], label, over: Math.round(r.bottom - fold) });
    }
  });
  out.push('belowFold=' + JSON.stringify(ctas));
  // Dock overlap: does the dock cover the last body content?
  const dock = document.querySelector('.dock');
  out.push('hasDock=' + (dock ? '1' : '0'));
  const d = document.createElement('div');
  d.id = 'audit';
  d.textContent = out.join(' | ');
  document.body.appendChild(d);
};
</script></body></html>`;

  const p = join(tmp, `${slug}.html`);
  writeFileSync(p, html);
  const dom = execFileSync("chromium", [
    "--headless", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage",
    "--virtual-time-budget=1200", "--dump-dom", p,
  ], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 60000 });

  const m = dom.match(/id="audit"[^>]*>([^<]*)/);
  if (!m) { console.log(`  ? ${slug} — no audit output`); problems++; continue; }
  const [ovS, clS, bfS, dockS] = m[1].split(" | ");
  const overflow = parseInt(ovS.split("=")[1], 10);
  const below = JSON.parse(bfS.split("=")[1]);
  const hasDock = dockS.split("=")[1] === "1";

  const flags = [];
  if (overflow > 0) flags.push(`overflow ${overflow}px`);
  if (below.length) flags.push(`${below.length} below fold`);
  if (flags.length) problems++;
  const mark = flags.length ? "✗" : "✓";
  console.log(`  ${mark} ${slug.padEnd(24)} ${flags.join(", ") || "fits"}`);
  if (verbose && below.length) {
    for (const b of below) console.log(`        ${b.tag} "${b.label}" +${b.over}px`);
  }
}

rmSync(tmp, { recursive: true, force: true });
console.log(problems ? `\n${problems} screen(s) need attention` : "\nAll screens fit");
