/**
 * Deterministic layout generator for infinite canvas items.
 *
 * Algorithm:
 * 1. Sort entries by date for deterministic ordering
 * 2. Place items on an even grid across the world with jitter for organic feel
 * 3. Vary sizes (200-500px width) with aspect ratio seeded from slug
 * 4. Run AABB collision relaxation passes to eliminate overlaps
 * 5. Assign zIndex based on placement order + random offset
 *
 * All randomness uses mulberry32 PRNG for determinism.
 */

/* ── Seeded PRNG (mulberry32) ── */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

/* ── Layout Types ── */

export interface CanvasItemLayout {
  slug: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
}

export interface LayoutEntry {
  slug: string;
  date: string;
  image?: string;
}

interface LayoutConfig {
  /** Minimum gap between items (px) */
  minGap: number;
  /** Max rotation in degrees */
  maxRotation: number;
  /** Minimum item width (px) */
  minWidth: number;
  /** Maximum item width (px) */
  maxWidth: number;
  /** Number of collision relaxation passes */
  relaxationPasses: number;
}

const DEFAULT_CONFIG: LayoutConfig = {
  minGap: 100,
  maxRotation: 0,
  minWidth: 200,
  maxWidth: 500,
  relaxationPasses: 30,
};

/* ── Helpers ── */

function isVideoPath(path?: string): boolean {
  if (!path) return false;
  return /\.(mov|mp4|webm)$/i.test(path);
}

/** Determine aspect ratio category from slug hash */
function getAspectRatio(rng: () => number, isVideo: boolean): number {
  if (isVideo) {
    // Videos are typically landscape
    return 1.6 + rng() * 0.2; // 1.6:1 to 1.8:1
  }

  const roll = rng();
  if (roll < 0.35) {
    // Landscape — 35% of items
    return 1.2 + rng() * 0.3; // 1.2:1 to 1.5:1
  } else if (roll < 0.6) {
    // Portrait — 25% of items
    return 0.65 + rng() * 0.15; // 0.65:1 to 0.8:1
  } else {
    // Roughly square — 40% of items
    return 0.9 + rng() * 0.2; // 0.9:1 to 1.1:1
  }
}

/** AABB overlap check with padding */
function overlaps(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
  gap: number
): boolean {
  return !(
    a.x + a.width + gap <= b.x ||
    b.x + b.width + gap <= a.x ||
    a.y + a.height + gap <= b.y ||
    b.y + b.height + gap <= a.y
  );
}

/** Calculate overlap depth between two AABBs (returns 0 if no overlap) */
function overlapDepth(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
  gap: number
): { dx: number; dy: number } {
  const overlapX = Math.min(a.x + a.width + gap, b.x + b.width + gap) - Math.max(a.x, b.x);
  const overlapY = Math.min(a.y + a.height + gap, b.y + b.height + gap) - Math.max(a.y, b.y);

  if (overlapX <= 0 || overlapY <= 0) {
    return { dx: 0, dy: 0 };
  }

  // Push apart along the axis of least overlap
  const aCenterX = a.x + a.width / 2;
  const aCenterY = a.y + a.height / 2;
  const bCenterX = b.x + b.width / 2;
  const bCenterY = b.y + b.height / 2;

  if (overlapX < overlapY) {
    // Push horizontally
    const sign = aCenterX < bCenterX ? -1 : 1;
    return { dx: sign * overlapX, dy: 0 };
  } else {
    // Push vertically
    const sign = aCenterY < bCenterY ? -1 : 1;
    return { dx: 0, dy: sign * overlapY };
  }
}

/* ── Main Layout Algorithm ── */

/**
 * Generate deterministic, evenly-spread positions for canvas items.
 * Items are distributed across the full canvas on a soft grid with jitter.
 * Layout is collision-free with organic, desk-like spacing.
 */
