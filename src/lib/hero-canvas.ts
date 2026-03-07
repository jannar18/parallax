/**
 * Hero canvas rendering — pure TypeScript, no React or DOM.
 *
 * All rendering logic for the two 3D folding planes:
 *   Left plane  → architecture photo slideshow with perspective warp
 *   Right plane → procedural wireframe network with parallax
 *
 * Functions accept a CanvasRenderingContext2D and mutate HeroState in place.
 */

// ── Types ──

export type PerfTier = "high" | "low";

export interface Point {
  x: number;
  y: number;
}

export interface WireNode {
  nx: number;
  ny: number;
  phase: number;
  reveal: number;
  revealTarget: number;
  revealDelay: number;
}

export interface WireEdge {
  from: number;
  to: number;
  weight: number;
  alpha: number;
  phase: number;
  signalPos: number;
  signalSpeed: number;
  signalDir: number;
  drawProgress: number;
}

export interface WireNetwork {
  nodes: WireNode[];
  edges: WireEdge[];
}

export interface HeroState {
  W: number;
  H: number;
  frame: number;
  rotation: number;
  targetRotation: number;
  isDragging: boolean;
  dragStartX: number;
  dragStartRotation: number;
  mouseX: number;
  mouseY: number;
  targetMX: number;
  targetMY: number;
  wireNetwork: WireNetwork | null;
  currentPhoto: number;
  nextPhoto: number;
  crossfade: number;
  photoHoldTimer: number;
  perfTier: PerfTier;
  dpr: number;
}

// ── Performance Tier Constants ──

const PERF_SLICES_HIGH = 80;
const PERF_SLICES_LOW = 24;
const PERF_WIRE_NODES_HIGH = 120;
const PERF_WIRE_NODES_LOW = 40;
const PERF_LONG_EDGES_HIGH = 14;
const PERF_LONG_EDGES_LOW = 6;

// ── Constants ──

export const HOLD_DURATION = 300; // ~5s per photo at 60fps
export const FADE_SPEED = 0.006;
export const PHOTO_COUNT = 12;
export const BG_COLOR = "#FDFCEA"; // --color-background (Riso Paper)
const INK_RGB = "71,31,32"; // Must match --color-ink-rgb in tokens.css (Riso Oxblood #471f20)

// ── State Factory ──

export function detectPerfTier(): PerfTier {
  if (typeof window === "undefined") return "high";
  const w = window.innerWidth;
  const isTouch = navigator.maxTouchPoints > 0;
  if (w < 768 || (w < 1024 && isTouch)) return "low";
  return "high";
}

export function createInitialState(): HeroState {
  return {
    W: 0,
    H: 0,
    frame: 0,
    rotation: 0,
    targetRotation: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartRotation: 0,
    mouseX: 0.5,
    mouseY: 0.5,
    targetMX: 0.5,
    targetMY: 0.5,
    wireNetwork: null,
    currentPhoto: 0,
    nextPhoto: 1,
    crossfade: 0,
    photoHoldTimer: 0,
    perfTier: "high",
    dpr: 1,
  };
}

// ── Wire Network Generation ──

export function generateWireNetwork(tier: PerfTier = "high"): WireNetwork {
  const nodeCount =
    tier === "low" ? PERF_WIRE_NODES_LOW : PERF_WIRE_NODES_HIGH;
  const longEdgeCount =
    tier === "low" ? PERF_LONG_EDGES_LOW : PERF_LONG_EDGES_HIGH;
  const nodes: WireNode[] = [];

  for (let i = 0; i < nodeCount; i++) {
    let nx: number, ny: number;
    if (Math.random() < 0.3) {
      nx = 0.35 + (Math.random() - 0.5) * 0.4;
      ny = 0.35 + (Math.random() - 0.5) * 0.4;
    } else {
      nx = 0.06 + Math.random() * 0.88;
      ny = 0.06 + Math.random() * 0.88;
    }
    nodes.push({
      nx,
      ny,
      phase: Math.random() * Math.PI * 2,
      reveal: 0,
      revealTarget: 0,
      revealDelay: i * 0.18 + Math.random() * 2,
    });
  }

  const edges: WireEdge[] = [];
  const maxDist = 0.3;
  const maxE = 4;
  const ec = new Array(nodeCount).fill(0);
  const cands: { i: number; j: number; d: number }[] = [];

  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const dx = nodes[i].nx - nodes[j].nx;
      const dy = nodes[i].ny - nodes[j].ny;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < maxDist) cands.push({ i, j, d });
    }
  }
  cands.sort((a, b) => a.d - b.d);

  for (const c of cands) {
    if (ec[c.i] < maxE && ec[c.j] < maxE) {
      edges.push({
        from: c.i,
        to: c.j,
        weight: 0.3 + Math.random() * 0.5,
        alpha: 0.15 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        signalPos: Math.random(),
        signalSpeed: 0.003 + Math.random() * 0.006,
        signalDir: Math.random() < 0.5 ? 1 : -1,
        drawProgress: 0,
      });
      ec[c.i]++;
      ec[c.j]++;
    }
  }

  // Long-range random edges for visual interest
  for (let i = 0; i < longEdgeCount; i++) {
    const a = Math.floor(Math.random() * nodeCount);
    let b = Math.floor(Math.random() * nodeCount);
    while (b === a) b = Math.floor(Math.random() * nodeCount);
    edges.push({
      from: a,
      to: b,
      weight: 0.2 + Math.random() * 0.3,
      alpha: 0.08 + Math.random() * 0.15,
      phase: Math.random() * Math.PI * 2,
      signalPos: Math.random(),
      signalSpeed: 0.002 + Math.random() * 0.004,
      signalDir: Math.random() < 0.5 ? 1 : -1,
      drawProgress: 0,
    });
  }

  return { nodes, edges };
}

