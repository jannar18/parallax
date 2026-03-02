# Computational Graphics for Web — Tools & Techniques Research

> **Status:** Deep research (finalized)
> **Date:** 2026-03-02
> **Purpose:** Map the landscape of code-generated visual assets for the web — SVG generation, shader art, generative patterns, Canvas techniques, and production export workflows. This informs how we'll create textures, backgrounds, decorative elements, and interactive visuals for the site.

---

## The Through-Line

The target aesthetic is **restrained, typographic, editorial** — Asimov Collective territory. Art Nouveau/Art Deco meets digital: organic curves alongside geometric precision, generous whitespace, muted palettes. Every visual element should feel like it was *authored*, not downloaded. Code-generated graphics serve this vision in three ways:

1. **Uniqueness** — generated assets are one-of-a-kind; no stock imagery smell
2. **Coherence** — a single parametric system can produce backgrounds, textures, decorative elements, and interactive moments that all share DNA
3. **Liveness** — generative elements can respond to time, user input, or content, keeping the "studio desk" metaphor active

The research below covers **seven domains** (SVG generation, p5.js/Processing, Three.js/WebGL, GLSL shaders, Canvas API, CSS effects, and Art Nouveau/Deco-specific techniques) plus a final section on export workflows to get from code to production-ready assets.

---

## 1. SVG Generation

SVG is the natural format for editorial graphics: resolution-independent, styleable with CSS, animatable, and small. Programmatic SVG generation gives us geometric patterns, organic curves, decorative flourishes, and data-driven layouts — all as vectors.

### Libraries (Ranked by Relevance to Our Aesthetic)

