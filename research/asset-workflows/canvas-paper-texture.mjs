/**
 * canvas-paper-texture.mjs
 * ========================
 * Generates a paper/parchment texture in Mission Asimov's warm palette.
 *
 * Technique: Layered simplex noise at multiple frequencies ("octaves"),
 * mapped through the project's warm color palette. Three noise layers
 * simulate the visual structure of real paper:
 *   1. Large-scale tonal variation (the overall warmth gradient)
 *   2. Medium-scale fiber texture (the weave/grain of the paper)
 *   3. Fine-scale speckle (individual fiber and dust particles)
 *
 * The result looks like aged parchment or handmade cotton paper --
 * warm off-white, never pure white, with the "hand quality" and
 * material consciousness central to Julianna's design language.
 *
 * Dependencies:
 *   npm install simplex-noise @napi-rs/canvas
 *
 * Usage:
 *   node canvas-paper-texture.mjs
 *   node canvas-paper-texture.mjs --width 2048 --height 2048 --seed 42
 *
 * Output:
 *   paper-texture.png (in the current directory)
 */

import { createCanvas } from '@napi-rs/canvas';
import { createNoise2D } from 'simplex-noise';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Parse simple --flag value pairs from argv */
function parseArgs() {
  const args = process.argv.slice(2);
  const config = { width: 1024, height: 1024, seed: undefined, output: 'paper-texture.png' };
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace(/^--/, '');
    const val = args[i + 1];
    if (key === 'width') config.width = parseInt(val, 10);
    if (key === 'height') config.height = parseInt(val, 10);
    if (key === 'seed') config.seed = parseInt(val, 10);
    if (key === 'output') config.output = val;
  }
  return config;
}

const config = parseArgs();
const { width, height, output } = config;

// ---------------------------------------------------------------------------
// Design DNA -- Color Palette
// ---------------------------------------------------------------------------
// From visual-analysis-notes.md: "Warm off-white, never pure white.
// Think aged paper, not screen white."

/** Parse a hex color string into [r, g, b] */
function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

