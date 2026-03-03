/**
 * svg-stipple-field.mjs
 * =====================
 * Generates an SVG stipple/dot field texture with variable density
 * and organic edge dissolution.
 *
 * This implements the "stipple as texture language" identified in
 * Julianna's Pinterest board analysis: "thousands of tiny marks
 * creating mass, atmosphere, and depth."
 *
 * Technique:
 *   1. Create a grid of candidate dot positions
 *   2. Apply simplex noise to modulate dot density -- denser in some
 *      areas, sparser in others, creating organic "mass" and "void"
 *   3. Apply an edge fade function so stipple dissolves at the
 *      boundaries, matching the "edge dissolution" quality in the
 *      design DNA: "things bleed, fade, dissolve at boundaries"
 *   4. Vary dot radius slightly with noise for hand-drawn quality
 *   5. Output pure SVG via string concatenation (no browser needed)
 *
 * The output uses the project's warm palette -- dots are warm gray
 * to terracotta on a cream/transparent background.
 *
 * Dependencies:
 *   npm install simplex-noise
 *
 * Usage:
 *   node svg-stipple-field.mjs
 *   node svg-stipple-field.mjs --width 800 --height 600 --seed 42 --density 0.6
 *
 * Output:
 *   stipple-field.svg (in the current directory)
 */

import { createNoise2D } from 'simplex-noise';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    width: 800,
    height: 600,
    seed: undefined,
    density: 0.55,      // 0-1, controls overall dot density
    output: 'stipple-field.svg',
    transparent: false,  // If true, no background rect
  };
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace(/^--/, '');
    const val = args[i + 1];
    if (key === 'width') config.width = parseInt(val, 10);
    if (key === 'height') config.height = parseInt(val, 10);
    if (key === 'seed') config.seed = parseInt(val, 10);
    if (key === 'density') config.density = parseFloat(val);
    if (key === 'output') config.output = val;
    if (key === 'transparent') config.transparent = val === 'true';
  }
  return config;
}

const config = parseArgs();
const { width, height, density, output, transparent } = config;

// ---------------------------------------------------------------------------
// Design DNA -- Colors
// ---------------------------------------------------------------------------
// Dots range from warm gray to terracotta, with opacity variation.
// This creates depth: lighter dots recede, darker ones come forward.

const DOT_COLORS = [
  { hex: '#B5AFA6', weight: 4 },   // Warm gray -- most common
  { hex: '#C4724E', weight: 2 },   // Terracotta -- occasional warmth
  { hex: '#C9A5A0', weight: 2 },   // Dusty rose -- subtle variation
  { hex: '#7A8B9A', weight: 1 },   // Slate blue-gray -- rare cool counterpoint
  { hex: '#D4A76A', weight: 1 },   // Amber -- rare warm fleck
];

// Build a weighted selection array
const colorPool = [];
for (const c of DOT_COLORS) {
  for (let i = 0; i < c.weight; i++) {
    colorPool.push(c.hex);
  }
}

const BACKGROUND_COLOR = '#F5F0E8'; // Cream

// ---------------------------------------------------------------------------
// Seeded RNG (mulberry32)
// ---------------------------------------------------------------------------

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

const rng = mulberry32(seedValue);
const noise2D = createNoise2D(mulberry32(seedValue + 1));
const noise2D_size = createNoise2D(mulberry32(seedValue + 2));

// ---------------------------------------------------------------------------
// Dot generation
// ---------------------------------------------------------------------------

/**
 * Edge fade function.
 * Returns 0 at the edges, 1 at the center. The transition is smooth
 * (uses a cosine curve) and starts at `margin` pixels from each edge.
 *
 * This creates the "dissolving at edges" quality -- stipple fields
 * that fade into whitespace rather than being hard-cropped.
 */
function edgeFade(x, y, w, h, margin) {
  const fadeX = x < margin
    ? (1 - Math.cos((x / margin) * Math.PI)) * 0.5
    : x > w - margin
      ? (1 - Math.cos(((w - x) / margin) * Math.PI)) * 0.5
      : 1;
  const fadeY = y < margin
    ? (1 - Math.cos((y / margin) * Math.PI)) * 0.5
    : y > h - margin
      ? (1 - Math.cos(((h - y) / margin) * Math.PI)) * 0.5
      : 1;
  return fadeX * fadeY;
}

