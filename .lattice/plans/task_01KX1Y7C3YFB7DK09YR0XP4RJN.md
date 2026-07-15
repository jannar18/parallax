# ASMV-109: Replace Fractal NYC software-post screenshots with per-page entrance video clips

**Complexity:** low

## Scope
The `fractal-nyc` entry in `src/data/works.json` carried 6 static PNG screenshots
(home + 5 houses). Replace them with short looping `.mp4` clips that show each
page *being entered* — the staggered FadeIn entrance animations (banners,
headings, buttons) playing on-camera, followed by a slow scroll that reveals the
below-the-fold content and stops the instant the footer's top edge reaches the
viewport bottom (footer never in frame).

## Approach
- New capture interaction script `pipeline/enter-page.mjs`: loads the home
  octahedron hub, clicks the target house's navbar link (wouter client-nav
  remounts the page so its FadeIn entrance replays while recording), holds,
  then slow-scrolls to the footer-stop. `TARGET_ROUTE` selects the house.
- Generated clips with the existing `pipeline/capture.mjs` (Playwright +
  ffmpeg, `--view-width 1440 --width 900`, mp4) against fractal-nyc.netlify.app.
- `LabMedia` already auto-plays `.mp4` as a looping muted `<video>`, so the
  swap needs no component changes — only the `screenshots` array.

## Changes
- `src/data/works.json` — fractal-nyc `screenshots` → 5 `.mp4`s (dropped the
  home clip; the carousel hero `gif` is already the octahedron, so keeping a
  home entrance clip would duplicate it).
- `public/lab/shots/fractal-nyc-{visit,events,campus,education,publications}.mp4` — new.
- `pipeline/enter-page.mjs` — new capture script (repeatable regeneration).

## Acceptance criteria
- Software post lightbox for Fractal NYC plays 5 looping entrance clips.
- Each clip shows the page's entrance animation and stops above the footer.
- No dark footer visible in any final frame.
- Human (Julianna) visually approved all 6 clips locally before commit.
