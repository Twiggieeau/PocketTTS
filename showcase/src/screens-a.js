/* Pocket TTS showcase — screen compositions.
   Every screen is a 360 x 800 dp phone frame. */

import {
  icon, esc, appBar, dock, wave, slider, rangeBar, tabs, pills, avatar,
  speechPeaks, toneFor, statusBar, emblem,
} from "./lib.js";

const A = (n, s = 18) => icon(n, s);

/* ========================================================== 1. READER === */
export function reader(theme = "dark") {
  const body = `
    ${appBar({ right: `<span class="chip on"><span class="dot"></span>On device</span>` })}
    <div class="body scroll">
      <h1 class="page-title">Reader</h1>

      <div class="card" style="margin-top:14px">
        <div class="card-hd">
          <span class="eyebrow-sm grow">Reading space</span>
          <span class="btn ghost sm">${A("edit", 14)}Edit</span>
        </div>
        <p style="font:400 18px/28px 'Open Sans',sans-serif;margin:14px 0 0;color:var(--text)">
          A voice for every story.
        </p>
        <p style="font:400 15px/23px 'Open Sans',sans-serif;margin:12px 0 0;color:var(--text-2)">
          Turn a quiet moment into time to listen. Pocket TTS reads your words on
          your device, without sending them to a server.
        </p>
        <div class="t3" style="margin-top:14px">45 words · 238 characters</div>
      </div>

      <div class="card tight" style="margin-top:12px">
        <div class="row">
          ${avatar("Alba")}
          <div class="grow">
            <div class="eyebrow-sm">Voice</div>
            <div class="t1">Alba</div>
          </div>
          <span class="dim">${A("chevronRight", 20)}</span>
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="row" style="margin-bottom:10px">
          <span class="pill"><span class="dot" style="width:7px;height:7px;border-radius:50%;background:var(--text-3)"></span>Idle</span>
          <div class="grow"></div>
          <span class="pill accent">1.00×</span>
          <span class="dim">${A("volume", 19)}</span>
        </div>
        <div class="row" style="justify-content:center;gap:14px;margin:2px 0 12px">
          <span class="btn quiet round" style="width:46px;height:46px;border-radius:50%;padding:0">${A("prev", 18)}</span>
          <span class="btn primary round" style="width:58px;height:58px;border-radius:50%;padding:0">${A("play", 24)}</span>
          <span class="btn quiet round" style="width:46px;height:46px;border-radius:50%;padding:0">${A("next", 18)}</span>
          <span class="btn ghost round" style="width:46px;height:46px;border-radius:50%;padding:0">${A("stop", 18)}</span>
        </div>
        <div class="slider" style="height:22px"><div class="track" style="height:3px"><div class="fill" style="width:0%"></div></div></div>
        <div class="row" style="margin-top:4px">
          <span class="t3">00:00 / 00:00</span>
          <div class="grow"></div>
          <span class="btn ghost sm">${A("download", 14)}Export WAV</span>
        </div>
      </div>

      <div class="card tight" style="margin-top:12px;margin-bottom:8px">
        <div class="row">
          <span class="dim">${A("sparkles", 18)}</span>
          <div class="grow">
            <div class="t1" style="font-size:14px">Multi-voice script</div>
            <div class="t3">Assign a voice to each speaker</div>
          </div>
          <span class="dim">${A("chevronRight", 18)}</span>
        </div>
      </div>
    </div>
    ${dock(0)}`;
  return body;
}

/* ================================================= 2. READER PLAYING ==== */
export function readerPlaying(theme = "dark") {
  const body = `
    ${appBar({ right: `<span class="chip on"><span class="dot"></span>On device</span>` })}
    <div class="body scroll">
      <div class="row" style="margin-top:2px">
        <h1 class="page-title grow">Reader</h1>
        <span class="pill accent">${A("bolt", 13)}1.25×</span>
      </div>

      <div class="card" style="margin-top:12px;padding:16px 18px">
        <div class="row" style="margin-bottom:10px">
          <span class="eyebrow-sm grow">Paragraph 3 of 12</span>
          <span class="pill on">${A("wave", 12)}Speaking</span>
        </div>
        <p style="font:400 15px/23px 'Open Sans',sans-serif;margin:0;color:var(--text-2)">
          Bring an article, a chapter, or an idea. Choose a voice, settle in, and
          let the story unfold.
        </p>
        <p style="font:400 15px/23px 'Open Sans',sans-serif;margin:12px 0 0;color:var(--text);
           background:color-mix(in srgb,var(--accent-strong) 22%,transparent);
           border-radius:8px;padding:2px 6px;margin-left:-6px">
          The next chapter is narrated by a voice you made yourself. No account,
          no upload, no waiting — everything happens here, on this phone.
        </p>
        <p style="font:400 15px/23px 'Open Sans',sans-serif;margin:12px 0 0;color:var(--text-2)">
          When it is ready, export a WAV, or hand the text to the system reader.
        </p>
        <div class="t3" style="margin-top:12px">Scroll follows the spoken section</div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="row" style="margin-bottom:10px">
          <span class="pill on"><span class="dot" style="width:7px;height:7px;border-radius:50%;background:currentColor"></span>Playing</span>
          <div class="grow"></div>
          <span class="pill accent">1.25×</span>
        </div>
        ${wave({ n: 62, seed: 21, height: 70, playhead: 0.42 })}
        <div class="row" style="margin-top:10px">
          <span class="t3">00:42 / 01:36</span>
          <div class="grow"></div>
          <span class="btn ghost sm">${A("download", 14)}Export WAV</span>
        </div>
        <div class="row" style="justify-content:center;gap:14px;margin-top:12px">
          <span class="btn quiet round" style="width:46px;height:46px;border-radius:50%;padding:0">${A("prev", 18)}</span>
          <span class="btn primary round" style="width:58px;height:58px;border-radius:50%;padding:0">${A("pause", 24)}</span>
          <span class="btn quiet round" style="width:46px;height:46px;border-radius:50%;padding:0">${A("next", 18)}</span>
          <span class="btn ghost round" style="width:46px;height:46px;border-radius:50%;padding:0">${A("stop", 18)}</span>
        </div>
      </div>
    </div>
    ${dock(0)}`;
  return body;
}

