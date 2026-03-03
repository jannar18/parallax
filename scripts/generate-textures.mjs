#!/usr/bin/env node

/**
 * generate-textures.mjs — Build-time texture asset generator
 *
 * Generates paper grain textures and stipple SVGs for the Parallax site.
 * Outputs to public/textures/ for static serving.
 *
 * Usage:
 *   node scripts/generate-textures.mjs
 *
 * Dependencies (devDependencies):
 *   - sharp (image optimization)
 *
 * Approach:
 *   1. Paper textures: Generated as SVG with feTurbulence, then rasterized
 *      via sharp if available (otherwise kept as SVG for CSS background-image).
 *   2. Stipple patterns: Generated as optimized SVG files with seeded PRNG dots.
 *
 * Asset budget: < 100KB total for the 1x load path.
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "public", "textures");

// Ensure output directory exists
if (!existsSync(OUT_DIR)) {
  mkdirSync(OUT_DIR, { recursive: true });
}

// ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────
function mulberry32(seed) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Brand Colors ─────────────────────────────────────────────────────────
const COLORS = {
  cream: "#F5F0E8",
  ink: "#2C2824",
  terracotta: "#C4724E",
  warmGray: "#B5AFA6",
};

// ── 1. Paper Grain SVG Tiles ─────────────────────────────────────────────

function generatePaperGrainSVG(variant) {
  const configs = {
    fine: { baseFrequency: "0.65", octaves: 3, size: 256 },
    coarse: { baseFrequency: "0.3", octaves: 2, size: 256 },
    paper: { baseFrequency: "0.45 0.55", octaves: 4, size: 256 },
  };

  const config = configs[variant];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${config.size}" height="${config.size}" viewBox="0 0 ${config.size} ${config.size}">
  <filter id="grain-${variant}" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="${config.baseFrequency}" numOctaves="${config.octaves}" stitchTiles="stitch" result="noise"/>
    <feColorMatrix type="saturate" values="0" in="noise" result="mono"/>
  </filter>
  <rect width="${config.size}" height="${config.size}" filter="url(#grain-${variant})"/>
</svg>`;
}

// ── 2. Stipple Pattern SVGs ──────────────────────────────────────────────

function generateStippleSVG({
  count = 600,
  width = 200,
  height = 200,
  dotRadius = 1.0,
  seed = 42,
  color = COLORS.ink,
  fadeAtEdges = true,
}) {
  const rng = mulberry32(seed);
  const dots = [];

  for (let i = 0; i < count; i++) {
    const x = rng() * width;
    const y = rng() * height;

    if (fadeAtEdges) {
      const dx = (x - width / 2) / (width / 2);
      const dy = (y - height / 2) / (height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (rng() < dist * 0.6) continue;
    }

    const r = dotRadius * (0.5 + rng() * 1.0);
    dots.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="${color}"/>`);
  }

  const maskDef = fadeAtEdges
    ? `<defs>
    <radialGradient id="fade">
      <stop offset="0%" stop-color="white" stop-opacity="1"/>
      <stop offset="55%" stop-color="white" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
    <mask id="edge-fade">
      <rect width="${width}" height="${height}" fill="url(#fade)"/>
    </mask>
  </defs>`
    : "";

  const groupAttrs = fadeAtEdges ? ` mask="url(#edge-fade)"` : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  ${maskDef}
  <g${groupAttrs}>
    ${dots.join("\n    ")}
  </g>
</svg>`;
}

// ── 3. Watercolor Wash SVG ──────────────────────────────────────────────

function generateWatercolorWashSVG({ color = COLORS.terracotta, width = 400, height = 200 }) {
  // Parse hex to RGB
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <filter id="watercolor-warp">
    <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="5" result="warp"/>
    <feDisplacementMap in="SourceGraphic" in2="warp" scale="40" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <g filter="url(#watercolor-warp)">
    <ellipse cx="${width * 0.5}" cy="${height * 0.5}" rx="${width * 0.4}" ry="${height * 0.35}"
      fill="rgba(${r},${g},${b},0.35)"/>
    <ellipse cx="${width * 0.45}" cy="${height * 0.55}" rx="${width * 0.3}" ry="${height * 0.25}"
      fill="rgba(${r},${g},${b},0.25)"/>
  </g>
</svg>`;
}

// ── Generate All Assets ──────────────────────────────────────────────────

async function main() {
  console.log("Generating texture assets...\n");

  const assets = [];

  // Paper grain tiles (3 variants)
  for (const variant of ["fine", "coarse", "paper"]) {
    const svg = generatePaperGrainSVG(variant);
    const filename = `grain-${variant}.svg`;
    const filepath = join(OUT_DIR, filename);
    writeFileSync(filepath, svg, "utf-8");
    assets.push({ name: filename, size: Buffer.byteLength(svg, "utf-8") });
  }

  // Stipple patterns (tuned to stay within 100KB total budget)
  const stippleConfigs = [
    { name: "stipple-sparse.svg", count: 200, seed: 17, dotRadius: 0.8 },
    { name: "stipple-dense.svg", count: 500, seed: 42, dotRadius: 1.0 },
    { name: "stipple-terracotta.svg", count: 350, seed: 99, dotRadius: 1.2, color: COLORS.terracotta },
  ];

  for (const config of stippleConfigs) {
    const { name, ...opts } = config;
    const svg = generateStippleSVG(opts);
    const filepath = join(OUT_DIR, name);
    writeFileSync(filepath, svg, "utf-8");
    assets.push({ name, size: Buffer.byteLength(svg, "utf-8") });
  }

  // Watercolor wash
  const washSvg = generateWatercolorWashSVG({ color: COLORS.terracotta });
  const washFilename = "wash-terracotta.svg";
  writeFileSync(join(OUT_DIR, washFilename), washSvg, "utf-8");
  assets.push({ name: washFilename, size: Buffer.byteLength(washSvg, "utf-8") });

  // Note: Grain textures are rendered via inline SVG feTurbulence in the
  // GrainOverlay component. The SVG files here serve as documentation and
  // fallback reference. No WebP rasterization needed — the inline SVG
  // approach is lighter and renders identically across modern browsers.

  // Summary
  console.log("Generated assets:");
  let totalSize = 0;
  for (const asset of assets) {
    const sizeKB = (asset.size / 1024).toFixed(1);
    console.log(`  ${asset.name.padEnd(30)} ${sizeKB} KB`);
    totalSize += asset.size;
  }
  console.log(`\n  Total: ${(totalSize / 1024).toFixed(1)} KB`);
  console.log(`  Output: ${OUT_DIR}`);

  if (totalSize > 100 * 1024) {
    console.warn("\n  WARNING: Total asset size exceeds 100KB budget!");
  } else {
    console.log("  Budget: within 100KB target");
  }
}

main().catch((err) => {
  console.error("Texture generation failed:", err);
  process.exit(1);
});
