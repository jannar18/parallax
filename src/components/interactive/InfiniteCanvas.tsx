"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  generateLayout,
  getInitialCamera,
  type CanvasItemLayout,
} from "@/lib/canvas-layout";
import ArtifactPopover, {
  type ArtifactEntry,
} from "@/components/interactive/ArtifactPopover";
import { isVideo } from "@/lib/media-utils";

/* ── Types ── */

interface CanvasEntry {
  slug: string;
  date: string;
  mood?: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  project?: string;
  description?: string;
}

interface InfiniteCanvasProps {
  entries: CanvasEntry[];
}

/* ── Constants ── */
const MIN_SCALE = 0.2;
const MAX_SCALE = 2.5;
const ZOOM_FACTOR_IN = 1.08;
const ZOOM_FACTOR_OUT = 0.92;
const DRAG_THRESHOLD = 5;
const LERP_FACTOR = 0.12;
const LERP_FACTOR_INSTANT = 1; // for reduced motion
const CONVERGENCE_EPSILON = 0.01;
const MOMENTUM_DECAY = 0.95;
const MOMENTUM_MIN = 0.1;
const VELOCITY_SAMPLE_COUNT = 5;
const KEYBOARD_PAN_STEP = 60;
const EDGE_MARGIN_RATIO = 0.5; // allow panning half a viewport beyond content

/* ── Lazy Video — only plays when near the viewport ── */

function LazyVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      className="w-full h-full object-contain pointer-events-none"
    />
  );
}

/* ── Component ── */

