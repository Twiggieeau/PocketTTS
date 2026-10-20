# Pocket TTS — design showcase

A static mockup of a next-generation **on-device text-to-speech app with voice cloning**,
built to the PocketTTS design system already in this repository.

Every screen is a 360 × 800 dp Android frame rendered at 3× device pixel ratio
(1080 × 2400 PNG), so the mockups drop straight into a README next to the real
app screenshots.

```
showcase/
├── build.mjs           # renders every screen to out/*.png
├── contact-sheet.mjs   # renders out/contact-sheet.png (all screens on one page)
├── src/
│   ├── tokens.css      # colour + type tokens, mirrored from PocketTheme.kt
│   ├── base.css        # component library (cards, buttons, sheets, waveforms)
│   ├── lib.js          # icon set, waveform generator, UI helpers
│   ├── screens-a.js    # primary application screens
│   └── screens-b.js    # sheets, dialogs and light-theme variants
└── out/                # generated PNGs + index.html gallery
```

## Build

```bash
node build.mjs              # all 29 screens + out/index.html
node build.mjs --only=10,27 # re-render matching slugs only
node contact-sheet.mjs      # out/contact-sheet.png
```

Requires `chromium` on `PATH` and Node 18+. No network access, no image assets —
every pixel is HTML/CSS/SVG, so the mockups stay diffable in git.

## Why the mockup exists

PocketTTS already ships Reader, voice cloning, waveform trimming, DeepFilterNet3
enhancement and loudness normalisation. The showcase sketches the **next
iteration**: a fuller studio around the existing engine.

### Feature ideas that drove the screens

**Voice cloning and preparation**

- **Record a sample** with a live input meter, clipping detection, room-tone
  check and a read-along prompt so the speaker varies their pitch naturally.
- **Import audio** that measures the file and proposes the strongest 3–30 s
  region instead of making the user scrub blindly.
- **Extract from video** with speech-band detection and a *mute music* pass.
- **Trim → enhance** as an ordered pipeline: the selection is made first, then
  DeepFilterNet3 and loudness normalisation run on exactly what is kept.
- **Before / after** A/B sheet comparing noise floor (−41 dB → −63 dB) instead of
  a vague "enhance" toggle.
- **Reference quality report** scoring SNR, clipping, loudness, duration, speaker
  count and room tone, with one-tap suggested fixes.
- **Consent and provenance** capture — permission, synthetic-speech disclosure,
  and a provenance stamp embedded in exported files.

**Reading and synthesis**

- **Multi-voice script**: one voice per line, per-line timing, adjustable gaps.
- **Prosody lab**: pitch, pace, warmth, expressiveness and energy, saved per
  voice, with named style presets.
- **Batch project**: queue chapters, watch progress, export a whole audiobook.
- **Export** with format choice, loudness target and provenance embedding.
- **Loudness master** using real LUFS measurement with peak protection.

**Trust and safety**

- Privacy defaults surfaced in Settings: network never used, consent log, local
  archive, and a visible *On device* badge on every screen.
- Destructive actions confirm their real consequences before they commit.
- Reference audio is archived so a clone can always be restored to the original.

## Design system

Tokens mirror `app/src/main/java/org/pockettts/android/engine/PocketTheme.kt`
and `DESIGN_SYSTEM.md` so the mockup and the shipped app stay in step.

| Role | Dark / AMOLED | Light |
| --- | --- | --- |
| Background | `#0B0E19` | `#F0F3FB` |
| Surface | `#1B2337` | `#FCFDFF` |
| Raised surface | `#263149` | `#E4EAF7` |
| Accent | `#B4C4FF` | `#4056C7` |
| Primary text | `#F4F6FF` | `#17213A` |
| Secondary text | `#BFCBE3` | `#4C5973` |
| Success | `#72E5BC` | `#116743` |
| Error | `#FFB4AB` | `#BA1A1A` |

- 24 dp cards, 34 dp sheets, 14 dp buttons, 26 dp navigation dock.
- 20 dp page padding, 12 dp control gaps, 10 dp peer-action gaps.
- 48 dp minimum touch targets; system font and text-size preferences retained.
- The type scale matches `StudioTypography` exactly (30/35 headings, 15/22 body,
  11/15 labels).

## Screens

| # | Screen | # | Screen |
| --- | --- | --- | --- |
| 01 | Reader | 16 | Batch project |
| 02 | Reader, playing | 17 | Export |
| 03 | Multi-voice script | 18 | Settings |
| 04 | Voice library | 19 | Background playback |
| 05 | Voice detail | 20 | Voice picker sheet |
| 06 | Add a voice | 21 | Recording sheet |
| 07 | Record a sample | 22 | Before / after sheet |
| 08 | Import audio | 23 | Confirm delete |
| 09 | Extract from video | 24 | Export notification |
| 10 | Trim the reference | 25 | System TTS engine sheet |
| 11 | Before / after | 26 | Light theme — voice library |
| 12 | Loudness master | 27 | Light theme — trim & enhance |
| 13 | Reference quality | 28 | Light theme — reader |
| 14 | Consent & provenance | 29 | Light theme — consent |
| 15 | Prosody lab | | |

`out/index.html` opens the same screens as a live gallery; `out/contact-sheet.png`
is the one-page overview.
