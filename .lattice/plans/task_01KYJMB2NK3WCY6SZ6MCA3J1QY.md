# ASMV-115: Document Parallax Haus as a full software project post

**Complexity:** medium — content-only at runtime, but it requires a deliberate multi-asset
capture, media QA, and a production deployment check.

## Goal

Add Parallax Haus to `/work/software` as a complete shipped identity/portfolio project,
not as a numbered prototype. The post should make the site’s strongest qualities legible:
one coherent identity across architecture and software, an autonomous generative-canvas
hero, full-viewport editorial pacing, the architecture/software merge, the Architecture
flipbook, the Software running log, and the tactile Studio Desk archive.

## Current architecture and decisions

- The canonical Software page is now a `Work` gallery backed by
  `src/data/works.json`, rendered by `LabGallery`/`LabCard` and opened in the
  `LabLightbox` media carousel. Fractal NYC is the closest prior pattern: a non-prototype
  project with one lead video and a mixed array of page clips/stills.
- `src/content/work-software/*.mdx` is legacy metadata/content. The direct
  `/work/software/[slug]` route redirects to `/work/software`, so a new MDX file would
  create content that users cannot read. Do not add one for this task and do not restore
  the old detail-panel architecture.
- Reuse the `/post-prototype` procedure’s useful sequence—understand, capture, register,
  deploy, verify—but do **not** run `pipeline/publish.mjs` unmodified. It hard-codes
  `prototype-NN` IDs/labels and `.gif` destinations, calls `git add -A`, commits, and may
  push. This task needs a stable `parallax-haus` ID, a `Ship` label, multiple media files,
  and the repo’s one-task/one-branch PR workflow.
- No gallery/component changes should be necessary: `LabMedia` already renders MP4 and
  PNG assets, and `LabLightbox` already treats `[gif, ...screenshots]` as one carousel.
  Only change components if verification exposes a concrete many-slide regression.

## Content structure

Append one new record to `src/data/works.json` without changing existing records:

- `id`: `parallax-haus`
- `number`: next stable manifest number (`13` at planning time; re-check max before edit)
- `label`: `Ship`
- `title`: `Parallax Haus`
- `date`: capture/publish date
- `url`: `https://parallax.haus/`
- `repo`: `https://github.com/jannar18/parallax`
- `tags`: `next.js`, `react`, `canvas`, `editorial`
- `gif`: lead hero-animation MP4 (the field name is legacy and supports MP4)
- `screenshots`: ordered media story below
- Suggested description (tighten only for accuracy after seeing the final captures):
  “An editorial portfolio that brings architecture, software, and an evolving studio
  archive into one identity—built with a generative canvas hero, book-like project
  browsing, responsive motion, and a tactile Riso-inspired visual system.”

The `Ship` label is intentional: this is the live production site and a complete
architecture × software identity project, not another `Prototype NNN` entry.

## Capture strategy

Capture from the existing production site (`https://parallax.haus/`) **before** adding
the new Software entry, so the walkthrough documents the site rather than recursively
showing its own post. Use a 1440×900 (16:10) Playwright viewport and encode gallery video
at 900–1000 px wide, 24 fps, H.264/yuv420p, muted, `faststart`. Prefer MP4 over GIF for
the long/dense motion; keep each still at the same 16:10 viewport ratio so the carousel
does not jump between wildly different compositions.

Add small repeatable Playwright helpers under `pipeline/` rather than relying on manual
screen recording:

1. `pipeline/parallax-haus-hero.mjs` — wait only for first paint, keep the viewport at
   the top, and record a fresh load long enough to include the hero’s 1.5 s pause and
   2.8 s autonomous fold (about 6 s total). Run `capture.mjs` with
   `--goto-wait domcontentloaded --net-idle 0 --wait 0`; tune `--trim-start` after frame
   inspection so the clip opens on the initial composition and does not lose the start
   of the fold.