/* ============================================ 3. MULTI-VOICE SCRIPT ===== */
export function multiVoice(theme = "dark") {
  const speakers = [
    { n: "Narrator", c: "#477ae8" },
    { n: "Ada", c: "#765acd" },
    { n: "Marcus", c: "#307890" },
  ];
  const rows = [
    { s: 0, t: "The station was empty when the lights failed." },
    { s: 1, t: "You always said the quiet was the interesting part." },
    { s: 2, t: "I said the opposite, and we both knew it." },
    { s: 1, t: "Then the radio turned itself on." },
  ];
  const body = `
    ${appBar({ left: `<span class="btn ghost sm" style="padding:6px 8px">${A("back", 15)}</span>`, title: "Script" })}
    <div class="body scroll">
      <div class="row" style="margin-top:2px">
        <h1 class="page-title grow">Multi-voice</h1>
        <span class="pill">${A("users", 13)}3 speakers</span>
      </div>
      <p class="page-sub">Each line is spoken by the voice you assign. Timing follows the script.</p>

      <div class="card" style="margin-top:14px;padding:14px 16px">
        ${rows.map((r, i) => `
          <div style="display:flex;gap:12px;padding:9px 0;${i ? "border-top:1px solid var(--outline-2);opacity:.55" : ""}">
            <div style="flex:0 0 4px;border-radius:999px;background:${speakers[r.s].c}"></div>
            <div class="grow">
              <div class="row" style="gap:6px;margin-bottom:3px">
                <span style="font:600 11px/15px 'Open Sans';color:${speakers[r.s].c};letter-spacing:.08em;text-transform:uppercase">${speakers[r.s].n}</span>
                <span class="t3">· 0:${(2 + i).toString().padStart(2, "0")}</span>
              </div>
              <div style="font:400 14px/21px 'Open Sans';color:var(--text)">${r.t}</div>
            </div>
            <span class="dim" style="align-self:center">${A("chevronRight", 16)}</span>
          </div>`).join("")}
      </div>

      <div class="card tight" style="margin-top:12px">
        <div class="row">
          <span class="dim">${A("person", 18)}</span>
          <div class="grow">
            <div class="t1" style="font-size:14px">Voice assignment</div>
            <div class="t3">Tap a line to change its speaker</div>
          </div>
          <span class="dim">${A("chevronRight", 18)}</span>
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        ${slider({ value: 0.35, label: "Gap between lines", display: "350 ms" })}
        ${slider({ value: 0.5, label: "Narration pace", display: "1.00×" })}
        <div class="btn-row" style="margin-top:12px">
          <span class="btn primary">${A("play", 16)}Preview script</span>
        </div>
      </div>
    </div>
    ${dock(0)}`;
  return body;
}

