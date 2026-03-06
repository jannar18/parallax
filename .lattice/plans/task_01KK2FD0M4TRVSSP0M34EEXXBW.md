# ASMV-39: Improve hero animation — bolder plane merge + perspective grid

The hero section doesn't fully deliver Asimov Collective-level visual impact. Two improvements needed:

1. **Bolder plane merge animation:** The two folding planes (architecture photos left, wireframe right) need to feel more dramatic and apparent as they merge. Currently the fold/merge feels subtle — it should be rich, bold, and unmistakable. Consider: stronger perspective distortion, more aggressive rotation range, visual cues that emphasize convergence (shadow, depth, overlap effects), timing/easing refinements.

2. **Perspective grid to define 3D space:** Add a receding grid (or similar spatial reference) that shares the same vanishing point / perspective as the folding planes. This grounds the planes in a defined 3D environment rather than floating on a flat cream background. The grid should reinforce the fold direction and make the depth feel intentional and architectural.

**Current implementation:** Canvas 2D with quadrilateral mapping (no WebGL). Two planes fold inward on scroll (0→1→0 rotation over 200vh). Left plane = photo slideshow, right plane = procedural wireframe. Parallax on mouse move. See `src/lib/hero-canvas.ts` (~490 lines) and `src/components/interactive/HeroBrandVisual.tsx`.

**Quality bar:** Asimov Collective — bold, confident, editorial. The hero should feel like a statement piece, not a tech demo.

**Reference:** research/01-asimov-collective-analysis.md for Asimov visual language.
