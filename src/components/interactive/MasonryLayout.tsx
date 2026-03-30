"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import ArtifactPopover, {
  type ArtifactEntry,
} from "@/components/interactive/ArtifactPopover";

function isVideo(src: string) {
  return /\.(mov|mp4|webm)$/i.test(src);
}

interface MasonryEntry {
  slug: string;
  date: string;
  mood?: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  project?: string;
  description?: string;
}

interface MasonryLayoutProps {
  entries: MasonryEntry[];
}

/* ── Layout constants ── */
const GAP = 20;
const ITEM_PADDING = 10;

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

interface MasonryItem {
  entry: MasonryEntry;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Compute masonry positions: shortest-column placement, absolute coordinates.
 * Column count and width are responsive to viewport width.
 */
function computeMasonryLayout(
  entries: MasonryEntry[],
  viewportWidth: number
): {
  items: MasonryItem[];
  totalWidth: number;
  totalHeight: number;
} {
  // Fill the full viewport width before growing vertically
  const horizontalMargin = 48; // 24px each side
  const targetWidth = Math.max(600, viewportWidth - horizontalMargin * 2);
  const colCount = Math.max(2, Math.min(8, Math.round(targetWidth / 260)));
  const colWidth = Math.floor((targetWidth - (colCount - 1) * GAP) / colCount);
  const layoutWidth = colCount * colWidth + (colCount - 1) * GAP;

  const colHeights = new Array(colCount).fill(0);
  const items: MasonryItem[] = [];

  for (const entry of entries) {
    // Find shortest column
    let minIdx = 0;
    for (let i = 1; i < colCount; i++) {
      if (colHeights[i] < colHeights[minIdx]) minIdx = i;
    }

    const aspect = Math.max(0.3, Math.min(3, entry.imageWidth / entry.imageHeight));
    const width = colWidth;
    const innerWidth = width - ITEM_PADDING * 2;
    const innerHeight = Math.round(innerWidth / aspect);
    const height = innerHeight + ITEM_PADDING * 2;

    items.push({
      entry,
      x: minIdx * (colWidth + GAP),
      y: colHeights[minIdx],
      width,
      height,
    });

    colHeights[minIdx] += height + GAP;
  }

  return {
    items,
    totalWidth: layoutWidth,
    totalHeight: Math.max(...colHeights, 0),
  };
}

export default function MasonryLayout({ entries }: MasonryLayoutProps) {
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
  const [layout, setLayout] = useState<{
    items: MasonryItem[];
    totalWidth: number;
    totalHeight: number;
  }>({ items: [], totalWidth: 0, totalHeight: 0 });

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    prefersReducedMotion.current =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

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

  /* ── Init layout & camera ── */
  useEffect(() => {
    const vw = window.innerWidth;

    // Compute responsive layout based on viewport width
    const computed = computeMasonryLayout(entries, vw);
    setLayout(computed);

    contentBounds.current = {
      minX: 0,
      minY: 0,
      maxX: computed.totalWidth,
      maxY: computed.totalHeight,
    };

    // Show at full size, centered horizontally, starting from top
    const x = (vw - computed.totalWidth) / 2;
    const y = 80; // below header
    const initial = { x, y, scale: 1 };

    initialCamera.current = { ...initial };
    current.current = { ...initial };
    target.current = { ...initial };

    if (worldRef.current) {
      worldRef.current.style.transform = `translate(${x}px, ${y}px) scale(1)`;
    }
    setReady(true);
  }, [entries]);

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

  const handleItemClick = useCallback((entry: MasonryEntry) => {
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
        {layout.items.map((item) => (
          <div
            key={item.entry.slug}
            className="absolute overflow-hidden"
            style={{ left: item.x, top: item.y, width: item.width, height: item.height, padding: ITEM_PADDING }}
            onClick={() => { if (!hasDragged.current) handleItemClick(item.entry); }}
          >
            <div className="artifact-treatment w-full h-full cursor-pointer hover:scale-[1.02] transition-transform duration-200 ease-out rounded-sm">
              {isVideo(item.entry.image) ? (
                <video
                  src={item.entry.image}
                  muted autoPlay loop playsInline
                  className="w-full h-full object-contain pointer-events-none"
                />
              ) : (
                <Image
                  src={item.entry.image}
                  alt={item.entry.description || `Artifact from ${item.entry.date}`}
                  width={item.width}
                  height={item.height}
                  className="w-full h-full object-contain pointer-events-none"
                  loading="lazy"
                  unoptimized
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Title — in the header bar, right side */}
      <div className="fixed top-0 right-[5vw] z-50 pointer-events-none text-right py-5 flex flex-col justify-center h-[60px]">
        <h1
          className="font-serif font-bold italic text-ink leading-none"
          style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.15rem)" }}
        >
          the studio desk
        </h1>
        <p
          className="font-mono text-ink-lighter uppercase mt-0.5"
          style={{ fontSize: "clamp(0.5rem, 0.6vw, 0.55rem)", letterSpacing: "0.1em" }}
        >
          {isTouchDevice
            ? "drag \u00B7 pinch \u00B7 tap"
            : "drag \u00B7 scroll \u00B7 click"}
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
