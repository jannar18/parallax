"use client";

import { useRef, useState, useCallback, useEffect } from "react";
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
 * ClipReel — vertical scroll version.
 * Clips stack vertically, each viewport-height. Auto-play on scroll into view.
 * First clip has riso cover. Normal page scroll reveals clips one by one.
 */
export default function ClipReel() {
  return (
    <>
      {CLIPS.map((src, i) => (
        <ClipItem key={src} src={src} hasRisoCover={i === 0} />
      ))}
    </>
  );
}

function ClipItem({ src, hasRisoCover }: { src: string; hasRisoCover: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Auto-play when clip scrolls into view, pause when it leaves
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play();
          setPlaying(true);
        } else {
          videoRef.current?.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
      ref={containerRef}
      className="relative flex h-screen w-full items-center justify-center cursor-pointer"
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
