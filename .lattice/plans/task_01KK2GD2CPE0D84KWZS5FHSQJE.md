# ASMV-43: Add mobile navigation pattern (nav unreachable on touch after hero)

## Problem

Header.tsx nav opens on hover only (`handleMouseEnter`). Touch devices cannot hover. The cross button is tappable (40x40) but at 25% opacity with no label -- not discoverable. Mobile users past the hero section have no way to navigate except scrolling to the footer.

## Approach: Slide-down overlay panel (typographic, restrained)

Rather than a typical hamburger or bottom nav, the mobile pattern will be a **fullscreen slide-down overlay** triggered by the existing cross button with improved affordance. This fits the Asimov editorial vibe: a clean, typographic panel that covers the viewport with generous whitespace and large nav links in the serif heading font.

### Design decisions

1. **Trigger:** The existing cross/axis button (`<button>` in Header.tsx) already exists and is tappable. On mobile/touch screens, we make it more visible (higher opacity, subtle background) and it toggles a fullscreen overlay instead of expanding inline links (which don't work well on small screens).
2. **Overlay panel:** Full-viewport slide-down with `paper` background. Navigation links displayed vertically in large serif italic type (Cormorant Garamond). The wordmark "parallax" at the bottom of the panel. Close via the cross (which transforms to an X state) or by tapping a link.
3. **Desktop unchanged:** The existing hover-expand behavior on desktop (768px+) is preserved. The mobile overlay only renders/activates below `md` breakpoint.
4. **No new dependencies.** Pure CSS transitions + React state. Matches how Asimov ships (CSS transitions, no heavy libraries).

### Key files

- **`src/components/global/Header.tsx`** -- main changes: add mobile overlay panel, improve cross button visibility on mobile, add touch-friendly toggle, media query separation
- **`src/styles/globals.css`** -- optional: add any animation keyframes if needed (slide-down)

### Implementation plan

1. **Improve cross button affordance on mobile:**
   - Increase opacity from 25% to at least 50% on mobile (below `md`)
   - The button is already 40x40 which meets touch target minimums
   - Add `aria-expanded` attribute tied to nav state

2. **Add mobile overlay state:**
   - New `mobileMenuOpen` state (boolean)
   - Cross button `onClick` toggles this on mobile (detect via `window.innerWidth < 768` or a ref/media query)
   - Actually, simpler: always toggle on click. On desktop the existing hover behavior already works; the click toggle is additive (already exists on line 127). We just need the overlay to only render on mobile via Tailwind's `md:hidden`.

3. **Build the overlay component (inline in Header.tsx):**
   - Fixed fullscreen div, `z-40` (below header's `z-50`)
   - Background: `bg-background` (paper cream)
   - Slide-down animation: `translate-y` from `-100%` to `0`
   - Content: vertical stack of all nav links (Architecture, Writing, Software, Now, About) in large serif italic
   - Each link closes the menu on click
   - Parallax wordmark at bottom

4. **Cross button visual state on mobile:**
   - When mobile menu is open, the crossbar of the SVG hides (already does this when `navOpen` is true -- line 143)
   - The vertical stroke remains, suggesting a close/dismiss gesture

5. **Prevent body scroll when overlay is open:**
   - Toggle `overflow: hidden` on `document.body` when overlay opens/closes

6. **Responsive boundary:**
   - Overlay: `md:hidden` (only shows below 768px)
   - Existing inline expanding links: `hidden md:flex` (only shows at 768px+)

### Acceptance criteria

- [ ] On mobile (<768px), past the hero section, the cross button is clearly visible (50%+ opacity)
- [ ] Tapping the cross button opens a fullscreen overlay with all navigation links
- [ ] Links are large, typographic (serif italic), and easy to tap (48px+ touch targets)
- [ ] Tapping a link navigates and closes the overlay
- [ ] Tapping the cross again closes the overlay
- [ ] Desktop behavior is unchanged (hover-expand inline links)
- [ ] Body scroll is prevented when overlay is open
- [ ] `pnpm build` passes with no errors
- [ ] No new dependencies added
