# ASMV-111: Add Figma-file walkthrough clip as final Fractal NYC page-shot

## Scope
Append a sped-up (4×, 30s) screen-recording tour of the fractal-nyc Figma design
file as the closing slide of the Fractal NYC post's lightbox carousel.

## Changes
- `public/lab/shots/fractal-nyc-figma.mp4` — new asset. Encoded to match the other
  desktop page-shots: 900×562, h264/yuv420p, 24fps, ~2.8MB. Stop-recording toolbar
  tail trimmed off.
- `src/data/works.json` — append `/lab/shots/fractal-nyc-figma.mp4` to the
  `fractal-nyc` entry's `screenshots` array (now 7 shots).

## Acceptance criteria
- works.json remains valid JSON; fractal-nyc `screenshots` has the new path last.
- New mp4 present, correct dimensions/codec, no macOS recording UI in any frame.
- Renders as the final carousel slide via `LabLightbox` (no code changes needed —
  it maps `[gif, ...screenshots]`).
