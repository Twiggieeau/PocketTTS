/* Pocket TTS showcase — sheets, dialogs, overlays and light-theme variants. */

import {
  icon, esc, appBar, dock, wave, slider, rangeBar, tabs, pills, avatar,
  speechPeaks, statusBar,
} from "./lib.js";

const A = (n, s = 18) => icon(n, s);

/* ============================================ SHEET: VOICE PICKER ======== */
export function voicePickerSheet() {
  return `
    <div class="sheet-backdrop"></div>
    <div class="sheet">
      <div class="grabber"></div>
      <div class="sheet-hd">
        <div class="grow">
          <h3>Choose a voice</h3>
        </div>
        <span class="btn ghost sm" style="padding:6px 8px">${A("close", 15)}</span>
      </div>
      <p class="sheet-note">The voice used for the next paragraph. Changing it stops current playback.</p>

      <div class="row" style="margin-bottom:12px">
        <span class="btn ghost sm grow" style="justify-content:flex-start;gap:8px">${A("search", 15)}Search voices</span>
        <span class="btn ghost sm">${A("plusCircle", 15)}New</span>
      </div>

      <div class="list">
        ${[
          ["Alba", "Built in · English (FP32)", true],
          ["Ada", "Cloned · 12.4 s reference", false],
          ["Marcus", "Cloned · from video", false],
        ].map(([n, s, on]) => `
          <div class="item ${on ? "on" : ""}">
            ${avatar(n)}
            <div class="grow">
              <div class="t1">${n}</div>
              <div class="t3">${s}</div>
            </div>
            ${on ? `<span style="color:var(--accent)">${A("checkCircle", 20)}</span>` : `<span class="dim">${A("chevronRight", 18)}</span>`}
          </div>`).join("")}
      </div>

      <div class="btn-row" style="margin-top:14px">
        <span class="btn primary">${A("play", 16)}Preview selected</span>
      </div>
    </div>`;
}

/* ======================================== SHEET: RECORDING CONTROLS ===== */
export function recordSheet() {
  return `
    <div class="sheet-backdrop"></div>
    <div class="sheet">
      <div class="grabber"></div>
      <div class="sheet-hd">
        <div class="grow"><h3>Recording</h3></div>
        <span class="btn ghost sm" style="padding:6px 8px">${A("close", 15)}</span>
      </div>
      <p class="sheet-note">Speak naturally. We trim silence automatically and keep the strongest 3–30 seconds.</p>

      <div class="card tight" style="background:var(--surface-low)">
        <div class="row" style="margin-bottom:10px">
          <span class="t1 grow" style="font-size:15px">00:12.4</span>
          <span class="pill on"><span class="dot" style="width:7px;height:7px;border-radius:50%;background:currentColor"></span>Live</span>
        </div>
        <div class="wave live" style="height:64px">
          <div class="strip">${speechPeaks(40, 5).map((p, i) => `<i class="bar ${i > 8 ? "hot" : ""}" style="height:${Math.max(3, p * 44).toFixed(1)}px"></i>`).join("")}</div>
        </div>
      </div>

      <div class="row" style="justify-content:center;margin-top:16px">
        <span class="btn rec round" style="width:62px;height:62px;border-radius:50%;padding:0;background:var(--error);color:#fff">${A("stop", 22)}</span>
      </div>
      <div style="text-align:center;margin-top:10px" class="t3">Tap to stop and review</div>

      <div class="btn-row" style="margin-top:16px">
        <span class="btn ghost">${A("folder", 15)}Prompts</span>
        <span class="btn ghost">${A("restore", 15)}Restart</span>
      </div>
    </div>`;
}