export default function InfiniteCanvas({ entries }: InfiniteCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);

  // Dual-state camera: current lerps toward target each frame
  const current = useRef({ x: 0, y: 0, scale: 1 });
  const target = useRef({ x: 0, y: 0, scale: 1 });
  const animating = useRef(false);
  const rafId = useRef(0);

  // Initial camera position for reset (ASMV-62)
  const initialCamera = useRef({ x: 0, y: 0, scale: 1 });

  // Drag state
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);
  const dragOrigin = useRef({ x: 0, y: 0 });

  // Momentum/inertia (ASMV-62)
  const velocityHistory = useRef<{ x: number; y: number; t: number }[]>([]);
  const velocity = useRef({ x: 0, y: 0 });

  // Multi-touch / pinch zoom (ASMV-63)
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const initialPinchDist = useRef(0);
  const initialPinchScale = useRef(1);
  const prevMidpoint = useRef({ x: 0, y: 0 });
  const isPinching = useRef(false);

  // Popover (ASMV-64)
  const [activeEntry, setActiveEntry] = useState<ArtifactEntry | null>(null);

  // Mobile detection for hint text
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Reduced motion preference
  const prefersReducedMotion = useRef(false);

  // Content bounding box for edge constraints
  const contentBounds = useRef({ minX: 0, minY: 0, maxX: 2000, maxY: 2000 });

  // Layout
  const [layout, setLayout] = useState<CanvasItemLayout[]>([]);
  const [ready, setReady] = useState(false);

  // Detect touch capability and watch reduced motion preference
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mq.matches;
    const onChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
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

      // Apply momentum to target (decaying each frame)
      // Skip momentum entirely for reduced motion
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

      // Edge constraints — soft clamp target within content bounds + margin
      // Uses actual content origin (bounds.minX/Y) so the constraint works
      // regardless of where the layout normalization places items.
      const vw = containerRef.current?.clientWidth ?? window.innerWidth;
      const vh = containerRef.current?.clientHeight ?? window.innerHeight;
      const marginX = vw * EDGE_MARGIN_RATIO;
      const marginY = vh * EDGE_MARGIN_RATIO;
      const bounds = contentBounds.current;

      // maxT = leftmost camera can go (content's left edge at viewport left + margin)
      // minT = rightmost camera can go (content's right edge at viewport right - margin)
      const maxTx = -bounds.minX * t.scale + marginX;
      const minTx = vw - bounds.maxX * t.scale - marginX;
      const maxTy = -bounds.minY * t.scale + marginY;
      const minTy = vh - bounds.maxY * t.scale - marginY;

      if (maxTx > minTx) {
        // Content fits in viewport — clamp within range
        t.x = Math.max(minTx, Math.min(maxTx, t.x));
      } else {
        // Content larger than viewport — clamp (swap min/max)
        t.x = Math.max(maxTx, Math.min(minTx, t.x));
      }
      if (maxTy > minTy) {
        t.y = Math.max(minTy, Math.min(maxTy, t.y));
      } else {
        t.y = Math.max(maxTy, Math.min(minTy, t.y));
      }

      c.x += (t.x - c.x) * lerp;
      c.y += (t.y - c.y) * lerp;
      c.scale += (t.scale - c.scale) * lerp;

      if (worldRef.current) {
        worldRef.current.style.transform = `translate(${c.x}px, ${c.y}px) scale(${c.scale})`;
      }

      // Continue if not converged (includes momentum check)
      const dx = Math.abs(t.x - c.x);
      const dy = Math.abs(t.y - c.y);
      const ds = Math.abs(t.scale - c.scale);
      const hasVelocity = v.x !== 0 || v.y !== 0;

      if (
        dx > CONVERGENCE_EPSILON ||
        dy > CONVERGENCE_EPSILON ||
        ds > 0.0001 ||
        hasVelocity
      ) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        // Snap to target
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

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  /* ── Init layout & camera ── */

  useEffect(() => {
    const items = generateLayout(
      entries.map((e) => ({
        slug: e.slug,
        date: e.date,
        image: e.image,
        imageWidth: e.imageWidth,
        imageHeight: e.imageHeight,
      }))
    );
    setLayout(items);

    // Store content bounds for edge constraints
    if (items.length > 0) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const item of items) {
        minX = Math.min(minX, item.x);
        minY = Math.min(minY, item.y);
        maxX = Math.max(maxX, item.x + item.width);
        maxY = Math.max(maxY, item.y + item.height);
      }
      contentBounds.current = { minX, minY, maxX, maxY };
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const initial = getInitialCamera(items, vw, vh);

    // Store initial camera for reset (ASMV-62)
    initialCamera.current = { ...initial };

    // Set both current and target to initial (no animation on load)
    current.current = { ...initial };
    target.current = { ...initial };

    if (worldRef.current) {
      worldRef.current.style.transform = `translate(${initial.x}px, ${initial.y}px) scale(${initial.scale})`;
    }
    setReady(true);
  }, [entries]);

  /* ── Reset View (ASMV-62) ── */

  const resetView = useCallback(() => {
    // Kill any momentum
    velocity.current = { x: 0, y: 0 };

    // Animate target back to initial camera position
    target.current = { ...initialCamera.current };
    startAnimation();
  }, [startAnimation]);

  /* ── Pinch helpers (ASMV-63) ── */

  // These read from stable refs so no memoization needed
  const getPinchDistance = () => {
    const pts = Array.from(pointers.current.values());
    if (pts.length < 2) return 0;
    const dx = pts[0].x - pts[1].x;
    const dy = pts[0].y - pts[1].y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getPinchMidpoint = () => {
    const pts = Array.from(pointers.current.values());
    if (pts.length < 2) return { x: 0, y: 0 };
    return {
      x: (pts[0].x + pts[1].x) / 2,
      y: (pts[0].y + pts[1].y) / 2,
    };
  };

  /* ── Pointer Events ── */

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button === 2) return; // ignore right-click

      // Track this pointer for multi-touch
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.current.size === 2) {
        // Two pointers: start pinch
        isPinching.current = true;
        isDragging.current = false;
        initialPinchDist.current = getPinchDistance();
        initialPinchScale.current = target.current.scale;
        prevMidpoint.current = getPinchMidpoint();
        // Kill any existing momentum when starting a pinch
        velocity.current = { x: 0, y: 0 };
      } else if (pointers.current.size === 1) {
        // Single pointer: start drag
        isDragging.current = true;
        hasDragged.current = false;
        lastPointer.current = { x: e.clientX, y: e.clientY };
        dragOrigin.current = { x: e.clientX, y: e.clientY };
        velocityHistory.current = [];
        // Kill any existing momentum when starting a new drag
        velocity.current = { x: 0, y: 0 };
      }

      containerRef.current?.setPointerCapture(e.pointerId);
      if (containerRef.current && !isPinching.current) {
        containerRef.current.style.cursor = "grabbing";
      }
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      // Update tracked pointer position
      if (pointers.current.has(e.pointerId)) {
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }

      // Pinch zoom (two pointers)
      if (isPinching.current && pointers.current.size >= 2) {
        const dist = getPinchDistance();
        if (initialPinchDist.current > 0) {
          const ratio = dist / initialPinchDist.current;
          const newScale = Math.min(
            MAX_SCALE,
            Math.max(MIN_SCALE, initialPinchScale.current * ratio)
          );

          // Zoom toward pinch midpoint
          const container = containerRef.current;
          if (container) {
            const midpoint = getPinchMidpoint();
            const rect = container.getBoundingClientRect();
            const midX = midpoint.x - rect.left;
            const midY = midpoint.y - rect.top;

            // Convert midpoint to world coordinates at current target scale
            const worldX = (midX - target.current.x) / target.current.scale;
            const worldY = (midY - target.current.y) / target.current.scale;

            target.current.scale = newScale;
            target.current.x = midX - worldX * newScale;
            target.current.y = midY - worldY * newScale;

            // Two-finger pan: track midpoint delta
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

      // Single pointer drag
      if (!isDragging.current) return;

      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;

      // Check if we've moved past the drag threshold
      const totalDx = e.clientX - dragOrigin.current.x;
      const totalDy = e.clientY - dragOrigin.current.y;
      if (
        !hasDragged.current &&
        Math.sqrt(totalDx * totalDx + totalDy * totalDy) > DRAG_THRESHOLD
      ) {
        hasDragged.current = true;
      }

      // Screen-space offset: translate is applied before scale in the transform,
      // so 1:1 screen-pixel mapping gives constant pan speed at any zoom level
      target.current.x += dx;
      target.current.y += dy;

      // Track velocity samples for momentum (ASMV-62)
      const now = performance.now();
      velocityHistory.current.push({ x: dx, y: dy, t: now });
      if (velocityHistory.current.length > VELOCITY_SAMPLE_COUNT) {
        velocityHistory.current.shift();
      }

      lastPointer.current = { x: e.clientX, y: e.clientY };
      startAnimation();
    },
    [startAnimation]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      // Remove tracked pointer
      pointers.current.delete(e.pointerId);

      if (isPinching.current) {
        // If we go from 2 pointers to 1, transition out of pinch
        if (pointers.current.size < 2) {
          isPinching.current = false;
          // If one pointer remains, resume drag from its current position
          if (pointers.current.size === 1) {
            const remaining = Array.from(pointers.current.values())[0];
            isDragging.current = true;
            hasDragged.current = true; // Prevent click from firing after pinch
            lastPointer.current = { x: remaining.x, y: remaining.y };
            dragOrigin.current = { x: remaining.x, y: remaining.y };
            velocityHistory.current = [];
          }
        }
        containerRef.current?.releasePointerCapture(e.pointerId);
        return;
      }

      // Apply momentum from velocity history (ASMV-62)
      // Skip for reduced motion preference
      if (isDragging.current && hasDragged.current && !prefersReducedMotion.current) {
        const history = velocityHistory.current;
        if (history.length >= 2) {
          const now = performance.now();
          // Only use samples from the last 100ms for responsive feel
          const recentSamples = history.filter((s) => now - s.t < 100);
          if (recentSamples.length >= 1) {
            let totalDx = 0;
            let totalDy = 0;
            for (const s of recentSamples) {
              totalDx += s.x;
              totalDy += s.y;
            }
            velocity.current = {
              x: totalDx / recentSamples.length,
              y: totalDy / recentSamples.length,
            };
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

  /* ── Wheel Zoom (zoom toward cursor) ── */

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const t = target.current;
      const zoomFactor = e.deltaY > 0 ? ZOOM_FACTOR_OUT : ZOOM_FACTOR_IN;
      const newScale = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, t.scale * zoomFactor)
      );

      // Zoom toward cursor position
      const rect = container.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      // Convert cursor to world coordinates before scale change
      const worldX = (cursorX - t.x) / t.scale;
      const worldY = (cursorY - t.y) / t.scale;

      // Adjust offset so the world point under cursor stays under cursor
      target.current.scale = newScale;
      target.current.x = cursorX - worldX * newScale;
      target.current.y = cursorY - worldY * newScale;

      startAnimation();
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [startAnimation]);

  /* ── Keyboard navigation (ASMV-65) ── */

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Escape closes popover
      if (e.key === "Escape" && activeEntry) {
        setActiveEntry(null);
        return;
      }

      // Don't capture keys when popover is open
      if (activeEntry) return;

      // Arrow keys: pan
      const panStep = KEYBOARD_PAN_STEP;
      switch (e.key) {
        case "ArrowUp":
          target.current.y += panStep;
          startAnimation();
          e.preventDefault();
          break;
        case "ArrowDown":
          target.current.y -= panStep;
          startAnimation();
          e.preventDefault();
          break;
        case "ArrowLeft":
          target.current.x += panStep;
          startAnimation();
          e.preventDefault();
          break;
        case "ArrowRight":
          target.current.x -= panStep;
          startAnimation();
          e.preventDefault();
          break;
        case "=":
        case "+": {
          // Zoom in toward center
          const vw = containerRef.current?.clientWidth ?? window.innerWidth;
          const vh = containerRef.current?.clientHeight ?? window.innerHeight;
          const t = target.current;
          const newScale = Math.min(MAX_SCALE, t.scale * ZOOM_FACTOR_IN);
          const worldX = (vw / 2 - t.x) / t.scale;
          const worldY = (vh / 2 - t.y) / t.scale;
          target.current.scale = newScale;
          target.current.x = vw / 2 - worldX * newScale;
          target.current.y = vh / 2 - worldY * newScale;
          startAnimation();
          e.preventDefault();
          break;
        }
        case "-":
        case "_": {
          // Zoom out from center
          const vw = containerRef.current?.clientWidth ?? window.innerWidth;
          const vh = containerRef.current?.clientHeight ?? window.innerHeight;
          const t = target.current;
          const newScale = Math.max(MIN_SCALE, t.scale * ZOOM_FACTOR_OUT);
          const worldX = (vw / 2 - t.x) / t.scale;
          const worldY = (vh / 2 - t.y) / t.scale;
          target.current.scale = newScale;
          target.current.x = vw / 2 - worldX * newScale;
          target.current.y = vh / 2 - worldY * newScale;
          startAnimation();
          e.preventDefault();
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeEntry, startAnimation]);

  /* ── Render ── */

  const entryMap = useMemo(
    () => new Map(entries.map((e) => [e.slug, e])),
    [entries]
  );

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
      {/* Grain texture overlay */}
      <div className="grain-texture absolute inset-0 pointer-events-none z-10" />

      {/* World container — single CSS transform, no React re-renders */}
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
        {layout.map((item) => {
          const entry = entryMap.get(item.slug);
          if (!entry) return null;

          return (
            <div
              key={item.slug}
              className="absolute overflow-hidden"
              data-slug={item.slug}
              role="button"
              tabIndex={0}
              aria-label={entry.description || `Artifact from ${entry.date}`}
              style={{
                left: item.x,
                top: item.y,
                width: item.width,
                height: item.height,
                transform: item.rotation ? `rotate(${item.rotation}deg)` : undefined,
                zIndex: item.zIndex,
              }}
              onClick={() => {
                if (!hasDragged.current) {
                  setActiveEntry(entry);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveEntry(entry);
                }
              }}
            >
              <div className="artifact-treatment w-full h-full cursor-pointer hover:scale-[1.02] transition-transform duration-200 ease-out">
                {isVideo(entry.image) ? (
                  <LazyVideo src={entry.image} />
                ) : (
                  <Image
                    src={entry.image}
                    alt={entry.description || `Artifact from ${entry.date}`}
                    width={item.width}
                    height={item.height}
                    className="w-full h-full object-contain pointer-events-none"
                    loading="lazy"
                    unoptimized
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Title overlay — pushed below header */}
      <div className="absolute top-20 left-[2.5vw] z-20 pointer-events-none">
        <h1
          className="font-serif font-bold italic text-ink"
          style={{ fontSize: "clamp(1.25rem, 2.5vw, 2rem)" }}
        >
          the studio desk
        </h1>
        <ul
          className="font-mono text-ink-lighter uppercase mt-1 space-y-0.5"
          style={{
            fontSize: "clamp(0.55rem, 0.7vw, 0.65rem)",
            letterSpacing: "0.1em",
          }}
        >
          <li>drag to explore</li>
          <li>{isTouchDevice ? "pinch to zoom" : "scroll to zoom"}</li>
          <li>{isTouchDevice ? "tap to view" : "click to view"}</li>
        </ul>
      </div>

      {/* Right-side note */}
      <div className="absolute top-20 right-[2.5vw] z-20 pointer-events-none text-right">
        <p
          className="font-mono text-ink-lighter"
          style={{
            fontSize: "clamp(0.55rem, 0.7vw, 0.65rem)",
            letterSpacing: "0.05em",
          }}
        >
          updated daily by claude
          <br />
          with a /update-site skill
        </p>
      </div>

      {/* Reset view button (ASMV-62) */}
      <button
        onClick={resetView}
        className="absolute right-6 z-20 pointer-events-auto
          px-3 py-1.5 rounded font-mono text-xs uppercase tracking-wider
          bg-surface/80 backdrop-blur-sm text-ink-light
          ring-1 ring-border hover:bg-surface hover:text-ink
          transition-all duration-200"
        style={{
          fontSize: "0.65rem",
          letterSpacing: "0.08em",
          bottom: "max(1.5rem, env(safe-area-inset-bottom, 1.5rem))",
        }}
      >
        Reset view
      </button>

      {/* Popover detail view (ASMV-64) */}
      {activeEntry && (
        <ArtifactPopover
          entry={activeEntry}
          onClose={() => setActiveEntry(null)}
        />
      )}
    </div>
  );
}
