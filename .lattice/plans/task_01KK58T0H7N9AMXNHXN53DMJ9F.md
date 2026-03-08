# ASMV-61: Deterministic scatter layout algorithm

## Scope
Rewrite `src/lib/canvas-layout.ts` with a proper layout algorithm that produces organic, desk-like positioning instead of the current naive rejection sampling.

## Approach
Replace the current random placement with a force-directed relaxation approach:

1. **Initial placement via Poisson disk sampling** — produces even but organic spacing
2. **Date-based clustering** — items from the same date start near each other (loose grouping, not rigid)
3. **Size variance by media type** — landscape wider, portrait taller, videos slightly larger
4. **Collision avoidance** — AABB intersection check with minimum 40px gap
5. **Slight rotation** — ±4 degrees, seeded from slug hash
6. **Deterministic** — all randomness from mulberry32 PRNG seeded by slug hash

## Interface Changes
- `generateLayout` now accepts `entries: { slug: string; date: string; image?: string }[]` instead of bare `slugs: string[]` (needs date for clustering, image path for aspect ratio hints)
- Add `zIndex` to `CanvasItemLayout` for stacking order
- World size scales with item count (approximately 4000x3000 at 37 items)

## Files
- **Modify:** `src/lib/canvas-layout.ts`
- **Modify:** `src/components/interactive/InfiniteCanvas.tsx` — update `generateLayout` call to pass entries instead of slugs, use zIndex
- **Modify:** `src/app/now/page.tsx` — no changes needed (already passes full entries)

## Acceptance Criteria
1. Items never overlap (AABB collision check with padding)
2. Items from the same date cluster loosely together
3. Sizes vary (200-500px width range)
4. Layout is deterministic — same entries always produce same positions
5. World size adapts to item count
6. Initial camera centers on content centroid
7. Build passes
