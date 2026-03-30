"use client";

import { useRef, useState, useCallback, useEffect, forwardRef } from "react";
import Image from "next/image";

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

/**
 * ClipReel — horizontally scrollable video clips.
 * First clip centered via a spacer sized by ResizeObserver.
 * Riso cover on first clip only.
 */
export default function ClipReel() {
  const firstRef = useRef<HTMLDivElement>(null);
  const [spacer, setSpacer] = useState("50vw");

  useEffect(() => {
    const el = firstRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) setSpacer(`calc(100vw - ${w}px)`);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="flex h-full items-center overflow-x-auto scrollbar-hide gap-[2vw]">
      <div className="flex-shrink-0" style={{ width: spacer }} />
      {CLIPS.map((src, i) => (
        <ClipItem
          key={src}
          src={src}
          hasRisoCover={i === 0}
          ref={i === 0 ? firstRef : undefined}
        />
      ))}
      <div className="flex-shrink-0 w-[3vw]" />
    </div>
  );
}

const ClipItem = forwardRef<HTMLDivElement, { src: string; hasRisoCover: boolean }>(
  function ClipItem({ src, hasRisoCover }, ref) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);

    const play = useCallback(() => {
      videoRef.current?.play();
      setPlaying(true);
    }, []);

    const pause = useCallback(() => {
      videoRef.current?.pause();
      setPlaying(false);
    }, []);

    const handleClick = useCallback(() => {
      if (playing) pause();
      else play();
    }, [playing, play, pause]);

    return (
      <div
        ref={ref}
        className="relative flex-shrink-0 cursor-pointer"
        style={{ height: "100vh" }}
        onMouseEnter={play}
        onMouseLeave={pause}
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

        {hasRisoCover && (
          <Image
            src="/images/home/merge.riso.1.png"
            alt="Architecture and software merged"
            fill
            className={`object-cover pointer-events-none transition-opacity duration-[2500ms] ease-in-out ${
              playing ? "opacity-0" : "opacity-100"
            }`}
            unoptimized
          />
        )}
      </div>
    );
  }
);
