# Handoff: Infinite Canvas for /now (Studio Desk) Page

## Context

parallax.studio (parallax.haus) is a personal site for Julianna — an architect turned software engineer. The `/now` page is the "studio desk" — daily artifacts (images, videos, sketches) documenting ongoing work. Currently it's a simple vertical list of entries. Julianna wants it transformed into an **infinite canvas** — a freeform, pannable, zoomable surface where artifacts float at different positions and scales, like objects scattered on a designer's desk.

## What Exists Today

### Now Page (`src/app/now/page.tsx`)
- Server component, loads all entries via `getAllNowEntries()` from `src/lib/content.ts`
- Renders entries as a vertical list with date, mood, image/video, description, and MDX body
- Images use `next/image`, videos use `<video>` element (detection via regex on file extension)
- `.artifact-treatment` CSS class applies warm tone filter (no pseudo-element overlays — just `filter: sepia(0.1) saturate(1.05) contrast(0.97)`)

### Content Structure (`src/lib/content.ts`)
- `NowEntry` interface: `{ slug, date, mood?, tags?, image?, project?, description?, content }`
- Entries are MDX files in `src/content/now/` with frontmatter
- Images/videos in `public/images/studio-desk-archive/YYYY-MM-DD/`
- Currently ~30+ entries across multiple dates, mix of PNGs, MOVs, and MP4s

### Existing Interactive Patterns
- **Canvas2D rendering**: `src/lib/hero-canvas.ts` — full custom canvas with animation loop, mouse parallax, performance tiers, DPR scaling. This is the team's proven pattern.
- **HeroBrandVisual**: React component wrapping canvas with refs, rAF loop, scroll-driven animation, resize handling
- **ArtifactBar**: Horizontal scroll strip with varied-height items, click-to-expand popover with detail view. The popover pattern (scrim + centered card) should be reused.
- **SplitViewMerge**: Scroll-driven sticky animation — shows the team knows scroll-progress mapping

### Homepage Integration
- The homepage has a "the studio desk" heading that links to `/now`
- The ArtifactBar on the homepage shows a subset of artifacts in a horizontal scroll
- These should remain as-is — the infinite canvas replaces only the `/now` page layout

## What We Want

A freeform infinite canvas where:
1. **Artifacts float** at varied positions and scales on a large virtual surface
2. **Pan** by mouse drag (desktop) or touch drag (mobile)
3. **Zoom** via scroll wheel (desktop) or pinch (mobile)
4. **Click/tap** an artifact to open the existing popover detail view
5. **Studio desk feel** — items scattered naturally, not on a grid. Varied sizes. Like looking down at a designer's desk.
6. **Videos autoplay** muted and loop (same as current ArtifactBar behavior)
7. **Performance** — should handle 30-40 items smoothly

## Research Resources

These were found and should be analyzed before implementation:

1. **Codrops Infinite Canvas (Jan 2026)**: https://tympanus.net/codrops/2026/01/07/infinite-canvas-building-a-seamless-pan-anywhere-image-space/
   - Full tutorial for a pan-anywhere image space
2. **Step-by-step infinite canvas tutorial**: https://www.ywian.com/blog/build-infinite-canvas-step-by-step
   - 7-step JS/TS tutorial with GitHub template
3. **HTML infinite canvas with zoom/pan**: https://www.sandromaglione.com/articles/infinite-canvas-html-with-zoom-and-pan
   - Pure HTML/CSS transforms approach
4. **p5.js pan/zoom gist**: https://gist.github.com/companje/5478fff07a18a1f4806df4cf77ae1048
   - Simple p5.js implementation (Julianna mentioned p5.js specifically)
5. **p5.canvascam**: https://github.com/bitcraftlab/p5.canvascam
   - Tiny 2D camera library for p5.js

## Recommended Approach (to be validated)

**CSS transforms on a container div** (not Canvas2D or p5.js) is likely the best fit because:
- Artifacts are HTML elements (images, videos) — Canvas2D would require re-implementing image/video rendering
- CSS transforms (`translate` + `scale` on a wrapper) give native browser compositing performance
- Items remain interactive DOM elements (clickable, hoverable)
- No additional dependencies needed
- The popover pattern from ArtifactBar can be reused directly

But **research the Codrops article first** — it may provide a better pattern. p5.js is also worth evaluating if it simplifies the pan/zoom math significantly.

## Architecture Notes

- `/now` page is currently a **server component** — the infinite canvas will need `"use client"` for interactivity
- The canvas component should receive artifacts as props (server component loads data, passes to client canvas)
- Item positions can be deterministic (seeded from slug hash) so they're stable across renders
- Consider a minimap or "reset view" button for navigation
- Mobile: ensure touch targets are large enough, pinch zoom doesn't conflict with browser zoom

## Stack
- Next.js 15 (App Router), React 19, Tailwind CSS 3, pnpm
- No graphics libraries currently installed
- Design tokens in `src/styles/tokens.css`, fonts in `src/lib/fonts.ts`

## Files to Modify/Create
- `src/app/now/page.tsx` — refactor to pass data to client component
- `src/components/interactive/InfiniteCanvas.tsx` — new component (the canvas surface)
- Possibly `src/lib/canvas-layout.ts` — position/scale generation logic
- Reuse popover pattern from `src/components/interactive/ArtifactBar.tsx`

## Lattice Tasks to Create
1. **Research & prototype** — fetch the tutorial resources, build a minimal pan/zoom prototype with a few test items
2. **Layout algorithm** — deterministic scatter positioning that looks natural (not random, not grid)
3. **Core canvas component** — pan, zoom, render items, handle resize
4. **Touch/mobile support** — pinch zoom, touch drag, performance on mobile
5. **Popover integration** — click artifact → detail view (reuse ArtifactBar popover)
6. **Polish** — minimap, reset view, smooth animations, loading states
7. **Review & merge**

## Voice & Quality Bar
- Asimov Collective level of restraint and craft
- The canvas should feel like a quiet, intentional space — not a chaotic Miro board
- Items should have breathing room, the scatter should feel curated
- Warm paper-like background, grain texture, the existing design language
