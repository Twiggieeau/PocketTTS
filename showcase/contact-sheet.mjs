#!/usr/bin/env node
/* Build a contact sheet: every screen on one page, for a quick review. */

import { readdirSync, writeFileSync, rmSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "out");
const tmp = join(outDir, ".sheet");
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });

const pngs = readdirSync(outDir).filter((f) => f.endsWith(".png")).sort();
const cells = pngs
  .map((f) => `<figure><img src="${f}" alt="${f}"><figcaption>${f.replace(/\.png$/, "")}</figcaption></figure>`)
  .join("");

const html = `<!doctype html><html><head><meta charset="utf-8">
<base href="file://${outDir}/">
<style>
  body{margin:0;padding:34px;background:#0a0d16;font-family:"Open Sans",sans-serif}
  h1{color:#f4f6ff;font-size:22px;margin:0 0 4px;letter-spacing:-.3px}
  p{margin:0 0 24px;color:#8593b3;font-size:13px}
  .grid{display:grid;grid-template-columns:repeat(6,1fr);gap:22px 16px}
  figure{margin:0}
  img{width:100%;display:block;border-radius:12px;box-shadow:0 10px 26px rgba(0,0,0,.55)}
  figcaption{color:#8c9ab8;font-size:11px;text-align:center;margin-top:7px}
</style></head><body>
<h1>Pocket TTS — design showcase</h1>
<p>${pngs.length} screens · 360×800 dp at 3× device pixel ratio</p>
<div class="grid">${cells}</div>
</body></html>`;

writeFileSync(join(tmp, "sheet.html"), html);
execFileSync("chromium", [
  "--headless", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage",
  "--hide-scrollbars", "--force-device-scale-factor=2",
  "--allow-file-access-from-files",
  "--window-size=1500,1000", "--screenshot=" + join(outDir, "contact-sheet.png"),
  join(tmp, "sheet.html"),
], { stdio: ["ignore", "ignore", "pipe"] });
rmSync(tmp, { recursive: true, force: true });
console.log("Contact sheet →", join(outDir, "contact-sheet.png"));
