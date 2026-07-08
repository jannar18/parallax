# Prototypes Portfolio — Improvement Notes (for later)

Follow-ups captured while shipping the lab/prototypes portfolio (`/work/software`).
None are blocking; the page is live and healthy. Pick these up in a future pass.

## 1. Media weight optimizations — ✅ DONE

All three heavy assets were optimized (GIF→MP4 / re-encode to 1000px H.264):

| Work | Was | Now |
|------|-----|-----|
| **Snails vs Garden** | 11 MB 1080p60 mp4 | **~490 KB** (1000px/30fps, re-encoded in place at `game-1.mp4`) |
| **Stem** | 3.5 MB 1000px GIF | **~195 KB** mp4 (also re-captured — hero-only, see below) |
| **Relief Hover** | 4.5 MB 1000px GIF | **~270 KB** mp4 |

GIF→MP4 recipe (kept for reference):
```bash
ffmpeg -y -i in.gif -vf "scale=1000:-2:flags=lanczos,format=yuv420p" \
  -c:v libx264 -crf 24 -preset slow -an -movflags +faststart out.mp4
```
`LabMedia.tsx` renders `.mp4`/`.webm` via `<video>` (see `isVideoSrc`); the whole `public/lab/`
gallery is now MP4 (no GIFs left).

### Re-captures done in the same pass
- **Stem** — re-captured from the local `github.com/jannar18/stem` (Vite) dev server. The whole
  hero (heading + tulip + shortener input) fits a 1440×900 frame, so the showcase pastes a long
  URL **on the hero with no scrolling** (`pipeline/stem.mjs`).
- **Fractal Campus** — the earlier version looked glitchy because scrolling a Framer site fires
  its lazy-load / scroll-reveal animations mid-capture. Re-shot **hero-only** (just the cursor-light
  gliding across the reliefs), fully settled before recording (`pipeline/fractal-campus.mjs`).
- **Renoverse AI** — re-shot as a short **video** from the local static site: hero (video bg
  visible) → "One workspace" product mockup → feature cards (`pipeline/renoverse.mjs`). Entry
  switched from `.png` to `.mp4`. Also fixed the entry's `url`: it pointed at a stale deploy
  (`renoverseai.github.io/renoverse-marketing-site/`, which is missing `hero.mp4`); corrected to
  the live, working deploy `jannar18.github.io/renoverse-ai-website/` (hero.mp4 → 206, all assets
  load). The `.png`→`.mp4` swap still stands regardless: a still of the scrim-heavy hero reads as
  empty, so the scroll-through video shows the product better.
- **Secret Garden** — screenshots were all the same cottage view. Replaced with a **loading-screen +
  GUI-panel** shot and one rendered scene frame. NOTE: the three.js/draco garden **will not render
  in headless** (SwiftShader software-GL blocks the page thread; the loading overlay never clears),
  so a GUI-panel-over-rendered-scene shot needs a **headful capture on a real GPU**. The existing
  `secret-garden.mp4` was clearly captured that way.

## 2. Capture pipeline (`pipeline/capture.mjs`) learnings & ideas

Learned while re-capturing **Fractal Campus** from its published Framer site:

- **Heavy cursor/shader pages make every synthetic input event expensive.** On the Fractal
  Campus page each Playwright `mouse.move` step cost ~130–250ms and each `mouse.wheel` tick
  ~475ms (the page re-renders a cursor-following light on every event). Wall-clock == recorded
  video length, so a "normal" interaction script produced a **105-second** clip. Fix pattern:
  keep the interaction script tight (few, long sweeps — see `pipeline/fractal-campus.mjs`) and
  **time-compress the result in post** (`setpts=PTS/N`) to land in the house range (~6–15s).
- **Framer / analytics / streaming sites never reach `networkidle`.** The old hardcoded 60s
  `waitForLoadState('networkidle')` was being recorded as dead footage at the head of the clip.
  Added a **`--net-idle <ms>`** flag (0 = skip). Use `--net-idle 0` for Framer captures.
- **`goto` waited on the `load` event, which blocks on a heavy hero video.** Renoverse's 13 MB
  `hero.mp4` made `waitUntil:'load'` take ~7s of dead footage. Added a **`--goto-wait <cond>`**
  flag (`load` | `domcontentloaded` | `networkidle` | `commit`). Use `--goto-wait domcontentloaded`
  for pages with large media so recording starts as soon as the DOM is ready.

Ideas worth adding to `capture.mjs` (not yet done):
- **`--target-duration <sec>` / `--speed <n>`**: auto time-compress (`setpts`) so output always
  lands at a target length regardless of the page's per-event cost. Would remove the manual
  post-process step used for Fractal Campus.
- **Smarter `--trim-start`**: auto-detect first motion (or start of the interaction script)
  instead of a hardcoded seconds value, so pre-roll dead footage is trimmed reliably.

## 3. Framer free-tier "Made in Framer" badge

Captures of the published Fractal Campus site include the small **"Made in Framer"** badge in
the bottom-right (free plan). Options if we want it gone: (a) crop it out in ffmpeg (loses a
sliver of content), or (b) publish on a paid Framer plan that removes the badge, then re-capture.
Left as-is for now — it's small and unobtrusive.

## 4. Data model nit

`src/data/works.json` still calls the media field **`gif`**, but several entries now hold
`.mp4`. `LabMedia` handles both transparently, so it works — but the field name is misleading.
Consider renaming `gif` → `media` in a future cleanup (touches `works.json`, `LabCard.tsx`,
`LabLightbox.tsx`, and the `Work` type).
