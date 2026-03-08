# ASMV-62: Core canvas component — pan, zoom, render items

## Scope
Extend `InfiniteCanvas.tsx` with robust event handling, momentum/inertia after drag release, and a "reset view" button.

## Changes
1. **Momentum/inertia** — track velocity of last N frames during drag, continue panning with exponential decay after release
2. **Reset view button** — fixed UI button that smoothly animates camera back to initial position (fit-all)
3. **`setPointerCapture`** — already implemented, verify it works
4. **Convergence detection** — already implemented, verify rAF stops when idle

## Files
- **Modify:** `src/components/interactive/InfiniteCanvas.tsx`

## Acceptance Criteria
1. After releasing a drag, canvas continues moving with decaying momentum
2. Reset view button visible, clicking it smoothly animates to fit-all view
3. rAF loop stops when camera converges (already working)
4. Build passes
