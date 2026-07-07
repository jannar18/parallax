"use client";

/* ──────────────────────────────────────────────────────────
 * LabMedia — shared media renderer for the lab gallery.
 * A "work" leads with a GIF (the thumbnail). The data model may
 * later carry .mp4/.webm in `gif`, so we detect video and render an
 * autoplay/loop/muted <video> (smooth, full-color — right for
 * gradient-heavy hover effects); otherwise a plain <img>.
 *
 * GIFs are large (~4MB) and animated, so Next's <Image> optimizer is
 * the wrong tool — we use a native <img> with lazy loading instead.
 * ────────────────────────────────────────────────────────── */

export function isVideoSrc(src: string): boolean {
  return /\.(mp4|webm|mov)$/i.test(src);
}

interface LabMediaProps {
  src: string;
  alt: string;
  /** Still poster shown while a video loads (ignored for gifs/images). */
  poster?: string;
  className?: string;
  /** Eager-load the first few above-the-fold cards. */
  priority?: boolean;
  /** When false, a video won't autoplay (shows its first frame). Used to keep
   *  only the active carousel slide playing. Defaults to true. */
  active?: boolean;
}

export default function LabMedia({
  src,
  alt,
  poster,
  className,
  priority = false,
  active = true,
}: LabMediaProps) {
  if (isVideoSrc(src)) {
    return (
      <video
        src={src}
        poster={poster || undefined}
        autoPlay={active}
        loop
        muted
        playsInline
        preload="metadata"
        aria-label={alt}
        className={className}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={className}
    />
  );
}
