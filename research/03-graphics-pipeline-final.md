# Graphics Pipeline — Research & Recommendations

> **Status:** Final deliverable (ASMV-3)
> **Date:** 2026-03-03
> **Scope:** Visual language extraction, computational graphics tools, AI image generation platforms, and recommended production pipeline for Mission Asimov.

---

## Table of Contents

1. [Design DNA — What We're Targeting](#1-design-dna--what-were-targeting)
2. [Visual Language — Extracted from Julianna's Work](#2-visual-language--extracted-from-juliannas-work)
3. [Computational Graphics — Tools & Techniques](#3-computational-graphics--tools--techniques)
4. [AI Image Generation Platforms](#4-ai-image-generation-platforms)
5. [Recommended Pipeline — The Synthesis](#5-recommended-pipeline--the-synthesis)
6. [Sources](#sources)
7. [Appendix A: Reference — Site Experience Analysis](#appendix-a-reference--site-experience-analysis)

---

## 1. Design DNA — What We're Targeting

The target is **restrained, typographic, editorial** — Asimov Collective territory, filtered through the specific sensibility visible in Julianna's own work. Art Nouveau organicism meets Art Deco structural discipline, softened by an architect's hand: stipple and grain over slick gradients, warm earth tones over cold minimalism, watercolor wash over pixel-perfect compositing.

Every visual element on the site should feel **authored, not downloaded**. Code-generated graphics serve this vision in three ways:

1. **Uniqueness** — generated assets are one-of-a-kind; no stock imagery smell
2. **Coherence** — a single parametric system can produce backgrounds, textures, decorative elements, and interactive moments that all share DNA
3. **Liveness** — generative elements can respond to time, user input, or content, keeping the "studio desk" metaphor active

### Shared Qualities Across All Reference Material

These five qualities emerged consistently across Julianna's sketchbook work, portfolio, and curated Pinterest references:

1. **Material consciousness** — the surface always matters. Monoprints, rubbings, paper grain, ink absorption. The medium is part of the message.
2. **Restraint** — nothing is overworked. Quiet virtuosity deployed with discipline.
3. **Atmospheric quality** — things bleed, fade, breathe at the edges. Watercolor washes dissolve into white. Stipple thins to nothing. No hard crops.
4. **The hand is present** — you feel the making process. Pencil pressure, process marks, torn collage edges.
5. **Generous whitespace** — compositions breathe. Negative space is active and intentional, not empty.

---

## 2. Visual Language — Extracted from Julianna's Work

### Source Material Analyzed

- **Mae graphics folder** — 13 images: sketchbook spreads, monoprints, rubbings, transfer prints, large-format texture studies
- **Selected Works 2022–2024 portfolio** — 14-page PDF with two major projects, resume, and design language
- **Pinterest board** ("Architecture School References + Graphics / Graphics") — 98 pins of curated architectural representation

### Core Visual Language

| Quality | How It Manifests |
|---------|-----------------|
| **Collage / layering** | Photo fragments within drawn contexts. Multiple realities coexisting. Not Photoshop compositing — more like a studio desk with overlapping work. |
| **Stipple / particle texture** | Thousands of tiny marks creating atmosphere. The fundamental texture unit is a point, not a stroke. |
| **Warm earth palette** | Terracotta, ochre, amber, cream, sage, slate. Warm off-white backgrounds. Coral/red as accent. |
| **Edge dissolution** | Things bleed, fade, dissolve at boundaries. Watercolor washes. Stipple that thins at edges. No hard crops. |
| **Landscape consciousness** | The ground matters. Topography, vegetation, water systems. Nature as co-author, not backdrop. |
| **Hand quality** | The maker's presence is always felt. Process marks, paper grain, pen pressure. |
| **Generous whitespace** | Compositions breathe. Negative space is active and intentional. |
| **Quiet typography** | Serif, light weight, lowercase. Handwritten annotations. Never loud. |

### Color Palette

**Primary warmth:**
- Terracotta (#C4724E approximate)
- Amber / warm ochre (#D4A76A approximate)
- Cream / warm white (#F5F0E8 approximate)
- Warm gray (#B5AFA6 approximate)

**Secondary earth:**
- Sage green (#8B9E7E approximate)
- Dusty rose (#C9A5A0 approximate)
- Slate blue-gray (#7A8B9A approximate)

**Accent (sparingly):**
- Coral red (#C95D45 approximate)

**Background:** Warm off-white, never pure #FFFFFF. Think aged paper, not screen white.

### Texture Vocabulary

These are the specific texture qualities to reproduce — either computationally or with AI generation:

1. **Stipple fields** — particle-based noise, variable density, dissolving at edges. The single strongest drawing technique across all references. Aerial site plans rendered entirely in stipple; elevation drawings where vegetation is stippled mass.
2. **Paper grain** — subtle fiber texture underlying everything. A baseline materiality that keeps the digital screen feeling physical.
3. **Watercolor wash** — gradient with organic, uneven edges. Not CSS `linear-gradient`. Think terracotta/amber tones bleeding into warm white.
4. **Contour/topographic lines** — flowing, organic, map-like. River corridors through topographic contours. A direct bridge to the landscape-consciousness theme.
5. **Collage edges** — slightly rough, not pixel-perfect. Torn paper feel. Photo fragments embedded within drawn contexts.
6. **Monoprint / rubbing** — surface transfer texture, archaeological quality. Surfaces that feel weathered and layered over time.

### Typography Direction

- Serif, light weight, lowercase
- Handwritten annotations as a secondary voice (not Comic Sans — think architect's lettering)
- Quiet, refined, European (Scandinavian/Swiss influence visible in references)
- Generous letter-spacing and line-height

### Layout Direction

- Generous margins and whitespace — things breathe
- Collage-like composition — elements can overlap and layer, not rigidly snapped to grids. **This is the central design move**, and it has a direct technical implication: many visual elements need **transparent backgrounds** so they can composite over other layers (stipple fields over content, watercolor washes bleeding into page backgrounds, decorative fragments floating over imagery). Transparency support is a first-class pipeline requirement, not a nice-to-have.
- The "studio desk" metaphor from the PRD maps directly to the collage method visible in Julianna's references
- Architecture portfolio pages with intentional sequencing (not image grids)
- Landscape orientation for drawings that need horizontal breathing room
- The facade patchwork motif (quilt-like grid of warm tones from "A Translation of History") as a potential layout inspiration

### What the Pinterest Board Reveals About Taste

The board is not about "pretty buildings." It is about **how to represent the relationship between built form and ground**:

1. **Process over product** — showing the thinking, not just the result
2. **Analysis over illustration** — understanding through drawing, not beautifying
3. **Landscape as co-author** — the ground has as much to say as the building
4. **Material honesty** — the medium matters (pen weight, paper texture, collage edges)
5. **European rigor** — Swiss/Scandinavian precision, Mediterranean warmth
6. **Quiet virtuosity** — incredible skill deployed with restraint

### Dominant Visual Themes in References

**Collage as primary method:** The strongest thread across the Pinterest board. Photo fragments embedded within drawings, layered media, transparent boundaries between photography and line work. The collage is analytical, not decorative — photography represents observed reality, drawing represents interpreted/projected reality. The layering IS the thinking.

**Topographic / cartographic obsession:** Contour lines, river systems, terrain mapping. The land itself as subject. River corridor ecological maps, watercolor site plans where landscape is painted and buildings are drawn.

**Landscape dominates architecture:** Buildings are nestled, embedded, almost secondary to their landscape context. Sections where tree canopy is rendered with more care than the building. Site plans where green space and water systems have more visual energy than built form.

**Drawing + photography layering:** The co-existence of drawn and photographic reality in a single frame. Proportional analysis overlaid on photographs of Mediterranean buildings. Building sections where one room glows with warm photographic light while everything else remains line drawing.

**The hand-drawn tree as character:** Trees are never stock or generic. Each drawn with specificity — species, age, canopy shape, root system. Trees as primary visual subjects.

**European architectural drawing tradition:** Strong Scandinavian, Mediterranean, and Swiss (ETH Zurich) influence. Not American rendering culture — no glossy Photoshop, no entourage people, no sky replacements.

**Textile / fiber art crossover:** A tree photograph printed on translucent fabric with embroidered/woven roots extending below. Material crossing between architecture and craft.

**Data / sound as landscape:** Particle-based sound waveform above topographic contour lines. Non-visual data made spatial.

---

## 3. Computational Graphics — Tools & Techniques

Seven domains cover the full landscape of code-generated visual assets for the web: SVG generation, p5.js/Processing, Three.js/WebGL, GLSL shaders, Canvas API, CSS effects, and Art Nouveau/Art Deco-specific techniques, plus export workflows.

### 3.1 SVG Generation

SVG is the natural format for editorial graphics: resolution-independent, styleable with CSS, animatable, and small. Programmatic SVG generation produces geometric patterns, organic curves, decorative flourishes, and data-driven layouts — all as vectors.

#### Libraries (Ranked by Relevance)

| Library | What It Does | Size | Why It Matters |
|---------|-------------|------|----------------|
| **[Paper.js](http://paperjs.org/)** | Full vector graphics framework on Canvas with SVG import/export | ~100kb | Best-in-class bezier curve manipulation, boolean operations, smooth paths. Ideal for organic Art Nouveau curves. First-class SVG export. |
| **[SVG.js v3.2](https://svgjs.dev/)** | Lightweight SVG manipulation/creation | ~16kb | Direct DOM-based SVG creation, chainable API, good for simple patterns and decorative elements |
| **[D3.js](https://d3js.org/)** (specifically `d3-shape`, `d3-path`, `d3-delaunay`) | Data-driven SVG generation | Modular | Bezier curve generators, Voronoi/Delaunay tessellation, area/line generators. Overkill for simple patterns but unmatched for data-driven generative art |
| **[Snap.svg](http://snapsvg.io/)** | SVG manipulation for modern browsers | ~80kb | Supports masks, patterns, gradients, clipping. Good for interactive SVG manipulation |
| **[GeoPattern](https://github.com/btmills/geopattern)** | Generate SVG patterns from strings | Small | Deterministic: same input always produces same pattern. Good for seeded decorative backgrounds |

#### Key Techniques

**Bezier curve generation for organic shapes:**
Paper.js excels here. Its `Path` object supports cubic bezier curves natively, with methods for smoothing point arrays into organic curves. Control points defined algorithmically (e.g., noise-driven) produce smooth paths via interpolation. Export to SVG preserves vector quality.

```javascript
// Paper.js — noise-driven organic curve
const path = new Path();
for (let i = 0; i < 20; i++) {
  const x = i * 50;
  const y = 200 + noise2D(x * 0.01, seed) * 100;
  path.add(new Point(x, y));
}
path.smooth({ type: 'catmull-rom' });
// Export: project.exportSVG()
```

**Catmull-Rom splines for Art Nouveau flourishes:**
Catmull-Rom splines pass *through* all control points (unlike Bezier, which is attracted to but doesn't touch control points). Ideal for flowing, calligraphic lines. The [`svg-catmull-rom-spline`](https://www.npmjs.com/package/svg-catmull-rom-spline) npm package converts point arrays directly to SVG path data. The [`catmullrom2bezier`](https://github.com/ariutta/catmullrom2bezier) package converts to cubic bezier for standard SVG path compatibility.

**Voronoi/Delaunay tessellation for geometric patterns:**
[`d3-delaunay`](https://d3js.org/d3-delaunay) (built on [`delaunator`](https://github.com/mapbox/delaunator), extremely fast) generates Voronoi diagrams from point sets. Useful for Art Deco-style geometric partitioning, mosaic patterns, or subtle background textures. Points can be noise-distributed for organic feel or grid-snapped for geometric precision.

**Generative SVG starter pattern** (from [George Francis](https://georgefrancis.dev/writing/a-generative-svg-starter-kit/)):
Create an SVG element with a `viewBox`, use JavaScript to populate it with generated `<rect>`, `<circle>`, `<path>` elements using randomness and noise, style with CSS. SVG's `viewBox` makes everything resolution-independent automatically.

**Why this matters for our site:**
SVG generation is the **primary tool** for editorial decorative elements: page dividers, section ornaments, background patterns, portfolio frame elements. Paper.js for anything organic/curved (Art Nouveau), D3 for anything geometric/tessellated (Art Deco), SVG.js for simple pattern repeats.

### 3.2 p5.js / Processing

p5.js remains the most accessible creative coding framework for the web — ideal for rapid prototyping of generative concepts, with a massive community producing relevant work.

#### Current State (Early 2026)

- **Core library:** Actively maintained, stable API, runs on HTML5 Canvas by default
- **Web Editor:** [editor.p5js.org](https://editor.p5js.org/) for quick experiments
- **Community:** Huge generative art community (fxhash, Art Blocks, creative coding scene)
- **Performance:** Good for 2D, adequate for simple 3D. Not the choice for heavy real-time effects

#### Export Options

| Format | Method | Notes |
|--------|--------|-------|
| PNG | `saveCanvas()` | Built-in, straightforward |
| SVG | [p5.js-svg](https://github.com/zenozeng/p5.js-svg) runtime | Replaces Canvas renderer with SVG. Some features unsupported |
| SVG (pen plotter) | [p5.plotSvg](https://github.com/golanlevin/p5.plotSvg) v0.1.8 (Jan 2026) | Path-based SVG export, optimized for vector output. Does not interfere with animation performance |
| Video | `saveFrames()` + ffmpeg | Export frame sequences, assemble externally |
| Canvas capture | `canvas.toDataURL()` / `canvas.toBlob()` | Standard browser APIs |

#### Strengths for Our Use Case

- **Noise functions built in:** `noise()` (Perlin), plus community libraries for Simplex
- **Quick iteration:** Sketch, tweak parameters, export. Ideal for generating static assets (textures, patterns, backgrounds) during development
- **2D primitives:** `bezier()`, `curve()` (Catmull-Rom), `beginShape()`/`endShape()` with `curveVertex()` for flowing organic shapes
- **Blend modes:** `blendMode()` supports multiply, screen, overlay — useful for layered texture effects

#### Limitations

- **Runtime overhead:** Loading p5.js (~800kb) for a production site is heavy if you only need a few generated assets. Better to generate at build time or use lighter alternatives for runtime
- **SVG export is not first-class:** The p5.js-svg runtime works but has gaps. For production SVG, generate in p5.js then trace/export manually, or use Paper.js instead
- **Canvas-bound:** Default renderer produces raster output. For resolution-independent assets, need the SVG runtime or a post-processing step

#### Verdict

**Use p5.js as a design tool, not a production dependency.** Generate textures, patterns, and decorative elements in the p5.js editor during development, export as SVG (via p5.plotSvg or p5.js-svg) or PNG, then use the static assets in production. If runtime generative visuals are needed, reach for Canvas API directly or Three.js/shaders.

### 3.3 Three.js / WebGL Shaders

Three.js is the dominant 3D/WebGL framework for the web. For our purposes, it's relevant for **generative textures**, **shader-driven backgrounds**, and **subtle interactive 3D elements**.

#### TSL (Three.js Shading Language)

The most significant development in Three.js since 2024 — a high-level shader abstraction that compiles to both GLSL (WebGL) and WGSL (WebGPU). This is the future of shader authoring in Three.js.

**Why TSL matters:**
- Write shaders once, run on WebGL *and* WebGPU
- JavaScript-native syntax (no string-based GLSL)
- Automatic optimization of shader graphs
- Node-based composition: chain functions like `mix(colorA, colorB, noise(uv))`

**WebGPU browser support (as of early 2026):**
- Chrome: supported since v113 (2023)
- Firefox: supported
- **Safari: supported since Safari 26 (September 2025)** — this was the last holdout
- WebGPU is now a **universal baseline** for modern browsers

**TSL Textures library** ([boytchev/tsl-textures](https://github.com/boytchev/tsl-textures)):
A collection of real-time procedural texture generators written in TSL. Includes wood, marble, fabric, stone, polka dots, and more — all GPU-based. Can be applied to planes as backgrounds or used to texture 3D elements. Requires `WebGPURenderer` and node-based materials.

#### Generative Background Approaches

**Full-screen shader quad:**
The simplest Three.js generative background: render a full-screen plane with a custom shader material. The shader generates the visual — noise fields, gradient blends, organic patterns. This is how most "living background" effects work.

```javascript
// Conceptual: TSL generative background
import { MeshBasicNodeMaterial, uniform, uv, time, mix } from 'three/tsl';

const material = new MeshBasicNodeMaterial();
const t = time.mul(0.1);
const n = noise(uv().mul(3.0).add(t));
material.colorNode = mix(color('#1a1a2e'), color('#e2d1c3'), n);
```

**Codrops/Tympanus patterns:**
[Codrops](https://tympanus.net/codrops/tag/webgl/) consistently publishes high-quality WebGL experiments — text effects, interactive backgrounds, image transitions. Many use Three.js + custom shaders. Excellent reference for tasteful, editorial-quality WebGL.

#### Lightweight Alternative: OGL

[OGL](https://github.com/oframe/ogl) is a minimal WebGL library (**8kb gzipped**, zero dependencies) with a Three.js-like API. Ideal when you need a shader-driven background or texture but don't need Three.js's full scene graph, lighting, loaders, etc.

**When to use OGL over Three.js:**
- Single shader background / texture generation
- Performance-critical pages where bundle size matters
- When writing custom GLSL anyway and don't need abstractions

#### Verdict

**Three.js/TSL for any runtime 3D or complex shader effects.** The WebGPU transition is complete — write TSL and target all browsers. For simple shader backgrounds, consider **OGL** to keep bundle size minimal. Use **tsl-textures** as a starting point for procedural material ideas.

### 3.4 GLSL / Shader Art

Shaders are the most powerful tool for generative visuals. A fragment shader runs per-pixel on the GPU, making complex patterns, noise fields, and organic textures essentially free in performance terms.

#### The Ecosystem

| Tool/Resource | Purpose | Integration |
|---------------|---------|-------------|
| **[Shadertoy](https://www.shadertoy.com/)** | Community + IDE for shader art | Browser-based. Shaders can be ported to Three.js/OGL |
| **[LYGIA](https://lygia.xyz/)** | Granular shader utility library | Multi-language (GLSL, HLSL, WGSL, MSL, **TSL**). Modular #include system. Noise, SDF, color, lighting functions |
| **[The Book of Shaders](https://thebookofshaders.com/)** | Tutorial + reference for fragment shaders | Browser examples, deep theory |
| **[Shadertoy React](https://github.com/mvilledieu/shadertoy-react)** | 6kb React component for rendering fragment shaders | Drop-in for React/Next.js projects |
| **[shader-web-background](https://github.com/xemantic/shader-web-background)** | GLSL shaders as website backgrounds | Vanilla JS, supports multipass, float textures. Shadertoy-compatible |
| **VS Code Shader Toy extension** | Live GLSL preview in editor | Real-time feedback while authoring |

#### LYGIA — The Shader Standard Library

[LYGIA](https://github.com/patriciogonzalezvivo/lygia) deserves special attention. It's the largest cross-platform shader library, with battle-tested functions organized into categories:

- **`math/`** — constants (PI, TAU), interpolation, easing
- **`space/`** — scale, rotate, tile, mirror operations on UV space
- **`color/`** — luma, saturation, blend modes, palettes, color space conversion, tonemapping
- **`generative/`** — noise (Perlin, Simplex, Worley/cellular, curl), fractional Brownian motion (fBm), random
- **`sdf/`** — signed distance functions for 2D shapes (circles, boxes, lines, polygons)
- **`draw/`** — stroke, fill, digits, shapes

LYGIA supports GLSL, HLSL, WGSL, and **TSL** — meaning it can be used directly with Three.js's new shading language.

#### Key Shader Techniques for Our Aesthetic

**Noise-based textures:**
Fractional Brownian motion (fBm) layers multiple octaves of noise to create organic, paper-like or fabric-like textures. Muted palettes + fBm noise = the "handmade" texture quality that matches Julianna's monoprint/rubbing work.

**Signed Distance Functions (SDFs) for geometric motifs:**
SDFs define shapes mathematically — circles, rounded rectangles, lines, polygons. They can be combined (union, intersection, subtraction) to create Art Deco geometric patterns. Sharp edges or soft gradients depending on how you threshold the distance field.

**Domain warping:**
Apply noise to the UV coordinates *before* sampling another noise function. This creates organic, flowing distortions — perfect for Art Nouveau-style movement and the watercolor-wash edge dissolution visible in the portfolio.

**Gradient mapping:**
Generate a grayscale noise field, then map it through a color palette (e.g., the warm terracotta/amber/cream/sage palette extracted from Julianna's work). This is how you get generative textures that match the brand.

#### Porting Shadertoy to Production

Shadertoy uses its own uniform conventions (`iTime`, `iResolution`, `iMouse`). To use in production:

1. **Three.js:** Replace Shadertoy uniforms with Three.js equivalents. Felix Rieseberg's [guide](https://felixrieseberg.com/using-webgl-shadertoy-shaders-in-three-js/) covers this
2. **shader-web-background:** Directly Shadertoy-compatible — paste the shader code, it handles uniforms
3. **Shadertoy React:** 6kb React component, handles the translation automatically

#### Verdict

**LYGIA + TSL is the shader strategy.** Use LYGIA's noise, SDF, and color functions within TSL shaders for Three.js. Prototype in Shadertoy or VS Code extension, then port to production. For simple backgrounds without Three.js overhead, use `shader-web-background` or `shadertoy-react`.

### 3.5 Canvas API — Generative Patterns & Noise Textures

The Canvas 2D API is the lightest-weight option for generating raster textures at runtime or build time. No library dependencies required — just browser APIs.

#### Noise Libraries

| Library | Size | Dimensions | Notes |
|---------|------|------------|-------|
| **[simplex-noise](https://github.com/jwagner/simplex-noise.js)** | ~2kb gzip | 2D, 3D, 4D | Fast (~20ns per 2D sample), TypeScript, zero deps, seedable. **Recommended** |
| **[open-simplex-noise](https://github.com/joshforisha/open-simplex-noise-js)** | Small | 2D, 3D, 4D | TypeScript, seedable. OpenSimplex algorithm (patent-free) |
| **[noisejs](https://github.com/josephg/noisejs)** | Tiny | 2D, 3D | Perlin + Simplex. Older but proven |

#### Generative Texture Recipes

**Paper/parchment texture:**
```javascript
// Layered noise for paper texture
const noise2D = createNoise2D(seedRng);
for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) {
    // Layer 1: large-scale variation (warm parchment base)
    const base = noise2D(x * 0.002, y * 0.002) * 0.5 + 0.5;
    // Layer 2: fine grain (paper fiber)
    const grain = noise2D(x * 0.05, y * 0.05) * 0.1;
    // Layer 3: very fine speckle
    const speckle = noise2D(x * 0.2, y * 0.2) * 0.03;
    const value = base + grain + speckle;
    // Map to muted palette: off-white to warm beige
    setPixel(x, y, mapToColor(value, palette));
  }
}
```

**Organic flow fields:**
Use noise to define angle at each point in a grid. Draw particles that follow the flow. The result: organic, hair-like patterns reminiscent of Art Nouveau line work. Export the particle paths as SVG polylines for vector output. This technique directly maps to the stipple fields and contour lines in Julianna's references.

**Reaction-diffusion patterns:**
The [Gray-Scott model](https://github.com/jasonwebb/reaction-diffusion-playground) produces organic, Turing-pattern textures (spots, stripes, labyrinthine structures) that resemble biological and Art Nouveau organic motifs. Can run on Canvas (CPU) or as a WebGL shader (GPU, much faster). Jason Webb's [Reaction-Diffusion Playground](https://jasonwebb.github.io/reaction-diffusion-playground/) is an excellent interactive reference.

#### Canvas to Production Asset

- **PNG/WebP export:** `canvas.toBlob('image/webp', quality)` or `canvas.toDataURL('image/png')`
- **High-DPI:** Generate at 2x or 3x the display size, then serve with `srcset`
- **Build-time generation:** Run Canvas code in Node.js via [`node-canvas`](https://github.com/Automattic/node-canvas) (uses native Cairo) or Puppeteer (headless Chrome). Generate textures during `npm run build`, output to `public/` as optimized WebP

#### Verdict

**Canvas API for build-time texture generation.** Use `simplex-noise` + Canvas to generate paper textures, noise gradients, and subtle background patterns at build time. Export as WebP for production. For runtime effects, prefer shaders (GPU) over Canvas (CPU).

### 3.6 CSS-Based Generative Effects

Pure CSS can create surprising texture-like effects with zero JavaScript, zero image downloads, and infinite scalability. These are the lightest-weight option and should be the **first reach** for subtle background effects.

#### Technique Catalog

**Layered gradients for depth:**
Stack multiple `radial-gradient()` or `conic-gradient()` layers with blend modes to create organic, mesh-gradient-like backgrounds. A single gradient declaration replaces a 50-200KB background image.

```css
.editorial-bg {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(226, 209, 195, 0.4), transparent 70%),
    radial-gradient(ellipse at 80% 20%, rgba(26, 26, 46, 0.15), transparent 60%),
    radial-gradient(ellipse at 50% 80%, rgba(180, 160, 140, 0.2), transparent 50%);
  background-color: #f5f0eb;
}
```

**Grainy/dithered gradients (SVG filter technique):**
[CSS-Tricks' grainy gradient technique](https://css-tricks.com/grainy-gradients/): use an SVG `<feTurbulence>` filter to generate noise, layer it under a gradient, then boost brightness/contrast for a dithered, organic texture. No JavaScript, no image files. The result looks like risograph printing or film grain — close to the monoprint quality in Julianna's work.

```css
.grain-overlay {
  filter: url(#grain-filter);
  /* Or inline SVG filter as data URI */
}
```

**`repeating-linear-gradient` for geometric patterns:**
Fine stripes, pinstripes, crosshatch, and grid patterns — all pure CSS. Useful for Art Deco-inspired geometric textures.

```css
.pinstripe {
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 19px,
    rgba(0,0,0,0.03) 19px,
    rgba(0,0,0,0.03) 20px
  );
}
```

**`mix-blend-mode` and `background-blend-mode`:**
Layer colored elements and blend them for complex color interactions. `multiply` darkens overlaps, `screen` lightens, `overlay` adds contrast. Creates organic color variation without any generated assets.

**CSS `mask-image` with gradients:**
Use gradient masks to create vignettes, fade edges, and shaped reveals. Combined with generated textures (SVG or Canvas), masks create refined editorial effects — supporting the "edge dissolution" quality from the design DNA.

#### CSS Paint API (Houdini)

The [CSS Paint API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Painting_API) lets you write JavaScript "paint worklets" that draw directly into an element's background using a Canvas-like API.

**Current status (early 2026):**
- Chrome/Edge: native support
- Firefox: behind a flag
- Safari: not supported natively
- **Polyfill available:** [css-paint-polyfill](https://github.com/nicolo-ribaudo/css-paint-polyfill) brings support to all modern browsers

**Caveat:** The polyfill adds weight and complexity. For production use, evaluate whether a build-time Canvas approach is simpler.

#### Verdict

**CSS effects are the baseline layer.** Use layered gradients for page-level ambiance, the grainy gradient technique for editorial texture, and `repeating-linear-gradient` for geometric accents. These load instantly, cost nothing, and set the foundation that heavier techniques (Canvas, shaders) build on top of.

### 3.7 Art Nouveau / Art Deco Computational Patterns

There are no dedicated "Art Nouveau pattern libraries" for the web — but the mathematical DNA of both movements is well-understood and highly amenable to generative code.

#### Art Nouveau: The Organic Vocabulary

Art Nouveau is defined by: **flowing curves, asymmetric organic forms, whiplash lines, botanical motifs, and the rejection of straight lines and right angles.** Computationally, this maps to:

| Visual Element | Computational Technique | Tool |
|---------------|------------------------|------|
| Whiplash curves / tendrils | Catmull-Rom splines with noise-perturbed control points | Paper.js, `svg-catmull-rom-spline` |
| Botanical/organic forms | L-systems (fractal branching), reaction-diffusion | Custom code, [reaction-diffusion-playground](https://github.com/jasonwebb/reaction-diffusion-playground) |
| Flowing borders / frames | Bezier curves with sinusoidal modulation along the path | Paper.js `path.smooth()` |
| Organic tessellation | Voronoi diagrams with relaxed (Lloyd's algorithm) point distributions | `d3-delaunay` |
| Hair-like line fields | Flow fields driven by curl noise | Canvas + `simplex-noise`, or GLSL shader |
| Soft organic gradients | Domain-warped noise fields | GLSL (LYGIA `generative/` functions) |

**The key insight:** Art Nouveau's organic quality comes from **smooth interpolation + noise perturbation**. Start with a mathematical curve (spline, circle, sine wave), then perturb it with low-frequency noise. The result feels organic and hand-drawn but retains structural coherence.

**Generative design resembles Art Nouveau** — this is [well-documented](http://gurneyjourney.blogspot.com/2017/05/generative-design-resembles-art-nouveau.html). When computers optimize structures with basic design goals and constraints, the results are curving, skeletal, biological forms with no straight lines — the same vocabulary Art Nouveau used a century earlier.

#### Art Deco: The Geometric Vocabulary

Art Deco is defined by: **symmetry, geometric precision, stepped forms, chevrons, sunbursts, fan/shell motifs, and rich metallic palettes.** Computationally:

| Visual Element | Computational Technique | Tool |
|---------------|------------------------|------|
| Geometric repeating patterns | Tiling algorithms, `repeating-linear-gradient` / `repeating-conic-gradient` | CSS, SVG `<pattern>` |
| Sunburst / radiating lines | Conic gradients, parametric line generation around a center point | CSS `conic-gradient`, SVG, Canvas |
| Chevrons / zigzags | Sawtooth wave functions, repeating path generation | SVG, CSS |
| Fan / shell motifs | Polar coordinate transformations, arc generation | Paper.js, D3 arc generators |
| Stepped / layered forms | Recursive scaling of geometric primitives | SVG generation, CSS transforms |
| Symmetry | Mirror/rotate transforms applied to generated half-patterns | Paper.js `item.transform()`, CSS/SVG transforms |
| Metallic gradients | Linear/radial gradients with gold/silver/bronze color stops | CSS, SVG `<linearGradient>` |

#### Hybrid Approach: Art Nouveau Polish + Art Deco Structure

For the Asimov aesthetic, the sweet spot is **Art Deco's structural discipline with Art Nouveau's organic softness**:

- **Geometric grid with organic fills:** Use Art Deco proportions and symmetry for overall layout, then fill cells/panels with noise-based organic textures
- **Structured curves:** Start with geometric arcs (Art Deco fans, radial forms), then slightly perturb with noise for a lived-in quality
- **Metallic-to-matte palette:** Gold/warm tones (Art Deco) but with the muted, flat treatment of Art Nouveau
- **Decorative borders that breathe:** Geometric overall structure, organic interior detail (like a Mucha poster frame)

#### Code Examples

**Noise-modulated geometric pattern:**
```javascript
// Art Deco sunburst with organic perturbation
const center = { x: width/2, y: height/2 };
const rays = 24; // Art Deco precision
for (let i = 0; i < rays; i++) {
  const baseAngle = (i / rays) * Math.PI * 2;
  // Noise perturbation: Art Nouveau softness
  const angleOffset = noise2D(i * 0.5, seed) * 0.02;
  const angle = baseAngle + angleOffset;
  // Width varies organically
  const rayWidth = 2 + noise2D(i * 0.3, seed + 100) * 1;
  drawRay(center, angle, rayWidth, maxRadius);
}
```

**Generative border ornament:**
```javascript
// Paper.js: flowing border with geometric anchor points
const border = new Path();
const cornerPoints = [/* geometric rectangle corners */];
const subdivisions = 40;
for (const [start, end] of segments(cornerPoints)) {
  for (let t = 0; t < 1; t += 1/subdivisions) {
    const base = lerp(start, end, t);
    // Inward organic undulation
    const offset = Math.sin(t * Math.PI * 6) * 8;
    const noiseOffset = noise2D(t * 3, segmentSeed) * 4;
    border.add(offsetPoint(base, normal, offset + noiseOffset));
  }
}
border.smooth({ type: 'catmull-rom', factor: 0.5 });
```

#### Verdict

**No off-the-shelf library needed — the techniques map cleanly.** Art Nouveau = noise-perturbed splines (Paper.js + simplex-noise). Art Deco = parametric geometry (SVG generation, CSS gradients). The hybrid = geometric structure with organic softening. Build a small utility library of pattern generators specific to our design language.

### 3.8 Export Workflows — Code to Production Asset

#### Workflow Matrix

| Source | Output Format | Method | Use Case |
|--------|--------------|--------|----------|
| SVG (Paper.js, D3, SVG.js) | SVG file | `project.exportSVG()` (Paper.js), `serialize()` DOM, or string generation | Decorative elements, borders, patterns. Stays vector. |
| SVG | Optimized SVG | [SVGO](https://github.com/svg/svgo) (CLI/Node) | Strip metadata, minify paths. Can reduce file size 50%+ |
| Canvas (2D API) | PNG | `canvas.toBlob('image/png')` | Textures at specific resolution |
| Canvas (2D API) | WebP | `canvas.toBlob('image/webp', 0.85)` | **Preferred raster format.** 25-35% smaller than JPEG at equal quality. Universal browser support |
| p5.js sketch | SVG | p5.plotSvg or p5.js-svg runtime | Design-time export, then optimize |
| p5.js sketch | PNG | `saveCanvas()` | Raster texture export |
| GLSL shader | PNG/WebP | Render to Canvas via Three.js/OGL, then `toBlob()` | Capture shader output as static texture |
| DOM/HTML | PNG/SVG | [html-to-image](https://github.com/bubkoo/html-to-image), [dom-to-image](https://github.com/tsayen/dom-to-image) | Capture CSS effects or complex DOM compositions |
| Canvas drawing commands | SVG | [canvas2svg](https://github.com/gliffy/canvas2svg) | Translate Canvas API calls to SVG output |
| Any raster | Optimized WebP/AVIF/PNG | [Sharp](https://sharp.pixelplumbing.com/) (Node.js, libvips) | Build-time image processing pipeline. Resize, format-convert, optimize. ~4-5x faster than ImageMagick |

#### Recommended Static Asset Pipeline

```
1. Author in p5.js editor or custom Canvas/SVG script
2. Export:
   - Vector elements -> SVG -> SVGO optimization
   - Raster textures -> PNG at 2x resolution
3. Build-time processing (via Sharp in build script):
   - Convert PNG -> WebP (quality 80-85)
   - Generate srcset variants (1x, 2x)
   - Generate AVIF variant for cutting-edge browsers
4. Serve via <picture> element or CSS with format fallbacks
```

#### Recommended Runtime Visual Pipeline

```
1. Author shader in Shadertoy or VS Code
2. Port to TSL (Three.js) or raw GLSL (OGL / shader-web-background)
3. Render to full-screen quad behind content
4. Use CSS mix-blend-mode to integrate with page
5. Provide graceful degradation:
   - Static fallback image for reduced-motion preference
   - Lower-resolution rendering on mobile / low-power devices
   - prefers-reduced-motion media query to disable animation
```

#### Build-Time Generation in a Next.js/Astro Pipeline

```javascript
// scripts/generate-textures.mjs
import { createCanvas } from '@napi-rs/canvas'; // or node-canvas
import sharp from 'sharp';
import { createNoise2D } from 'simplex-noise';

const canvas = createCanvas(2048, 2048);
const ctx = canvas.getContext('2d');
const noise = createNoise2D();

// ... generate texture on canvas ...

const buffer = canvas.toBuffer('image/png');
await sharp(buffer)
  .resize(1024, 1024)
  .webp({ quality: 82 })
  .toFile('public/textures/paper-grain.webp');
```

#### Format Recommendations

| Use Case | Format | Why |
|----------|--------|-----|
| Decorative elements, borders, icons | SVG | Vector, scalable, styleable, tiny file size |
| Background textures, noise patterns | WebP | 25-35% smaller than JPEG, universal support, lossy OK |
| Textures needing transparency | WebP (lossy+alpha) or PNG | WebP supports alpha with lossy compression |
| Animated textures | WebP animated, or CSS/shader at runtime | Animated WebP for precomposed, shaders for interactive |
| High-quality photography | AVIF (primary) + WebP (fallback) | AVIF is 50% smaller than JPEG. Use `<picture>` for fallback |

---

## 4. AI Image Generation Platforms

AI image generation complements the computational pipeline above. Where code-generated assets excel at textures, patterns, and geometric elements, AI platforms excel at pictorial compositions, hero imagery, and visual identity exploration.

### 4.1 OpenAI GPT Image (formerly DALL-E)

#### Current State (March 2026)

OpenAI has moved beyond the "DALL-E" branding. **DALL-E 3 is deprecated** (EOL May 12, 2026). The current lineup is the **GPT Image** family — natively multimodal LLMs, not standalone diffusion models.

| Model | Status | Notes |
|-------|--------|-------|
| **gpt-image-1.5** | Current flagship | Superior instruction following, text rendering, 4x faster than gpt-image-1. #1 on LMArena Text-to-Image leaderboard. |
| **gpt-image-1** | Active | Solid quality, slightly slower/pricier at equivalent quality. |
| **gpt-image-1-mini** | Active (budget) | 55-78% cheaper. Lower quality ceiling but viable for volume. |
| **DALL-E 3** | Deprecated | EOL May 12, 2026. |

#### API Details

Two API surfaces:
- **Images API** (traditional) — `POST /v1/images/generations`, `/edits`
- **Responses API** (newer, recommended) — image gen as built-in tool in conversational context. Supports multi-turn editing, iterative refinement.

| Parameter | Options |
|-----------|---------|
| `size` | `1024x1024`, `1024x1536`, `1536x1024` |
| `quality` | `low`, `medium`, `high` |
| `output_format` | `png`, `jpeg`, `webp` |
| `background` | `opaque`, `transparent` |

**Pricing (per image):**

| Model | Low | Medium | High |
|-------|-----|--------|------|
| gpt-image-1.5 | ~$0.009 | ~$0.07 | ~$0.20 |
| gpt-image-1 | ~$0.011 | ~$0.07 | ~$0.25 |
| gpt-image-1-mini | ~$0.005 | ~$0.02 | ~$0.052 |

#### Strengths

- **Text rendering** — best-in-class. Can render dense typography, labels, headlines, multi-line text reliably. Directly relevant for editorial/typographic assets.
- **Instruction following** — because these are LLMs, complex multi-clause prompts with constraints work well. Can enforce restraint (no clutter, generous whitespace, specific palettes).
- **Transparent backgrounds** — native support via `background: "transparent"`.
- **Multi-turn editing** — iterative refinement via Responses API. Generate, refine, adjust, finalize.
- **API-first** — fully programmatic, no GUI dependency. Integrates into static site build pipelines and the `/update-site` skill.
- **Inpainting** — supported via Edits endpoint or Responses API.

#### Limitations

- **Max resolution 1536x1024** — sufficient for web, may need upscaling for large-format print.
- **Character consistency across generations** — no built-in "style lock" mechanism.
- **Style drift in long editing sessions** — after 10+ edits, re-specify style details.
- **Some art style regression** — gpt-image-1.5 reported to have regressed in specific art styles vs gpt-image-1.

#### Relevance to Mission Asimov

**Good fit:**
- Text rendering for typographic compositions
- Precise instruction following enforces restraint
- Transparent backgrounds for layered compositions
- Multi-turn editing for iterative visual identity refinement
- API-first integrates into static site build pipeline

**Caution:**
- Max 1536px may limit architecture portfolio imagery
- Consistency across separate generations needs careful prompting
- Test Art Nouveau/Art Deco specifics early

**Recommendation:** gpt-image-1.5 for this use case. Instruction-following precision suits restrained editorial work.

### 4.2 Midjourney V7

#### Current State (March 2026)

**V7 is the current default model** (released April 2025). Completely rebuilt architecture described as "smartest, most beautiful, most coherent."

**V8 is imminent** — was in final distillation as of mid-February 2026. Promises native 2K (2048x2048), enhanced text rendering, faster generation.

#### Access Methods

No longer Discord-only:
- **Web app** (midjourney.com) — full-featured workspace
- **Discord** — still works via `/imagine`
- **Mobile apps** — iOS and Android

All require paid subscription. No free tier.

#### Pricing

| Plan | Monthly | Key Features |
|------|---------|--------------|
| Basic | $10/mo | ~3.3 GPU hrs |
| Standard | $30/mo | Relax Mode (unlimited slow) |
| Pro | $60/mo | + Stealth Mode (private) |
| Mega | $120/mo | + max concurrency |

#### Strengths

- **Aesthetic quality is best-in-class.** Painterly, cinematic, rich textures. Excels at images that "look like art."
- **Art Nouveau / Art Deco handling** — handles these styles natively and well.
- **Style reference system (`--sref`)** — pass an image URL, Midjourney applies its aesthetic. Can build reusable style codes.
- **Style Creator tool** — web-based tool for building custom `--sref` codes by picking from image grids.
- **Character reference (`--cref`)** — maintain character consistency across generations.
- **Personalization system** — learns aesthetic preferences over time.
- **Draft mode** — half cost, 10x speed for rapid iteration.

#### Limitations

- **Text rendering remains weak** — only 15% improvement over V6. Achilles heel.
- **Prompt adherence is loose** — "sacrifices precision for vibe." Unreliable for specific counts, exact spatial arrangements.
- **No public API** — cannot be automated without violating ToS. Enterprise API exists but requires applying for access.
- **Aggressive content moderation** — legitimate prompts sometimes blocked.

#### Style Control (Key for Our Use Case)

- **`--sref <url>`** — style reference from image. Could use Asimov Collective screenshots or Julianna's own work.
- **`--sw 0-1000`** — style weight controlling reference influence.
- **`--cref <url>`** — character consistency across generations.
- **Style Creator** — build reusable "Mission Asimov" style code.
- **Personalization** — platform learns preferences over time.

#### Relevance to Mission Asimov

**Best for:** Curated hero assets, portfolio imagery, establishing visual language via `--sref` codes. Aesthetic quality aligns naturally with editorial restraint target.

**Not viable for:** Automated pipelines (`/update-site` skill). No API access.

**Recommendation:** Use Midjourney (Pro plan, $60/mo for Stealth Mode) for curated asset creation. Build a reusable style code via Style Creator. Use GPT Image API for any automated generation.

### 4.3 Google Gemini / Imagen

#### Current State (March 2026)

Google's image generation has diverged into two tracks: **Gemini native image generation** (branded "Nano Banana") and the **Imagen family** (standalone text-to-image). Imagen 3 is retired; Imagen 4 runs as a dedicated model, while the Nano Banana models integrate image generation directly into the Gemini multimodal LLM architecture.

| Model | ID | Status | Max Resolution | Architecture |
|-------|----|--------|----------------|--------------|
| **Nano Banana 2** | `gemini-3.1-flash-image-preview` | Preview | 4K (4096x4096) | Gemini 3.1 Flash — fast, high-volume |
| **Nano Banana Pro** | `gemini-3-pro-image-preview` | Preview | 4K (4096x4096) | Gemini 3 Pro — advanced reasoning, best quality |
| **Nano Banana** | `gemini-2.5-flash-image` | GA | 1K (1024x1024) | Gemini 2.5 Flash — budget tier |
| **Imagen 4 Fast** | `imagen` (fast) | GA | 2K (2048x2048) | Dedicated diffusion — speed-optimized |
| **Imagen 4 Standard/Ultra** | `imagen` (standard/ultra) | GA | 2K (2048x2048) | Dedicated diffusion — balanced/max photorealism |

**Key distinction:** Nano Banana models are multimodal LLMs (like GPT Image) — they reason about prompts, support multi-turn editing, and accept reference images. Imagen 4 is standalone text-to-image — faster and cheaper, but no conversational editing or image input.

#### API Details

Two surfaces: **Gemini API** (Nano Banana — `generateContent` via SDK or REST, text + up to 14 reference images, multi-turn editing, mask-free inpainting, configurable "Thinking" depth) and **Imagen API** (text-to-image only via Vertex AI or Gemini API, no editing/reference images).

#### Pricing

| Model | 512px | 1K | 2K | 4K |
|-------|-------|----|----|----|
| Nano Banana (2.5 Flash) | — | $0.039 | — | — |
| Nano Banana 2 (3.1 Flash) | $0.045 | $0.067 | $0.101 | $0.151 |
| Nano Banana Pro (3 Pro) | — | $0.134 | $0.134 | $0.24 |
| Imagen 4 Fast/Standard/Ultra | — | $0.02 / $0.04 / $0.06 | — | — |

**Free tier:** Gemini 2.5 Flash Image — ~500 requests/day at 1K. Most generous free image generation tier among major providers. **Batch pricing:** 50% discount on Nano Banana models.

#### Strengths

- **Text rendering — near-perfect (94-98%).** Rivals GPT Image 1.5, far exceeds Midjourney.
- **Resolution ceiling — industry-leading 4K.** GPT Image tops out at 1536x1024. Significant for architecture portfolio imagery.
- **Reference image input (up to 14 images).** Upload Asimov Collective screenshots as style references. Genuine style transfer, not filter overlay.
- **Multi-turn editing.** Conversational refinement: "more whitespace," "quieter palette," "shift the balance."
- **Reasoning-driven generation.** Complex multi-clause prompts with constraints (restraint, whitespace, specific palettes) are parsed with genuine understanding.
- **Generous free tier.** Extensive prototyping before committing to paid.
- **Extreme aspect ratio support** (1:8, 8:1) — useful for banners, panoramic compositions.

#### Limitations

- **No transparent background support.** Critical gap vs GPT Image 1.5. Workaround: chromakey green + post-processing, but adds pipeline complexity.
- **Best models still in Preview.** API may change, rate limits may shift.
- **Dynamic rate limits.** Quotas fluctuate with server demand — reports of hitting limits after 15-20 images during peak.
- **Aggressive content moderation.** More conservative than OpenAI. Legitimate editorial prompts may trigger false positives.
- **No persistent style codes.** Unlike Midjourney's `--sref`, requires re-uploading reference images each session.
- **SynthID watermark** on all outputs (non-visible, unlikely to matter for web).

#### Relevance to Mission Asimov

**Best for:** High-resolution hero assets (4K portfolio imagery), style-referenced generation (upload Asimov Collective screenshots), budget prototyping (free tier), and automated daily content at 1K ($0.067/image — price-competitive with GPT Image).

**Not recommended for:** Transparent overlays (use GPT Image 1.5), curated artistic hero images (Midjourney's aesthetic quality and `--sref` system remain superior), workflows requiring guaranteed uptime (preview models are risky).

**Model selection guide:**

| Use Case | Model | Est. Cost |
|----------|-------|-----------|
| Hero / portfolio images (4K) | Nano Banana Pro | $0.24/image |
| Editorial compositions (2K) | Nano Banana 2 | $0.101/image |
| Daily automated assets (1K) | Nano Banana 2 or GPT Image 1.5 | $0.067-0.07/image |
| Rapid prototyping | Nano Banana (2.5 Flash, free) | Free |
| Simple backgrounds / fills | Imagen 4 Fast | $0.02/image |
| Transparent overlays | GPT Image 1.5 | $0.07-0.20/image |
| Curated artistic assets | Midjourney V7/V8 | Subscription |

### 4.4 Platform Comparison

| Dimension | GPT Image 1.5 | Midjourney V7 | Gemini (Nano Banana Pro) | Imagen 4 | Generative Code |
|-----------|---------------|---------------|--------------------------|----------|-----------------|
| **Aesthetic quality** | Good, literal | Best, painterly | Good, reasoning-informed | Good, photorealistic | Depends on skill |
| **Prompt precision** | High | Loose (vibe) | High (Thinking engine) | Moderate | N/A (code) |
| **Text rendering** | Excellent | Weak (71%) | Excellent (94-98%) | Good | Perfect (SVG) |
| **Max resolution** | 1536x1024 | ~2048px | 4096x4096 | 2048x2048 | Unlimited (vector) |
| **API access** | Full | None (public) | Full | Full | N/A |
| **Transparent BG** | Yes (native) | No | No | No | Yes (SVG/Canvas) |
| **Multi-turn editing** | Yes | No | Yes | No | N/A |
| **Style reference** | Prompt-only | Best (`--sref`) | Reference images (up to 14) | None | Total (code) |
| **Automation** | Fully scriptable | Manual only | Fully scriptable | Fully scriptable | Fully scriptable |
| **Cost per image** | $0.009-$0.25 | $10-120/mo sub | $0.039-$0.24 | $0.02-$0.06 | Free (compute) |
| **Free tier** | No | No | Yes (500 req/day) | No | Free |
| **Best for** | Automated typography, transparent overlays | Curated hero images | High-res editorial, style-referenced work | Budget text-to-image | Textures, patterns, interactive |

---

## 5. Recommended Pipeline — The Synthesis

### The Layered Approach

The site's visual system has four layers, from lightest to heaviest. Each layer builds on the previous. Start with CSS, add complexity only where it earns its weight.

| Layer | Tool | Purpose | Performance Cost |
|-------|------|---------|-----------------|
| **1. CSS baseline** | Layered gradients, `feTurbulence` grain, blend modes | Page ambiance, subtle texture | 0kb additional |
| **2. SVG generation** | Paper.js (organic), SVG.js (simple patterns) | Decorative elements, borders, section ornaments | 1-5kb each after SVGO |
| **3. Build-time raster** | `simplex-noise` + Canvas + Sharp | Paper textures, noise gradients, background patterns | 10-50kb each (WebP) |
| **4. Runtime shaders** | OGL (8kb) or Three.js + TSL | Interactive backgrounds, living textures | 8-150kb+ library |

**Cross-cutting:** `simplex-noise` (~2kb) drives organic variation in layers 2-4. LYGIA provides noise, SDF, and color functions for shaders.

### The Recommended Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| **CSS baseline** | Layered gradients, `feTurbulence` grain, blend modes | Page ambiance, subtle texture, zero-cost |
| **SVG generation** | Paper.js (organic), SVG.js (simple patterns) | Decorative elements, borders, section ornaments |
| **Noise/math** | `simplex-noise` (~2kb) | Driving organic variation in all generators |
| **Geometric computation** | `d3-delaunay` | Voronoi patterns, tessellation, Art Deco geometry |
| **Runtime shaders** | OGL (8kb) or Three.js + TSL | Interactive backgrounds, living textures |
| **Shader utilities** | LYGIA | Noise, SDF, color functions for shaders |
| **Design-time sketching** | p5.js (editor only, not shipped) | Rapid prototyping of generative concepts |
| **Build-time processing** | Sharp + SVGO | Optimize all generated assets |
| **Spline curves** | `svg-catmull-rom-spline`, `catmullrom2bezier` | Art Nouveau flourishes and organic SVG paths |

### What NOT to Include

- **Full Three.js** if we only need flat shader backgrounds (use OGL instead)
- **p5.js in production bundle** (too heavy for what we'd use)
- **CSS Paint API / Houdini** (polyfill complexity not worth it when Canvas/SVG achieve the same)

### Performance Budget

For an Asimov-quality editorial site, visual polish must not come at the cost of loading speed:

- **CSS effects:** 0kb additional (built into the stylesheet)
- **SVG decorative elements:** typically 1-5kb each after SVGO
- **Noise library (simplex-noise):** ~2kb gzipped
- **WebGL background (OGL):** ~8kb gzipped + shader code
- **WebGL background (Three.js):** ~150kb+ gzipped (only if 3D features are needed beyond flat shaders)
- **Generated textures (WebP):** 10-50kb each at appropriate quality
- **Total visual layer budget:** aim for under 100kb total for all generative/decorative assets

### AI Platform Pipeline

The hybrid approach uses each platform for what it does best:

1. **Midjourney** (manual) — hero images, portfolio backgrounds, moodboard exploration. Build reusable `--sref` style code from Julianna's existing work and the established color palette.
2. **GPT Image API** (automated) — the **layering engine**. Transparent backgrounds are native, making this the go-to for generating compositing material: stipple overlays, watercolor-wash fragments, decorative elements that float over content. Also strong for typographic compositions. gpt-image-1.5 recommended for instruction-following precision. This role is more central than "just typography" — the collage/layering design language depends on transparency support.
3. **Generative code** (automated) — the other path to layered compositions. SVG and Canvas both give perfect transparency control, producing stipple fields, contour lines, watercolor-wash effects, paper grain. Code-generated assets can be produced at **three stages**: design-time (run scripts manually, commit results — intentional, frozen), build-time (generate during `npm run build` via Node.js Canvas/Sharp — fresh per deploy but static per visitor), or runtime (shaders/CSS in the browser — alive, responsive to scroll/time/viewport). Atmospheric texture (paper grain, subtle stipple) suits runtime. Compositional elements (specific stipple fields framing portfolio images, wash edges on daily entries) suit build-time or design-time for intentional placement.
4. **Gemini/Imagen** — strong complement for high-resolution hero assets (4K, beating GPT Image's 1536px ceiling) and style-referenced generation (upload Asimov screenshots as references). Generous free tier for prototyping. **Cannot produce transparent backgrounds** — use GPT Image or generative code for layering material.

### Mapping Texture Vocabulary to Tools

Every texture from the design DNA (Section 2) maps to a specific computational or AI approach:

| Texture | Primary Tool | Technique |
|---------|-------------|-----------|
| **Stipple fields** | Canvas + `simplex-noise`, or GLSL shader | Particle-based noise at variable density, alpha fadeout at edges |
| **Paper grain** | CSS `feTurbulence` filter (baseline) or Canvas noise (build-time) | Layered fBm noise mapped to warm off-white palette |
| **Watercolor wash** | GLSL domain warping, or Canvas with wet-edge algorithms | Noise-driven opacity falloff with organic boundary shapes |
| **Contour/topographic lines** | SVG generation (Paper.js or D3) | Marching squares / contour extraction from noise field, exported as SVG paths |
| **Collage edges** | CSS `mask-image` + generated noise masks | Irregular alpha masks from noise-driven edge paths |
| **Monoprint / rubbing** | Canvas (build-time texture generation) | Multi-layer noise with high-frequency grain, mapped through warm palette |

---

## Sources

- [GeoPattern - GitHub](https://github.com/btmills/geopattern)
- [svg-patterns - npm](https://www.npmjs.com/package/svg-patterns)
- [SVG.js v3.2](https://svgjs.dev/)
- [Snap.svg](http://snapsvg.io/)
- [Pattern Monster](https://pattern.monster)
- [p5.plotSvg - GitHub](https://github.com/golanlevin/p5.plotSvg)
- [p5.js-svg Runtime - GitHub](https://github.com/zenozeng/p5.js-svg)
- [p5.js](https://p5js.org/)
- [fxhash Beginner's Guide to p5.js](https://www.fxhash.xyz/article/beginner's-guide-to-learning-p5.js-for-generative-art)
- [Three.js Shading Language Wiki](https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language)
- [TSL: A Better Way to Write Shaders - Three.js Roadmap](https://threejsroadmap.com/blog/tsl-a-better-way-to-write-shaders-in-threejs)
- [Field Guide to TSL and WebGPU - Maxime Heckel](https://blog.maximeheckel.com/posts/field-guide-to-tsl-and-webgpu/)
- [Migrate Three.js to WebGPU (2026) - Complete Checklist](https://www.utsubo.com/blog/webgpu-threejs-migration-guide)
- [tsl-textures - GitHub](https://github.com/boytchev/tsl-textures)
- [Introduction to TSL - Arie M. Prasetyo (Jan 2026)](https://arie-m-prasetyo.medium.com/introduction-to-tsl-0e1fda1beffe)
- [100 Three.js Tips (2026)](https://www.utsubo.com/blog/threejs-best-practices-100-tips)
- [Codrops WebGL Tag](https://tympanus.net/codrops/tag/webgl/)
- [Interactive Text Destruction with TSL - Codrops](https://tympanus.net/codrops/2025/07/22/interactive-text-destruction-with-three-js-webgpu-and-tsl/)
- [OGL - Minimal WebGL Library](https://github.com/oframe/ogl)
- [Shadertoy](https://www.shadertoy.com/)
- [LYGIA Shader Library](https://lygia.xyz/)
- [LYGIA - GitHub](https://github.com/patriciogonzalezvivo/lygia)
- [shadertoy-react - GitHub](https://github.com/mvilledieu/shadertoy-react)
- [shader-web-background - GitHub](https://github.com/xemantic/shader-web-background)
- [Using Shadertoy Shaders in Three.js - Felix Rieseberg](https://felixrieseberg.com/using-webgl-shadertoy-shaders-in-three-js/)
- [simplex-noise.js - GitHub](https://github.com/jwagner/simplex-noise.js)
- [open-simplex-noise-js - GitHub](https://github.com/joshforisha/open-simplex-noise-js)
- [noisejs - GitHub](https://github.com/josephg/noisejs)
- [Reaction-Diffusion Playground - Jason Webb](https://jasonwebb.github.io/reaction-diffusion-playground/)
- [Reaction-Diffusion Tutorial - Karl Sims](https://www.karlsims.com/rd.html)
- [d3-delaunay](https://d3js.org/d3-delaunay)
- [Delaunator - GitHub](https://github.com/mapbox/delaunator)
- [CSS Gradients 2026 Guide - Elementor](https://elementor.com/blog/css-gradients/)
- [Grainy Gradients - CSS-Tricks](https://css-tricks.com/grainy-gradients/)
- [Modern CSS Background Effects Without Images](https://blog.openreplay.com/modern-css-background-effects/)
- [CSS Paint API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Painting_API)
- [Creating Generative Patterns with CSS Paint API - CSS-Tricks](https://css-tricks.com/creating-generative-patterns-with-the-css-paint-api/)
- [Houdini.how - web.dev](https://web.dev/articles/houdini-how)
- [Generative Design Resembles Art Nouveau - Gurney Journey](http://gurneyjourney.blogspot.com/2017/05/generative-design-resembles-art-nouveau.html)
- [Art Nouveau Curves and Generative Elements - EngageCSEdu](https://engage-csedu.org/find-resources/art-nouveau-curves-and-generative-elements)
- [Paper.js](http://paperjs.org/)
- [A Generative SVG Starter Kit - George Francis](https://georgefrancis.dev/writing/a-generative-svg-starter-kit/)
- [Generative Art with JavaScript and SVG - Springer](https://link.springer.com/book/10.1007/979-8-8688-0086-3)
- [svg-catmull-rom-spline - npm](https://www.npmjs.com/package/svg-catmull-rom-spline)
- [catmullrom2bezier - GitHub](https://github.com/ariutta/catmullrom2bezier)
- [Haikei - SVG Design Assets](https://haikei.app/)
- [canvas2svg - GitHub](https://github.com/gliffy/canvas2svg)
- [html-to-image - GitHub](https://github.com/bubkoo/html-to-image)
- [dom-to-image - GitHub](https://github.com/tsayen/dom-to-image)
- [Sharp - High Performance Node.js Image Processing](https://sharp.pixelplumbing.com/)
- [SVGO - GitHub](https://github.com/svg/svgo)
- [SVG vs Canvas vs WebGL Benchmarks 2025](https://www.svggenie.com/blog/svg-vs-canvas-vs-webgl-performance-2025)

---

## Appendix A: Reference — Site Experience Analysis

The following site analyses are about experience, UX structure, storytelling, and branding. They inform the site's interaction model and content strategy rather than the graphics pipeline directly.

### A.1 Asimov Collective Project Sites

Sites analyzed: Shinkei Systems, Monumental Labs, Extropic. (Valar Atomics pending.)

#### The Asimov Collective Formula

Every project page follows the same structural DNA with remarkable consistency:

**1. Navigation = Confidence**
- Fixed header with just two links: "Library" and "Projects"
- Breadcrumb ("Back to home") for escape
- Sequential project navigation (prev/next) — portfolio is a browsable collection, not isolated pages
- Minimal navigation = "we trust our content to hold you"

**2. Content Pacing = Slow Reveal**
- Hero, then title + description, then service tags, then image galleries, then CTA, then next project
- Progressive disclosure — metadata first, then rich media builds narrative momentum
- Multiple image galleries in three formats: wide (landscape), square, tall (portrait)
- Galleries break up text sections — the rhythm is: read, look, read, look

**3. Imagery = Full Immersion**
- High-resolution assets (4000px wide), WebP with blur placeholders for progressive loading
- Three responsive image formats serve different aspect ratios per device
- Embedded interactive "playgrounds" (asimov-playground.vercel.app) — dynamic, explorable content beyond static images
- Video autoplay where appropriate
- Images dominate — text is brief, imagery does the storytelling

**4. Typography = Invisible System**
- Custom fonts (7 distinct font files loaded per page) — not system fonts, not Google Fonts
- Sans-serif dominant, clean and contemporary
- Strong hierarchy: large headlines for impact, smaller body copy
- Generous line-height — text breathes

**5. Copy = Precise and Confident**
- Brief, substantive, no hyperbole
- "Artisanal quality at industrial scale" (Shinkei) — concise positioning
- "Bridges workshop traditions of fine arts with cutting-edge technology" (Monumental) — craft meets innovation
- Tags define scope: "Brand Design, Strategy, Web Design + Development, Copywriting, Product Design, Identity Design"
- The copy serves the imagery, not the other way around

**6. Interaction = Subtle Physics**
- Lenis scroll library with lerp: 0.8 — smooth, physics-based scrolling
- No jarring animations — everything eases
- ResizeObserver for responsive behavior
- Scroll-linked reveals (progressive disclosure as you scroll)
- The interaction is felt, not seen

**7. Whitespace = Confidence**
- Generous vertical rhythm between sections
- Fixed nav doesn't intrude
- Image galleries have breathing room
- Absence of clutter communicates: "we don't need to fill space to justify our presence"

**8. Premium Quality Signals**
- Custom font infrastructure
- Sophisticated image optimization (blur placeholders, responsive formats)
- Smooth scroll physics
- Embedded interactive playgrounds (not just screenshots — live explorable content)
- Detailed view tracking / analytics
- Clean, purposeful navigation — nothing extraneous

#### What to Take from Asimov for Mission Asimov

| Asimov Pattern | How It Translates |
|----------------|-------------------|
| Single-column vertical scroll | Primary site structure — one column, intentional pacing |
| Three image formats (wide/square/tall) | Portfolio pages use mixed aspect ratios, not uniform grids |
| Progressive disclosure | Content reveals as you scroll — don't show everything at once |
| Sequential project navigation | Architecture portfolio as a browsable sequence, not a grid |
| Embedded interactive playgrounds | Room for interactive experiments within project pages |
| Smooth scroll physics (Lenis, lerp) | The site should feel physical — eased, weighted movement |
| Copy serves imagery | Brief, precise text. Let the work speak. |
| Custom typography system | Invest in typeface selection early — this is non-negotiable for the quality bar |

### A.2 Porter Robinson / Nurture

#### porterrobinson.com

The landing is intentionally **minimal and mysterious** — pink background with "Porter Robinson SMILE! :D." The real experience loads asynchronously via JavaScript (WebGL/Three.js world). The site IS a narrative device, not a container.

Key qualities:
- **Anticipation through absence** — nothing is immediately visible, the experience unfolds
- **The site as a space you enter** — not a page you read (confirmed from earlier research)
- **Performative identity** — "SMILE! :D" is an instruction, not an invitation
- Custom fonts (NBArchitekt, PPPangramsans) for artistic control
- Sophisticated tracking underneath a deliberately opaque navigation

#### What to Take from Porter Robinson

| Porter Pattern | How It Translates |
|----------------|-------------------|
| Site as portal/space | Future interactive layer — the "play" in "play within polish" |
| Anticipation and unfolding | Even in Asimov-first V1, the site could have a moment of arrival |
| Custom WebGL world | Banked for Phase 2+ — architecture the codebase so this can be added later |
| Performative identity | The site's personality should be felt, not just displayed |

### Appendix Pending Items

- Valar Atomics (Asimov Collective) — fetch was interrupted
- nurture.art — fetch partially completed
- Deeper analysis of Asimov Collective's homepage and overall portfolio structure