/* ================================== SHEET: BEFORE / AFTER ENHANCE ======== */
export function beforeAfterSheet() {
  return `
    <div class="sheet-backdrop"></div>
    <div class="sheet">
      <div class="grabber"></div>
      <div class="sheet-hd">
        <div class="grow"><h3>Before / after</h3></div>
        <span class="btn ghost sm" style="padding:6px 8px">${A("close", 15)}</span>
      </div>
      <p class="sheet-note">Switch instantly between the original and the enhanced reference.</p>

      <div class="tabstrip">
        <div class="on">Original</div>
        <div>Enhanced</div>
      </div>

      <div class="card" style="margin-top:12px;padding:14px 16px">
        ${wave({ n: 48, seed: 17, height: 74 })}
        <div class="row" style="justify-content:center;gap:14px;margin-top:12px">
          <span class="btn quiet round" style="width:42px;height:42px;border-radius:50%;padding:0">${A("prev", 16)}</span>
          <span class="btn primary round" style="width:50px;height:50px;border-radius:50%;padding:0">${A("play", 21)}</span>
          <span class="btn quiet round" style="width:42px;height:42px;border-radius:50%;padding:0">${A("next", 16)}</span>
        </div>
      </div>

      <div class="grid-2" style="margin-top:12px">
        <div class="card tight" style="text-align:center">
          <div class="eyebrow-sm">Original</div>
          <div style="font:700 22px/28px 'Open Sans';margin-top:4px">−41 dB</div>
          <div class="t3" style="margin-top:2px">noise floor</div>
        </div>
        <div class="card tight" style="text-align:center;border-color:color-mix(in srgb,var(--success) 40%,transparent)">
          <div class="eyebrow-sm" style="color:var(--success)">Enhanced</div>
          <div style="font:700 22px/28px 'Open Sans';margin-top:4px;color:var(--success)">−63 dB</div>
          <div class="t3" style="margin-top:2px">22 dB cleaner</div>
        </div>
      </div>

      <div class="btn-row" style="margin-top:14px">
        <span class="btn ghost">${A("restore", 15)}Keep original</span>
        <span class="btn primary">${A("check", 16)}Keep enhanced</span>
      </div>
    </div>`;
}

/* ======================================= DIALOG: DELETE A VOICE ========= */
export function deleteDialog() {
  return `
    <div class="sheet-backdrop" style="background:rgba(4,6,12,.72)"></div>
    <div style="position:absolute;left:24px;right:24px;top:50%;transform:translateY(-50%);z-index:22">
      <div class="card" style="background:var(--glass-sheet);border-radius:26px;padding:22px 20px 18px">
        <div style="width:44px;height:44px;border-radius:14px;background:color-mix(in srgb,var(--error) 18%,transparent);color:var(--error);display:grid;place-items:center">${A("trash", 22)}</div>
        <div style="font:700 19px/25px 'Open Sans';margin-top:14px">Delete “Ada”?</div>
        <p style="font:400 14px/21px 'Open Sans';color:var(--text-2);margin:8px 0 0">
          The cloned reference, its edits and its archive are removed from this device.
          Files you already exported are not affected.
        </p>
        <div class="btn-row" style="margin-top:18px">
          <span class="btn ghost">Cancel</span>
          <span class="btn danger" style="border-color:color-mix(in srgb,var(--error) 45%,transparent);color:var(--error)">Delete</span>
        </div>
      </div>
    </div>`;
}

/* ====================================== NOTIFICATION: EXPORT DONE ======== */
export function exportNotification() {
  return `
    <div style="position:absolute;left:12px;right:12px;top:40px;z-index:30">
      <div class="card" style="padding:13px 15px;border-radius:22px;box-shadow:0 10px 30px rgba(0,0,0,.5)">
        <div class="row" style="gap:11px">
          <div class="avatar sm" style="background:linear-gradient(135deg,#477ae8,#765acd)">${A("check", 16)}</div>
          <div class="grow">
            <div class="t1" style="font-size:14px">Export complete</div>
            <div class="t3">Chapter 2 — The Signal.wav · 18.4 MB</div>
          </div>
        </div>
      </div>
    </div>`;
}

