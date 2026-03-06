# ASMV-40: Fix scroll animation bug on hero

There is a bug in the scroll-driven animation on the hero section (HeroBrandVisual). The scroll animation effect is broken — this is critical and should be fixed before any visual improvements (ASMV-39).

**Key files:**
- `src/components/interactive/HeroBrandVisual.tsx` (scroll handler, lines 54-88)
- `src/lib/hero-canvas.ts` (rotation/plane geometry)

**Priority:** Critical — the hero is the first thing visitors see. A broken scroll animation undermines the entire landing experience.

**Note:** Bug details TBD — needs investigation to identify exact symptoms and root cause.
