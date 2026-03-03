# Asset Generation Workflows -- Mission Asimov

Practical starter scripts and prompt templates for generating visual assets in the Mission Asimov design language. Each workflow produces assets that embody the project's core visual qualities: restraint, warmth, hand-quality, atmospheric texture, and generous whitespace.

These workflows are **research artifacts** -- they demonstrate techniques from the computational graphics pipeline research (`03-computational-graphics-pipeline.md`) applied to the specific palette and texture vocabulary extracted from Julianna's work (`03-visual-analysis-notes.md`).

## Design DNA Reference

All scripts and prompts use this palette:

| Color | Hex | Role |
|-------|-----|------|
| Terracotta | `#C4724E` | Primary warmth |
| Amber | `#D4A76A` | Primary warmth |
| Cream | `#F5F0E8` | Background (never pure white) |
| Warm gray | `#B5AFA6` | Structure, line work |
| Sage | `#8B9E7E` | Secondary (sparingly) |
| Dusty rose | `#C9A5A0` | Secondary |
| Slate blue-gray | `#7A8B9A` | Secondary (rare cool counterpoint) |
| Coral red | `#C95D45` | Accent (sparingly, narratively) |

## Workflows

### 1. Canvas Paper Texture (`canvas-paper-texture.mjs`)

**What it does:** Generates a paper/parchment texture using layered simplex noise mapped through the warm palette. Three noise octaves simulate real paper structure: large-scale tonal variation, medium-scale fiber grain, and fine-scale speckle. Includes a subtle edge vignette.

**Output:** PNG file (default: `paper-texture.png`)

**Dependencies:**
```bash
npm install simplex-noise @napi-rs/canvas
```

> **Note on `@napi-rs/canvas`:** This is a native Canvas implementation for Node.js. If you have trouble installing it (requires Rust toolchain on some platforms), you can substitute `canvas` (the `node-canvas` package, which requires Cairo) -- the API is the same. Change the import to `import { createCanvas } from 'canvas';`.

**Usage:**
```bash
# Default: 1024x1024 with random seed
node canvas-paper-texture.mjs

# Custom size and reproducible seed
node canvas-paper-texture.mjs --width 2048 --height 2048 --seed 42

# Custom output path
node canvas-paper-texture.mjs --output public/textures/paper.png
```

**Technique:** Fractional Brownian motion (fBm) -- layering noise at multiple frequencies to create organic, natural-looking texture. The same technique used in film VFX for procedural material generation.

---

### 2. SVG Stipple Field (`svg-stipple-field.mjs`)

**What it does:** Generates an SVG file containing a stipple/dot field with variable density and organic edge dissolution. Dots range in color from warm gray to terracotta, with opacity variation creating atmospheric depth. The stipple dissolves smoothly at the edges rather than being hard-cropped.

**Output:** SVG file (default: `stipple-field.svg`)

**Dependencies:**
```bash
npm install simplex-noise
```

**Usage:**
```bash
# Default: 800x600 at 55% density
node svg-stipple-field.mjs

# Custom size, density, and seed
node svg-stipple-field.mjs --width 1200 --height 400 --density 0.7 --seed 42

# Transparent background (no background rect)
node svg-stipple-field.mjs --transparent true

# Custom output
node svg-stipple-field.mjs --output public/decorations/stipple.svg
```

**Post-processing:** Optimize the SVG for production with SVGO:
```bash
npx svgo stipple-field.svg -o stipple-field.min.svg
```

**Technique:** Noise-modulated rejection sampling on a jittered grid. Each grid position is a candidate for a dot; simplex noise modulates the probability of placement, creating organic dense/sparse zones. An edge-fade function smoothly reduces probability near boundaries.

---

### 3. CSS Grain Overlay (`css-grain-overlay.html`)

**What it does:** A standalone HTML demo showing the CSS grainy gradient technique -- SVG `feTurbulence` filters combined with layered CSS radial gradients, all in the project palette. Demonstrates three variants: light (cream base), dark (warm dark base), and coarse stipple (risograph quality).

**Output:** Open directly in a browser -- no build step, no dependencies.

**Usage:**
```bash
# Open in default browser
open css-grain-overlay.html

# Or just double-click the file
```

The page includes interactive controls (bottom-right corner) to adjust grain opacity and blend mode in real time.

**Technique:** SVG `feTurbulence` generates procedural Perlin noise on the GPU. `feComponentTransfer` increases contrast to make the grain visible. The noise is applied via a CSS `filter` on a pseudo-element, then blended into the gradient background using `mix-blend-mode`. Zero JavaScript required for the effect itself.

**Three variants demonstrated:**
- **Light** -- Fine grain (baseFrequency: 0.65), soft-light blend. Subtle paper quality.
- **Dark** -- Same grain on dark warm base. For hero sections or dark mode.
- **Coarse** -- Lower frequency (0.35), multiply blend. Visible risograph/monoprint quality.

---

### 4. Midjourney Prompts (`midjourney-prompts.md`)

**What it contains:** 8 carefully crafted Midjourney prompt templates covering:

1. Hero image (atmospheric landscape)
2. Texture background (paper/parchment, tileable)
3. Architectural portfolio backdrop
4. Decorative element (stipple field)
5. Section divider (organic line)
6. Collage element (material fragment)
7. Botanical element (hand-drawn tree)
8. Abstract pattern (watercolor wash)

Each prompt includes recommended `--ar`, `--stylize`, and other parameters, plus variants for different use cases. Also includes a `--sref` (style reference) strategy for maintaining consistency across generations.

---

### 5. GPT Image API Prompts (`gpt-image-prompts.md`)

**What it contains:** 8 prompt templates formatted for OpenAI's GPT Image API (gpt-image-1 / DALL-E 3), covering similar asset types as the Midjourney prompts but optimized for the API's strengths:

1. Hero image (landscape)
2. Texture background (handmade paper)
3. Stipple field (transparent background)
4. Architectural portfolio backdrop
5. Section divider (transparent)
6. Material fragment (collage element, transparent)
7. Botanical element (tree portrait, transparent)
8. Typography texture (letterform with grain)

Includes full API call structure (JSON), cURL examples, a Node.js helper function, and a batch generation script. Emphasizes transparent background support and text rendering capabilities.

---

## Quick Start

Install shared dependencies for the Node.js scripts:
```bash
npm install simplex-noise @napi-rs/canvas
```

Generate a sample of each code-based asset:
```bash
node canvas-paper-texture.mjs --seed 42
node svg-stipple-field.mjs --seed 42
open css-grain-overlay.html
```

## Production Integration

These scripts are designed to slot into a build pipeline. When the tech stack is chosen (Next.js or Astro), these workflows can be:

1. **Run at build time** via `scripts/generate-textures.mjs` to produce static assets
2. **Optimized via Sharp** for WebP/AVIF output with responsive `srcset` variants
3. **Cached** -- seeded randomness means the same seed always produces the same output, so assets only need regenerating when parameters change
4. **CSS grain** can be copied directly into the site's stylesheet -- no build step needed

## File Inventory

```
research/asset-workflows/
  README.md                  # This file
  canvas-paper-texture.mjs   # Node.js -- generates paper texture PNG
  svg-stipple-field.mjs      # Node.js -- generates stipple SVG
  css-grain-overlay.html     # Browser -- CSS grain demo (no deps)
  midjourney-prompts.md      # Midjourney prompt templates
  gpt-image-prompts.md       # GPT Image API prompt templates
```
