"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

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

export default function ClipReel() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [slideProgress, setSlideProgress] = useState<number[]>(
    () => Array(TOTAL_SLIDES).fill(0)
  );

  useEffect(() => {
    const onScroll = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const scrolled = -wrapper.getBoundingClientRect().top;
      const sh = window.innerHeight;

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
      style={{ height: `${TOTAL_SLIDES * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Slide 0: Riso cover — same size as video clips, right-aligned */}
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
          <ClipSlide
            key={src}
            src={src}
            z={TOTAL_SLIDES - 1 - i}
            wipe={slideProgress[i + 1]}
            active={
              slideProgress[i + 1] < 1 &&
              slideProgress[i] >= 1
            }
          />
        ))}

        {/* Wipe line — thin scarlet line at the active wipe edge */}
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

function ClipSlide({
  src,
  z,
  wipe,
  active,
}: {
  src: string;
  z: number;
  wipe: number;
  active: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (active) {
      videoRef.current?.play();
      setPlaying(true);
    } else {
      videoRef.current?.pause();
      setPlaying(false);
    }
  }, [active]);

  const handleClick = useCallback(() => {
    if (playing) {
      videoRef.current?.pause();
      setPlaying(false);
    } else {
      videoRef.current?.play();
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
