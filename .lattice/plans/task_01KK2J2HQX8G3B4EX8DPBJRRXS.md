# ASMV-49: Extract Footer grain overlay to shared utility

## Problem

`Footer.tsx` lines 14-22 contain an inline SVG grain texture that duplicates the same SVG data URI in `globals.css` lines 103-110 (`.grain-overlay::before`). The SVG `feTurbulence` filter string is identical in both places. This violates DRY: if the texture ever changes, two locations need updating.

## Analysis

The Footer's grain differs from the global `GrainOverlay` in three ways:
- **Position:** `absolute` (scoped to footer) vs `fixed` (full viewport)
- **Opacity:** `0.08` vs `0.03` (higher for visibility against dark `bg-ink`)
- **Blend mode:** `soft-light` vs `multiply` (different for dark background)

These are intentional differences -- the global overlay is a subtle page-wide texture on a light background, while the Footer needs a stronger effect on its dark background.

The `.grain-overlay` class in `globals.css` bundles both the *container styles* (position, z-index, opacity, blend) and the *texture content* (`::before` with the SVG). We can't just slap `.grain-overlay` on the Footer div because the container styles would conflict (and `.grain-overlay` being outside `@layer` means it would override Tailwind utilities).

## Approach

Extract the grain texture `::before` into a standalone class `.grain-texture` that only provides the pseudo-element content. Then:

1. **`.grain-texture::before`** -- just the SVG background image (the reusable part)
2. **`.grain-overlay`** -- unchanged, uses `.grain-texture` for the pseudo-element plus its own container styles (fixed, z-index, opacity, blend)
3. **Footer** -- uses `.grain-texture` class on its existing div, keeps its Tailwind container styles

### Changes

**`src/styles/globals.css`:**
- Extract `::before` content into `.grain-texture::before`
- Make `.grain-overlay` extend `.grain-texture` (either by adding both classes in the component, or by keeping `.grain-overlay::before` unchanged since CSS doesn't have `@extend`)

Actually, the simplest approach without introducing CSS complexity: just make `.grain-overlay::before` also match `.grain-texture::before` using a grouped selector:

```css
.grain-overlay::before,
.grain-texture::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,...");
  background-repeat: repeat;
  background-size: 300px 300px;
}
```

This way `.grain-overlay` keeps working exactly as before, and `.grain-texture` provides just the texture pseudo-element for use with custom container styles.

**`src/components/global/Footer.tsx`:**
- Remove the inline `style={{ backgroundImage: ... }}` from the grain div (lines 17-21)
- Add `grain-texture` class to the existing div
- Keep all Tailwind classes for positioning/opacity/blend

### Before (Footer.tsx lines 14-22):
```tsx
<div
  className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-soft-light"
  style={{
    backgroundImage: `url("data:image/svg+xml,...")`,
    backgroundRepeat: "repeat",
    backgroundSize: "300px 300px",
  }}
/>
```

### After:
```tsx
<div className="grain-texture absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-soft-light" />
```

The texture comes from `.grain-texture::before`, the container styling comes from Tailwind classes. The inline SVG data URI is eliminated.

## Acceptance Criteria

1. Footer renders visually identical grain texture (same SVG, same opacity, same blend mode)
2. No inline SVG data URI in Footer.tsx
3. `.grain-overlay` (global GrainOverlay component) still works exactly as before
4. `pnpm build` passes
5. Single source of truth for the SVG grain texture in `globals.css`
