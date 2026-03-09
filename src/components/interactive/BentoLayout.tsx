"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import ArtifactPopover, {
  type ArtifactEntry,
} from "@/components/interactive/ArtifactPopover";

function isVideo(src: string) {
  return /\.(mov|mp4|webm)$/i.test(src);
}

interface BentoEntry {
  slug: string;
  date: string;
  mood?: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  project?: string;
  description?: string;
}

interface BentoLayoutProps {
  entries: BentoEntry[];
}

/* ── Layout constants ── */
const GRID_COLS = 6;
const CELL_SIZE = 200;
const GAP = 10;

/* ── Camera constants ── */
const MIN_SCALE = 0.15;
const MAX_SCALE = 2.5;
const ZOOM_FACTOR_IN = 1.08;
const ZOOM_FACTOR_OUT = 0.92;
const DRAG_THRESHOLD = 5;
const LERP_FACTOR = 0.12;
const LERP_FACTOR_INSTANT = 1;
const CONVERGENCE_EPSILON = 0.01;
const MOMENTUM_DECAY = 0.95;
const MOMENTUM_MIN = 0.1;
const VELOCITY_SAMPLE_COUNT = 5;
const KEYBOARD_PAN_STEP = 60;
const EDGE_MARGIN_RATIO = 0.5;

interface BentoItem {
  entry: BentoEntry;
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
}

/**
 * Determine span from aspect ratio and position.
 * Wider thresholds for more visual variety.
 */
function getSpan(
  entry: BentoEntry,
  index: number
): { colSpan: number; rowSpan: number } {
  const aspect = entry.imageWidth / entry.imageHeight;

  // Feature item every 4th
  if (index > 0 && index % 4 === 0) {
    return { colSpan: 2, rowSpan: 2 };
  }

  // Hero item every 7th
  if (index > 0 && index % 7 === 0) {
    return { colSpan: 3, rowSpan: 2 };
  }

  if (aspect < 0.85) {
    // Portrait
    return { colSpan: 1, rowSpan: 2 };
  } else if (aspect > 1.2) {
    // Landscape
    return { colSpan: 2, rowSpan: 1 };
  }

  // Square-ish
  return { colSpan: 1, rowSpan: 1 };
}

/**
 * Pack entries into a grid using a simple occupied-cell tracker.
 * Returns absolute pixel positions for each item.
 */
function computeBentoLayout(entries: BentoEntry[]): {
  items: BentoItem[];
  totalWidth: number;
  totalHeight: number;
} {
  // Grid occupancy: grid[row][col] = true if occupied
  const maxRows = Math.ceil(entries.length * 2); // generous upper bound
  const grid: boolean[][] = Array.from({ length: maxRows }, () =>
    new Array(GRID_COLS).fill(false)
  );

  const items: BentoItem[] = [];
  let maxRowUsed = 0;

  for (let i = 0; i < entries.length; i++) {
    const span = getSpan(entries[i], i);
    let colSpan = span.colSpan;
    const rowSpan = span.rowSpan;

    // Clamp span to grid width
    colSpan = Math.min(colSpan, GRID_COLS);

    // Find first available position (scan row by row, col by col)
    let placed = false;
    for (let r = 0; r < maxRows && !placed; r++) {
      for (let c = 0; c <= GRID_COLS - colSpan && !placed; c++) {
        // Check if all cells are free
        let fits = true;
        for (let dr = 0; dr < rowSpan && fits; dr++) {
          for (let dc = 0; dc < colSpan && fits; dc++) {
            if (grid[r + dr]?.[c + dc]) fits = false;
          }
        }

        if (fits) {
          // Mark cells as occupied
          for (let dr = 0; dr < rowSpan; dr++) {
            for (let dc = 0; dc < colSpan; dc++) {
              grid[r + dr][c + dc] = true;
            }
          }
          items.push({
            entry: entries[i],
            col: c,
            row: r,
            colSpan,
            rowSpan,
          });
          maxRowUsed = Math.max(maxRowUsed, r + rowSpan);
          placed = true;
        }
      }
    }
  }

  const totalWidth = GRID_COLS * (CELL_SIZE + GAP) - GAP;
  const totalHeight = maxRowUsed * (CELL_SIZE + GAP) - GAP;

  return { items, totalWidth, totalHeight };
}