2. `pipeline/parallax-haus-scroll.mjs` — wait for fonts/images and for the hero entrance
   to finish, then perform a single slow top-to-bottom walkthrough. Pause briefly at the
   major compositions and finish on the footer; do not use the default down-and-back
   loop because the requested artifact is a scroll-through. Target roughly 25–40 s,
   then trim load/settle footage during encode.
3. `pipeline/parallax-haus-stills.mjs` — deterministic screenshot runner for the exact
   viewport/scroll positions and primary routes listed below. Wait for fonts and lazy
   media before each shot; hide no real site chrome. For animated/video sections,
   pause at a representative, nonblank frame.

Store assets together for maintainability:

- `public/lab/parallax-haus/hero-animation.mp4` — lead media/card thumbnail
- `public/lab/parallax-haus/home-scroll.mp4` — first carousel slide after the lead
- Homepage major-section stills:
  - `home-hero.png` (settled hero composition)
  - `home-software.png` (World 02 / Software Development + AI Research)
  - `home-architecture.png` (World 01 / Architectural Design)
  - `home-merge.png` (architecture + software convergence at a readable midpoint/end)
  - `home-clip-reel.png` (Arch Voice media experience)
  - `home-manifesto.png` (future-of-the-field statement and archive link)
  - `home-studio-desk.png` (the Studio Desk banner/artifact strip)
  - `home-footer.png` (dark textured footer/wordmark)
- Primary-page stills (representative viewport, not excessively tall full-page images):
  - `page-software.png` — Software running log
  - `page-architecture.png` — Architecture flipbook cover/opening view only; do not
    click through every portfolio project
  - `page-archive.png` — Studio Desk archive
  - `page-writing.png` — Writing index
  - `page-about.png` — About/resume opening

This route set follows the site’s primary navigation. Do not capture `/now` (redirect),
utility/dev surfaces (`/pretext`, `/riso-test`), every writing/project detail route, or
every Architecture leaf. The homepage itself is represented by the lead video, full
scroll, and section stills.

Order `screenshots` as a visual narrative: full scroll first; homepage stills in page
order; then Software, Architecture, Archive, Writing, and About page stills. This keeps
the post rich without requiring a new detail-page implementation.

## Affected files

- `src/data/works.json` — append the `parallax-haus` `Ship` record.
- `pipeline/parallax-haus-hero.mjs` — reproducible initial-animation interaction.
- `pipeline/parallax-haus-scroll.mjs` — reproducible one-way homepage walkthrough.
- `pipeline/parallax-haus-stills.mjs` — reproducible major-section/page screenshots.
- `public/lab/parallax-haus/*` — two optimized MP4s plus the ordered PNG stills.

Expected no-touch files: `src/content/work-software/*`, `src/lib/content.ts`,
`src/components/lab/*`, and `pipeline/publish.mjs`.

## Implementation and branch/deployment approach

1. From current `main`, use `scripts/new-lattice-worktree.sh ASMV-115
   parallax-haus-post` (or equivalent) to create
   `feature/ASMV-115-parallax-haus-post`; keep shared Lattice writes pointed at the
   primary checkout via `LATTICE_ROOT=/Users/fractalos/Dev/parallax`.
2. Capture and visually QA the existing production site before modifying the manifest.
   Keep temporary WebM/frame/contact-sheet files in `pipeline/.tmp/` only.
3. Add only the reproducible helpers, optimized final media, and manifest entry. Stage
   explicit task paths—never the unmodified publisher’s repo-wide `git add -A`—so
   unrelated primary-checkout/Lattice changes are preserved.
4. Commit on the feature branch, push it, and open a PR to `main` following the repo’s
   one-task/one-branch rule. Merge only after independent review passes. The merge to
   `main` triggers the Vercel production deployment at `parallax.haus`.
5. After Vercel deploys, verify the live entry and every served media URL; then complete
   the normal Lattice review ceremony. Do not commit or push during planning.

## Verification

### Media QA

- Use `ffprobe` to confirm both videos are H.264/yuv420p, 24 fps, no audio, expected
  dimensions, and reasonable file sizes; ensure `moov`/faststart behavior allows prompt
  web playback.
