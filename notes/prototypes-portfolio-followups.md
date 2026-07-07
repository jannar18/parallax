# Prototypes Portfolio — Improvement Notes (for later)

Follow-ups captured while shipping the lab/prototypes portfolio (`/work/software`).
None are blocking; the page is live and healthy. Pick these up in a future pass.

## 1. Media weight optimizations (highest value)

The gallery still has a few heavy assets. Targets, newest-first:

| Work | Current | Action | Target |
|------|---------|--------|--------|
| **Snails vs Garden** | `public/videos/software/snails-vs-garden/game-1.mp4` — **11 MB** 1080p original demo | Re-encode (H.264, crf ~24, scale to 1000px, `-an`, `+faststart`) | ~1–2 MB, same perceived quality |
| **Stem** | `public/lab/prototype-01.gif` — ~3.6 MB 1000px GIF | Convert GIF → MP4 | well under 1 MB |
| **Relief Hover** | `public/lab/prototype-02.gif` — ~4.7 MB 1000px GIF | Convert GIF → MP4 | well under 1 MB |

GIF→MP4 recipe (matches the rest of the gallery):
```bash
ffmpeg -y -i in.gif -vf "scale=1000:-2:flags=lanczos,format=yuv420p" \
  -c:v libx264 -crf 24 -preset slow -an -movflags +faststart out.mp4
```
Then update the entry's `gif` field in `src/data/works.json` to the `.mp4` path and delete
the old GIF. `LabMedia.tsx` already renders `.mp4`/`.webm` via `<video>` (see `isVideoSrc`),
so no component changes are needed — this is exactly how Fractal NYC / Fractal Campus work now.

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
