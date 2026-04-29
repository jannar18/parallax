# ASMV-86 — Plan

## Scope
Fix the mobile aspect-ratio collapse of the Section 2 image (`/images/home/software-split.riso.1.png`) on the home page so the image stays roughly square on mobile, matching its desktop appearance. CSS-only change. No JS, no asset changes, no refactor of unrelated sections.

Complexity: low.

## Target file & lines
`src/app/page.tsx`, Section 2 (lines 40–80). Specifically:
- Line 40: `<section className="grid h-screen grid-cols-1 md:grid-cols-2">`
- Line 71: `<div className="relative overflow-hidden">` (the image wrapper)

## Root cause
The section uses `h-screen` at every breakpoint and switches from 1 col to 2 cols at `md`. On mobile (`grid-cols-1`) the section is still 100vh tall but the implicit grid auto-rows split that height across two rows — so the right (image) cell becomes ~100vw wide × ~50vh tall, a wide-short rectangle. `<Image fill object-cover />` then crops the riso fill to that wide-short box, which looks "squished / shrunken." On desktop (2 cols), the cell is ~50vw × 100vh — close to square — so the bug is mobile-only.

## Proposed fix
Two coordinated changes in `src/app/page.tsx`:

1. Drop the fixed mobile height on the section; restore `h-screen` only at `md+`:
   - Before: `className="grid h-screen grid-cols-1 md:grid-cols-2"`
   - After:  `className="grid grid-cols-1 md:h-screen md:grid-cols-2"`

2. Give the image cell an explicit square aspect on mobile and revert to filling the row on desktop:
   - Before: `<div className="relative overflow-hidden">`
   - After:  `<div className="relative aspect-square overflow-hidden md:aspect-auto md:h-full">`

The text cell on the left will then size to its content on mobile (its current `py-[5vh]` already gives breathing room) and continue to fill 50vw × 100vh on desktop. Section 2 will become slightly taller than 100vh on mobile (text block + square image) — that is the intended outcome and is consistent with how the rest of the page (e.g. the spacer divs around it) already breaks the strict h-screen rhythm on small viewports.

No Tailwind config changes needed (`aspect-square`, `md:aspect-auto`, `md:h-full`, `md:h-screen` are all default utilities).

## Out of scope
- Other sections in `page.tsx` (Hero, ScrollLine spacers, SplitViewMerge, ClipReel, the studio-desk block).
- Image asset changes / re-export.
- Any responsive work on text typography in this block.
- Tailwind config changes.

## Acceptance criteria
1. On a viewport <768px, the Section 2 image renders as a square (1:1) — visually matches the riso composition rather than appearing horizontally stretched / vertically compressed.
2. On a viewport ≥768px, Section 2 still fills the viewport height (`md:h-screen`) and the image still occupies the full right half (50vw × 100vh) — no visible change from current desktop behavior.
3. No layout regressions in adjacent sections (hero spacer above, ScrollLine + SplitViewMerge below).
4. `pnpm lint` passes; `pnpm build` succeeds.

## Verification steps for the implementer
1. `pnpm dev`, open `/`, resize to ~375px wide (mobile) and ~1280px wide (desktop). Confirm image is square on mobile and full-height-half-width on desktop.
2. Confirm the text block above the image is fully visible (not clipped) on mobile.
3. `pnpm lint && pnpm build`.
