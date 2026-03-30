# ASMV-80: Rename Now to Archive and add studio desk subtitle with infinite scroll toggle

## Scope

Three changes bundled together:

1. **Rename "Now" to "Archive"** across all navigation, routes, and text references.
2. **Add a small subtitle** to the studio desk page (below the existing "the studio desk" title).
3. **Add an archive/infinite scroll toggle** -- restrained, thin, not prominent. Replaces the existing LayoutSwitcher (scatter/masonry) with "archive" (masonry) and "infinite scroll" (scatter) modes.

## Files to Change

### Route rename: `/now` -> `/archive`
- `src/app/now/page.tsx` -> move to `src/app/archive/page.tsx`
- `src/app/now/layout.tsx` -> move to `src/app/archive/layout.tsx`
- Update metadata title from "Now" to "Archive"

### Navigation links
- `src/components/global/Header.tsx` — update href `/now` -> `/archive`, label "Now" -> "Archive" (in allLinks, leftLinks)
- `src/components/global/Footer.tsx` — update href `/now` -> `/archive`

### Homepage references
- `src/app/page.tsx` — update `href="/now"` -> `href="/archive"` on the studio desk link

### Components referencing `/now`
- `src/components/interactive/ArtifactBar.tsx` — update `href="/now"` -> `href="/archive"` in popover link
- `src/components/interactive/StudioDeskScroll.tsx` — update `href="/now"` -> `href="/archive"`
- `src/components/interactive/LayoutSwitcher.tsx` — update hrefs from `/now` -> `/archive`, rename labels from "Scatter"/"Masonry" to "Infinite Scroll"/"Archive"

### Studio desk subtitle
- `src/components/interactive/InfiniteCanvas.tsx` — add subtitle below "the studio desk" title
- `src/components/interactive/MasonryLayout.tsx` — add subtitle in header area

### Toggle redesign
- `src/components/interactive/LayoutSwitcher.tsx` — rename labels: "Scatter" -> "Infinite Scroll", "Masonry" -> "Archive". Make styling thinner and more restrained.

## Acceptance Criteria

- All `/now` URLs now route to `/archive`
- Header nav says "Archive" instead of "Now"
- Footer says "Daily Archive" (already does) but links to `/archive`
- LayoutSwitcher toggle uses "Archive" and "Infinite Scroll" labels
- Toggle is visually restrained: thin, small, not prominent
- Subtitle appears on studio desk page
- `pnpm build` passes with no errors