/* ============================== SHEET: SYSTEM TTS ENGINE PICKER ======== */
export function systemEngineSheet() {
  return `
    <div class="sheet-backdrop"></div>
    <div class="sheet">
      <div class="grabber"></div>
      <div class="sheet-hd">
        <div class="grow"><h3>Text to speech output</h3></div>
        <span class="btn ghost sm" style="padding:6px 8px">${A("close", 15)}</span>
      </div>
      <p class="sheet-note">Choose the engine your phone uses for reading text aloud in other apps.</p>

      <div class="list">
        <div class="item on">
          <div class="avatar sm" style="background:linear-gradient(135deg,#477ae8,#765acd)">${A("wave", 16)}</div>
          <div class="grow">
            <div class="t1">Pocket TTS</div>
            <div class="t3">On-device · offline</div>
          </div>
          <span style="color:var(--accent)">${A("checkCircle", 19)}</span>
        </div>
        <div class="item">
          <div class="avatar sm" style="background:var(--surface-high)">${A("globe", 16)}</div>
          <div class="grow">
            <div class="t1">Google Speech Services</div>
            <div class="t3">System default</div>
          </div>
        </div>
      </div>

      <div class="hint" style="margin-top:14px">
        <span class="ic">${A("shield", 16)}</span>
        <span>Pocket TTS voices stay on this device. Other apps ask the system for speech, never for your text.</span>
      </div>
    </div>`;
}

/* ============================= LIGHT-THEME MIRRORS ======================= */

/** Light theme: voice library with cloned voices. */
export function lightVoiceLibrary() {
  return `
    ${appBar({ right: `<span class="chip on"><span class="dot"></span>On device</span>` })}
    <div class="body scroll">
      <h1 class="page-title">Voices</h1>
      <p class="page-sub">3 voices · one personal collection</p>

      <div class="row" style="margin-top:14px;gap:10px">
        <span class="btn primary" style="flex:0 0 auto">${A("add", 16)}Add voice</span>
        <span class="btn ghost" style="flex:0 0 auto">${A("upload", 16)}Import</span>
      </div>

      <div class="list" style="margin-top:14px">
        <div class="item on" style="box-shadow:0 3px 12px rgba(23,33,58,.12)">
          ${avatar("Alba")}
          <div class="grow">
            <div class="row" style="gap:8px">
              <span class="t1">Alba</span>
              <span style="color:var(--accent)">${A("checkCircle", 17)}</span>
            </div>
            <div class="row" style="gap:7px;margin-top:5px">
              <span class="pill">Built in</span>
              <span class="t3">English (FP32)</span>
            </div>
          </div>
          <span class="dim">${A("more", 18)}</span>
        </div>
        <div class="item">
          ${avatar("Ada")}
          <div class="grow">
            <div class="t1">Ada</div>
            <div class="row" style="gap:7px;margin-top:5px">
              <span class="pill accent">Cloned</span>
              <span class="t3">From recording · 12.4 s</span>
            </div>
            <div class="row" style="gap:8px;margin-top:8px">
              <div class="meter good" style="flex:1"><div style="width:92%"></div></div>
              <span class="t3">92/100</span>
            </div>
          </div>
          <span class="dim">${A("more", 18)}</span>
        </div>
        <div class="item">
          ${avatar("Marcus")}
          <div class="grow">
            <div class="t1">Marcus</div>
            <div class="row" style="gap:7px;margin-top:5px">
              <span class="pill accent">Cloned</span>
              <span class="t3">From video · 18.1 s</span>
            </div>
          </div>
          <span class="dim">${A("more", 18)}</span>
        </div>
      </div>

      <div class="card tight" style="margin-top:14px;margin-bottom:8px">
        <div class="row">
          <span class="dim">${A("folder", 18)}</span>
          <div class="grow">
            <div class="t1" style="font-size:14px">Model packs</div>
            <div class="t3">English (FP32) · 2 bundled voices</div>
          </div>
          <span class="dim">${A("chevronRight", 18)}</span>
        </div>
      </div>
    </div>
    ${dock(1)}`;
}

