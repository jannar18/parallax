# ASMV-102: Document fractal-nyc as a work entry on /work/software

## Scope
Append ONE work entry (`id: fractal-nyc`, number 5) to `src/data/works.json` showing off
the fractal-nyc project's themed "house" pages. Capture a hero GIF of the home page +
3–6 page screenshots. APPEND only; do not touch the 4 existing works, the gallery page,
the loader, or the pipeline.

## Approach
- Source: `~/Dev/fractal-nyc` (React SPA, routes: /, /story, /campus, /visit, /events,
  /education, /publications, /political-club, /people, /the-protocol). Live: netlify.
- Capture from the live Netlify site with Playwright (installed in scratchpad; capture.mjs
  copied there so its ESM `import 'playwright'` resolves).
- Hero: short looping GIF of `/` (Three.js hero) -> `public/lab/fractal-nyc.gif` (< 5MB).
- Screenshots (each house has a distinct palette -> visual variety):
  home, visit (olive), events (coral), education (crimson), publications (pink), campus (green).
  Save to `public/lab/shots/fractal-nyc-<page>.png`, compressed.
- Append entry with repo https://github.com/jannar18/fractal-nyc, url = netlify link,
  date 2026-07-06, tags, screenshots[] paths.

## Acceptance criteria
- works.json parses; 4 existing entries unchanged; new entry appended.
- Every referenced media path exists under public/lab/.
- Hero GIF < ~5MB; PNGs reasonably sized.
- Nothing committed (left staged).