/* ================================================== 4. VOICE LIBRARY ==== */
export function voiceLibrary(theme = "dark") {
  const voices = [
    { name: "Alba", tag: "Built in", sub: "English (FP32)", sel: true, score: null },
    { name: "Ada", tag: "Cloned", sub: "From recording · 12.4 s", score: 92 },
    { name: "Marcus", tag: "Cloned", sub: "From video · 18.1 s", score: 78 },
  ];
  const body = `
    ${appBar({ right: `<span class="chip on"><span class="dot"></span>On device</span>` })}
    <div class="body scroll">
      <h1 class="page-title">Voices</h1>
      <p class="page-sub">3 voices · one personal collection</p>

      <div class="row" style="margin-top:14px;gap:10px">
        <span class="btn primary" style="flex:0 0 auto">${A("add", 16)}Add voice</span>
        <span class="btn ghost" style="flex:0 0 auto">${A("upload", 16)}Import</span>
      </div>

      <div class="list" style="margin-top:14px">
        ${voices.map((v) => `
          <div class="item ${v.sel ? "on" : ""}" style="${v.sel ? "box-shadow:0 3px 12px rgba(0,0,0,.4)" : ""}">
            ${avatar(v.name)}
            <div class="grow">
              <div class="row" style="gap:8px">
                <span class="t1 clamp-1">${v.name}</span>
                ${v.sel ? `<span style="color:var(--accent)">${A("checkCircle", 17)}</span>` : ""}
              </div>
              <div class="row" style="gap:7px;margin-top:5px">
                <span class="pill ${v.tag === "Cloned" ? "accent" : ""}">${v.tag}</span>
                <span class="t3 clamp-1">${v.sub}</span>
              </div>
              ${v.score ? `<div class="row" style="gap:8px;margin-top:8px">
                  <div class="meter ${v.score > 85 ? "good" : "warn"}" style="flex:1"><div style="width:${v.score}%"></div></div>
                  <span class="t3">${v.score}/100</span>
                </div>` : ""}
            </div>
            <span class="dim">${A("more", 18)}</span>
          </div>`).join("")}
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
  return body;
}

/* ==================================================== 5. VOICE DETAIL ==== */
export function voiceDetail(theme = "dark") {
  const body = `
    ${appBar({ left: `<span class="btn ghost sm" style="padding:6px 8px">${A("back", 15)}</span>`, title: "Voice" })}
    <div class="body scroll">
      <div class="card" style="text-align:center;padding:20px 18px">
        ${avatar("Ada", "lg").replace('class="avatar lg"', 'class="avatar lg" style="margin:0 auto 12px;width:64px;height:64px;border-radius:21px;font-size:24px"')}
        <div style="font:700 24px/30px 'Open Sans';letter-spacing:-.4px">Ada</div>
        <div class="row" style="justify-content:center;gap:7px;margin-top:8px">
          <span class="pill accent">${A("sparkles", 12)}Cloned voice</span>
          <span class="pill on">${A("verified", 12)}Consented</span>
        </div>
        ${wave({ n: 48, seed: 33, height: 56, className: "tall", playhead: 0.3 })}
        <div class="row" style="justify-content:center;gap:12px;margin-top:12px">
          <span class="btn quiet round" style="width:44px;height:44px;border-radius:50%;padding:0">${A("prev", 17)}</span>
          <span class="btn primary round" style="width:54px;height:54px;border-radius:50%;padding:0">${A("play", 22)}</span>
          <span class="btn quiet round" style="width:44px;height:44px;border-radius:50%;padding:0">${A("next", 17)}</span>
        </div>
        <div class="t3" style="margin-top:8px">Reference preview · 00:12.40</div>
      </div>

      <div class="card" style="margin-top:12px">
        ${slider({ value: 0.62, label: "Reader amplification for this voice", display: "+4.0 dB" })}
        <div class="t3" style="margin-top:6px">Remembered separately for every voice. Never changes the reference.</div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="eyebrow-sm" style="margin-bottom:8px">Style presets</div>
        <div class="row" style="flex-wrap:wrap;gap:7px">
          ${["Narrator", "Podcast host", "Calm", "Bright", "Character"].map((p, i) => `<span class="pill ${i === 0 ? "accent" : ""}">${p}</span>`).join("")}
        </div>
        <div class="btn-row" style="margin-top:12px">
          <span class="btn soft">${A("tune", 15)}Prosody lab</span>
          <span class="btn ghost">${A("wave", 15)}Edit audio</span>
        </div>
      </div>

      <div class="card" style="margin-top:12px;margin-bottom:8px">
        <div class="eyebrow-sm" style="margin-bottom:8px">Provenance</div>
        <div class="kv"><span class="k">Source</span><span class="v">Microphone recording</span></div>
        <div class="kv" style="margin-top:7px"><span class="k">Reference</span><span class="v">12.4 s · enhanced</span></div>
        <div class="kv" style="margin-top:7px"><span class="k">Created</span><span class="v">12 Oct · 19:04</span></div>
        <div class="kv" style="margin-top:7px"><span class="k">Backup</span><span class="v" style="color:var(--success)">Synced to archive</span></div>
      </div>
    </div>
    ${dock(1)}`;
  return body;
}

/* =================================================== 6. ADD A VOICE ====== */
export function addVoice(theme = "dark") {
  const opts = [
    { icon: "mic", name: "Record a sample", sub: "Speak 3–30 s in a quiet room", tone: "#477ae8" },
    { icon: "music", name: "Import audio", sub: "WAV, M4A or MP3 from this device", tone: "#765acd" },
    { icon: "video", name: "Extract from video", sub: "Pull a clean track from a clip", tone: "#307890" },
    { icon: "person", name: "From a model pack", sub: "Install a speaker you trust", tone: "#986129" },
  ];
  const body = `
    ${appBar({ left: `<span class="btn ghost sm" style="padding:6px 8px">${A("back", 15)}</span>`, title: "Add voice" })}
    <div class="body scroll">
      <h1 class="page-title">Create a voice</h1>
      <p class="page-sub">Clone a voice from a reference you are allowed to use. Everything stays on this device.</p>

      <div class="list" style="margin-top:16px">
        ${opts.map((o) => `
          <div class="item" style="align-items:center">
            <div class="avatar" style="background:linear-gradient(135deg,${o.tone} 0%, ${o.tone}cc 100%)">${A(o.icon, 20)}</div>
            <div class="grow">
              <div class="t1">${o.name}</div>
              <div class="t2">${o.sub}</div>
            </div>
            <span class="dim">${A("chevronRight", 18)}</span>
          </div>`).join("")}
      </div>

      <div class="hint" style="margin-top:16px">
        <span class="ic">${A("shield", 16)}</span>
        <span>Voice references are stored in the app's private directory. Nothing is uploaded, and consent is recorded with the voice.</span>
      </div>

      <div class="card" style="margin-top:12px;margin-bottom:8px">
        <div class="row">
          <span class="dim">${A("info", 18)}</span>
          <div class="grow">
            <div class="t1" style="font-size:14px">How cloning works</div>
            <div class="t3">A 3–30 s reference conditions the model — no training on your device.</div>
          </div>
          <span class="dim">${A("chevronRight", 18)}</span>
        </div>
      </div>
    </div>
    ${dock(1)}`;
  return body;
}

/* ================================================== 7. RECORD STUDIO ==== */
export function recordStudio(theme = "dark") {
  const peaks = speechPeaks(46, 5).map((p, i) => (i > 12 ? Math.max(0.05, p * 0.8) : p));
  const body = `
    ${appBar({ left: `<span class="btn ghost sm" style="padding:6px 8px">${A("back", 15)}</span>`, title: "Record" })}
    <div class="body scroll">
      <h1 class="page-title">Record a sample</h1>
      <p class="page-sub">Speak in a quiet room. One speaker, with their permission.</p>

      <div class="card" style="margin-top:16px;padding:16px 18px">
        <div style="font:700 40px/46px 'Open Sans';letter-spacing:-1px">00:12<span style="color:var(--text-3)">.4</span></div>
        <div class="t3" style="margin-top:2px">Target 3–30 seconds</div>

        <div class="wave live" style="margin-top:12px;height:78px">
          <div class="strip">${peaks.map((p, i) => `<i class="bar ${i > 12 ? "hot" : ""}" style="height:${Math.max(3, p * 56).toFixed(1)}px"></i>`).join("")}</div>
        </div>

        <div style="margin-top:12px">
          <div class="row" style="margin-bottom:5px">
            <span class="t3">Input level</span>
            <div class="grow"></div>
            <span class="t3">−6 dB</span>
          </div>
          <div class="meter" style="height:8px"><div style="width:62%"></div></div>
          <div class="row" style="margin-top:6px;gap:6px">
            <span class="pill on">${A("check", 12)}No clipping</span>
            <span class="pill">${A("wave", 12)}Room tone OK</span>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="eyebrow-sm" style="margin-bottom:8px">Read this naturally</div>
        <p style="font:400 15px/23px 'Open Sans';margin:0;color:var(--text-2)">
          “The lighthouse keeper counted the ships. Some were fishing boats, some were
          not, and one of them had been waiting for him for years.”
        </p>
      </div>

      <div class="row" style="justify-content:center;margin-top:16px">
        <span class="btn quiet round" style="width:48px;height:48px;border-radius:50%;padding:0">${A("folder", 18)}</span>
        <span class="btn rec round" style="width:66px;height:66px;border-radius:50%;padding:0;background:linear-gradient(135deg,#ff8a80,#e5484d);color:#fff;box-shadow:0 4px 18px rgba(229,72,77,.4)">${A("stop", 24)}</span>
        <span class="btn quiet round" style="width:48px;height:48px;border-radius:50%;padding:0">${A("restore", 18)}</span>
      </div>
      <div style="text-align:center;margin-top:12px" class="t3">Recording · tap the square to stop</div>
    </div>
    ${dock(1)}`;
  return body;
}

/* ==================================================== 8. IMPORT AUDIO === */
export function importAudio(theme = "dark") {
  const body = `
    ${appBar({ left: `<span class="btn ghost sm" style="padding:6px 8px">${A("back", 15)}</span>`, title: "Import" })}
    <div class="body scroll">
      <h1 class="page-title">Import audio</h1>
      <p class="page-sub">Voice sample, interview, or audiobook chapter. We will find the best usable region.</p>

      <div class="card" style="margin-top:16px;padding:14px 16px">
        <div class="row">
          <span class="avatar sm" style="background:linear-gradient(135deg,#477ae8,#765acd)">${A("music", 16)}</span>
          <div class="grow">
            <div class="t1 clamp-1" style="font-size:15px">narration_take_04.wav</div>
            <div class="t3">4.2 MB · from Downloads</div>
          </div>
          <span class="dim">${A("close", 17)}</span>
        </div>
        ${wave({ n: 54, seed: 12, height: 64, sel: [0.12, 0.58] })}
        <div class="row" style="margin-top:8px">
          <span class="t3">Suggested region 00:18.2 – 00:41.6</span>
          <div class="grow"></div>
          <span class="pill accent">23.4 s</span>
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="eyebrow-sm" style="margin-bottom:9px">Analysis</div>
        <div class="kv"><span class="k">Duration</span><span class="v">1:52.8</span></div>
        <div class="kv" style="margin-top:7px"><span class="k">Sample rate</span><span class="v">48 kHz</span></div>
        <div class="kv" style="margin-top:7px"><span class="k">Channels</span><span class="v">Stereo → mono</span></div>
        <div class="kv" style="margin-top:7px"><span class="k">Speakers detected</span><span class="v">1</span></div>
        <div class="kv" style="margin-top:7px"><span class="k">Noise floor</span><span class="v" style="color:var(--warn)">−41 dB</span></div>
      </div>

      <div class="hint" style="margin-top:12px">
        <span class="ic">${A("info", 16)}</span>
        <span>Imported audio is converted to mono PCM16 at 24 kHz before trimming and enhancement. The original file is never modified.</span>
      </div>

      <div class="btn-row" style="margin-top:14px;margin-bottom:8px">
        <span class="btn primary">${A("arrowRight", 16)}Continue to editor</span>
      </div>
    </div>
    ${dock(1)}`;
  return body;
}

/* ================================================= 9. VIDEO EXTRACTION === */
export function videoExtract(theme = "dark") {
  const body = `
    ${appBar({ left: `<span class="btn ghost sm" style="padding:6px 8px">${A("back", 15)}</span>`, title: "From video" })}
    <div class="body scroll">
      <h1 class="page-title">Extract from video</h1>
      <p class="page-sub">Pick a clean stretch of speech from a clip.</p>

      <div class="card" style="margin-top:16px;padding:0;overflow:hidden">
        <div style="height:150px;background:linear-gradient(135deg,#1d2a4a 0%,#2b1f47 55%,#0f1424 100%);position:relative;display:grid;place-items:center">
          <span style="width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.14);display:grid;place-items:center;color:#fff">${A("play", 24)}</span>
          <div style="position:absolute;left:12px;bottom:12px;font:600 11px/15px 'Open Sans';color:#dfe6ff;background:rgba(0,0,0,.45);padding:3px 8px;border-radius:6px">00:24.6 / 02:11.0</div>
        </div>
        <div style="padding:14px 16px">
          <div class="t1" style="font-size:15px">interview_final.mp4</div>
          <div class="t3" style="margin-top:3px">1920×1080 · stereo · 47 MB</div>
          <div class="wave" style="margin-top:12px;height:56px">
            <div class="strip">${speechPeaks(52, 3).map((p, i) => `<i class="bar ${i > 14 && i < 40 ? "" : "dim"}" style="height:${Math.max(3, p * 38).toFixed(1)}px"></i>`).join("")}</div>
          </div>
          <div class="row" style="margin-top:8px">
            <span class="t3">Audio track · speech band highlighted</span>
            <div class="grow"></div>
            <span class="pill">Auto</span>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="eyebrow-sm" style="margin-bottom:9px">Extraction</div>
        <div class="kv"><span class="k">Start</span><span class="v">00:24.60</span></div>
        <div class="kv" style="margin-top:7px"><span class="k">End</span><span class="v">00:43.20</span></div>
        <div class="kv" style="margin-top:7px"><span class="k">Selected length</span><span class="v">18.6 s</span></div>
        <div class="btn-row" style="margin-top:12px">
          <span class="btn ghost sm">${A("sparkles", 14)}Find speech</span>
          <span class="btn ghost sm">${A("wave", 14)}Mute music</span>
        </div>
      </div>

      <div class="btn-row" style="margin-top:12px;margin-bottom:8px">
        <span class="btn primary">${A("download", 16)}Extract audio</span>
      </div>
    </div>
    ${dock(1)}`;
  return body;
}

/* ====================================================== 10. TRIM EDITOR == */
export function trimEditor(theme = "dark") {
  const body = `
    ${appBar({ left: `<span class="btn ghost sm" style="padding:6px 8px">${A("back", 15)}</span>`, title: "Trim sample" })}
    <div class="body scroll">
      <div class="row" style="margin-top:2px">
        <h1 class="page-title grow">Trim sample</h1>
        <span class="pill accent">Valid range 3–30 s</span>
      </div>

      <div class="card" style="margin-top:12px;padding:14px 16px">
        ${wave({ n: 62, seed: 9, height: 96, sel: [0.08, 0.86] })}
        <div style="height:10px"></div>
        ${rangeBar({ start: 0.08, end: 0.86 })}
        <div class="row" style="margin-top:8px">
          <div class="grow">
            <div class="t3">Start</div>
            <div class="t1" style="font-size:15px">00:01.20</div>
          </div>
          <div class="grow">
            <div class="t3" style="text-align:right">End</div>
            <div class="t1" style="font-size:15px;text-align:right">00:26.40</div>
          </div>
        </div>
        <div class="btn-row tight" style="margin-top:10px">
          <span class="btn quiet sm off">−0.1 s</span>
          <span class="btn quiet sm">+0.1 s</span>
          <span class="btn quiet sm off">−0.1 s</span>
          <span class="btn quiet sm">+0.1 s</span>
        </div>
      </div>

      <div class="card tight" style="margin-top:12px">
        <div class="row" style="margin-bottom:10px">
          <span class="t1 grow" style="font-size:14px">Selection</span>
          <span class="pill on">00:25.20</span>
        </div>
        <div class="transport" style="border-radius:16px;padding:10px">
          <span class="btn quiet round" style="width:42px;height:42px;border-radius:50%;padding:0">${A("prev", 16)}</span>
          <span class="btn primary round" style="width:50px;height:50px;border-radius:50%;padding:0">${A("play", 21)}</span>
          <span class="btn quiet round" style="width:42px;height:42px;border-radius:50%;padding:0">${A("next", 16)}</span>
          <span class="btn ghost round" style="width:42px;height:42px;border-radius:50%;padding:0">${A("stop", 16)}</span>
        </div>
        <div class="row" style="margin-top:10px">
          <span class="t3">Position 00:01.20</span>
          <div class="grow"></div>
          <span class="btn ghost sm">${A("expand", 14)}Keep full audio</span>
        </div>
      </div>

      <div class="hint" style="margin-top:12px">
        <span class="ic">${A("info", 16)}</span>
        <span>Trim first, then enhance. Enhancement always runs on the selection you keep.</span>
      </div>

      <div class="btn-row" style="margin-top:12px;margin-bottom:8px">
        <span class="btn primary">${A("check", 16)}Use selection</span>
      </div>
    </div>
    ${dock(1)}`;
  return body;
}

/* ==================================================== 11. ENHANCE A/B ==== */
export function enhance(theme = "dark") {
  const body = `
    ${appBar({ left: `<span class="btn ghost sm" style="padding:6px 8px">${A("back", 15)}</span>`, title: "Enhance" })}
    <div class="body scroll">
      <h1 class="page-title">Reduce noise</h1>
      <p class="page-sub">DeepFilterNet3 runs on this device. Compare before you keep it.</p>

      <div class="tabstrip" style="margin-top:14px">
        <div class="on">Original</div>
        <div>Enhanced</div>
      </div>

      <div class="card" style="margin-top:12px;padding:14px 16px">
        ${wave({ n: 58, seed: 17, height: 82 })}
        <div class="row" style="margin-top:10px">
          <span class="t3">Noise floor</span>
          <div class="grow"></div>
          <span class="t1" style="font-size:15px;color:var(--warn)">−41 dB</span>
        </div>
        <div class="row" style="margin-top:6px">
          <span class="t3">Hiss and room tone</span>
          <div class="grow"></div>
          <span class="t3">present</span>
        </div>
      </div>

      <div class="card" style="margin-top:12px;padding:14px 16px;border-style:dashed;opacity:.72">
        <div class="row" style="margin-bottom:8px">
          <span class="eyebrow-sm grow">After enhancement</span>
          <span class="pill">preview</span>
        </div>
        ${wave({ n: 58, seed: 17, height: 70, bars: speechPeaks(58, 17).map((p) => Math.min(1, p * 1.04)) })}
        <div class="row" style="margin-top:10px">
          <span class="t3">Noise floor</span>
          <div class="grow"></div>
          <span class="t1" style="font-size:15px;color:var(--success)">−63 dB</span>
        </div>
        <div class="row" style="margin-top:6px">
          <span class="t3">Improvement</span>
          <div class="grow"></div>
          <span class="t3">22 dB quieter</span>
        </div>
      </div>

      <div class="hint" style="margin-top:12px">
        <span class="ic">${A("shield", 16)}</span>
        <span>Both versions are kept until you choose. The original reference is archived so you can always restore it.</span>
      </div>

      <div class="btn-row" style="margin-top:12px;margin-bottom:8px">
        <span class="btn ghost">${A("restore", 15)}Original</span>
        <span class="btn primary">${A("check", 16)}Use enhanced</span>
      </div>
    </div>
    ${dock(1)}`;
  return body;
}

/* ================================================ 12. LOUDNESS / MASTER == */
export function loudness(theme = "dark") {
  const body = `
    ${appBar({ left: `<span class="btn ghost sm" style="padding:6px 8px">${A("back", 15)}</span>`, title: "Loudness" })}
    <div class="body scroll">
      <h1 class="page-title">Master the level</h1>
      <p class="page-sub">Measure and normalise against a target, with peak protection.</p>

      <div class="card" style="margin-top:16px;padding:16px 18px">
        <div class="row">
          <div class="grow">
            <div class="eyebrow-sm">Integrated loudness</div>
            <div style="font:700 34px/40px 'Open Sans';letter-spacing:-.8px;margin-top:2px">−23.4 <span style="font-size:16px;color:var(--text-2);font-weight:500">LUFS</span></div>
          </div>
          <span class="pill warn">Quiet</span>
        </div>
        <div style="position:relative;height:34px;margin-top:14px">
          <div style="position:absolute;left:0;right:0;top:14px;height:7px;border-radius:999px;background:linear-gradient(90deg,#3a6fd8 0%,#3f8f5c 28%,#3f8f5c 46%,#c8a13a 68%,#c05a4a 100%);opacity:.5"></div>
          <div style="position:absolute;left:0;right:0;top:14px;height:7px;border-radius:999px;background:linear-gradient(90deg,#3a6fd8 0%,#3f8f5c 28%,#3f8f5c 46%,#c8a13a 68%,#c05a4a 100%);clip-path:inset(0 62% 0 0)"></div>
          <div style="position:absolute;left:38%;top:6px;width:4px;height:23px;border-radius:3px;background:#fff;box-shadow:0 0 0 2px var(--surface)"></div>
        </div>
        <div class="row" style="margin-top:2px">
          <span class="t3">−36</span><div class="grow"></div><span class="t3">−24</span><div class="grow"></div><span class="t3">−18</span><div class="grow"></div><span class="t3">−12</span><div class="grow"></div><span class="t3">−6</span>
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="eyebrow-sm" style="margin-bottom:9px">Target</div>
        <div class="grid-3">
          ${[["−23 LUFS", "Broadcast", false], ["−16 LUFS", "Podcast", true], ["−14 LUFS", "Streaming", false]]
            .map(([v, l, on]) => `
            <div class="item" style="flex-direction:column;align-items:flex-start;gap:2px;padding:11px 12px;${on ? "background:var(--selected);border-color:var(--accent-strong)" : ""}">
              <span class="t1" style="font-size:15px;white-space:nowrap">${v}</span>
              <span class="t3">${l}</span>
            </div>`).join("")}
        </div>
        ${slider({ value: 0.55, label: "Applied gain", display: "+7.4 dB" })}
        <div class="kv" style="margin-top:10px"><span class="k">True peak after gain</span><span class="v" style="color:var(--success)">−1.0 dBTP</span></div>
        <div class="kv" style="margin-top:7px"><span class="k">Limiter</span><span class="v">Soft · 0.3 ratio</span></div>
      </div>

      <div class="btn-row" style="margin-top:12px;margin-bottom:8px">
        <span class="btn ghost">${A("play", 15)}Preview</span>
        <span class="btn primary">${A("check", 16)}Apply</span>
      </div>
    </div>
    ${dock(1)}`;
  return body;
}

/* ================================================== 13. QUALITY REPORT == */
export function qualityReport(theme = "dark") {
  const metrics = [
    ["Signal to noise", "31 dB", 88, "good", "Clear speech over a quiet floor"],
    ["Clipping", "0.0 %", 100, "good", "No distorted samples detected"],
    ["Loudness", "−19 LUFS", 72, "", "Slightly below the podcast target"],
    ["Duration", "12.4 s", 84, "good", "Comfortably inside the 3–30 s window"],
    ["Speakers", "1", 100, "good", "A single consistent speaker"],
    ["Room tone", "−58 dB", 62, "warn", "Slight echo in the recording space"],
  ];
  const body = `
    ${appBar({ left: `<span class="btn ghost sm" style="padding:6px 8px">${A("back", 15)}</span>`, title: "Quality" })}
    <div class="body scroll">
      <h1 class="page-title">Reference quality</h1>
      <p class="page-sub">A faster clone starts with a cleaner reference.</p>

      <div class="card" style="margin-top:16px;padding:16px 18px">
        <div class="row">
          <div class="grow">
            <div class="eyebrow-sm">Overall score</div>
            <div style="font:700 40px/46px 'Open Sans';letter-spacing:-1px">92<span style="font-size:17px;color:var(--text-3);font-weight:500">/100</span></div>
            <div class="t2" style="margin-top:2px">Excellent reference</div>
          </div>
          <div style="width:62px;height:62px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--success) 0 92%, var(--track) 92% 100%);position:relative">
            <div style="position:absolute;inset:7px;border-radius:50%;background:var(--surface-low);display:grid;place-items:center;color:var(--success)">${A("check", 22)}</div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        ${metrics.map(([k, v, p, tone, note], i) => `
          <div style="${i ? "margin-top:12px" : ""}">
            <div class="row">
              <span class="t2 grow">${k}</span>
              <span class="t1" style="font-size:14px">${v}</span>
            </div>
            <div class="meter ${tone}" style="margin-top:5px"><div style="width:${p}%"></div></div>
            <div class="t3" style="margin-top:4px">${note}</div>
          </div>`).join("")}
      </div>

      <div class="card" style="margin-top:12px;margin-bottom:8px">
        <div class="eyebrow-sm" style="margin-bottom:9px">Suggested fixes</div>
        <div class="row" style="gap:10px;margin-bottom:9px">
          <span class="pill accent">${A("sparkles", 12)}Enhance</span>
          <span class="t2 grow">Reduce room tone before cloning</span>
          <span class="dim">${A("chevronRight", 16)}</span>
        </div>
        <div class="row" style="gap:10px">
          <span class="pill accent">${A("volume", 12)}Normalise</span>
          <span class="t2 grow">Raise to −16 LUFS for podcast use</span>
          <span class="dim">${A("chevronRight", 16)}</span>
        </div>
      </div>
    </div>
    ${dock(1)}`;
  return body;
}

/* ================================================== 14. CONSENT + NAME == */
export function consent(theme = "dark") {
  const body = `
    ${appBar({ left: `<span class="btn ghost sm" style="padding:6px 8px">${A("back", 15)}</span>`, title: "Confirm" })}
    <div class="body scroll">
      <h1 class="page-title">Name this voice</h1>
      <p class="page-sub">The voice stays on this device and is tagged with who it belongs to.</p>

      <div class="card" style="margin-top:16px;padding:14px 16px">
        <div class="eyebrow-sm" style="margin-bottom:6px">Voice name</div>
        <div style="font:400 17px/24px 'Open Sans';color:var(--text);border-bottom:1px solid var(--accent);padding-bottom:6px">Ada</div>
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
  return body;
}

