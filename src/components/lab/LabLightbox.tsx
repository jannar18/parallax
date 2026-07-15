"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Work } from "@/lib/content";
import LabMedia from "./LabMedia";
import ArrowUpRight from "@/components/ui/ArrowUpRight";
import CarouselArrow from "@/components/ui/CarouselArrow";

interface LabLightboxProps {
  work: Work;
  onClose: () => void;
}

/**
 * LabLightbox — enlarged detail overlay for a single work.
 *
 * When a work carries `screenshots[]` (e.g. fractal-nyc, ships), the media
 * becomes a carousel: the lead GIF followed by each still, navigated with
 * clear left/right arrows (and ← / → keys). Slides step a full viewport width
 * at a time so browser-sized videos display edge-to-edge on mobile and as
 * large as the 75vh cap allows on desktop, letterboxed by the oxblood
 * backdrop. Escape / backdrop close; body scroll is locked while open;
 * focus moves to the close button.
 */
export default function LabLightbox({ work, onClose }: LabLightboxProps) {
  const label = work.label ?? `Prototype ${String(work.number).padStart(3, "0")}`;
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
      className="fixed inset-0 z-[80] flex flex-col overflow-hidden bg-oxblood/70 backdrop-blur-md"
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
        className="fixed right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-paper/15 text-lg text-paper backdrop-blur transition-colors hover:bg-paper/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-paper"
      >
        ✕
      </button>

      {/* Figure pins caption to the bottom of the viewport: media flexes to
          fill whatever height is left over so the label/description/links stay
          in view without scrolling. */}
      <figure className="m-0 flex h-full w-full flex-col pt-16 sm:p-10">
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="h-full overflow-hidden">
            <div
              className="flex h-full items-center transition-transform duration-500 ease-out"
              style={{
                transform: hasCarousel
                  ? `translateX(-${index * 100}%)`
                  : undefined,
              }}
            >
              {views.map((src, i) => {
                const isActive = i === index;
                return (
                  <div
                    key={src}
                    className="flex h-full w-full flex-shrink-0 items-center justify-center"
                    aria-hidden={hasCarousel && !isActive}
                  >
                    <div
                      className={`flex max-w-full items-center justify-center overflow-hidden transition-opacity duration-500 sm:rounded-lg sm:shadow-[18px_26px_60px_-30px_rgba(0,0,0,0.7)] ${
                        hasCarousel && !isActive
                          ? "cursor-pointer opacity-35"
                          : "opacity-100"
                      }`}
                      onClick={
                        hasCarousel && !isActive ? () => setIndex(i) : undefined
                      }
                    >
                      {/* Only the active slide autoplays its video (perf).
                          Explicit viewport-relative max-h reserves room for
                          the caption/dots + top padding so nothing gets
                          pushed off-screen. */}
                      <LabMedia
                        key={`${src}-${isActive}`}
                        src={src}
                        alt={`${work.title} — view ${i + 1}`}
                        priority={isActive}
                        active={isActive}
                        className="block h-auto max-h-[calc(100dvh-20rem)] w-auto max-w-full object-contain sm:max-h-[calc(100dvh-17rem)]"
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
                className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-oxblood/50 text-paper backdrop-blur transition-all hover:bg-oxblood/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-paper disabled:pointer-events-none disabled:opacity-0"
              >
                <CarouselArrow direction="left" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                disabled={atEnd}
                aria-label="Next"
                className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-oxblood/50 text-paper backdrop-blur transition-all hover:bg-oxblood/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-paper disabled:pointer-events-none disabled:opacity-0"
              >
                <CarouselArrow direction="right" />
              </button>
            </>
          )}
        </div>

        {/* Position dots */}
        {hasCarousel && (
          <div className="mt-4 flex shrink-0 items-center justify-center gap-2">
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

        <figcaption className="mx-auto mt-5 w-full max-w-4xl shrink-0 px-5 pb-6 sm:px-0 sm:pb-0">
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
                    className="inline-flex items-center gap-1 border-b border-paper/40 pb-px text-sm text-paper transition-colors hover:border-scarlet hover:text-scarlet"
                  >
                    Live <ArrowUpRight />
                  </a>
                )}
                {work.repo && (
                  <a
                    href={work.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 border-b border-paper/40 pb-px text-sm text-paper transition-colors hover:border-scarlet hover:text-scarlet"
                  >
                    View repo <ArrowUpRight />
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