| Library | What It Does | Size | Why It Matters |
|---------|-------------|------|----------------|
| **[Paper.js](http://paperjs.org/)** | Full vector graphics framework on Canvas with SVG import/export | ~100kb | Best-in-class bezier curve manipulation, boolean operations, smooth paths. Ideal for organic Art Nouveau curves. First-class SVG export. |
| **[SVG.js v3.2](https://svgjs.dev/)** | Lightweight SVG manipulation/creation | ~16kb | Direct DOM-based SVG creation, chainable API, good for simple patterns and decorative elements |
| **[D3.js](https://d3js.org/)** (specifically `d3-shape`, `d3-path`, `d3-delaunay`) | Data-driven SVG generation | Modular | Bezier curve generators, Voronoi/Delaunay tessellation, area/line generators. Overkill for simple patterns but unmatched for data-driven generative art |
| **[Snap.svg](http://snapsvg.io/)** | SVG manipulation for modern browsers | ~80kb | Supports masks, patterns, gradients, clipping. Good for interactive SVG manipulation |
| **[GeoPattern](https://github.com/btmills/geopattern)** | Generate SVG patterns from strings | Small | Deterministic: same input always produces same pattern. Good for seeded decorative backgrounds |

### Key Techniques

**Bezier curve generation for organic shapes:**
Paper.js excels here. Its `Path` object supports cubic bezier curves natively, with methods for smoothing point arrays into organic curves. You define control points algorithmically (e.g., noise-driven) and Paper.js interpolates smooth paths. Export to SVG preserves the vector quality.

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
Catmull-Rom splines pass *through* all control points (unlike Bezier, which is attracted to but doesn't touch control points). This makes them ideal for generating flowing, calligraphic lines. The [`svg-catmull-rom-spline`](https://www.npmjs.com/package/svg-catmull-rom-spline) npm package converts point arrays directly to SVG path data. The [`catmullrom2bezier`](https://github.com/ariutta/catmullrom2bezier) package converts to cubic bezier for standard SVG path compatibility.

**Voronoi/Delaunay tessellation for geometric patterns:**
[`d3-delaunay`](https://d3js.org/d3-delaunay) (built on [`delaunator`](https://github.com/mapbox/delaunator), which is extremely fast) generates Voronoi diagrams from point sets. Useful for Art Deco-style geometric partitioning, mosaic patterns, or subtle background textures. Points can be noise-distributed for organic feel or grid-snapped for geometric precision.

**Generative SVG starter pattern** (from [George Francis](https://georgefrancis.dev/writing/a-generative-svg-starter-kit/)):
The approach: create an SVG element with a `viewBox`, use JavaScript to populate it with generated `<rect>`, `<circle>`, `<path>` elements using randomness and noise, style with CSS. SVG's `viewBox` makes everything resolution-independent automatically.

### Why This Matters for Our Site

SVG generation is the **primary tool** for editorial decorative elements: page dividers, section ornaments, background patterns, portfolio frame elements. Paper.js for anything organic/curved (Art Nouveau), D3 for anything geometric/tessellated (Art Deco), SVG.js for simple pattern repeats.

---

## 2. p5.js / Processing

p5.js remains the most accessible creative coding framework for the web. It's ideal for rapid prototyping of generative concepts and has a massive community producing Art-Nouveau-adjacent work.

### Current State (Early 2026)

- **Core library:** Actively maintained, stable API, runs on HTML5 Canvas by default
- **Web Editor:** [editor.p5js.org](https://editor.p5js.org/) for quick experiments
- **Community:** Huge generative art community (fxhash, Art Blocks, creative coding scene)
- **Performance:** Good for 2D, adequate for simple 3D. Not the choice for heavy real-time effects

### Export Options

| Format | Method | Notes |
|--------|--------|-------|
| PNG | `saveCanvas()` | Built-in, straightforward |
| SVG | [p5.js-svg](https://github.com/zenozeng/p5.js-svg) runtime | Replaces Canvas renderer with SVG. Some features unsupported |
| SVG (pen plotter) | [p5.plotSvg](https://github.com/golanlevin/p5.plotSvg) v0.1.8 (Jan 2026) | Path-based SVG export, optimized for vector output. Does not interfere with animation performance |
| Video | `saveFrames()` + ffmpeg | Export frame sequences, assemble externally |
| Canvas capture | `canvas.toDataURL()` / `canvas.toBlob()` | Standard browser APIs |

### Strengths for Our Use Case

- **Noise functions built in:** `noise()` (Perlin), plus community libraries for Simplex
- **Quick iteration:** Sketch → tweak parameters → export. Ideal for generating static assets (textures, patterns, backgrounds) during development
- **2D primitives:** `bezier()`, `curve()` (Catmull-Rom), `beginShape()`/`endShape()` with `curveVertex()` for flowing organic shapes
- **Blend modes:** `blendMode()` supports multiply, screen, overlay — useful for layered texture effects

### Limitations

- **Runtime overhead:** Loading p5.js (~800kb) for a production site is heavy if you only need a few generated assets. Better to generate at build time or use lighter alternatives for runtime
- **SVG export is not first-class:** The p5.js-svg runtime works but has gaps. For production SVG, generate in p5.js then trace/export manually, or use Paper.js instead
- **Canvas-bound:** Default renderer produces raster output. For resolution-independent assets, you need the SVG runtime or a post-processing step

### Verdict for Our Site

**Use p5.js as a design tool, not a production dependency.** Generate textures, patterns, and decorative elements in the p5.js editor during development, export as SVG (via p5.plotSvg or p5.js-svg) or PNG, then use the static assets in production. If we need runtime generative visuals, reach for Canvas API directly or Three.js/shaders.

---

## 3. Three.js / WebGL Shaders

Three.js is the dominant 3D/WebGL framework for the web. For our purposes, it's relevant for **generative textures**, **shader-driven backgrounds**, and **subtle interactive 3D elements**.

### Major Development: TSL (Three.js Shading Language)

The most significant development in Three.js since 2024 is **TSL** — a high-level shader abstraction that compiles to both GLSL (WebGL) and WGSL (WebGPU). This is the future of shader authoring in Three.js.

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
A collection of real-time procedural texture generators written in TSL. Includes wood, marble, fabric, stone, polka dots, and more. All run on the GPU. These can be applied to planes as backgrounds or used to texture 3D elements. Requires `WebGPURenderer` and node-based materials (`MeshStandardNodeMaterial`, etc.).

### Generative Background Approaches

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
[Codrops](https://tympanus.net/codrops/tag/webgl/) consistently publishes high-quality WebGL experiments — text effects, interactive backgrounds, image transitions. Many use Three.js + custom shaders. These serve as excellent reference for tasteful, editorial-quality WebGL.

### Lightweight Alternative: OGL

[OGL](https://github.com/oframe/ogl) is a minimal WebGL library (**8kb gzipped**, zero dependencies) with a Three.js-like API. It's ideal when you need a shader-driven background or texture but don't need Three.js's full scene graph, lighting, loaders, etc.

**When to use OGL over Three.js:**
- Single shader background / texture generation
- Performance-critical pages where bundle size matters
- When you're writing custom GLSL anyway and don't need abstractions

### Verdict for Our Site

**Three.js/TSL for any runtime 3D or complex shader effects.** The WebGPU transition is complete — we can write TSL and target all browsers. For simple shader backgrounds, consider **OGL** to keep bundle size minimal. Use **tsl-textures** as a starting point for procedural material ideas.

---

## 4. GLSL / Shader Art

Shaders are the most powerful tool for generative visuals. A fragment shader runs per-pixel on the GPU, making complex patterns, noise fields, and organic textures essentially free in performance terms.

### The Ecosystem

| Tool/Resource | Purpose | Integration |
|---------------|---------|-------------|
| **[Shadertoy](https://www.shadertoy.com/)** | Community + IDE for shader art | Browser-based. Shaders can be ported to Three.js/OGL |
| **[LYGIA](https://lygia.xyz/)** | Granular shader utility library | Multi-language (GLSL, HLSL, WGSL, MSL, **TSL**). Modular #include system. Noise, SDF, color, lighting functions |
| **[The Book of Shaders](https://thebookofshaders.com/)** | Tutorial + reference for fragment shaders | Browser examples, deep theory |
| **[Shadertoy React](https://github.com/mvilledieu/shadertoy-react)** | 6kb React component for rendering fragment shaders | Drop-in for React/Next.js projects |
| **[shader-web-background](https://github.com/xemantic/shader-web-background)** | GLSL shaders as website backgrounds | Vanilla JS, supports multipass, float textures. Shadertoy-compatible |
| **VS Code Shader Toy extension** | Live GLSL preview in editor | Real-time feedback while authoring |

### LYGIA — The Shader Standard Library

[LYGIA](https://github.com/patriciogonzalezvivo/lygia) deserves special attention. It's the largest cross-platform shader library, with battle-tested functions organized into categories:

- **`math/`** — constants (PI, TAU), interpolation, easing
- **`space/`** — scale, rotate, tile, mirror operations on UV space
- **`color/`** — luma, saturation, blend modes, palettes, color space conversion, tonemapping
- **`generative/`** — noise (Perlin, Simplex, Worley/cellular, curl), fractional Brownian motion (fBm), random
- **`sdf/`** — signed distance functions for 2D shapes (circles, boxes, lines, polygons)
- **`draw/`** — stroke, fill, digits, shapes

LYGIA supports GLSL, HLSL, WGSL, and **TSL** — meaning it can be used directly with Three.js's new shading language.

### Key Shader Techniques for Editorial Aesthetics

**Noise-based textures:**
Fractional Brownian motion (fBm) layers multiple octaves of noise to create organic, paper-like or fabric-like textures. Muted palettes + fBm noise = the "handmade" texture quality we want.

**Signed Distance Functions (SDFs) for geometric motifs:**
SDFs define shapes mathematically — circles, rounded rectangles, lines, polygons. They can be combined (union, intersection, subtraction) to create Art Deco geometric patterns. Sharp edges or soft gradients depending on how you threshold the distance field.

**Domain warping:**
Apply noise to the UV coordinates *before* sampling another noise function. This creates organic, flowing distortions — perfect for Art Nouveau-style movement and organic form.

**Gradient mapping:**
Generate a grayscale noise field, then map it through a color palette (e.g., warm parchment tones, muted golds, deep navy). This is how you get generative textures that match a specific brand palette.

### Porting Shadertoy to Production

Shadertoy uses its own uniform conventions (`iTime`, `iResolution`, `iMouse`). To use Shadertoy shaders in a web project:

1. **Three.js:** Replace Shadertoy uniforms with Three.js equivalents (`time`, `resolution` as custom uniforms). Felix Rieseberg's [guide](https://felixrieseberg.com/using-webgl-shadertoy-shaders-in-three-js/) covers this process
2. **shader-web-background:** Directly Shadertoy-compatible — paste the shader code, it handles uniforms
3. **Shadertoy React:** 6kb React component, handles the translation automatically

### Verdict for Our Site

**LYGIA + TSL is the shader strategy.** Use LYGIA's noise, SDF, and color functions within TSL shaders for Three.js. Prototype in Shadertoy or VS Code extension, then port to production. For simple backgrounds without Three.js overhead, use `shader-web-background` or `shadertoy-react`.

---

## 5. Canvas API — Generative Patterns & Noise Textures

The Canvas 2D API is the lightest-weight option for generating raster textures at runtime or build time. No library dependencies required — just browser APIs.

### Noise Libraries

| Library | Size | Dimensions | Notes |
|---------|------|------------|-------|
| **[simplex-noise](https://github.com/jwagner/simplex-noise.js)** | ~2kb gzip | 2D, 3D, 4D | Fast (~20ns per 2D sample), TypeScript, zero deps, seedable. **Recommended** |
| **[open-simplex-noise](https://github.com/joshforisha/open-simplex-noise-js)** | Small | 2D, 3D, 4D | TypeScript, seedable. OpenSimplex algorithm (patent-free) |
| **[noisejs](https://github.com/josephg/noisejs)** | Tiny | 2D, 3D | Perlin + Simplex. Older but proven |

### Generative Texture Recipes

**Paper/parchment texture:**
```javascript
// Conceptual: layered noise for paper texture
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
Use noise to define angle at each point in a grid. Draw particles that follow the flow. The result: organic, hair-like patterns reminiscent of Art Nouveau line work. Export the particle paths as SVG polylines for vector output.

**Reaction-diffusion patterns:**
The [Gray-Scott model](https://github.com/jasonwebb/reaction-diffusion-playground) produces organic, Turing-pattern textures (spots, stripes, labyrinthine structures). These resemble biological and Art Nouveau organic motifs. Can run on Canvas (CPU) or as a WebGL shader (GPU, much faster). Jason Webb's [Reaction-Diffusion Playground](https://jasonwebb.github.io/reaction-diffusion-playground/) is an excellent interactive reference.

### Canvas to Production Asset

Canvas generates raster (bitmap) data. To get production-ready assets:
- **PNG/WebP export:** `canvas.toBlob('image/webp', quality)` or `canvas.toDataURL('image/png')`
- **High-DPI:** Generate at 2x or 3x the display size, then serve with `srcset`
- **Build-time generation:** Run Canvas code in Node.js via [`node-canvas`](https://github.com/Automattic/node-canvas) (uses native Cairo) or Puppeteer (headless Chrome). Generate textures during `npm run build`, output to `public/` as optimized WebP

### Verdict for Our Site

**Canvas API for build-time texture generation.** Use `simplex-noise` + Canvas to generate paper textures, noise gradients, and subtle background patterns at build time. Export as WebP for production. For runtime effects, prefer shaders (GPU) over Canvas (CPU).

---

## 6. CSS-Based Generative Effects

Pure CSS can create surprising texture-like effects with zero JavaScript, zero image downloads, and infinite scalability. These are the lightest-weight option and should be the **first reach** for subtle background effects.

### Technique Catalog

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
[CSS-Tricks' grainy gradient technique](https://css-tricks.com/grainy-gradients/): use an SVG `<feTurbulence>` filter to generate noise, layer it under a gradient, then boost brightness/contrast to create a dithered, organic texture. No JavaScript, no image files. The result looks like risograph printing or film grain.

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
Layer colored elements and blend them for complex color interactions. `multiply` darkens overlaps, `screen` lightens, `overlay` adds contrast. These create organic color variation without any generated assets.

**CSS `mask-image` with gradients:**
Use gradient masks to create vignettes, fade edges, and shaped reveals. Combined with generated textures (SVG or Canvas), masks create refined editorial effects.

### CSS Paint API (Houdini)

The [CSS Paint API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Painting_API) lets you write JavaScript "paint worklets" that draw directly into an element's background using a Canvas-like API. This enables **generative CSS backgrounds with full algorithmic control**.

**Current status (early 2026):**
- Chrome/Edge: native support
- Firefox: behind a flag
- Safari: not supported natively
- **Polyfill available:** [css-paint-polyfill](https://github.com/nicolo-ribaudo/css-paint-polyfill) brings support to all modern browsers
- [Houdini.how](https://web.dev/articles/houdini-how) — community worklet showcase, all backed by the polyfill

**Example:** George Francis's [generative "fleck" patterns](https://codepen.io/georgedoescode/pen/eYvjOMN) via Houdini Paint API — seeded randomness produces deterministic generative patterns that can be applied to any element's background via CSS.

**Caveat:** The polyfill adds weight and complexity. For production use, evaluate whether a build-time Canvas approach is simpler.

### Verdict for Our Site

**CSS effects are the baseline layer.** Use layered gradients for page-level ambiance, the grainy gradient technique for editorial texture, and `repeating-linear-gradient` for geometric accents. These load instantly, cost nothing, and set the foundation that heavier techniques (Canvas, shaders) build on top of.

---

## 7. Art Nouveau / Art Deco Computational Patterns

There are no dedicated "Art Nouveau pattern libraries" for the web — but the mathematical DNA of both movements is well-understood and highly amenable to generative code.

### Art Nouveau: The Organic Vocabulary

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

### Art Deco: The Geometric Vocabulary

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

### Hybrid Approach: Art Nouveau Polish + Art Deco Structure

For the Asimov aesthetic, the sweet spot is **Art Deco's structural discipline with Art Nouveau's organic softness**:

- **Geometric grid with organic fills:** Use Art Deco proportions and symmetry for overall layout, then fill cells/panels with noise-based organic textures
- **Structured curves:** Start with geometric arcs (Art Deco fans, radial forms), then slightly perturb with noise for a lived-in quality
- **Metallic-to-matte palette:** Gold/warm tones (Art Deco) but with the muted, flat treatment of Art Nouveau
- **Decorative borders that breathe:** Geometric overall structure, organic interior detail (like a Mucha poster frame)

### Specific Code Approaches

**Noise-modulated geometric pattern:**
```javascript
// Generate Art Deco sunburst with organic perturbation
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

### Verdict for Our Site

**No off-the-shelf library needed — the techniques map cleanly.** Art Nouveau = noise-perturbed splines (Paper.js + simplex-noise). Art Deco = parametric geometry (SVG generation, CSS gradients). The hybrid = geometric structure with organic softening. Build a small utility library of pattern generators specific to our design language.

---

## 8. Export Workflows — Code to Production Asset

The final question: how do you get from a generative code sketch to a production-ready asset that loads fast and looks sharp?

### Workflow Matrix

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

### Recommended Production Pipeline

**For static generative assets (textures, patterns, backgrounds):**

```
1. Author in p5.js editor or custom Canvas/SVG script
2. Export:
   - Vector elements → SVG → SVGO optimization
   - Raster textures → PNG at 2x resolution
3. Build-time processing (via Sharp in build script):
   - Convert PNG → WebP (quality 80-85)
   - Generate srcset variants (1x, 2x)
   - Generate AVIF variant for cutting-edge browsers
4. Serve via <picture> element or CSS with format fallbacks
```

**For runtime generative visuals (interactive backgrounds, living textures):**

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

**For build-time generation in a Next.js/Astro pipeline:**

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

### Format Recommendations

| Use Case | Format | Why |
|----------|--------|-----|
| Decorative elements, borders, icons | SVG | Vector, scalable, styleable, tiny file size |
| Background textures, noise patterns | WebP | 25-35% smaller than JPEG, universal support, lossy OK |
| Textures needing transparency | WebP (lossy+alpha) or PNG | WebP supports alpha with lossy compression |
| Animated textures | WebP animated, or CSS/shader at runtime | Animated WebP for precomposed, shaders for interactive |
| High-quality photography | AVIF (primary) + WebP (fallback) | AVIF is 50% smaller than JPEG. Use `<picture>` for fallback |

---

## Summary: Tool Selection for Our Site

### The Stack (Recommended)

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
- **AI image generation** (out of scope; this is about authored, deterministic, code-generated assets)

### Performance Budget Guidance

For an Asimov-quality editorial site, visual polish must not come at the cost of loading speed:

- **CSS effects:** 0kb additional (built into the stylesheet)
- **SVG decorative elements:** typically 1-5kb each after SVGO
- **Noise library (simplex-noise):** ~2kb gzipped
- **WebGL background (OGL):** ~8kb gzipped + shader code
- **WebGL background (Three.js):** ~150kb+ gzipped (only if we need 3D features beyond flat shaders)
- **Generated textures (WebP):** 10-50kb each at appropriate quality
- **Total visual layer budget:** aim for under 100kb total for all generative/decorative assets

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
