"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  createInitialState,
  detectPerfTier,
  generateWireNetwork,
  drawFrame,
  getMetadataLeft,
  getMetadataRight,
  getMetadataBottom,
  PHOTO_COUNT,
  type HeroState,
  type MetadataBottomItem,
} from "@/lib/hero-canvas";

export default function HeroBrandVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stickyRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HeroState>(createInitialState());
  const rafRef = useRef<number>(0);
  const photosRef = useRef<HTMLImageElement[]>([]);
  const isVisibleRef = useRef(true);

  const [metadataLeft, setMetadataLeft] = useState("");
  const [metadataRight, setMetadataRight] = useState("");
  const [metadataBottom, setMetadataBottom] = useState<MetadataBottomItem[]>([]);
  const [hintVisible, setHintVisible] = useState(true);

  // ── Image Preloading ──
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= PHOTO_COUNT; i++) {
      const img = new Image();
      img.src = `/images/hero/photo-${String(i).padStart(2, "0")}.jpg`;
      imgs.push(img);
    }
    photosRef.current = imgs;
  }, []);

  // ── Canvas Resize ──
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = stickyRef.current;
    if (!canvas || !container) return;

    const s = stateRef.current;
    s.perfTier = detectPerfTier();

    // DPR: retina on desktop (capped at 2x), 1x on mobile for performance
    const dpr = s.perfTier === "low" ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    s.dpr = dpr;

    const cssW = container.clientWidth;
    const cssH = container.clientHeight;

    // Set canvas backing store to DPR-scaled size
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    // State dimensions remain in CSS pixels (drawing code uses these)
    s.W = cssW;
    s.H = cssH;

    s.wireNetwork = generateWireNetwork(s.perfTier);
  }, []);

  // ── Scroll-Driven Rotation ──
  useEffect(() => {
    const handleScroll = () => {
      const el = scrollRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const scrollRange = el.clientHeight - window.innerHeight;
      if (scrollRange <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / scrollRange));

      // Ease function for smooth fold/unfold
      const ease = (t: number) =>
        t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      // Fold in → stay merged
      let rotation: number;
      if (progress <= 0.5) {
        rotation = ease(progress / 0.5);
      } else {
        rotation = 1;
      }

      // Set directly — no lerp lag for scroll-driven animation
      stateRef.current.rotation = rotation;
      stateRef.current.targetRotation = rotation;

      if (progress > 0.03) setHintVisible(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Animation Loop ──
  useEffect(() => {
    handleResize();
    let skipFrame = false;

    const loop = () => {
      if (!isVisibleRef.current) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const s = stateRef.current;

      // Throttle to ~30fps on mobile: skip every other frame
      if (s.perfTier === "low") {
        skipFrame = !skipFrame;
        if (skipFrame) {
          rafRef.current = requestAnimationFrame(loop);
          return;
        }
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Scale context for DPR — drawing code uses CSS pixel coordinates
      const dpr = s.dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      drawFrame(ctx, s, photosRef.current);

      if (s.frame % 30 === 0) {
        setMetadataLeft(getMetadataLeft(s));
        setMetadataRight(getMetadataRight(s));
        setMetadataBottom(getMetadataBottom(s));
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [handleResize]);

  // ── Resize ──
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // ── Intersection Observer (pause rAF offscreen) ──
  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Parallax + dblclick wireframe regen ──
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const s = stateRef.current;
      s.targetMX = e.clientX / (s.W || 1);
      s.targetMY = e.clientY / (s.H || 1);
    };

    const handleDblClick = () => {
      const s = stateRef.current;
      s.wireNetwork = generateWireNetwork(s.perfTier);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("dblclick", handleDblClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("dblclick", handleDblClick);
    };
  }, []);

  return (
    <div ref={scrollRef} className="relative" style={{ height: "150vh" }}>
      <section
        ref={stickyRef}
        className="sticky top-0 h-screen overflow-hidden"
      >
        {/* Canvas layer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ zIndex: 1 }}
        />

        {/* UI overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 2 }}
        >
          {/* Left metadata column */}
          <div
            className="absolute left-7 top-1/2 -translate-y-1/2 font-mono uppercase whitespace-pre"
            style={{
              writingMode: "vertical-rl",
              fontSize: "8.75px",
              fontWeight: 300,
              letterSpacing: "1.8px",
              lineHeight: 1.8,
              color: "rgba(var(--color-ink-rgb),0.26)",
            }}
          >
            {metadataLeft}
          </div>

          {/* Right metadata column */}
          <div
            className="absolute right-7 top-1/2 -translate-y-1/2 font-mono uppercase whitespace-pre"
            style={{
              writingMode: "vertical-rl",
              transform: "translateY(-50%) rotate(180deg)",
              fontSize: "8.75px",
              fontWeight: 300,
              letterSpacing: "1.8px",
              lineHeight: 1.8,
              color: "rgba(var(--color-ink-rgb),0.26)",
            }}
          >
            {metadataRight}
          </div>

          {/* Hint text */}
          {hintVisible && (
            <div
              className="absolute bottom-12 left-1/2 -translate-x-1/2 font-mono uppercase animate-breathe"
              style={{
                fontSize: "8.25px",
                fontWeight: 300,
                letterSpacing: "3px",
                color: "rgba(var(--color-ink-rgb),0.13)",
              }}
            >
              scroll to merge worlds
            </div>
          )}

          {/* Bottom metadata bar */}
          <div
            className="absolute bottom-[22px] left-0 right-0 flex justify-center items-center gap-5 font-mono uppercase"
            style={{
              fontSize: "8.25px",
              fontWeight: 300,
              letterSpacing: "3.5px",
              color: "rgba(var(--color-ink-rgb),0.19)",
            }}
          >
            {metadataBottom.map((item, i) =>
              item.type === "sep" ? (
                <span
                  key={i}
                  className="inline-block w-[3px] h-[3px] rounded-full"
                  style={{ background: "rgba(var(--color-ink-rgb),0.16)" }}
                />
              ) : (
                <span key={i}>{item.value}</span>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
