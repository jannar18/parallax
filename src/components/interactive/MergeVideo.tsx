"use client";

import Image from "next/image";
import { useRef, useState } from "react";

/**
 * MergeVideo — plays a video once with a riso poster that fades in/out.
 *
 * 1. Riso image visible initially (cover)
 * 2. Video starts → image fades out
 * 3. Video ends → image fades back in
 */
export default function MergeVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCover, setShowCover] = useState(true);

  return (
    <div className="absolute inset-0">
      <video
        ref={videoRef}
        muted
        playsInline
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        onPlaying={() => {
          // Delay fade-out so the thumbnail is visible for a moment
          setTimeout(() => setShowCover(false), 4000);
        }}
        onEnded={() => setShowCover(true)}
      >
        <source
          src="/images/homepage/processed/merge-demo.mp4"
          type="video/mp4"
        />
      </video>

      {/* Warm filter over video */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: "rgba(180, 120, 80, 0.3)", mixBlendMode: "multiply" }}
      />

      {/* Grain texture over video (stronger than default) */}
      <div
        className="grain-texture absolute inset-0 pointer-events-none"
        style={{ opacity: 0.35 }}
      />

      {/* Riso cover — fades out when video plays, back in when it ends */}
      <Image
        src="/images/homepage/processed/merge-fallback.png"
        alt="Architecture and software merged"
        fill
        className={`object-cover transition-opacity duration-[2500ms] ease-in-out ${
          showCover ? "opacity-100" : "opacity-0"
        }`}
        unoptimized
      />
    </div>
  );
}