// ── Plane Geometry ──

export function getLeftPlane(s: HeroState): Point[] {
  const cx = s.W * 0.5;
  const topY = s.H * 0.1;
  const botY = s.H * 0.9;
  const frontX = cx - s.W * 0.35;
  const maxSwing = s.W * 0.55;
  const backX = frontX + s.rotation * maxSwing;
  const perspAmount = s.rotation * 0.08;

  return [
    { x: frontX, y: topY },
    { x: backX, y: topY + s.H * perspAmount },
    { x: backX, y: botY - s.H * perspAmount },
    { x: frontX, y: botY },
  ];
}

export function getRightPlane(s: HeroState): Point[] {
  const cx = s.W * 0.5;
  const topY = s.H * 0.1;
  const botY = s.H * 0.9;
  const frontX = cx + s.W * 0.35;
  const maxSwing = s.W * 0.55;
  const backX = frontX - s.rotation * maxSwing;
  const perspAmount = s.rotation * 0.08;

  return [
    { x: backX, y: topY + s.H * perspAmount },
    { x: frontX, y: topY },
    { x: frontX, y: botY },
    { x: backX, y: botY - s.H * perspAmount },
  ];
}

export function mapToQuad(nx: number, ny: number, pts: Point[]): Point {
  const tx = pts[0].x + (pts[1].x - pts[0].x) * nx;
  const ty = pts[0].y + (pts[1].y - pts[0].y) * nx;
  const bx = pts[3].x + (pts[2].x - pts[3].x) * nx;
  const by = pts[3].y + (pts[2].y - pts[3].y) * nx;
  return { x: tx + (bx - tx) * ny, y: ty + (by - ty) * ny };
}

// ── Drawing Helpers ──

function clipToQuad(ctx: CanvasRenderingContext2D, pts: Point[]) {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  ctx.lineTo(pts[1].x, pts[1].y);
  ctx.lineTo(pts[2].x, pts[2].y);
  ctx.lineTo(pts[3].x, pts[3].y);
  ctx.closePath();
  ctx.clip();
}

function drawPlaneBorder(ctx: CanvasRenderingContext2D, pts: Point[], a: number) {
  ctx.strokeStyle = `rgba(${INK_RGB},${a})`;
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  ctx.lineTo(pts[1].x, pts[1].y);
  ctx.lineTo(pts[2].x, pts[2].y);
  ctx.lineTo(pts[3].x, pts[3].y);
  ctx.closePath();
  ctx.stroke();
}

