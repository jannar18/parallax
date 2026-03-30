# ASMV-81: Software portfolio: 2-column grid with text left, image right, taller image containers

## Summary

Redesign the software portfolio listing page (`src/app/work/software/page.tsx`) from a 3-column card grid (text below image) to a 2-column grid where each card has text on the left and the thumbnail image on the right, with taller image containers for more visual breathing room.

## Current State

- 3-column grid (`grid-cols-3`) with each card being a vertical stack: image (16:9 aspect ratio) on top, then title, description, and stack below.
- Links to `/work/software/[slug]` which triggers the panel overlay via Next.js parallel routes.

## Changes

### File: `src/app/work/software/page.tsx`

1. **Grid**: Change from `grid-cols-2 sm:grid-cols-3 md:grid-cols-3` to `grid-cols-1 md:grid-cols-2` with larger gap.
2. **Card layout**: Each card becomes a horizontal flex container — text on the left (~40%), image on the right (~60%).
3. **Image container**: Change from `aspect-[16/9]` to a taller container (`aspect-[3/4]` or fixed min-height) so thumbnails get more vertical space.
4. **Text column**: Title, description, and stack arranged vertically with proper spacing. Left-aligned.
5. **Responsive**: On mobile (`< md`), cards stack to single column. The horizontal text-left/image-right layout is maintained at all breakpoints since it works well at full width too.
6. **Preserve**: Link behavior, hover effects, `thumbPosition` support, all existing data fields.

## Acceptance Criteria

- 2-column grid on desktop (md+), 1-column on mobile
- Each card: text left, image right
- Image containers are taller than current 16:9
- Click-to-panel overlay still works
- Hover state still works (scale on image, color change on title)
- No changes to content files, content.ts, panel, or layout