console.log(`Generating ${width}x${height} stipple field (density: ${density})...`);

const dots = [];

// Grid spacing determines maximum dot density.
// Smaller spacing = more potential dots = finer stipple.
const baseSpacing = 4; // pixels between grid positions
const margin = Math.min(width, height) * 0.15; // 15% edge fade zone

for (let y = baseSpacing; y < height - baseSpacing; y += baseSpacing) {
  for (let x = baseSpacing; x < width - baseSpacing; x += baseSpacing) {
    // ----- Noise-based density modulation -----
    // Low-frequency noise creates organic regions of high and low density.
    // This is what makes the stipple feel like "mass" rather than uniform fill.
    const densityNoise = noise2D(x * 0.005, y * 0.005);
    // Map from [-1, 1] to [0, 1] and apply density parameter
    const localDensity = (densityNoise * 0.5 + 0.5) * density;

    // ----- Edge dissolution -----
    const fade = edgeFade(x, y, width, height, margin);

    // ----- Placement decision -----
    // A dot appears if a random value falls below the combined probability.
    // Higher density + further from edge = more likely to place a dot.
    const threshold = localDensity * fade;
    if (rng() > threshold) continue; // Skip -- no dot here

    // ----- Position jitter -----
    // Offset from the grid to avoid mechanical regularity.
    // The "hand quality" means nothing should look grid-snapped.
    const jitterX = (rng() - 0.5) * baseSpacing * 1.2;
    const jitterY = (rng() - 0.5) * baseSpacing * 1.2;
    const dotX = x + jitterX;
    const dotY = y + jitterY;

    // Ensure dot stays within bounds
    if (dotX < 1 || dotX > width - 1 || dotY < 1 || dotY > height - 1) continue;

    // ----- Dot radius -----
    // Varies with noise for organic feel. Smaller dots in sparser areas,
    // slightly larger in denser areas (like ink pooling on paper).
    const sizeNoise = noise2D_size(dotX * 0.01, dotY * 0.01);
    const baseRadius = 0.5 + localDensity * 1.2;
    const radius = Math.max(0.3, baseRadius + sizeNoise * 0.4);

    // ----- Color selection -----
    const colorIdx = Math.floor(rng() * colorPool.length);
    const color = colorPool[colorIdx];

    // ----- Opacity -----
    // Varies to create depth. Dots in sparse areas are more transparent
    // (they're "fading away"). Dots in dense areas are more opaque.
    const opacity = 0.25 + localDensity * fade * 0.65;

    dots.push({ x: dotX, y: dotY, r: radius, color, opacity });
  }
}

console.log(`Generated ${dots.length} dots.`);

// ---------------------------------------------------------------------------
// SVG assembly
// ---------------------------------------------------------------------------
// Pure string construction -- no DOM, no browser. This runs in any
// Node.js environment.

const svgLines = [];
svgLines.push(`<?xml version="1.0" encoding="UTF-8"?>`);
svgLines.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`);
svgLines.push(`  <!-- Generated by svg-stipple-field.mjs | Seed: ${seedValue} | Density: ${density} | Dots: ${dots.length} -->`);

// Background (optional)
if (!transparent) {
  svgLines.push(`  <rect width="${width}" height="${height}" fill="${BACKGROUND_COLOR}" />`);
}

// Group all dots for potential CSS styling
svgLines.push(`  <g class="stipple-field">`);

for (const dot of dots) {
  // Round values to reduce SVG file size (fewer decimal places)
  const cx = dot.x.toFixed(1);
  const cy = dot.y.toFixed(1);
  const r = dot.r.toFixed(2);
  const op = dot.opacity.toFixed(2);

  svgLines.push(`    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${dot.color}" opacity="${op}" />`);
}

svgLines.push(`  </g>`);
svgLines.push(`</svg>`);

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

const svgContent = svgLines.join('\n');
const outputPath = resolve(output);
writeFileSync(outputPath, svgContent, 'utf-8');

const sizeKB = (Buffer.byteLength(svgContent, 'utf-8') / 1024).toFixed(1);
console.log(`Wrote ${sizeKB} KB to ${outputPath}`);
console.log('Done.');
console.log('');
console.log('Tip: For production use, optimize with SVGO:');
console.log(`  npx svgo ${output} -o stipple-field.min.svg`);
