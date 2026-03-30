# ASMV-80: Software portfolio: 2-column grid with text left, image right, taller image containers

## Goal

Redesign the software portfolio listing page (`/work/software`) from a 3-column card grid (text below image) to a 2-column grid where each card has text on the left and the image/thumbnail on the right, with taller image containers for more breathing room.

## Current State

- `src/app/work/software/page.tsx` renders a `grid-cols-2 sm:grid-cols-3 md:grid-cols-3` grid
- Each card is a vertical stack: image (16:9), then title, description, stack
- Cards link to `/work/software/[slug]` which triggers the intercepted panel overlay
- Panel overlay (`@panel/(.)[slug]/page.tsx`) uses `ProjectPanel` component — this is unaffected

## Approach

Modify `src/app/work/software/page.tsx` only:

1. **Outer grid**: Change to `grid-cols-1 md:grid-cols-2` (stack on mobile, 2-col on desktop)
2. **Each card**: Horizontal layout with `flex` — text block on left (~40%), image on right (~60%)
3. **Image container**: Taller aspect ratio — switch from `aspect-[16/9]` to `aspect-[3/4]` for more vertical breathing room
4. **Mobile**: Cards stack vertically; within each card, text sits above image (column layout) for readability on narrow screens
5. **Keep**: All existing `Link` click behavior, hover effects, content display (title, description, stack)

## Key Files

- `src/app/work/software/page.tsx` — the only file that needs changes

## Acceptance Criteria

- [x] 2-column grid on md+ breakpoints
- [x] Each card: text left, image right (on md+)
- [x] Taller image containers (aspect-[3/4] instead of 16/9)
- [x] Mobile: single column, text above image
- [x] Click-to-panel overlay still works
- [x] `pnpm build` passes