/** Light theme: the trim + enhance editor, the core voice-cloning prep step. */
export function lightTrimEditor() {
  return `
    ${appBar({ left: `<span class="btn ghost sm" style="padding:6px 8px">${A("back", 15)}</span>`, title: "Edit audio" })}
    <div class="body scroll">
      <div class="row" style="margin-top:2px">
        <h1 class="page-title grow">Trim &amp; enhance</h1>
        <span class="pill accent">Step 2 of 3</span>
      </div>
      <p class="page-sub">Ada · reference 00:41.2</p>

      <div class="card" style="margin-top:14px;padding:14px 16px">
        ${wave({ n: 60, seed: 9, height: 92, sel: [0.06, 0.84] })}
        <div style="height:10px"></div>
        ${rangeBar({ start: 0.06, end: 0.84 })}
        <div class="row" style="margin-top:8px">
          <div class="grow">
            <div class="t3">Start</div>
            <div class="t1" style="font-size:15px">00:02.40</div>
          </div>
          <div class="grow">
            <div class="t3" style="text-align:right">End</div>
            <div class="t1" style="font-size:15px;text-align:right">00:34.60</div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="row" style="margin-bottom:10px">
          <span class="t2 grow">Selection</span>
          <span class="pill on">00:32.20</span>
        </div>
        <div class="transport" style="border-radius:16px;padding:10px">
          <span class="btn quiet round" style="width:42px;height:42px;border-radius:50%;padding:0">${A("prev", 16)}</span>
          <span class="btn primary round" style="width:50px;height:50px;border-radius:50%;padding:0">${A("play", 21)}</span>
          <span class="btn quiet round" style="width:42px;height:42px;border-radius:50%;padding:0">${A("next", 16)}</span>
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="eyebrow-sm" style="margin-bottom:9px">Enhancement</div>
        <div class="row" style="gap:11px;margin-bottom:11px">
          <span class="dim">${A("sparkles", 19)}</span>
          <span class="grow">
            <span class="t1" style="display:block;font-size:15px">DeepFilterNet3</span>
            <span class="t3">Noise floor −41 dB → −63 dB</span>
          </span>
          <span class="switch on"></span>
        </div>
        <div class="row" style="gap:11px">
          <span class="dim">${A("volume", 19)}</span>
          <span class="grow">
            <span class="t1" style="display:block;font-size:15px">Loudness normalisation</span>
            <span class="t3">Target −16 LUFS</span>
          </span>
          <span class="switch on"></span>
        </div>
        ${slider({ value: 0.42, label: "Reference gain", display: "+2.0 dB", mt: 16 })}
      </div>

      <div class="btn-row" style="margin-top:12px;margin-bottom:8px">
        <span class="btn ghost">${A("restore", 15)}Original</span>
        <span class="btn primary">${A("check", 16)}Save changes</span>
      </div>
    </div>
    ${dock(1)}`;
}

