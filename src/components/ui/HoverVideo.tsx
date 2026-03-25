"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface HoverVideoProps {
  src?: string;
  poster?: string;
  fallbackImage?: string;
  alt: string;
}

/**
 * HoverVideo — shows a poster/image by default, plays video on hover.
 * Falls back to static image if no video src provided.
 * On touch devices, tap toggles play/pause.
 */
export default function HoverVideo({
  src,
  poster,
  fallbackImage,
  alt,
}: HoverVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  if (!src) {
    const imgSrc = poster || fallbackImage;
    if (!imgSrc) return null;
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-surface">
        <Image src={imgSrc} alt={alt} fill className="object-cover" />
      </div>
    );
  }

  const handleMouseEnter = () => {
    videoRef.current?.play();
    setPlaying(true);
  };

  const handleMouseLeave = () => {
    videoRef.current?.pause();
    setPlaying(false);
  };

  const handleClick = () => {
    // Touch device toggle
    if (playing) {
      videoRef.current?.pause();
      setPlaying(false);
    } else {
      videoRef.current?.play();
      setPlaying(true);
    }
  };

  return (
    <div
      className="relative h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster || fallbackImage || undefined}
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-auto object-contain"
      />
    </div>
  );
}
