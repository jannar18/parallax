"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";

// Riso thumbnail is slide 0, then 16 video clips
const RISO_COVER = "/images/home/merge.riso.1.png";
const CLIPS = [
  "/videos/software/arch-voice-mcp/clip-01.mp4",
  "/videos/software/arch-voice-mcp/clip-02.mp4",
  "/videos/software/arch-voice-mcp/clip-03.mp4",
  "/videos/software/arch-voice-mcp/clip-04.mp4",
  "/videos/software/arch-voice-mcp/clip-05.mp4",
  "/videos/software/arch-voice-mcp/clip-06.mp4",
  "/videos/software/arch-voice-mcp/clip-07.mp4",
  "/videos/software/arch-voice-mcp/clip-08.mp4",
  "/videos/software/arch-voice-mcp/clip-09.mp4",
  "/videos/software/arch-voice-mcp/clip-10.mp4",
  "/videos/software/arch-voice-mcp/clip-11.mp4",
  "/videos/software/arch-voice-mcp/clip-12.mp4",
  "/videos/software/arch-voice-mcp/clip-13.mp4",
  "/videos/software/arch-voice-mcp/clip-14.mp4",
  "/videos/software/arch-voice-mcp/clip-15.mp4",
  "/videos/software/arch-voice-mcp/clip-16.mp4",
];

