# ASMV-12 Hero Graphics Brief (Moodboard Synthesis)

## What the references say

Structural cues from Asimov set:
- Hero compositions are simple and legible at distance: one dominant visual field + restrained type block.
- Strong brand feeling comes from a single controlled visual move (not many effects).
- Editorial pacing is quiet: whitespace, soft transitions, and clear hierarchy.

Julianna visual DNA cues:
- Soft architectural linework and hand-drawn draft edges.
- Warm mineral palette (chalk, terracotta, muted ochre, clay, sage) with low saturation.
- Collage logic: layered traces, translucent washes, and occasional geometric cuts.
- Texture is essential: stipple, graphite grain, paper fibers, and watercolor fade edges.

Non-negotiables for first hero pass:
- Keep the scene calm and breathable (no dense UI overlays, no sci-fi gloss).
- Preserve transparency-friendly layering potential for future compositing.
- Prioritize architecture/drawing language over startup-tech visual tropes.

## Style lock (new constraint)

The hero must read as a **beautiful drawing**, not a render.

Hard constraints for all generations:
- No photoreal rendering, no glossy materials, no cinematic 3D lighting.
- Mostly monochrome graphite/charcoal linework on off-white paper.
- Color is optional and minimal (faint terracotta/sage wash only, less than 10% of frame).
- Imperfection is intentional: draft marks, erased traces, uneven hand pressure.
- Keep 60-75% negative space for headline and supporting copy.

## Three concept directions

### 1) Threshold Drawing (recommended first)
Visual idea:
- A drafted interior threshold/void with soft daylight and very light linework.
- Main subject is hand-drawn spatial framing, not rendered volume.
- Texture layers (paper + graphite dust + stipple) fade toward edges.

Why it fits:
- Direct bridge between architecture studio language and Asimov restraint.
- Supports serif-led typography without fighting readability.

### 2) Section Collage Atlas
Visual idea:
- Hybrid plan/section composition over off-white paper.
- Fragmented site traces and contour lines in graphite dominate.
- Minimal washed accents only if needed for hierarchy.

Why it fits:
- Feels distinctly "designer's desk" and process-oriented.
- Works well with transparent overlays and modular collage fragments.

### 3) Graphite Monolith Study
Visual idea:
- Minimal graphite drawing of architectural masses on an off-white textured ground.
- One subtle color interruption (dusty peach or muted ultramarine).
- Slight blur/grain depth to avoid sterile line-art look.

Why it fits:
- Most restrained option; high confidence for typography-forward landing.
- Safest route for immediate production quality while preserving identity.

## Prompt pack (first generation round, drawing-only)

Use these for still hero backgrounds (16:10 and 3:2 variants).

Prompt A: Threshold Drawing
"Architectural threshold interior drawing, graphite and charcoal on off-white paper, hand-drafted linework with visible construction lines and erased traces, soft daylight atmosphere without rendered realism, subtle paper grain and stipple texture, calm minimal composition with generous negative space for editorial typography, architecture portfolio drawing style, no photoreal rendering, no glossy surfaces, no CGI, no people, no logos, high resolution"

Prompt B: Section Collage Atlas
"Architectural plan-section collage drawing on warm off-white paper, layered tracing fragments and pencil contour lines, hand annotations and light graphite smudges, restrained composition with large negative space, tactile analog drafting quality, minimal muted wash accents only, no photoreal textures, no rendered shadows, no UI, no branding text, high resolution"

Prompt C: Graphite Monolith Study
"Minimal architectural graphite study, monumental forms emerging from paper grain, off-white background with soft charcoal edges, one faint washed accent plane optional, museum-catalog editorial mood, restrained composition, quiet negative space for headline, analog drawing texture, no photoreal rendering, no interface elements, no people, high resolution"

Prompt D: Desk Drawing System
"Overhead studio desk-style architectural drawing composition, graphite sketches, torn tracing paper fragments, tape marks, measured annotations, subtle monospaced terminal-like notes as tiny marginal marks, coherent and minimal layout with lots of breathing room, elegant not messy, no photoreal desk objects, no glossy render, high resolution"

## Software signal without breaking drawing mode

Add software/AI language as annotation overlays, not as rendered objects:
- tiny monospaced command snippets near margins (`$`, path-like strings, short labels)
- thin node-route lines connecting drawing fragments
- coordinate ticks and indexing marks
- keep this layer faint and sparse so drawing remains dominant

## Transparent overlay fragment prompts

Use these to generate PNG elements for layering over hero base images.

Overlay 1:
"Transparent background PNG, irregular watercolor wash shape, warm terracotta pigment, feathered edges, paper bleed texture, subtle opacity variation, no hard border"

Overlay 2:
"Transparent background PNG, graphite stipple cloud, soft organic cluster, medium density speckle, hand-drawn character, neutral gray-black"

Overlay 3:
"Transparent background PNG, architectural tracing lines fragment, thin pencil linework, partial plan geometry, delicate and sparse, no background fill"

Overlay 4:
"Transparent background PNG, faint monospaced annotation marks and route arrows, tiny system-diagram labels, graphite-gray strokes, sparse and elegant, no background fill"

## Round 1 test matrix

Generate 8 candidates total:
- 3x Threshold Drawing
- 2x Section Collage Atlas
- 2x Graphite Monolith Study
- 1x Desk Drawing System

Selection criteria:
- Reads immediately as drafted architecture work
- Preserves Asimov-style bold simplicity
- Leaves clean typography space
- Allows future layered software annotations

## Recommendation

Start production with **Direction 1: Threshold Drawing** and generate:
- 8 base hero stills per matrix above
- 16 transparent overlay fragments (4 wash, 4 stipple, 4 linework, 4 annotation)

Then shortlist top 2 composites for homepage hero wireframe integration.
