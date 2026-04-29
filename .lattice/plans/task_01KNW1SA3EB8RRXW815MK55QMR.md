# ASMV-87: Hero brand visual — wireframe nodes don't animate on mobile / smaller viewport

## Root cause hypothesis

The wireframe renders fine on mobile, but everything that visibly *moves* on the right plane is gated on either (a) mouse-driven parallax — which never fires without a pointer — or (b) the `s.perfTier === "low"` flag, which deliberately skips signal dots and cross markers. The remaining alpha pulsing (sin-wave on edge/node opacity) has very small amplitude (~±0.15) and is imperceptible. So on mobile the user sees a fully-revealed but apparently frozen network.

Concretely, in `src/lib/hero-canvas.ts::drawRightPlane`:
- `px = (s.mouseX - 0.5) * 6` and `py = (s.mouseY - 0.5) * 4` — the only large-scale visible motion of nodes/edges. With no mouse move on mobile, `mouseX`/`mouseY` stay at `0.5` → `px = py = 0` forever.
- Line 449: signal dots only drawn when `!isLow`.
- Line 470: cross markers only drawn when `!isLow`.
- Edge alpha animation amplitude (line 428): `0.7 + 0.15 * sin(...)` — too subtle to notice.
- Node alpha amplitude (line 463): `0.35 + 0.1 * sin(...)` — also too subtle.

The rAF loop, `s.frame` counter, IntersectionObserver gating, and entrance animation all work correctly on mobile (`s.frame++` happens in `drawFrame`, which runs at ~30fps on low tier — that's enough to animate). The bug is purely that the visually-driving motion sources are mouse-gated or perfTier-gated, leaving mobile with a static-looking image.

There is also a **secondary bug** worth fixing while we're here: the `orientationchange` listener registered in `HeroBrandVisual.tsx` lines 134–145 leaks. The handler is an anonymous `() => setTimeout(handleResize, 150)` but the cleanup tries `removeEventListener("orientationchange", handleResize)` with the wrong function reference. Across React strict-mode double-invocation and any handler-deps churn, this accumulates listeners. Not the primary symptom, but a latent bug in the same file — fix it in this task.

## Scope

Make the wireframe network feel alive on mobile (and on any viewport where the cursor isn't moving), without regressing desktop. Also fix the leaked orientationchange listener.

Out of scope: redesigning the entrance animation, changing `detectPerfTier` thresholds, rewriting the wireframe to use a different motion model.

## Approach

### 1. Add an autonomous, time-based parallax drift so the wireframe always moves

In `src/lib/hero-canvas.ts::drawRightPlane`, replace the mouse-only parallax with a sum of mouse parallax + a slow autonomous drift driven by `s.frame`. On low tier (mobile, no pointer) the drift becomes the dominant source of motion; on desktop the user's mouse still dominates and the drift is barely noticeable.

```ts
// before
const px = (s.mouseX - 0.5) * 6;
const py = (s.mouseY - 0.5) * 4;

// after
const t = s.frame * 0.012; // slow Lissajous wander
const driftAmp = s.perfTier === "low" ? 4 : 2; // bigger autonomous drift on mobile
const px = (s.mouseX - 0.5) * 6 + Math.cos(t) * driftAmp;
const py = (s.mouseY - 0.5) * 4 + Math.sin(t * 1.3) * driftAmp * 0.7;
```

Tunable constants — verify the drift is gentle, not jittery. Target: the network gently breathes / sways. Cosine + sine with mismatched frequency (1 vs 1.3) produces a Lissajous-like wander.

### 2. Make signal dots draw on mobile

In `src/lib/hero-canvas.ts::drawRightPlane` line 449, remove the `if (!isLow)` gate around signal dot rendering. Signal dots are tiny (1.8px radius) and are the most clearly-animated element. Skipping them was a 2026-03 perf optimisation (commit `911fb17` ASMV-48), but profiling at the time was about iOS jank during scroll-driven rotation; the rotation is now timed (commit `1b4f328`), so per-frame cost matters less. Keep them on mobile.

Cross markers (line 470) can stay gated on `!isLow` — they're decorative and add stroke cost.

### 3. Increase the alpha-pulse amplitude very slightly

To give edges/nodes more visible "breathing" even when parallax is small. In `drawRightPlane`:
- Line 428 edge alpha: change `(0.7 + 0.15 * sin(...))` to `(0.65 + 0.25 * sin(...))`.
- Line 463 node alpha: change `(0.35 + 0.1 * sin(...))` to `(0.3 + 0.18 * sin(...))`.

These keep the average alpha similar but double the visible pulse. Keep this small — we don't want a disco effect on desktop.

### 4. Fix the orientationchange listener leak

In `src/components/interactive/HeroBrandVisual.tsx` lines 134–145, hoist the orientation handler into a named local function inside the effect so add/remove use the same reference:

```ts
useEffect(() => {
  const onOrientation = () => setTimeout(handleResize, 150);
  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", onOrientation);
  return () => {
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("orientationchange", onOrientation);
  };
}, [handleResize]);
```

## Files to change

- `src/lib/hero-canvas.ts` — `drawRightPlane` (lines ~391–484): autonomous drift, ungate signal dots on low tier, bump alpha amplitudes.
- `src/components/interactive/HeroBrandVisual.tsx` — lines 134–145: fix orientationchange listener leak.

## Acceptance criteria

1. On mobile (DevTools iPhone 14 Pro emulation, viewport ~390px) the wireframe nodes/edges visibly drift and the alpha pulses are perceptible without any user interaction. The drift is slow and graceful, not jittery.
2. On desktop (≥1024px, mouse moves) behaviour is essentially unchanged — mouse parallax still dominates; the new autonomous drift is barely perceptible (≤2px range).
3. Signal dots are visible on mobile.
4. Entrance animation (1.5s delay → 2.8s rotation) still completes correctly on mobile.
5. The orientationchange listener no longer leaks across re-renders. Verified by adding then removing the component (e.g., navigating away and back) and inspecting `getEventListeners(window).orientationchange.length` in DevTools — it should not grow.
6. `pnpm lint` clean. Existing Vitest suite (`src/__tests__/hero-canvas.test.ts`, `hero-mobile.test.ts`) still passes; if any test asserts that signal dots are skipped on low tier, update it to reflect new behaviour.

## How to verify

1. `pnpm dev`, open `http://localhost:3000`, open DevTools → device toolbar → iPhone 14 Pro. Hard refresh. Watch the right plane: after ~1.5s entrance, nodes/edges should drift and pulse continuously without touching the screen.
2. Resize back to desktop width. Move the mouse over the canvas. Confirm parallax responds to mouse and the autonomous drift is not visually distracting.
3. Toggle device orientation in the device toolbar a few times. Confirm `getEventListeners(window).orientationchange` (Chromium DevTools console) has length 1, not growing.
4. (Optional) Sanity check on a real phone if available.
5. `pnpm lint && pnpm test` (vitest suite).

## Notes for implementer

- The `s.frame` counter ticks at ~30/sec on mobile (low tier) because of the `skipFrame` toggle in `HeroBrandVisual.tsx` line 102 that bypasses `drawFrame` every other rAF. Pick drift constants assuming a 30fps tick — `s.frame * 0.012` gives a ~17s full Lissajous loop on mobile, ~8s on desktop. Both feel slow.
- Don't change `detectPerfTier()` thresholds; the perf gating is doing real work for mid-range Android.
- Don't remove the `skipFrame` 30fps cap — that was deliberate for thermal/battery reasons.
- Do not add `prefers-reduced-motion` handling here — that's a separate concern and out of scope.
