# ASMV-63: Touch/mobile support — pinch zoom, drag

## Scope
Add multi-touch support to `InfiniteCanvas.tsx`: pinch-to-zoom and two-finger pan.

## Changes
1. **Pinch zoom** — track two pointers, compute distance ratio, apply to scale
2. **Two-finger pan** — midpoint delta of both pointers
3. **`touch-action: none`** — already set on viewport
4. **Mobile initial zoom** — start slightly more zoomed on narrow viewports so items are large enough to tap
5. **Momentum on touch** — same inertia system as mouse (from ASMV-62)

## Algorithm
```
onPointerDown: if 2nd pointer → record initialPinchDistance, initialScale
onPointerMove: if 2 pointers {
  distance = dist(p1, p2)
  ratio = distance / initialPinchDistance
  target.scale = clamp(initialScale * ratio, MIN, MAX)
  midpointDelta → target.x/y
}
```

## Files
- **Modify:** `src/components/interactive/InfiniteCanvas.tsx`

## Acceptance Criteria
1. Pinch-to-zoom works on touch devices
2. Two-finger drag pans the canvas
3. Single-finger drag still pans
4. No conflict with browser zoom (touch-action: none)
5. Build passes
