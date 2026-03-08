# ASMV-64: Popover detail view on artifact click

## Scope
Add click-to-open popover for artifacts on the canvas, reusing the pattern from `ArtifactBar.tsx`.

## Changes
1. **Click detection** — distinguish click from drag using the existing 5px threshold (`hasDragged` ref)
2. **Active entry state** — `useState` for the selected entry (only React state needed for this)
3. **Popover overlay** — rendered as sibling to viewport (outside the CSS transform):
   - Backdrop scrim: `bg-ink/40 backdrop-blur-sm` (same as ArtifactBar)
   - Centered card: `max-w-3xl`, shows full image/video, date, mood, description
   - Escape key closes
   - Scrim click closes
4. **Video in popover** — muted autoplay loop with controls
5. **No "View full entry" link** — we're already on the /now page

## Pattern Reference
Copy the popover structure from `ArtifactBar.tsx` lines 116-183 but adapt:
- Remove the `Link` to /now (already there)
- Use `z-[60]` and `z-[70]` for scrim and card (above grain z-10 and title z-20)
- Wire to canvas click handler via entry slug, not array index

## Files
- **Modify:** `src/components/interactive/InfiniteCanvas.tsx`

## Acceptance Criteria
1. Clicking (not dragging) an artifact opens the popover
2. Popover shows full-size image/video with date, mood, description
3. Escape key closes popover
4. Clicking scrim closes popover
5. Popover is unaffected by canvas pan/zoom (rendered outside transform)
6. Build passes