/* ==================================================== 15. PROSODY LAB === */
export function prosody(theme = "dark") {
  const body = `
    ${appBar({ left: `<span class="btn ghost sm" style="padding:6px 8px">${A("back", 15)}</span>`, title: "Prosody" })}
    <div class="body scroll">
      <h1 class="page-title">Prosody lab</h1>
      <p class="page-sub">Steer how a cloned voice reads — warmth, pace, energy and expressiveness.</p>

      <div class="card" style="margin-top:16px;padding:16px 18px">
        <div class="row">
          ${avatar("Ada")}
          <div class="grow">
            <div class="eyebrow-sm">Preview voice</div>
            <div class="t1">Ada</div>
          </div>
          <span class="btn primary sm">${A("play", 14)}Speak</span>
        </div>
        <div class="row" style="margin-top:12px;gap:8px">
          <span class="t3 grow">“The next chapter is narrated by a voice you made yourself.”</span>
        </div>
        ${wave({ n: 50, seed: 44, height: 58, playhead: 0.36 })}
      </div>

      <div class="card" style="margin-top:12px">
        <div class="eyebrow-sm" style="margin-bottom:10px">Style presets</div>
        <div class="row" style="flex-wrap:wrap;gap:7px">
          ${["Narrator", "Podcast host", "Calm", "Bright", "Dramatic", "Character", "News"].map((p, i) => `<span class="pill ${i === 1 ? "accent" : ""}">${p}</span>`).join("")}
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        ${slider({ value: 0.52, label: "Pitch", display: "+0.5 st", mt: 0 })}
        ${slider({ value: 0.5, label: "Pace", display: "1.00×", mt: 16 })}
        ${slider({ value: 0.64, label: "Warmth", display: "64", mt: 16 })}
        ${slider({ value: 0.38, label: "Expressiveness", display: "38", mt: 16 })}
        ${slider({ value: 0.58, label: "Energy", display: "58", mt: 16 })}
      </div>

      <div class="card tight" style="margin-top:12px;margin-bottom:8px">
        <div class="row">
          <span class="dim">${A("restore", 18)}</span>
          <div class="grow">
            <div class="t1" style="font-size:14px">Reset to voice defaults</div>
            <div class="t3">Presets are saved per voice</div>
          </div>
        </div>
      </div>
    </div>
    ${dock(1)}`;
  return body;
}

