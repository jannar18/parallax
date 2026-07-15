# ASMV-108: Nav bar adapts color to light/dark backgrounds

## Goal
The fixed `Header` currently renders in dark ink (`text-ink*`) everywhere. Over
dark full-bleed sections (ClipReel `bg-black`, Footer `bg-ink`) the nav is nearly
invisible. Make the header detect when a dark section is behind it and switch to
white font. Light condition = plain white for now.

## Approach
1. **Mark dark sections** with a `data-nav-dark` attribute on their outermost
   full-bleed element:
   - `ClipReel.tsx` — the `bg-black` container (homepage).
   - `Footer.tsx` — the `bg-ink` `<footer>` (every page).
2. **Detect in `Header.tsx`** (client component): scan all `[data-nav-dark]`
   elements and check whether any overlaps the header band (~44px from top) via
   `getBoundingClientRect`. Runs on scroll, resize, and route change
   (`usePathname`) so it works site-wide and after client navigation. Sets an
   `onDark` state.
3. **Recolor** the wordmark, expanding links, and center cross to white when
   `onDark` is true. Suppress white while the mobile overlay is open
   (`onDark && !mobileMenuOpen`) since the overlay is a light surface above the
   dark section. Add `transition-colors` so the swap animates.

## Key files
- `src/components/global/Header.tsx` (detection + recolor)
- `src/components/interactive/ClipReel.tsx` (mark dark)
- `src/components/global/Footer.tsx` (mark dark)

## Acceptance criteria
- Scrolling the homepage into the ClipReel (black) section turns the nav white.
- Scrolling into the footer (ink) turns the nav white; light sections keep ink.
- Works after client-side navigation to other routes (footer detection).
- Mobile menu overlay keeps its dark-ink links (unaffected).
- `pnpm build` / lint pass. Only nav files committed (sibling ASMV-107 work left
  untouched).

## Complexity: low

## Reset 2026-07-08 by agent:claude-opus-4-impl
