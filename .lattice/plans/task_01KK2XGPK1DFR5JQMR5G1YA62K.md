# ASMV-53: Fix hero plane animation — full rotation range 0→1→0

## Problem

The hero section's 3D folding planes use `rotation` in range [0.5, 1.0]:
- Initial state sets `rotation: 0.5` and `targetRotation: 0.5`
- Scroll handler maps scroll progress to 0.5→1→0.5
- This means the planes never go fully flat/open — they only use half the visual range

## Desired Behavior

- **Top of page (no scroll):** Planes are fully OPEN (rotation=0)
- **Middle of scroll:** Planes MERGE (rotation=1)
- **Bottom of scroll:** Planes OPEN again (rotation=0)
- Full rotation range: 0 → 1 → 0

## Root Cause

Two issues:
1. `createInitialState()` sets `rotation: 0.5` instead of `0`
2. Scroll handler maps to range [0.5, 1.0] instead of [0, 1.0]
3. Plane geometry functions (`getLeftPlane`, `getRightPlane`) would produce zero-width planes at rotation=0 because `backX = frontX + rotation * maxSwing` evaluates to `backX = frontX` when rotation=0

## Fix Approach

### 1. Fix geometry functions (`hero-canvas.ts`)

Remap the geometry so rotation [0, 1] maps to the internal visual range [0.5, 1.0]:

**`getLeftPlane()`:**
- Change: `const backX = frontX + s.rotation * maxSwing;`
- To: `const backX = frontX + (0.5 + s.rotation * 0.5) * maxSwing;`
- Change: `const perspAmount = s.rotation * 0.08;`
- To: `const perspAmount = (0.5 + s.rotation * 0.5) * 0.08;`

**`getRightPlane()`:**
- Change: `const backX = frontX - s.rotation * maxSwing;`
- To: `const backX = frontX - (0.5 + s.rotation * 0.5) * maxSwing;`
- Change: `const perspAmount = s.rotation * 0.08;`
- To: `const perspAmount = (0.5 + s.rotation * 0.5) * 0.08;`

This ensures:
- rotation=0: planes at half-swing (visually open/spread), perspAmount=0.04
- rotation=1: planes at full-swing (visually merged/overlapping), perspAmount=0.08

### 2. Fix initial state (`hero-canvas.ts`)

Change `rotation: 0.5` to `rotation: 0` and `targetRotation: 0.5` to `targetRotation: 0`.

### 3. Fix scroll handler (`HeroBrandVisual.tsx`)

Change the scroll mapping from 0.5→1→0.5 to 0→1→0:
- First segment: `rotation = ease(progress / 0.3)` (not `0.5 + 0.5 * ease(...)`)
- Hold segment: `rotation = 1` (unchanged)
- Last segment: `rotation = 1 - ease((progress - 0.7) / 0.3)` (not `1 - 0.5 * ease(...)`)

### 4. Verify photo fade

`drawLeftPlane` uses `const fade = 1 - s.rotation * 0.7`. At rotation=0, fade=1.0 (full opacity). At rotation=1, fade=0.3. This is correct behavior — photos fully visible when open, faded when merged.

## Files Modified

- `src/lib/hero-canvas.ts` — `createInitialState()`, `getLeftPlane()`, `getRightPlane()`
- `src/components/interactive/HeroBrandVisual.tsx` — scroll handler

## Acceptance Criteria

- At page top (no scroll): rotation=0, planes visually spread apart
- At mid-scroll: rotation=1, planes merged/overlapping
- At bottom of scroll: rotation=0, planes spread apart again
- No build errors
- Photo slideshow still works correctly
- Wireframe network still renders in right plane