/** Linearly interpolate between two [r,g,b] colors */
function lerpColor(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

// The paper texture lives in the lightest part of our palette:
// from cream/warm-white to a slightly warmer tone.
const COLOR_LIGHTEST = hexToRgb('#F5F0E8'); // Cream -- the warm off-white background
const COLOR_MID      = hexToRgb('#EDE6D8'); // Slightly warmer -- visible paper grain
const COLOR_DARK     = hexToRgb('#D4CCBE'); // Warm gray undertone -- deepest shadows in the paper
const COLOR_WARM_HIT = hexToRgb('#D4A76A'); // Amber -- very subtle warm flecks

// ---------------------------------------------------------------------------
// Seeded random number generator (simple mulberry32)
// ---------------------------------------------------------------------------
// Used as the seed function for simplex-noise, so outputs are reproducible.

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const seedValue = config.seed ?? Math.floor(Math.random() * 100000);
console.log(`Seed: ${seedValue}`);

// Create two independent noise generators (different seeds for variety)
const rng1 = mulberry32(seedValue);
const rng2 = mulberry32(seedValue + 7919); // offset by a prime
const rng3 = mulberry32(seedValue + 15485863);

const noise2D_large  = createNoise2D(rng1);
const noise2D_medium = createNoise2D(rng2);
const noise2D_fine   = createNoise2D(rng3);

// ---------------------------------------------------------------------------
// Generate texture
// ---------------------------------------------------------------------------

console.log(`Generating ${width}x${height} paper texture...`);

const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');
const imageData = ctx.createImageData(width, height);
const data = imageData.data; // Uint8ClampedArray [r, g, b, a, r, g, b, a, ...]

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    // ------------------------------------------------------------------
    // Layer 1: Large-scale tonal variation
    // Low frequency noise (scale ~0.001-0.003) creates broad warm/cool
    // zones across the paper, like the natural variation in handmade
    // sheets where pulp thickness varies.
    // ------------------------------------------------------------------
    const largeNoise = noise2D_large(x * 0.002, y * 0.002);
    // Normalize from [-1,1] to [0,1]
    const largeval = largeNoise * 0.5 + 0.5;

    // ------------------------------------------------------------------
    // Layer 2: Medium-scale fiber grain
    // Medium frequency (~0.02-0.05) creates the visible fiber direction
    // and grain structure. Slightly anisotropic (different x/y scale)
    // to suggest a paper-making direction, like real laid paper.
    // ------------------------------------------------------------------
    const medNoise = noise2D_medium(x * 0.03, y * 0.045);
    // Reduced amplitude -- grain is subtle
    const medval = medNoise * 0.12;

    // ------------------------------------------------------------------
    // Layer 3: Fine speckle / dust particles
    // High frequency (~0.1-0.3) creates individual particle texture.
    // This gives the stipple/grain quality described in the visual
    // analysis: "stipple and grain over smooth gradients."
    // ------------------------------------------------------------------
    const fineNoise = noise2D_fine(x * 0.15, y * 0.15);
    // Very low amplitude -- speckle is felt more than seen
    const fineval = fineNoise * 0.05;

    // ------------------------------------------------------------------
    // Combine layers and map to palette
    // ------------------------------------------------------------------
    // Total value: ~0 to ~1, biased toward the middle
    const combined = Math.max(0, Math.min(1, largeval + medval + fineval));

    // Map through the palette:
    // 0.0-0.6 -> lightest to mid (most of the paper is light)
    // 0.6-0.85 -> mid to dark (shadows and deeper grain)
    // 0.85-1.0 -> occasional warm amber flecks
    let rgb;
    if (combined < 0.6) {
      const t = combined / 0.6;
      rgb = lerpColor(COLOR_LIGHTEST, COLOR_MID, t);
    } else if (combined < 0.85) {
      const t = (combined - 0.6) / 0.25;
      rgb = lerpColor(COLOR_MID, COLOR_DARK, t);
    } else {
      // Rare warm flecks -- like oxidation spots on aged paper
      const t = (combined - 0.85) / 0.15;
      rgb = lerpColor(COLOR_DARK, COLOR_WARM_HIT, t * 0.3); // Only 30% toward amber
    }

    // ------------------------------------------------------------------
    // Add a tiny amount of per-pixel random variation
    // This prevents banding and adds the "alive" quality of real paper.
    // ------------------------------------------------------------------
    const dither = (Math.random() - 0.5) * 3; // +/- 1.5 levels

    const idx = (y * width + x) * 4;
    data[idx + 0] = Math.max(0, Math.min(255, rgb[0] + dither));
    data[idx + 1] = Math.max(0, Math.min(255, rgb[1] + dither));
    data[idx + 2] = Math.max(0, Math.min(255, rgb[2] + dither));
    data[idx + 3] = 255; // Fully opaque
  }
}

ctx.putImageData(imageData, 0, 0);

// ---------------------------------------------------------------------------
// Optional: Add a subtle vignette
// ---------------------------------------------------------------------------
// Darkens the edges slightly, giving the paper a "held in your hands" feel.
// Uses a radial gradient overlay with multiply-like blending.

const vignetteCanvas = createCanvas(width, height);
const vCtx = vignetteCanvas.getContext('2d');
const gradient = vCtx.createRadialGradient(
  width / 2, height / 2, Math.min(width, height) * 0.3,  // Inner circle
  width / 2, height / 2, Math.max(width, height) * 0.7   // Outer circle
);
gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');       // Center: no darkening
gradient.addColorStop(1, 'rgba(0, 0, 0, 0.06)');    // Edges: very subtle darkening
vCtx.fillStyle = gradient;
vCtx.fillRect(0, 0, width, height);

// Composite the vignette onto the paper
ctx.globalCompositeOperation = 'multiply';
ctx.drawImage(vignetteCanvas, 0, 0);
ctx.globalCompositeOperation = 'source-over'; // Reset

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

const outputPath = resolve(output);
const buffer = canvas.toBuffer('image/png');
writeFileSync(outputPath, buffer);

console.log(`Wrote ${buffer.length} bytes to ${outputPath}`);
console.log('Done.');