/* =================================================== 16. BATCH / QUEUE === */
export function queue(theme = "dark") {
  const items = [
    { t: "Chapter 1 — The Arrival", v: "Ada", p: 100, s: "Done", tone: "on" },
    { t: "Chapter 2 — The Signal", v: "Marcus", p: 62, s: "Synthesising", tone: "accent" },
    { t: "Chapter 3 — The Keeper", v: "Ada", p: 0, s: "Queued", tone: "" },
    { t: "Appendix — Credits", v: "Alba", p: 0, s: "Queued", tone: "" },
  ];
  const body = `
    ${appBar({ left: `<span class="btn ghost sm" style="padding:6px 8px">${A("back", 15)}</span>`, title: "Project" })}
    <div class="body scroll">
      <h1 class="page-title">Sleeping Lighthouse</h1>
      <p class="page-sub">4 chapters · 2 voices · 18 min of audio</p>

      <div class="card" style="margin-top:16px;padding:14px 16px">
        <div class="row" style="margin-bottom:8px">
          <span class="t2 grow">Overall progress</span>
          <span class="t1" style="font-size:14px">42 %</span>
        </div>
        <div class="meter"><div style="width:42%"></div></div>
        <div class="row" style="margin-top:8px">
          <span class="t3">~3 min remaining</span>
          <div class="grow"></div>
          <span class="pill">${A("bolt", 12)}Runs on device</span>
        </div>
      </div>

      <div class="list" style="margin-top:12px">
        ${items.map((i) => `
          <div class="item" style="flex-direction:column;align-items:stretch;gap:8px;padding:13px 14px">
            <div class="row">
              <span class="grow">
                <span class="t1" style="display:block">${i.t}</span>
                <span class="t3">${i.v}</span>
              </span>
              <span class="pill ${i.tone}">${i.s}</span>
            </div>
            ${i.p > 0 ? `<div class="meter ${i.p === 100 ? "good" : ""}"><div style="width:${i.p}%"></div></div>` : ""}
          </div>`).join("")}
      </div>

      <div class="card" style="margin-top:12px">
        <div class="row" style="margin-bottom:10px">
          <span class="t2 grow">Output</span>
          <span class="pill accent">WAV 48 kHz</span>
        </div>
        <div class="row" style="gap:8px">
          <span class="btn ghost sm">${A("plusCircle", 14)}Add item</span>
          <span class="btn ghost sm">${A("tune", 14)}Batch settings</span>
        </div>
      </div>

      <div class="btn-row" style="margin-top:12px;margin-bottom:8px">
        <span class="btn primary">${A("play", 16)}Synthesise all</span>
        <span class="btn ghost">${A("pause", 16)}</span>
      </div>
    </div>
    ${dock(0)}`;
  return body;
}

