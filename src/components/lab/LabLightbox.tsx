"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Work } from "@/lib/content";
import LabMedia from "./LabMedia";

interface LabLightboxProps {
  work: Work;
  onClose: () => void;
}

/**
 * LabLightbox — enlarged detail overlay for a single work.
 *
 * When a work carries `screenshots[]` (e.g. fractal-nyc, ships), the media
 * becomes a carousel: the lead GIF followed by each still, navigated with
 * clear left/right arrows (and ← / → keys). The active slide is centered with
 * the adjacent slides peeking in at the edges. Escape / backdrop close; body
 * scroll is locked while open; focus moves to the close button.
 */
export default function LabLightbox({ work, onClose }: LabLightboxProps) {
  const label = work.label ?? `Prototype ${String(work.number).padStart(2, "0")}`;
  const screenshots = work.screenshots ?? [];
  // The carousel = the lead gif/video followed by any screenshots.
  const views = [work.gif, ...screenshots];
  const hasCarousel = views.length > 1;

  const [index, setIndex] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  const clamp = useCallback(
    (i: number) => Math.min(views.length - 1, Math.max(0, i)),
    [views.length]
  );
  const go = useCallback((delta: number) => setIndex((i) => clamp(i + delta)), [clamp]);

  // Escape to close, ← / → to navigate, body scroll lock while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (hasCarousel && e.key === "ArrowLeft") go(-1);
      else if (hasCarousel && e.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, go, hasCarousel]);

  const atStart = index === 0;
  const atEnd = index === views.length - 1;

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-oxblood/70 p-6 backdrop-blur-md sm:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={work.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="fixed right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-paper/15 text-lg text-paper transition-colors hover:bg-paper/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-paper"
      >
        ✕
      </button>

      <figure className="m-0 w-full max-w-4xl">
        {/* Carousel viewport */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex items-center transition-transform duration-500 ease-out"
              style={{
                transform: hasCarousel
                  ? `translateX(calc(8% - ${index * 84}%))`
                  : undefined,
              }}
            >
              {views.map((src, i) => {
                const isActive = i === index;
                return (
                  <div
                    key={src}
                    className={`flex flex-shrink-0 justify-center ${
                      hasCarousel ? "w-[84%] px-2" : "w-full"
                    }`}
                    aria-hidden={hasCarousel && !isActive}
                  >
                    <div
                      className={`max-w-full overflow-hidden rounded-lg shadow-[18px_26px_60px_-30px_rgba(0,0,0,0.7)] transition-opacity duration-500 ${
                        hasCarousel && !isActive
                          ? "cursor-pointer opacity-35"
                          : "opacity-100"
                      }`}
                      onClick={
                        hasCarousel && !isActive ? () => setIndex(i) : undefined
                      }
                    >
                      {/* Only the active slide autoplays its video (perf) */}
                      <LabMedia
                        key={`${src}-${isActive}`}
                        src={src}
                        alt={`${work.title} — view ${i + 1}`}
                        priority={isActive}
                        active={isActive}
                        className="block max-h-[64vh] w-auto max-w-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Arrows */}
          {hasCarousel && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                disabled={atStart}
                aria-label="Previous"
                className="absolute left-1 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-paper/15 text-2xl text-paper backdrop-blur transition-all hover:bg-paper/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-paper disabled:pointer-events-none disabled:opacity-0 sm:-left-2"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                disabled={atEnd}
                aria-label="Next"
                className="absolute right-1 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-paper/15 text-2xl text-paper backdrop-blur transition-all hover:bg-paper/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-paper disabled:pointer-events-none disabled:opacity-0 sm:-right-2"
              >
                →
              </button>
            </>
          )}
        </div>

        {/* Position dots */}
        {hasCarousel && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {views.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to view ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-paper ${
                  i === index ? "w-5 bg-paper" : "w-1.5 bg-paper/35 hover:bg-paper/60"
                }`}
              />
            ))}
          </div>
        )}

        <figcaption className="mt-5">
          <span className="font-mono text-xs uppercase tracking-wider text-scarlet">
            {label}
          </span>
          <h2 className="mt-2 font-serif text-3xl font-normal leading-tight tracking-tighter text-paper">
            {work.title}
          </h2>
          {work.description && (
            <p className="mt-3 max-w-[60ch] text-base leading-normal text-paper/80">
              {work.description}
            </p>
          )}

          {(work.tags?.length || work.repo || work.url) && (
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              {work.tags && work.tags.length > 0 && (
                <ul className="flex flex-wrap gap-1.5">
                  {work.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-paper/25 px-2.5 py-0.5 font-mono text-[10.5px] tracking-wide text-paper/60"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
              <div className="ml-auto flex items-center gap-5">
                {work.url && (
                  <a
                    href={work.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b border-paper/40 pb-px text-sm text-paper transition-colors hover:border-scarlet hover:text-scarlet"
                  >
                    Live ↗
                  </a>
                )}
                {work.repo && (
                  <a
                    href={work.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b border-paper/40 pb-px text-sm text-paper transition-colors hover:border-scarlet hover:text-scarlet"
                  >
                    View repo ↗
                  </a>
                )}
              </div>
            </div>
          )}
        </figcaption>
      </figure>
    </div>
  );
}