export function generateLayout(
  entries: LayoutEntry[],
  config: Partial<LayoutConfig> = {}
): CanvasItemLayout[] {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  if (entries.length === 0) return [];

  // ── 1. Sort entries by date for deterministic ordering ──
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const itemCount = sorted.length;

  // ── 2. Calculate grid dimensions ──
  // Even grid across the world, each item gets its own cell
  const cols = Math.ceil(Math.sqrt(itemCount * 1.5)); // slightly wider than tall
  const rows = Math.ceil(itemCount / cols);

  // Cell size based on average item size + generous gap
  const avgSize = (cfg.minWidth + cfg.maxWidth) / 2;
  const cellWidth = avgSize + cfg.minGap + 80;
  const cellHeight = avgSize + cfg.minGap + 80;

  // Global PRNG for grid-level jitter
  const globalSeed = hashString("canvas-layout-even") + itemCount;
  const globalRng = mulberry32(globalSeed);

  // Shuffle cell assignments for organic feel (not a left-to-right grid)
  const cellIndices = Array.from({ length: cols * rows }, (_, i) => i);
  // Fisher-Yates shuffle with seeded PRNG
  for (let i = cellIndices.length - 1; i > 0; i--) {
    const j = Math.floor(globalRng() * (i + 1));
    [cellIndices[i], cellIndices[j]] = [cellIndices[j], cellIndices[i]];
  }

  // ── 3. Place items on the grid with jitter ──
  const items: CanvasItemLayout[] = [];
  const margin = 100;

  for (let i = 0; i < sorted.length; i++) {
    const entry = sorted[i];
    const slugSeed = hashString(entry.slug);
    const rng = mulberry32(slugSeed);

    // ── Size ──
    const video = isVideoPath(entry.image);
    const widthBase = cfg.minWidth + rng() * (cfg.maxWidth - cfg.minWidth);
    const width = Math.round(video ? widthBase * 1.15 : widthBase);
    const aspectRatio = getAspectRatio(rng, video);
    const height = Math.round(width / aspectRatio);

    // ── Position: grid cell center + jitter ──
    const cellIdx = cellIndices[i];
    const col = cellIdx % cols;
    const row = Math.floor(cellIdx / cols);

    const cellCenterX = margin + (col + 0.5) * cellWidth;
    const cellCenterY = margin + (row + 0.5) * cellHeight;

    // Jitter: ±25% of cell size for organic scatter within the cell
    const jitterX = (rng() - 0.5) * cellWidth * 0.5;
    const jitterY = (rng() - 0.5) * cellHeight * 0.5;

    const x = cellCenterX + jitterX - width / 2;
    const y = cellCenterY + jitterY - height / 2;

    // ── Rotation ──
    const rotation = (rng() - 0.5) * 2 * cfg.maxRotation;

    // ── zIndex ──
    const zIndex = i + Math.floor(rng() * 5);

    items.push({ slug: entry.slug, x, y, width, height, rotation, zIndex });
  }

  // ── 6. Collision relaxation ──
  // Iteratively push overlapping items apart
  for (let pass = 0; pass < cfg.relaxationPasses; pass++) {
    let hadOverlap = false;

    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        if (overlaps(items[i], items[j], cfg.minGap)) {
          hadOverlap = true;
          const depth = overlapDepth(items[i], items[j], cfg.minGap);

          // Split the correction between both items
          const halfDx = depth.dx / 2;
          const halfDy = depth.dy / 2;

          items[i].x += halfDx;
          items[i].y += halfDy;
          items[j].x -= halfDx;
          items[j].y -= halfDy;
        }
      }
    }

    // Early exit if no overlaps remain
    if (!hadOverlap) break;
  }

  // ── 7. Normalize positions ──
  // Shift all items so the minimum x,y starts at a reasonable margin
  if (items.length > 0) {
    let minX = Infinity;
    let minY = Infinity;

    for (const item of items) {
      minX = Math.min(minX, item.x);
      minY = Math.min(minY, item.y);
    }

    const normalizeMargin = 80;
    const shiftX = normalizeMargin - minX;
    const shiftY = normalizeMargin - minY;

    for (const item of items) {
      item.x = Math.round(item.x + shiftX);
      item.y = Math.round(item.y + shiftY);
    }
  }

  return items;
}

/**
 * Calculate initial camera offset to center the canvas items in the viewport.
 */
export function getInitialCamera(
  items: CanvasItemLayout[],
  viewportWidth: number,
  viewportHeight: number
): { x: number; y: number; scale: number } {
  if (items.length === 0) {
    return { x: 0, y: 0, scale: 1 };
  }

  // Find bounding box of all items
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (const item of items) {
    minX = Math.min(minX, item.x);
    minY = Math.min(minY, item.y);
    maxX = Math.max(maxX, item.x + item.width);
    maxY = Math.max(maxY, item.y + item.height);
  }

  const contentWidth = maxX - minX;
  const contentHeight = maxY - minY;
  const centerX = minX + contentWidth / 2;
  const centerY = minY + contentHeight / 2;

  // Scale to fit with some padding
  const scaleX = viewportWidth / (contentWidth + 200);
  const scaleY = viewportHeight / (contentHeight + 200);
  const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in past 1:1

  const x = viewportWidth / 2 - centerX * scale;
  const y = viewportHeight / 2 - centerY * scale;

  return { x, y, scale };
}