export function drawPhotoInQuad(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  pts: Point[],
  alpha: number,
  cropAspect?: number,
  sliceCount?: number,
) {
  if (!img || !img.complete || img.naturalWidth === 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  clipToQuad(ctx, pts);

  const minX = Math.min(pts[0].x, pts[3].x);
  const maxX = Math.max(pts[1].x, pts[2].x);
  const minY = Math.min(pts[0].y, pts[1].y);
  const maxY = Math.max(pts[2].y, pts[3].y);
  const quadW = maxX - minX;
  const quadH = maxY - minY;
  if (quadW <= 0 || quadH <= 0) {
    ctx.restore();
    return;
  }

  const quadAspect = cropAspect ?? quadW / quadH;
  const imgAspect = img.naturalWidth / img.naturalHeight;
  let sx: number, sy: number, sw: number, sh: number;
  if (imgAspect > quadAspect) {
    sh = img.naturalHeight;
    sw = sh * quadAspect;
    sx = (img.naturalWidth - sw) / 2;
    sy = 0;
  } else {
    sw = img.naturalWidth;
    sh = sw / quadAspect;
    sx = 0;
    sy = (img.naturalHeight - sh) / 2;
  }

  const slices = sliceCount ?? PERF_SLICES_HIGH;
  for (let i = 0; i < slices; i++) {
    const t1 = i / slices;
    const t2 = (i + 1) / slices;
    const tl = mapToQuad(t1, 0, pts);
    const tr = mapToQuad(t2, 0, pts);
    const br = mapToQuad(t2, 1, pts);
    const bl = mapToQuad(t1, 1, pts);
    const sliceSx = sx + t1 * sw;
    const sliceSw = sw / slices;
    const dx = Math.min(tl.x, bl.x);
    const dxr = Math.max(tr.x, br.x);
    const dy = Math.min(tl.y, tr.y);
    const dyb = Math.max(bl.y, br.y);
    const dw = dxr - dx;
    const dh = dyb - dy;
    if (dw > 0 && dh > 0 && sliceSw > 0) {
      ctx.drawImage(img, sliceSx, sy, sliceSw, sh, dx, dy, dw, dh);
    }
  }
  ctx.restore();
}

// ── Slideshow ──

export function updateSlideshow(s: HeroState) {
  s.photoHoldTimer++;
  if (s.photoHoldTimer > HOLD_DURATION) {
    s.crossfade += FADE_SPEED;
    if (s.crossfade >= 1) {
      s.currentPhoto = s.nextPhoto;
      s.nextPhoto = (s.nextPhoto + 1) % PHOTO_COUNT;
      s.crossfade = 0;
      s.photoHoldTimer = 0;
    }
  }
}

// ── Left Plane (Photo Slideshow) ──

export function drawLeftPlane(
  ctx: CanvasRenderingContext2D,
  s: HeroState,
  photos: HTMLImageElement[],
) {
  const pts = getLeftPlane(s);

  // Fixed crop aspect from fully-opened plane geometry (no zoom on fold)
  const refAspect = (s.W * 0.55) / (s.H * 0.8);

  // Fade photo opacity as plane rotates open
  const fade = 1 - s.rotation * 0.7;

  const slices =
    s.perfTier === "low" ? PERF_SLICES_LOW : PERF_SLICES_HIGH;

  const ca = 0.82 * (1 - s.crossfade) * fade;
  const na = 0.82 * s.crossfade * fade;
  if (ca > 0.01) drawPhotoInQuad(ctx, photos[s.currentPhoto], pts, ca, refAspect, slices);
  if (na > 0.01) drawPhotoInQuad(ctx, photos[s.nextPhoto], pts, na, refAspect, slices);
  drawPlaneBorder(ctx, pts, 0.15);
}

// ── Right Plane (Wireframe Network) ──

export function drawRightPlane(ctx: CanvasRenderingContext2D, s: HeroState) {
  const pts = getRightPlane(s);
  const net = s.wireNetwork;
  if (!net) return;

  const isLow = s.perfTier === "low";
  const px = (s.mouseX - 0.5) * 6;
  const py = (s.mouseY - 0.5) * 4;
  const ts = s.frame / 60;

  ctx.save();
  clipToQuad(ctx, pts);

  // Reveal nodes over time
  for (const n of net.nodes) {
    if (ts > n.revealDelay) n.revealTarget = 1;
    n.reveal += (n.revealTarget - n.reveal) * 0.2;
  }

  // Draw edges + signals
  for (const edge of net.edges) {
    const nA = net.nodes[edge.from];
    const nB = net.nodes[edge.to];
    const er = Math.min(nA.reveal, nB.reveal);
    if (er < 0.01) continue;

    // Animate draw progress — line strokes from node A toward node B
    edge.drawProgress += (1 - edge.drawProgress) * 0.06;

    const pA = mapToQuad(nA.nx, nA.ny, pts);
    const pB = mapToQuad(nB.nx, nB.ny, pts);

    // End point based on draw progress
    const endX = pA.x + (pB.x - pA.x) * edge.drawProgress;
    const endY = pA.y + (pB.y - pA.y) * edge.drawProgress;

    const a = Math.min(
      edge.alpha * er * (0.7 + 0.15 * Math.sin(s.frame * 0.008 + edge.phase)) * 2.5,
      0.85,
    );

    ctx.strokeStyle = `rgba(${INK_RGB},${a})`;
    ctx.lineWidth = edge.weight * 1.8;
    ctx.beginPath();
    ctx.moveTo(pA.x + px, pA.y + py);
    ctx.lineTo(endX + px, endY + py);
    ctx.stroke();

    // Signal dot — only travels along drawn portion; skip on mobile
    edge.signalPos += edge.signalSpeed * edge.signalDir;
    const maxSig = edge.drawProgress;
    if (edge.signalPos > maxSig) {
      edge.signalPos = maxSig;
      edge.signalDir = -1;
    } else if (edge.signalPos < 0) {
      edge.signalPos = 0;
      edge.signalDir = 1;
    }
    if (!isLow) {
      const sigX = pA.x + (pB.x - pA.x) * edge.signalPos + px;
      const sigY = pA.y + (pB.y - pA.y) * edge.signalPos + py;
      ctx.fillStyle = `rgba(${INK_RGB},${Math.min(a * 1.4, 0.6) * er})`;
      ctx.beginPath();
      ctx.arc(sigX, sigY, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw nodes
  for (const node of net.nodes) {
    if (node.reveal < 0.01) continue;
    const p = mapToQuad(node.nx, node.ny, pts);
    const a = node.reveal * (0.35 + 0.1 * Math.sin(s.frame * 0.01 + node.phase));
    ctx.fillStyle = `rgba(${INK_RGB},${a})`;
    ctx.beginPath();
    ctx.arc(p.x + px, p.y + py, 2.0, 0, Math.PI * 2);
    ctx.fill();

    // Cross marker on some nodes — skip on mobile
    if (!isLow && node.phase > Math.PI) {
      ctx.strokeStyle = `rgba(${INK_RGB},${a * 0.4})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(p.x + px - 3, p.y + py);
      ctx.lineTo(p.x + px + 3, p.y + py);
      ctx.moveTo(p.x + px, p.y + py - 3);
      ctx.lineTo(p.x + px, p.y + py + 3);
      ctx.stroke();
    }
  }

  ctx.restore();
  drawPlaneBorder(ctx, pts, 0.15);
}

// ── Main Draw Frame ──

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  s: HeroState,
  photos: HTMLImageElement[],
) {
  s.frame++;
  s.mouseX += (s.targetMX - s.mouseX) * 0.05;
  s.mouseY += (s.targetMY - s.mouseY) * 0.05;
  // rotation is set directly by scroll handler — no lerp lag
  s.rotation = s.targetRotation;

  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, s.W, s.H);

  updateSlideshow(s);
  drawLeftPlane(ctx, s, photos);
  drawRightPlane(ctx, s);
}

// ── Metadata Getters (for overlay text) ──

export function getMetadataLeft(s: HeroState): string {
  const now = new Date();
  const ts = now.toISOString().replace("T", "  ").slice(0, 22);
  return [
    `\u03C6  ${(s.mouseX * 180 - 90).toFixed(1)}\u00B0`,
    `\u03BB  ${(s.mouseY * 360 - 180).toFixed(1)}\u00B0`,
    "",
    ts,
    "",
    "Colour space: sRGB",
    "Renderer: Canvas2D",
    `Frame: ${s.frame}`,
  ].join("\n");
}

export function getMetadataRight(s: HeroState): string {
  return [
    `merge: ${(s.rotation * 100).toFixed(0)}%`,
    `density: ${s.wireNetwork ? s.wireNetwork.nodes.length : 0}`,
    "",
    "mode: generative",
    "blend: overlay",
    "",
    `iteration: ${Math.floor(s.frame / 60)}`,
  ].join("\n");
}

export interface MetadataBottomItem {
  type: "text" | "sep";
  value?: string;
}

export function getMetadataBottom(s: HeroState): MetadataBottomItem[] {
  const now = new Date();
  const fps = s.perfTier === "low" ? "30.0fps" : "60.0fps";
  return [
    { type: "text" as const, value: `${s.W}\u00D7${s.H}` },
    { type: "sep" as const },
    { type: "text" as const, value: fps },
    { type: "sep" as const },
    { type: "text" as const, value: "architecture \u2194 computation" },
    { type: "sep" as const },
    { type: "text" as const, value: `${now.getFullYear()}` },
  ];
}
