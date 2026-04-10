# ASMV-87: Hero brand visual — wireframe nodes don't animate on mobile / smaller viewport

User reports that on mobile or smaller browser widths the hero opening animation no longer animates — the wireframe nodes aren't moving around.

Relevant code: src/components/interactive/HeroBrandVisual.tsx (rAF loop, IntersectionObserver gating, perfTier detection) and src/lib/hero-canvas.ts (drawRightPlane wireframe network animation).

Suspects to investigate:
- detectPerfTier() returns 'low' when w < 768 || (w < 1024 && isTouch). On low tier the loop skips every other frame — verify s.frame still increments and reveal animations still tick.
- The entrance animation in HeroBrandVisual loop() runs only while elapsed >= DELAY_MS && s.rotation < 1. After completion does the wireNetwork keep updating?
- On mobile, signal dots and cross markers are skipped (line 449, 470 in hero-canvas.ts). Verify edges/nodes themselves still draw and move.
- isVisibleRef gating via IntersectionObserver — if the threshold isn't met on small viewports the loop returns early and stops animating.
- Canvas resize: handleResize() rebuilds wireNetwork on every resize. orientationchange handler may rebuild it mid-animation and reset reveal state.

Reproduce in DevTools mobile emulation first to see what 'not animating' actually means (no wireframe at all? wireframe drawn but static? animation runs once and freezes?).
