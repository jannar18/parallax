"use client";

import { useRef, useState, useEffect, useCallback } from "react";

// Riso thumbnail is slide 0, then 16 video clips
const RISO_COVER = "/images/home/merge.riso.1.png";
const CLIPS = [
  "/videos/software/arch-voice-mcp/clip-01.mov",
  "/videos/software/arch-voice-mcp/clip-02.mp4",
  "/videos/software/arch-voice-mcp/clip-03.mp4",
  "/videos/software/arch-voice-mcp/clip-04.mp4",
  "/videos/software/arch-voice-mcp/clip-05.mov",
  "/videos/software/arch-voice-mcp/clip-06.mov",
  "/videos/software/arch-voice-mcp/clip-07.mov",
  "/videos/software/arch-voice-mcp/clip-08.mov",
  "/videos/software/arch-voice-mcp/clip-09.mov",
  "/videos/software/arch-voice-mcp/clip-10.mov",
  "/videos/software/arch-voice-mcp/clip-11.mov",
  "/videos/software/arch-voice-mcp/clip-12.mov",
  "/videos/software/arch-voice-mcp/clip-13.mov",
  "/videos/software/arch-voice-mcp/clip-14.mov",
  "/videos/software/arch-voice-mcp/clip-15.mp4",
  "/videos/software/arch-voice-mcp/clip-16.mp4",
];

const TOTAL_SLIDES = 1 + CLIPS.length; // riso cover + clips

/* ─────────────────────────────────────────────
 * Desktop: scroll-driven clip-path wipe
 * ───────────────────────────────────────────── */

function DesktopClipReel() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [slideProgress, setSlideProgress] = useState<number[]>(
    () => Array(TOTAL_SLIDES).fill(0)
  );

  useEffect(() => {
    const onScroll = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const scrolled = -wrapper.getBoundingClientRect().top;
      const sh = wrapper.clientHeight / TOTAL_SLIDES;

      setSlideProgress(
        Array.from({ length: TOTAL_SLIDES }, (_, i) => {
          const p = (scrolled - i * sh) / sh;
          return Math.max(0, Math.min(1, p));
        })
      );
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{ height: `${TOTAL_SLIDES * 100}dvh` }}
    >
      <div className="sticky top-0 w-full overflow-hidden" style={{ height: "100dvh" }}>
        {/* Slide 0: Riso cover */}
        <div
          className="absolute inset-0 flex items-center justify-end"
          style={{
            zIndex: TOTAL_SLIDES,
            clipPath: `inset(0 0 ${slideProgress[0] * 100}% 0)`,
          }}
        >
          <img
            src={RISO_COVER}
            alt="Architecture and software merged"
            className="h-full w-auto object-contain"
          />
        </div>

        {/* Slides 1–16: Video clips */}
        {CLIPS.map((src, i) => (
          <DesktopClipSlide
            key={src}
            src={src}
            z={TOTAL_SLIDES - 1 - i}
            wipe={slideProgress[i + 1]}
          />
        ))}

        {/* Wipe line */}
        {(() => {
          const idx = slideProgress.findIndex((p) => p > 0 && p < 1);
          if (idx === -1) return null;
          return (
            <div
              className="absolute left-0 right-0 pointer-events-none"
              style={{
                top: `${(1 - slideProgress[idx]) * 100}%`,
                height: "2px",
                backgroundColor: "var(--color-scarlet)",
                zIndex: TOTAL_SLIDES + 1,
              }}
            />
          );
        })()}
      </div>
    </div>
  );
}

function DesktopClipSlide({
  src,
  z,
  wipe,
}: {
  src: string;
  z: number;
  wipe: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handleClick = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
      setPlaying(false);
    } else {
      v.play().catch(() => {});
      setPlaying(true);
    }
  }, [playing]);

  return (
    <div
      className="absolute inset-0 flex items-center justify-end cursor-pointer"
      style={{
        zIndex: z,
        clipPath: `inset(0 0 ${wipe * 100}% 0)`,
      }}
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-auto object-contain"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
 * Mobile: tap-through gallery
 * ───────────────────────────────────────────── */

function MobileClipReel() {
  const [current, setCurrent] = useState(-1); // -1 = riso cover
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const total = CLIPS.length;
  const isRiso = current === -1;

  // Swap src on a single persistent <video> element — no remounting.
  // iOS Safari handles one video element far better than creating new ones.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isRiso) {
      v.removeAttribute("src");
      v.load();
      setPlaying(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    v.src = CLIPS[current];
    v.load();
    const onCanPlay = () => {
      setLoading(false);
      v.play().catch(() => {});
      setPlaying(true);
    };
    v.addEventListener("canplay", onCanPlay, { once: true });
    return () => v.removeEventListener("canplay", onCanPlay);
  }, [current, isRiso]);

  const next = () => setCurrent((c) => (c < total - 1 ? c + 1 : c));
  const prev = () => setCurrent((c) => (c > -1 ? c - 1 : c));

  const togglePlay = () => {
    if (isRiso) { next(); return; }
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
      setPlaying(false);
    } else {
      v.play().catch(() => {});
      setPlaying(true);
    }
  };

  return (
    <div className="relative w-full bg-black" style={{ height: "100dvh" }}>
      {/* Single persistent video element — hidden when showing riso cover */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        className={`absolute inset-0 h-full w-full object-contain ${isRiso ? "hidden" : ""}`}
      />

      {/* Riso cover */}
      {isRiso && (
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={RISO_COVER}
            alt="Architecture and software merged"
            className="h-full w-auto object-contain"
          />
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-paper/30 border-t-scarlet rounded-full animate-spin" />
        </div>
      )}

      {/* Tap overlay for play/pause */}
      <div className="absolute inset-0 z-[5]" onClick={togglePlay} />

      {/* Prev button — left edge */}
      {current > -1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-0 top-0 bottom-0 w-16 z-10 flex items-center justify-center text-paper/40 active:text-paper/80 transition-colors"
          aria-label="Previous clip"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* Next button — right edge */}
      {current < total - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-0 top-0 bottom-0 w-16 z-10 flex items-center justify-center text-paper/40 active:text-paper/80 transition-colors"
          aria-label="Next clip"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Progress dots */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1.5">
        {Array.from({ length: total + 1 }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i - 1)}
            className={`rounded-full transition-all ${
              i - 1 === current
                ? "w-2 h-2 bg-scarlet"
                : "w-1.5 h-1.5 bg-paper/30"
            }`}
            aria-label={i === 0 ? "Cover" : `Clip ${i}`}
          />
        ))}
      </div>

      {/* Clip counter */}
      <div className="absolute top-4 right-4 z-20">
        <p className="font-mono text-paper/50" style={{ fontSize: "0.7rem" }}>
          {isRiso ? "cover" : `${current + 1} / ${total}`}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
 * Export: picks layout based on screen width
 * ───────────────────────────────────────────── */

export default function ClipReel() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Detect touch device once — stays stable across orientation changes
    // so rotating to landscape doesn't switch to the desktop scroll wipe.
    setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
    setMounted(true);
  }, []);

  // Avoid hydration mismatch — render nothing until client-side check
  if (!mounted) return <div style={{ height: "100dvh" }} />;

  return isMobile ? <MobileClipReel /> : <DesktopClipReel />;
}
