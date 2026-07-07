# ASMV-104: Re-capture Running Log + Fractal NYC media at 1000px pipeline quality (live URLs)

## Scope
Re-capture two works from their LIVE URLs at updated pipeline quality and OVERWRITE existing media (same filenames, no works.json change).

## Tasks
1. **Running Log** — capture `https://jannar18.github.io/prototypes/` (smooth scroll-through of card grid) → overwrite `public/lab/prototype-03.gif`. Target `--width 1000 --fps 24 --duration 6`, <6MB.
2. **Fractal NYC hero** — capture `https://fractal-nyc.netlify.app/` (interactive Three.js fractal-octahedron in motion) → overwrite `public/lab/fractal-nyc.gif`. Same spec.
3. **Fractal NYC 6 house stills** — navigate each themed house page, capture full-width PNG (~1600px) → overwrite `public/lab/shots/fractal-nyc-{home,visit,events,campus,education,publications}.png`.

## Tool
`pipeline/capture.mjs` (Playwright chromium + ffmpeg two-pass palette). Chromium present in ms-playwright cache. PNG stills via a small Playwright screenshot script.

## Acceptance
- Each GIF verified visually (Read): crisp, best moment, not blank, <6MB, 1000px wide.
- Each PNG verified: crisp, correct house page, ~1600px.
- No edits to works.json / page.tsx / content.ts. No publish.mjs. No commit/push.

## Before dimensions
- prototype-03.gif: 680x425 -> 1000 wide
- fractal-nyc.gif: 820x461 -> 1000 wide
- 6 stills: 1600x1138 -> ~1600 wide
