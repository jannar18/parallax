# ASMV-82: Rename Now to Archive and add studio desk subtitle with infinite scroll toggle

## Current State

- `/archive` route already exists with the correct page. Header and Footer already link to `/archive`.
- `/now` route is a legacy duplicate that should be removed.
- The `LayoutSwitcher` component renders at bottom-left with "Infinite / Archive" labels.
- No subtitle exists on the studio desk page.
- Content files remain in `src/content/now/` (collection directory, not a route — no change needed).

## Plan

### 1. Remove legacy `/now` route, add redirect
- Delete `src/app/now/page.tsx` and `src/app/now/layout.tsx`
- Add redirect `/now` -> `/archive` in `next.config.mjs` for backward compatibility

### 2. Add subtitle to studio desk page
- In `StudioDesk.tsx`, add a small subtitle at the top of the page
- Text: "the studio desk" (matches homepage link text) — small, restrained, mono font
- Position: fixed top-center or absolute top of content area

### 3. Restyle LayoutSwitcher as archive/infinite scroll toggle
- Rename labels: "Infinite" -> "Infinite Scroll", "Archive" -> "Archive View" (or keep short)
- Make the toggle smaller, thinner, more restrained per the brief
- Keep functionality: scatter = infinite canvas, masonry = archive scroll

### 4. Clean up remaining "Now" references
- `src/app/now/page.tsx` metadata title says "Now" — already being deleted
- No other "Now" label references in nav or routes (already "Archive" in Header/Footer)

## Files to Modify
- `src/app/now/` — DELETE directory
- `next.config.mjs` — add redirect
- `src/components/interactive/StudioDesk.tsx` — add subtitle
- `src/components/interactive/LayoutSwitcher.tsx` — restyle toggle

## Acceptance Criteria
- No `/now` route exists; `/now` redirects to `/archive`
- Studio desk page shows a small subtitle
- Layout toggle is small, thin, restrained
- `pnpm build` passes
