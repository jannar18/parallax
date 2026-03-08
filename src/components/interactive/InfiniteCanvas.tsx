"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  generateLayout,
  getInitialCamera,
  type CanvasItemLayout,
} from "@/lib/canvas-layout";

/* ── Types ── */

interface CanvasEntry {
  slug: string;
  date: string;
  mood?: string;
  image: string;
  project?: string;
  description?: string;
}

interface InfiniteCanvasProps {
  entries: CanvasEntry[];
}

function isVideo(src: string) {
  return /\.(mov|mp4|webm)$/i.test(src);
}

/* ── Constants ── */
const MIN_SCALE = 0.2;
const MAX_SCALE = 2.5;
const ZOOM_FACTOR_IN = 1.08;
const ZOOM_FACTOR_OUT = 0.92;
const DRAG_THRESHOLD = 5;
const LERP_FACTOR = 0.12;
const CONVERGENCE_EPSILON = 0.01;
const MOMENTUM_DECAY = 0.95;
const MOMENTUM_MIN = 0.1;
const VELOCITY_SAMPLE_COUNT = 5;

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
  const [activeEntry, setActiveEntry] = useState<CanvasEntry | null>(null);

  // Mobile detection for hint text
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Layout
  const [layout, setLayout] = useState<CanvasItemLayout[]>([]);
  const [ready, setReady] = useState(false);

  // Detect touch capability
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  /* ── rAF animation loop ── */

  const startAnimation = useCallback(() => {
    if (animating.current) return;
    animating.current = true;

    const tick = () => {
      const c = current.current;
      const t = target.current;
      const v = velocity.current;

      // Apply momentum to target (decaying each frame)
      if (v.x !== 0 || v.y !== 0) {
        t.x += v.x;
        t.y += v.y;
        v.x *= MOMENTUM_DECAY;
        v.y *= MOMENTUM_DECAY;
        if (Math.abs(v.x) < MOMENTUM_MIN && Math.abs(v.y) < MOMENTUM_MIN) {
          v.x = 0;
          v.y = 0;
        }
      }

      c.x += (t.x - c.x) * LERP_FACTOR;
      c.y += (t.y - c.y) * LERP_FACTOR;
      c.scale += (t.scale - c.scale) * LERP_FACTOR;

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
      entries.map((e) => ({ slug: e.slug, date: e.date, image: e.image }))
    );
    setLayout(items);

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
    return {
      x: (pts[0].x + pts[1].x) / 2,
      y: (pts[0].y + pts[1].y) / 2,
    };
  }, []);

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
    [getPinchDistance, getPinchMidpoint]
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
    [startAnimation, getPinchDistance, getPinchMidpoint]
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
      if (isDragging.current && hasDragged.current) {
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

  /* ── Escape key closes popover (ASMV-64) ── */

  useEffect(() => {
    if (!activeEntry) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveEntry(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeEntry]);

  /* ── Render ── */

  const entryMap = new Map(entries.map((e) => [e.slug, e]));

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
              className="absolute"
              data-slug={item.slug}
              style={{
                left: item.x,
                top: item.y,
                width: item.width,
                height: item.height,
                transform: `rotate(${item.rotation}deg)`,
                zIndex: item.zIndex,
              }}
              onClick={() => {
                if (!hasDragged.current) {
                  setActiveEntry(entry);
                }
              }}
            >
              <div className="artifact-treatment relative w-full h-full rounded-sm cursor-pointer">
                {isVideo(entry.image) ? (
                  <video
                    src={entry.image}
                    muted
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-cover rounded-sm pointer-events-none"
                  />
                ) : (
                  <Image
                    src={entry.image}
                    alt={entry.description || `Artifact from ${entry.date}`}
                    fill
                    sizes={`${item.width}px`}
                    className="object-cover rounded-sm pointer-events-none"
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
      <div className="absolute top-6 left-6 z-20 pointer-events-none">
        <h1
          className="font-serif font-bold italic text-ink"
          style={{ fontSize: "clamp(1.25rem, 2.5vw, 2rem)" }}
        >
          the studio desk
        </h1>
        <p
          className="font-mono text-ink-lighter uppercase"
          style={{
            fontSize: "clamp(0.55rem, 0.7vw, 0.65rem)",
            letterSpacing: "0.1em",
          }}
        >
          {isTouchDevice
            ? "drag to explore \u00B7 pinch to zoom \u00B7 tap to view"
            : "drag to explore \u00B7 scroll to zoom \u00B7 click to view"}
        </p>
      </div>

      {/* Reset view button (ASMV-62) */}
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

      {/* Popover detail view (ASMV-64) */}
      {activeEntry && (
        <>
          {/* Scrim */}
          <div
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm"
            onClick={() => setActiveEntry(null)}
          />

          {/* Card */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-8 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-3xl rounded-lg bg-surface shadow-2xl ring-1 ring-border overflow-hidden">
              <div className="bg-paper p-6">
                {isVideo(activeEntry.image) ? (
                  <video
                    src={activeEntry.image}
                    muted
                    autoPlay
                    loop
                    playsInline
                    controls
                    className="mx-auto h-auto max-h-[75vh] w-auto object-contain"
                  />
                ) : (
                  <Image
                    src={activeEntry.image}
                    alt={
                      activeEntry.description ||
                      `Artifact from ${activeEntry.date}`
                    }
                    width={1200}
                    height={1200}
                    className="mx-auto h-auto max-h-[75vh] w-auto object-contain"
                    unoptimized
                  />
                )}
              </div>

              <div className="px-5 py-4">
                <p
                  className="font-sans text-ink-lighter uppercase"
                  style={{ fontSize: "0.7rem", letterSpacing: "0.1em" }}
                >
                  {activeEntry.date}
                  {activeEntry.mood && (
                    <span className="ml-2 normal-case italic text-ink-light">
                      {activeEntry.mood}
                    </span>
                  )}
                </p>
                {activeEntry.project && (
                  <p className="mt-1 font-mono text-xs text-ink-light">
                    {activeEntry.project}
                  </p>
                )}
                {activeEntry.description && (
                  <p className="mt-2 text-sm text-ink-light leading-relaxed">
                    {activeEntry.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