/* ====================================================== 17. EXPORT ======= */
export function exportScreen(theme = "dark") {
  const body = `
    ${appBar({ left: `<span class="btn ghost sm" style="padding:6px 8px">${A("back", 15)}</span>`, title: "Export" })}
    <div class="body scroll">
      <h1 class="page-title">Export</h1>
      <p class="page-sub">Sleeping Lighthouse · Chapter 2 · 03:12</p>

      <div class="card" style="margin-top:16px;padding:14px 16px">
        <div class="row" style="margin-bottom:10px">
          <span class="t2 grow">Format</span>
        </div>
        <div class="grid-2">
          ${[["WAV", "48 kHz · lossless", true], ["M4A", "128 kbps AAC", false], ["MP3", "192 kbps", false], ["Opus", "24 kbps voice", false]]
            .map(([n, s, on]) => `
            <div class="item" style="flex-direction:column;align-items:flex-start;gap:2px;padding:10px 12px;${on ? "background:var(--selected);border-color:var(--accent-strong)" : ""}">
              <span class="t1" style="font-size:14px">${n}</span>
              <span class="t3">${s}</span>
            </div>`).join("")}
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="eyebrow-sm" style="margin-bottom:9px">Loudness target</div>
        <div class="row" style="gap:8px">
          <span class="pill on">−16 LUFS</span>
          <span class="pill">−23 LUFS</span>
          <span class="pill">Off</span>
        </div>
        <div class="divider" style="margin:12px 0"></div>
        <div class="row" style="gap:11px;margin-bottom:11px">
          <span class="dim">${A("verified", 18)}</span>
          <span class="t2 grow">Embed synthetic-speech provenance</span>
          <span class="switch on"></span>
        </div>
        <div class="row" style="gap:11px">
          <span class="dim">${A("text", 18)}</span>
          <span class="t2 grow">Attach the source text</span>
          <span class="switch on"></span>
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="eyebrow-sm" style="margin-bottom:9px">Send to</div>
        <div class="row" style="gap:11px;margin-bottom:11px">
          <span class="dim">${A("folder", 18)}</span>
          <span class="t2 grow">Files</span>
          <span class="dim">${A("chevronRight", 16)}</span>
        </div>
        <div class="row" style="gap:11px;margin-bottom:11px">
          <span class="dim">${A("share", 18)}</span>
          <span class="t2 grow">Share sheet</span>
          <span class="dim">${A("chevronRight", 16)}</span>
        </div>
        <div class="row" style="gap:11px">
          <span class="dim">${A("headphones", 18)}</span>
          <span class="t2 grow">Audiobook player</span>
          <span class="dim">${A("chevronRight", 16)}</span>
        </div>
      </div>

      <div class="btn-row" style="margin-top:14px;margin-bottom:8px">
        <span class="btn primary">${A("download", 16)}Export file</span>
      </div>
    </div>
    ${dock(0)}`;
  return body;
}