- Inspect the first/middle/last frames of each video and every PNG at full size. Reject
  blank loading frames, cookie/browser chrome, clipped header, accidental hover states,
  jarring scroll jumps, or unreadable section framing.
- Hero clip: includes the untouched opening state, complete autonomous fold, and a brief
  settled ending; it should loop without a long blank tail.
- Scroll clip: starts at the hero, moves only downward at a readable pace, pauses at all
  major sections, and ends on the footer.
- Stills: all eight homepage moments and all five primary destination pages are present;
  Architecture shows the flipbook entry view only.

### Data/build QA

- Parse `src/data/works.json`; confirm the new ID/number are unique, existing entries are
  byte-for-byte unchanged, and every referenced `/lab/parallax-haus/*` file exists.
- Run `pnpm test`, `pnpm exec tsc --noEmit`, and `pnpm build` (with no dev server using
  `.next` concurrently). Run the repo lint command if it is functional on this Next.js
  version; document any pre-existing failure rather than widening scope.
- Preview `/work/software` at desktop and mobile widths. Confirm Parallax Haus sorts to
  the top by date, is visibly labeled `Ship`, the lead video autoplays/loops/mutes, all
  carousel media render in order, arrows/keyboard/dots work across the long carousel,
  close/focus behavior still works, and Live/Repo links resolve correctly.

### Production QA

- After merge/deploy, load `https://parallax.haus/work/software` in a fresh session and
  exercise the full Parallax Haus carousel.
- Verify `https://parallax.haus/` and the five primary destinations still load, the live
  and repo links are correct, and each `/lab/parallax-haus/*` URL returns/render its media.
- Check the production browser console/network panel for new 404s, media decode errors,
  or hydration errors.

## Acceptance criteria

- `/work/software` contains a newest-first `Parallax Haus` entry labeled `Ship`, never
  `Prototype`, with accurate live/repo links and copy centered on its architecture ×
  software identity and strongest design/interaction qualities.
- The post leads with a clean recording of the complete initial hero animation and
  includes a readable one-way full homepage scroll-through.
- The carousel includes a strong still for every major homepage section listed above and
  one representative still for Software, Architecture, Archive, Writing, and About.
- The Architecture capture stops at the flipbook opening; no exhaustive project
  click-through was performed or published.
- Final MP4/PNG assets are optimized, visually inspected, committed under
  `public/lab/parallax-haus/`, and render correctly at desktop and mobile sizes.
- Tests/typecheck/build pass (or only documented pre-existing failures remain), the PR is
  reviewed and merged, Vercel deploys successfully, and the live production entry and
  all media URLs are verified.

## Review Cycle 1 — Human capture replacements

Julianna supplied four preferred full-resolution captures and explicitly requested that
they replace the generated assets without changing carousel order or manifest paths:

- `home-studio-desk.png` ← Desktop screenshot at 5:28:19 PM
- `home-manifesto.png` ← Desktop screenshot at 5:27:56 PM
- `home-footer.png` ← Desktop screenshot at 5:28:38 PM
- `page-architecture.png` ← screenshot at 5:29:52 PM

Keep all other media unchanged. Verify the four replacements visually, confirm the
manifest still resolves all 15 media assets, rerun relevant integrity/build checks, and
commit the replacements as a follow-up on the existing feature branch.

## Review Cycle 2 — Software gallery placement and production ship

Julianna explicitly requested publication and the exact local sequence
`Parallax Haus → Snails vs Garden → Arch Voice MCP`, with every other Software
entry retaining its existing relative order. Because `getAllWorks()` sorts by date
descending, assign Parallax Haus a date immediately before Snails vs Garden without
changing gallery code or the other records. Verify the rendered ordering, then push the
feature branch, open and merge the PR to `main`, wait for Vercel, and verify the live
card, 15-slide carousel, media URLs, and primary routes.

## Reset 2026-07-27 by human:julianna

## Reset 2026-07-27 by human:julianna
