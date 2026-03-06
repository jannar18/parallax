"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  createInitialState,
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
    s.W = canvas.width = container.clientWidth;
    s.H = canvas.height = container.clientHeight;
    s.wireNetwork = generateWireNetwork();
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

      // Fold in → hold merged → unfold back to thin lines
      let rotation: number;
      if (progress <= 0.35) {
        rotation = ease(progress / 0.35);
      } else if (progress <= 0.65) {
        rotation = 1;
      } else {
        rotation = 1 - ease((progress - 0.65) / 0.35);
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

    const loop = () => {
      if (!isVisibleRef.current) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const s = stateRef.current;
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
      stateRef.current.wireNetwork = generateWireNetwork();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("dblclick", handleDblClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("dblclick", handleDblClick);
    };
  }, []);

  return (
    <div ref={scrollRef} className="relative" style={{ height: "200vh" }}>
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
              fontSize: "8px",
              fontWeight: 300,
              letterSpacing: "1.8px",
              lineHeight: 1.8,
              color: "rgba(44,40,36,0.22)",
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
              fontSize: "8px",
              fontWeight: 300,
              letterSpacing: "1.8px",
              lineHeight: 1.8,
              color: "rgba(44,40,36,0.22)",
            }}
          >
            {metadataRight}
          </div>

          {/* Hint text */}
          {hintVisible && (
            <div
              className="absolute bottom-12 left-1/2 -translate-x-1/2 font-mono uppercase animate-breathe"
              style={{
                fontSize: "7.5px",
                fontWeight: 300,
                letterSpacing: "3px",
                color: "rgba(44,40,36,0.1)",
              }}
            >
              scroll to merge worlds
            </div>
          )}

          {/* Bottom metadata bar */}
          <div
            className="absolute bottom-[22px] left-0 right-0 flex justify-center items-center gap-5 font-mono uppercase"
            style={{
              fontSize: "7.5px",
              fontWeight: 300,
              letterSpacing: "3.5px",
              color: "rgba(44,40,36,0.16)",
            }}
          >
            {metadataBottom.map((item, i) =>
              item.type === "sep" ? (
                <span
                  key={i}
                  className="inline-block w-[3px] h-[3px] rounded-full"
                  style={{ background: "rgba(44,40,36,0.13)" }}
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