/* ===================================================== 18. SETTINGS ====== */
export function settings(theme = "dark") {
  const row = (ic, title, sub, right = "") => `
    <div class="row" style="gap:12px;padding:11px 0;${""}">
      <span class="dim">${A(ic, 19)}</span>
      <span class="grow">
        <span class="t1" style="display:block;font-size:15px">${title}</span>
        ${sub ? `<span class="t3">${sub}</span>` : ""}
      </span>
      ${right || `<span class="dim">${A("chevronRight", 17)}</span>`}
    </div>`;

  const body = `
    ${appBar({ right: `<span class="chip on"><span class="dot"></span>Offline</span>` })}
    <div class="body scroll">
      <h1 class="page-title">Settings</h1>

      <div class="card" style="margin-top:14px;padding:16px 18px">
        <div class="eyebrow-sm" style="margin-bottom:10px">Appearance</div>
        <div class="row" style="gap:6px">
          ${["System", "Light", "Dark", "AMOLED"].map((m, i) => `<span class="pill ${i === 2 ? "accent" : ""}" style="flex:1;justify-content:center">${m}</span>`).join("")}
        </div>
        <div class="row" style="gap:11px;margin-top:14px">
          <span class="dim">${A("access", 19)}</span>
          <span class="t2 grow">Follow system text size and contrast</span>
          <span class="switch on"></span>
        </div>
        <div class="row" style="gap:11px;margin-top:11px">
          <span class="dim">${A("wave", 19)}</span>
          <span class="t2 grow">Haptic feedback</span>
          <span class="switch on"></span>
        </div>
      </div>

      <div class="card" style="margin-top:12px;padding:16px 18px">
        <div class="eyebrow-sm" style="margin-bottom:4px">Engine</div>
        ${row("cpu", "Model pack", "English (FP32) · 2 voices")}
        ${row("bolt", "Performance", "4 threads · 0.9× realtime")}
        ${row("volume", "Reader amplification", "Per voice")}
      </div>

      <div class="card" style="margin-top:12px;padding:16px 18px">
        <div class="eyebrow-sm" style="margin-bottom:4px">Privacy</div>
        ${row("shield", "Everything stays local", "No account, no upload", `<span class="pill on">${A("check", 12)}On</span>`)}
        ${row("key", "Consent log", "2 recorded consents")}
        ${row("cloudOff", "Network access", "Never used", `<span class="pill on">${A("lock", 12)}Blocked</span>`)}
      </div>

      <div class="card" style="margin-top:12px;padding:16px 18px;margin-bottom:8px">
        <div class="eyebrow-sm" style="margin-bottom:4px">Storage</div>
        ${row("download", "Voice backups", "ZIP · 1 archive")}
        ${row("trash", "Cache", "214 MB")}
        ${row("info", "About", "Pocket TTS 4.0")}
      </div>
    </div>
    ${dock(2)}`;
  return body;
}

