# ASMV-101: Rebuild /work/software as GIF-first lab gallery (merge wave 2)

## Scope
Replace the MDX case-study listing on `src/app/work/software/page.tsx` with a
GIF-first gallery fed by `getAllWorks()` (Agent A's data layer). Keep parallax
chrome (Header/Footer/fonts/tokens). Drop heavy case-study card styling.

## Files (ownership-respecting)
- `src/app/work/software/page.tsx` — server component: header intro + render `getAllWorks()` into `<LabGallery works={...} />`.
- `src/components/lab/LabGallery.tsx` (NEW, client) — responsive grid of cards + lightbox state, escape/scroll-lock, focus handling.
- `src/components/lab/LabCard.tsx` (NEW) — single card: media (gif via `<img unoptimized>`, video via autoplay/loop/muted `<video>`), label/title/desc/tags/repo/live.
- `src/components/lab/LabMedia.tsx` (NEW) — shared media renderer (gif vs video detection), reused by card + lightbox.
- `src/components/lab/LabLightbox.tsx` (NEW) — overlay: larger media, meta, repo + live links, and a `screenshots[]` thumbnail strip (multi-image support for fractal-nyc).

## Approach
- Reimplement the proven prototypes pattern (card + lightbox + video/gif) idiomatically in React/Tailwind. GIFs are large (~4MB) -> use `<img unoptimized loading="lazy">`.
- Palette/type: Riso tokens via Tailwind (paper/ink/scarlet/border/surface, font-serif titles, font-mono labels/tags). Minimal chrome. aspect-[16/10] media, rounded, subtle border + hover lift.
- Accessibility: keyboard-openable cards (Enter/Space), focus-visible rings, alt text, Escape closes lightbox, body scroll lock while open, backdrop click closes.
- Newest-first already handled by loader.

## Verify
- `pnpm dev`, load `/work/software`: 4 works render with gifs, lightbox opens, repo/live links work, responsive at 375px + desktop. Screenshot.
- `npx tsc --noEmit` + `pnpm lint` clean for touched files. Kill dev before any build.

## Acceptance criteria
- 4 seeded works render GIF-first, newest first.
- Click/keyboard opens lightbox with larger media + meta + links; screenshots strip shown when present.
- Responsive (1 col mobile, 2 col desktop). Escape/backdrop close. Chrome unchanged.
- No edits to works.json / content.ts / pipeline. Left staged, no commit.