/** Light theme: reader with the new advanced controls surfaced. */
export function lightReader() {
  return `
    ${appBar({ right: `<span class="chip on"><span class="dot"></span>On device</span>` })}
    <div class="body scroll">
      <h1 class="page-title">Reader</h1>

      <div class="card" style="margin-top:14px">
        <div class="card-hd">
          <span class="eyebrow-sm grow">Reading space</span>
          <span class="btn ghost sm">${A("edit", 14)}Edit</span>
        </div>
        <p style="font:400 18px/28px 'Open Sans';margin:14px 0 0">A voice for every story.</p>
        <p style="font:400 15px/23px 'Open Sans';margin:12px 0 0;color:var(--text-2)">
          Turn a quiet moment into time to listen. Pocket TTS reads your words on your
          device, without sending them to a server.
        </p>
        <div class="t3" style="margin-top:14px">45 words · 238 characters</div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="row" style="margin-bottom:10px">
          <span class="pill on"><span class="dot" style="width:7px;height:7px;border-radius:50%;background:currentColor"></span>Playing</span>
          <div class="grow"></div>
          <span class="pill accent">1.25×</span>
        </div>
        ${wave({ n: 58, seed: 21, height: 64, playhead: 0.4 })}
        <div class="row" style="margin-top:10px">
          <span class="t3">00:42 / 01:36</span>
          <div class="grow"></div>
          <span class="btn ghost sm">${A("download", 14)}Export WAV</span>
        </div>
        <div class="row" style="justify-content:center;gap:14px;margin-top:12px">
          <span class="btn quiet round" style="width:46px;height:46px;border-radius:50%;padding:0">${A("prev", 18)}</span>
          <span class="btn primary round" style="width:58px;height:58px;border-radius:50%;padding:0">${A("pause", 24)}</span>
          <span class="btn quiet round" style="width:46px;height:46px;border-radius:50%;padding:0">${A("next", 18)}</span>
        </div>
      </div>

      <div class="card" style="margin-top:12px;margin-bottom:8px">
        <div class="eyebrow-sm" style="margin-bottom:9px">Speed</div>
        <div class="presets">
          ${[0.75, 1, 1.25, 1.5].map((v) => `<div class="${v === 1.25 ? "on" : ""}">${v.toFixed(2)}×</div>`).join("")}
        </div>
        ${slider({ value: 0.375, label: "Fine speed", display: "1.25×", ticks: ["0.50×", "0.75×", "1.00×", "1.25×", "1.50×", "1.75×", "2.00×"] })}
      </div>
    </div>
    ${dock(0)}`;
}

/** Light theme: consent + provenance before creating a cloned voice. */
export function lightConsent() {
  return `
    ${appBar({ left: `<span class="btn ghost sm" style="padding:6px 8px">${A("back", 15)}</span>`, title: "Confirm" })}
    <div class="body scroll">
      <h1 class="page-title">Name this voice</h1>
      <p class="page-sub">The voice stays on this device and is tagged with who it belongs to.</p>

      <div class="card" style="margin-top:16px;padding:14px 16px">
        <div class="eyebrow-sm" style="margin-bottom:6px">Voice name</div>
        <div style="font:400 17px/24px 'Open Sans';border-bottom:1px solid var(--accent);padding-bottom:6px">Ada</div>
        <div class="row" style="margin-top:10px;gap:7px">
          <span class="pill">Narrator</span>
          <span class="pill">Podcaster</span>
          <span class="pill">Character</span>
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="eyebrow-sm" style="margin-bottom:10px">Consent</div>
        <div class="row" style="align-items:flex-start;gap:10px;margin-bottom:12px">
          <span style="width:19px;height:19px;border-radius:6px;background:var(--accent-strong);color:#fff;display:grid;place-items:center;flex:0 0 19px;margin-top:1px">${A("check", 13)}</span>
          <span class="t2 grow">I have permission from the person in this recording to create and use their voice.</span>
        </div>
        <div class="row" style="align-items:flex-start;gap:10px;margin-bottom:12px">
          <span style="width:19px;height:19px;border-radius:6px;background:var(--accent-strong);color:#fff;display:grid;place-items:center;flex:0 0 19px;margin-top:1px">${A("check", 13)}</span>
          <span class="t2 grow">I understand that exported audio is synthetic speech, not the original recording.</span>
        </div>
        <div class="row" style="align-items:flex-start;gap:10px">
          <span style="width:19px;height:19px;border-radius:6px;border:1.5px solid var(--outline-2);flex:0 0 19px;margin-top:1px"></span>
          <span class="t2 grow">Share this voice with a trusted family member on this device.</span>
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="eyebrow-sm" style="margin-bottom:9px">Provenance stamp</div>
        <div class="code">Provenance: on-device voice clone · 12 Oct 2025 · Pocket TTS</div>
        <div class="t3" style="margin-top:7px">Written into exported files so listeners can tell it is synthetic.</div>
      </div>

      <div class="btn-row" style="margin-top:14px;margin-bottom:8px">
        <span class="btn primary">${A("sparkles", 16)}Create voice</span>
      </div>
    </div>
    ${dock(1)}`;
}