/* ================================================ 19. LOCK SCREEN ======== */
export function lockScreen(theme = "dark") {
  const body = `
    <div style="flex:1;display:flex;flex-direction:column;padding:34px 22px 20px;position:relative">
      <div style="text-align:center">
        <div style="font:600 13px/18px 'Open Sans';color:var(--text-2)">Tue, 12 October</div>
        <div style="font:700 64px/70px 'Open Sans';letter-spacing:-2px;margin-top:6px">9:17</div>
      </div>
      <div style="flex:1"></div>
      <div class="card" style="padding:14px 16px">
        <div class="row" style="margin-bottom:10px">
          <div class="grow">
            <div class="t3">Pocket TTS</div>
            <div class="t1" style="font-size:15px">Chapter 2 — The Signal</div>
          </div>
          <span class="dim">${A("more", 18)}</span>
        </div>
        ${wave({ n: 40, seed: 71, height: 44, playhead: 0.46 })}
        <div class="row" style="margin-top:10px">
          <span class="t3">−01:14</span>
          <div class="grow"></div>
          <span class="t3">03:12</span>
        </div>
        <div class="row" style="justify-content:center;gap:20px;margin-top:12px">
          <span class="dim">${A("prev", 22)}</span>
          <span style="width:50px;height:50px;border-radius:50%;background:var(--accent);color:#0d1226;display:grid;place-items:center">${A("pause", 22)}</span>
          <span class="dim">${A("next", 22)}</span>
        </div>
      </div>
      <div style="text-align:center;margin-top:14px" class="t3">Playing in the background · tap to open</div>
    </div>`;
  return body;
}