// Hidden <video preload="auto"> elements warm the browser's HTTP cache for
// upcoming clips so the next swap is (near-)instant. When a clip's URL is
// later set on the visible element, ranged responses come from cache.
function PrefetchClips({ indices }: { indices: number[] }) {
  return (
    <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0 pointer-events-none">
      {indices.map((i) => (
        <video key={i} src={CLIPS[i]} preload="auto" muted playsInline />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
 * Desktop: click-driven gallery with side tracker
 * ───────────────────────────────────────────── */

function DesktopClipReel() {
  const [current, setCurrent] = useState(-1); // -1 = riso cover, 0..n = clip index
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false); // true between src swap and canplay+play
  const [autoAdvance, setAutoAdvance] = useState(false); // playthrough mode
  const videoRef = useRef<HTMLVideoElement>(null);

  const isCover = current === -1;
  const lastIdx = CLIPS.length - 1;

  // Swap src on the single persistent <video> element when `current` changes.
  // Cover slot is the entry point: it shows the play button and clicking it
  // kicks off playthrough mode (autoAdvance=true) starting at clip 01. Once
  // playthrough is on, the `ended` handler advances to the next clip. The
  // user can pause / resume / jump via tracker or arrows without leaving
  // playthrough mode. Returning to the cover resets playthrough.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isCover) {
      v.removeAttribute("src");
      v.load();
      setPlaying(false);
      setLoading(false);
      setAutoAdvance(false);
      return;
    }
    v.src = CLIPS[current];
    setPlaying(false);
    setLoading(true);
    // loadedmetadata fires as soon as duration is known (earlier than canplay),
    // so we can seek + request play sooner; play() will wait on buffering.
    const onReady = () => {
      try {
        v.currentTime = 0;
      } catch {
        /* ignore — some browsers throw if duration not yet known */
      }
      v.play()
        .then(() => {
          setPlaying(true);
          setLoading(false);
        })
        .catch(() => {
          // autoplay blocked — drop loading so the play hint appears and the
          // user can click to start
          setLoading(false);
        });
    };
    v.addEventListener("loadedmetadata", onReady, { once: true });
    return () => v.removeEventListener("loadedmetadata", onReady);
  }, [current, isCover]);

  const goPrev = useCallback(
    () => setCurrent((c) => Math.max(-1, c - 1)),
    []
  );
  const goNext = useCallback(
    () => setCurrent((c) => Math.min(lastIdx, c + 1)),
    [lastIdx]
  );

  const handleVideoClick = useCallback(() => {
    // On the cover, a click means "start playthrough from clip 01".
    if (isCover) {
      setAutoAdvance(true);
      setCurrent(0);
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
      setPlaying(false);
      return;
    }
    // If video has already ended, restart from 0; otherwise resume.
    if (v.ended || (v.duration && v.currentTime >= v.duration - 0.05)) {
      v.currentTime = 0;
    }
    v.play().catch(() => {});
    setPlaying(true);
  }, [isCover, playing]);

  const handleEnded = useCallback(() => {
    setPlaying(false);
    // Playthrough mode: hop to the next clip if there is one. Otherwise the
    // browser holds the last frame, which is exactly what we want.
    if (autoAdvance) {
      setCurrent((c) => (c < lastIdx ? c + 1 : c));
    }
  }, [autoAdvance, lastIdx]);

  // Build tracker rows: cover + every clip
  const rows: Array<{ idx: number; label: string }> = [
    { idx: -1, label: "Cover" },
    ...CLIPS.map((_, i) => ({
      idx: i,
      label: `Clip ${String(i + 1).padStart(2, "0")}`,
    })),
  ];

  // Prefetch a sliding window around the current clip so neighbor swaps
  // (next chevron, tracker jumps, auto-advance) hit a warm cache. On the
  // cover, prime clip-01 + clip-02 so pressing play feels instant.
  const prefetchIndices = useMemo(() => {
    if (isCover) return [0, 1].filter((i) => i < CLIPS.length);
    const window = [current - 1, current + 1, current + 2];
    return window.filter((i) => i >= 0 && i < CLIPS.length && i !== current);
  }, [current, isCover]);

  return (
    <section className="relative h-screen bg-paper overflow-hidden">
      <PrefetchClips indices={prefetchIndices} />
      {/* Video stage — click to play/pause */}
      <div
        className="absolute inset-0 flex items-center justify-end cursor-pointer"
        onClick={handleVideoClick}
      >
        <div className="relative h-full">
          <video
            ref={videoRef}
            muted
            playsInline
            preload="metadata"
            onEnded={handleEnded}
            className={`block h-full w-auto object-contain ${isCover ? "hidden" : ""}`}
          />
          {isCover && (
            <img
              src={RISO_COVER}
              alt="Architecture and software merged"
              className="block h-full w-auto object-contain pointer-events-none"
            />
          )}

          {/* Play indicator — visible on the cover (entry point to playthrough)
              and on any paused/ended clip. Hidden during playback and during
              the load-and-autoplay window so it doesn't flash. */}
          <div
            className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
              playing || loading ? "opacity-0" : "opacity-100"
            }`}
          >
            <svg
              width="96"
              height="96"
              viewBox="0 0 24 24"
              fill="var(--color-scarlet)"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tracker — leftover space on the left */}
      <nav
        className="absolute left-[5vw] top-1/2 -translate-y-1/2 z-10 flex flex-col gap-[1vh]"
        aria-label="Clip tracker"
      >
        {rows.map(({ idx, label }) => {
          const active = idx === current;
          return (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrent(idx);
              }}
              className={`group flex items-center gap-3 font-mono uppercase transition-colors ${
                active ? "text-scarlet" : "text-ink-lighter hover:text-ink"
              }`}
              style={{
                fontSize: "clamp(0.65rem, 0.8vw, 0.8rem)",
                letterSpacing: "var(--tracking-wider)",
              }}
              aria-current={active ? "true" : undefined}
            >
              <span
                className={`block w-2 h-2 rounded-full border transition-all ${
                  active
                    ? "bg-scarlet border-scarlet"
                    : "border-ink-lighter group-hover:border-ink"
                }`}
              />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Prev chevron — bottom-left so it doesn't fight the tracker */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        disabled={current === -1}
        className="absolute left-[5vw] bottom-[5vh] z-20 w-12 h-12 flex items-center justify-center text-scarlet hover:text-ink disabled:opacity-25 disabled:hover:text-scarlet disabled:cursor-not-allowed transition-colors"
        aria-label="Previous clip"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Next chevron — bottom-right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        disabled={current === lastIdx}
        className="absolute right-[3vw] bottom-[5vh] z-20 w-12 h-12 flex items-center justify-center text-scarlet hover:text-ink disabled:opacity-25 disabled:hover:text-scarlet disabled:cursor-not-allowed transition-colors"
        aria-label="Next clip"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </section>
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
    const onReady = () => {
      setLoading(false);
      v.play().catch(() => {});
      setPlaying(true);
    };
    v.addEventListener("loadedmetadata", onReady, { once: true });
    return () => v.removeEventListener("loadedmetadata", onReady);
  }, [current, isRiso]);

  const prefetchIndices = useMemo(() => {
    if (isRiso) return [0, 1].filter((i) => i < CLIPS.length);
    const window = [current - 1, current + 1, current + 2];
    return window.filter((i) => i >= 0 && i < CLIPS.length && i !== current);
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
      <PrefetchClips indices={prefetchIndices} />
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