export default function BentoLayout({ entries }: BentoLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);

  const current = useRef({ x: 0, y: 0, scale: 1 });
  const target = useRef({ x: 0, y: 0, scale: 1 });
  const animating = useRef(false);
  const rafId = useRef(0);
  const initialCamera = useRef({ x: 0, y: 0, scale: 1 });

  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);
  const dragOrigin = useRef({ x: 0, y: 0 });

  const velocityHistory = useRef<{ x: number; y: number; t: number }[]>([]);
  const velocity = useRef({ x: 0, y: 0 });

  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const initialPinchDist = useRef(0);
  const initialPinchScale = useRef(1);
  const prevMidpoint = useRef({ x: 0, y: 0 });
  const isPinching = useRef(false);

  const contentBounds = useRef({ minX: 0, minY: 0, maxX: 2000, maxY: 2000 });

  const [activeEntry, setActiveEntry] = useState<ArtifactEntry | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const prefersReducedMotion = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    prefersReducedMotion.current =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const layout = useMemo(() => computeBentoLayout(entries), [entries]);

  /* ── rAF animation loop ── */
  const startAnimation = useCallback(() => {
    if (animating.current) return;
    animating.current = true;

    const tick = () => {
      const c = current.current;
      const t = target.current;
      const v = velocity.current;
      const lerp = prefersReducedMotion.current ? LERP_FACTOR_INSTANT : LERP_FACTOR;

      if (!prefersReducedMotion.current && (v.x !== 0 || v.y !== 0)) {
        t.x += v.x;
        t.y += v.y;
        v.x *= MOMENTUM_DECAY;
        v.y *= MOMENTUM_DECAY;
        if (Math.abs(v.x) < MOMENTUM_MIN && Math.abs(v.y) < MOMENTUM_MIN) {
          v.x = 0;
          v.y = 0;
        }
      }

      const vw = containerRef.current?.clientWidth ?? window.innerWidth;
      const vh = containerRef.current?.clientHeight ?? window.innerHeight;
      const marginX = vw * EDGE_MARGIN_RATIO;
      const marginY = vh * EDGE_MARGIN_RATIO;
      const bounds = contentBounds.current;

      const maxTx = marginX;
      const minTx = vw - (bounds.maxX - bounds.minX) * t.scale - marginX;
      const maxTy = marginY;
      const minTy = vh - (bounds.maxY - bounds.minY) * t.scale - marginY;

      if (maxTx > minTx) t.x = Math.max(minTx, Math.min(maxTx, t.x));
      if (maxTy > minTy) t.y = Math.max(minTy, Math.min(maxTy, t.y));

      c.x += (t.x - c.x) * lerp;
      c.y += (t.y - c.y) * lerp;
      c.scale += (t.scale - c.scale) * lerp;

      if (worldRef.current) {
        worldRef.current.style.transform = `translate(${c.x}px, ${c.y}px) scale(${c.scale})`;
      }

      const dx = Math.abs(t.x - c.x);
      const dy = Math.abs(t.y - c.y);
      const ds = Math.abs(t.scale - c.scale);
      const hasVelocity = v.x !== 0 || v.y !== 0;

      if (dx > CONVERGENCE_EPSILON || dy > CONVERGENCE_EPSILON || ds > 0.0001 || hasVelocity) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        c.x = t.x;
        c.y = t.y;
        c.scale = t.scale;
        if (worldRef.current) {
          worldRef.current.style.transform = `translate(${c.x}px, ${c.y}px) scale(${c.scale})`;
        }
        animating.current = false;
      }
    };

    rafId.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

  /* ── Init camera ── */
  useEffect(() => {
    contentBounds.current = {
      minX: 0,
      minY: 0,
      maxX: layout.totalWidth,
      maxY: layout.totalHeight,
    };

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scaleX = vw / (layout.totalWidth + 200);
    const scaleY = vh / (layout.totalHeight + 200);
    const fitScale = Math.min(scaleX, scaleY, 1);
    // Don't zoom out past readable size — show a portion, let user explore
    const scale = Math.max(fitScale, 0.75);

    const x = vw / 2 - (layout.totalWidth / 2) * scale;
    const y = vh / 2 - (layout.totalHeight / 2) * scale;

    const initial = { x, y, scale };
    initialCamera.current = { ...initial };
    current.current = { ...initial };
    target.current = { ...initial };

    if (worldRef.current) {
      worldRef.current.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    }
    setReady(true);
  }, [layout]);

  const resetView = useCallback(() => {
    velocity.current = { x: 0, y: 0 };
    target.current = { ...initialCamera.current };
    startAnimation();
  }, [startAnimation]);

  /* ── Pinch helpers ── */
  const getPinchDistance = useCallback(() => {
    const pts = Array.from(pointers.current.values());
    if (pts.length < 2) return 0;
    const dx = pts[0].x - pts[1].x;
    const dy = pts[0].y - pts[1].y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const getPinchMidpoint = useCallback(() => {
    const pts = Array.from(pointers.current.values());
    if (pts.length < 2) return { x: 0, y: 0 };
    return { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
  }, []);

  /* ── Pointer events ── */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button === 2) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.current.size === 2) {
        isPinching.current = true;
        isDragging.current = false;
        initialPinchDist.current = getPinchDistance();
        initialPinchScale.current = target.current.scale;
        prevMidpoint.current = getPinchMidpoint();
        velocity.current = { x: 0, y: 0 };
      } else if (pointers.current.size === 1) {
        isDragging.current = true;
        hasDragged.current = false;
        lastPointer.current = { x: e.clientX, y: e.clientY };
        dragOrigin.current = { x: e.clientX, y: e.clientY };
        velocityHistory.current = [];
        velocity.current = { x: 0, y: 0 };
      }

      containerRef.current?.setPointerCapture(e.pointerId);
      if (containerRef.current && !isPinching.current)
        containerRef.current.style.cursor = "grabbing";
    },
    [getPinchDistance, getPinchMidpoint]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (pointers.current.has(e.pointerId))
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (isPinching.current && pointers.current.size >= 2) {
        const dist = getPinchDistance();
        if (initialPinchDist.current > 0) {
          const ratio = dist / initialPinchDist.current;
          const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, initialPinchScale.current * ratio));
          const container = containerRef.current;
          if (container) {
            const midpoint = getPinchMidpoint();
            const rect = container.getBoundingClientRect();
            const midX = midpoint.x - rect.left;
            const midY = midpoint.y - rect.top;
            const worldX = (midX - target.current.x) / target.current.scale;
            const worldY = (midY - target.current.y) / target.current.scale;
            target.current.scale = newScale;
            target.current.x = midX - worldX * newScale;
            target.current.y = midY - worldY * newScale;
            const mdx = midpoint.x - prevMidpoint.current.x;
            const mdy = midpoint.y - prevMidpoint.current.y;
            target.current.x += mdx;
            target.current.y += mdy;
            prevMidpoint.current = midpoint;
          }
        }
        startAnimation();
        return;
      }

      if (!isDragging.current) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      const totalDx = e.clientX - dragOrigin.current.x;
      const totalDy = e.clientY - dragOrigin.current.y;
      if (!hasDragged.current && Math.sqrt(totalDx * totalDx + totalDy * totalDy) > DRAG_THRESHOLD)
        hasDragged.current = true;

      target.current.x += dx;
      target.current.y += dy;
      const now = performance.now();
      velocityHistory.current.push({ x: dx, y: dy, t: now });
      if (velocityHistory.current.length > VELOCITY_SAMPLE_COUNT)
        velocityHistory.current.shift();
      lastPointer.current = { x: e.clientX, y: e.clientY };
      startAnimation();
    },
    [startAnimation, getPinchDistance, getPinchMidpoint]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      pointers.current.delete(e.pointerId);
      if (isPinching.current) {
        if (pointers.current.size < 2) {
          isPinching.current = false;
          if (pointers.current.size === 1) {
            const remaining = Array.from(pointers.current.values())[0];
            isDragging.current = true;
            hasDragged.current = true;
            lastPointer.current = { x: remaining.x, y: remaining.y };
            dragOrigin.current = { x: remaining.x, y: remaining.y };
            velocityHistory.current = [];
          }
        }
        containerRef.current?.releasePointerCapture(e.pointerId);
        return;
      }

      if (isDragging.current && hasDragged.current && !prefersReducedMotion.current) {
        const history = velocityHistory.current;
        if (history.length >= 2) {
          const now = performance.now();
          const recentSamples = history.filter((s) => now - s.t < 100);
          if (recentSamples.length >= 1) {
            let totalDx = 0, totalDy = 0;
            for (const s of recentSamples) { totalDx += s.x; totalDy += s.y; }
            velocity.current = { x: totalDx / recentSamples.length, y: totalDy / recentSamples.length };
            startAnimation();
          }
        }
      }

      isDragging.current = false;
      velocityHistory.current = [];
      containerRef.current?.releasePointerCapture(e.pointerId);
      if (containerRef.current) containerRef.current.style.cursor = "grab";
    },
    [startAnimation]
  );

  /* ── Wheel zoom ── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const t = target.current;
      const zoomFactor = e.deltaY > 0 ? ZOOM_FACTOR_OUT : ZOOM_FACTOR_IN;
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, t.scale * zoomFactor));
      const rect = container.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;
      const worldX = (cursorX - t.x) / t.scale;
      const worldY = (cursorY - t.y) / t.scale;
      target.current.scale = newScale;
      target.current.x = cursorX - worldX * newScale;
      target.current.y = cursorY - worldY * newScale;
      startAnimation();
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [startAnimation]);

  /* ── Keyboard ── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeEntry) { setActiveEntry(null); return; }
      if (activeEntry) return;
      switch (e.key) {
        case "ArrowUp": target.current.y += KEYBOARD_PAN_STEP; startAnimation(); e.preventDefault(); break;
        case "ArrowDown": target.current.y -= KEYBOARD_PAN_STEP; startAnimation(); e.preventDefault(); break;
        case "ArrowLeft": target.current.x += KEYBOARD_PAN_STEP; startAnimation(); e.preventDefault(); break;
        case "ArrowRight": target.current.x -= KEYBOARD_PAN_STEP; startAnimation(); e.preventDefault(); break;
        case "=": case "+": {
          const vw = containerRef.current?.clientWidth ?? window.innerWidth;
          const vh = containerRef.current?.clientHeight ?? window.innerHeight;
          const t = target.current;
          const ns = Math.min(MAX_SCALE, t.scale * ZOOM_FACTOR_IN);
          const wX = (vw / 2 - t.x) / t.scale;
          const wY = (vh / 2 - t.y) / t.scale;
          target.current.scale = ns; target.current.x = vw / 2 - wX * ns; target.current.y = vh / 2 - wY * ns;
          startAnimation(); e.preventDefault(); break;
        }
        case "-": case "_": {
          const vw = containerRef.current?.clientWidth ?? window.innerWidth;
          const vh = containerRef.current?.clientHeight ?? window.innerHeight;
          const t = target.current;
          const ns = Math.max(MIN_SCALE, t.scale * ZOOM_FACTOR_OUT);
          const wX = (vw / 2 - t.x) / t.scale;
          const wY = (vh / 2 - t.y) / t.scale;
          target.current.scale = ns; target.current.x = vw / 2 - wX * ns; target.current.y = vh / 2 - wY * ns;
          startAnimation(); e.preventDefault(); break;
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeEntry, startAnimation]);

  const handleItemClick = useCallback((entry: BentoEntry) => {
    setActiveEntry({
      slug: entry.slug, date: entry.date, mood: entry.mood,
      image: entry.image, project: entry.project, description: entry.description,
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden bg-paper"
      style={{ cursor: "grab", touchAction: "none" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="grain-texture absolute inset-0 pointer-events-none z-10" />

      <div
        ref={worldRef}
        className="absolute top-0 left-0"
        style={{
          transformOrigin: "0 0",
          willChange: "transform",
          opacity: ready ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        {layout.items.map((item) => {
          const x = item.col * (CELL_SIZE + GAP);
          const y = item.row * (CELL_SIZE + GAP);
          const w = item.colSpan * CELL_SIZE + (item.colSpan - 1) * GAP;
          const h = item.rowSpan * CELL_SIZE + (item.rowSpan - 1) * GAP;

          return (
            <div
              key={item.entry.slug}
              className="absolute overflow-hidden"
              style={{ left: x, top: y, width: w, height: h }}
              onClick={() => { if (!hasDragged.current) handleItemClick(item.entry); }}
            >
              <div className="artifact-treatment w-full h-full cursor-pointer hover:scale-[1.02] transition-transform duration-200 ease-out">
                {isVideo(item.entry.image) ? (
                  <video
                    src={item.entry.image}
                    muted autoPlay loop playsInline
                    className="w-full h-full object-cover pointer-events-none"
                  />
                ) : (
                  <Image
                    src={item.entry.image}
                    alt={item.entry.description || `Artifact from ${item.entry.date}`}
                    width={item.entry.imageWidth}
                    height={item.entry.imageHeight}
                    className="w-full h-full object-cover pointer-events-none"
                    loading="lazy"
                    unoptimized
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Title overlay */}
      <div className="absolute top-20 left-6 z-20 pointer-events-none">
        <h1
          className="font-serif font-bold italic text-ink"
          style={{ fontSize: "clamp(1.25rem, 2.5vw, 2rem)" }}
        >
          the studio desk
        </h1>
        <p
          className="font-mono text-ink-lighter uppercase"
          style={{ fontSize: "clamp(0.55rem, 0.7vw, 0.65rem)", letterSpacing: "0.1em" }}
        >
          {isTouchDevice
            ? "drag to explore \u00B7 pinch to zoom \u00B7 tap to view"
            : "drag to explore \u00B7 scroll to zoom \u00B7 click to view"}
        </p>
      </div>

      <button
        onClick={resetView}
        className="absolute bottom-6 right-6 z-20 pointer-events-auto
          px-3 py-1.5 rounded font-mono text-xs uppercase tracking-wider
          bg-surface/80 backdrop-blur-sm text-ink-light
          ring-1 ring-border hover:bg-surface hover:text-ink
          transition-all duration-200"
        style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}
      >
        Reset view
      </button>

      {activeEntry && (
        <ArtifactPopover entry={activeEntry} onClose={() => setActiveEntry(null)} />
      )}
    </div>
  );
}
