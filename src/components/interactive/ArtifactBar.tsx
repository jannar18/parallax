"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Artifact {
  slug: string;
  date: string;
  mood?: string;
  image: string;
  project?: string;
  description?: string;
}

interface ArtifactBarProps {
  artifacts: Artifact[];
}

/**
 * ArtifactBar — horizontal scroll strip of studio desk artifacts.
 *
 * Objects at varied scales on the page surface. Subtle scale on hover.
 * Click opens a centered popover with the artifact and info.
 */
export default function ArtifactBar({ artifacts }: ArtifactBarProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const heights = ["45vh", "30vh", "38vh", "50vh", "28vh", "42vh"];

  const closePopover = useCallback(() => setActiveIndex(null), []);

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePopover();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, closePopover]);

  if (artifacts.length === 0) {
    return (
      <div className="flex h-[66.67vh] items-center justify-center">
        <p
          className="font-sans text-ink-lighter italic"
          style={{ fontSize: "clamp(0.8rem, 1vw, 0.95rem)" }}
        >
          The desk is empty — check back soon.
        </p>
      </div>
    );
  }

  const active = activeIndex !== null ? artifacts[activeIndex] : null;

  return (
    <>
      <div className="h-[66.67vh] pt-[2vh] pb-[11vh]">
        <div
          className="flex h-full items-end gap-[2vw] overflow-x-auto px-[3vw] scrollbar-hide"
          style={{ scrollSnapType: "x proximity" }}
        >
          {artifacts.map((artifact, i) => (
            <div
              key={artifact.slug}
              className="relative flex-shrink-0"
              style={{ scrollSnapAlign: "start" }}
            >
              <button
                onClick={() =>
                  setActiveIndex(activeIndex === i ? null : i)
                }
                className="group relative block cursor-pointer"
              >
                <Image
                  src={artifact.image}
                  alt={artifact.description || `Artifact from ${artifact.date}`}
                  width={600}
                  height={800}
                  className="rounded-sm object-contain transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg"
                  style={{ height: heights[i % heights.length], width: "auto" }}
                  unoptimized
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Centered popover */}
      {active && (
        <>
          {/* Scrim */}
          <div
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm"
            onClick={closePopover}
          />

          {/* Popover — centered on page */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-8 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-sm rounded-lg bg-surface shadow-2xl ring-1 ring-border overflow-hidden">
              {/* Artifact image — floating with padding */}
              <div className="bg-cream p-6">
                <Image
                  src={active.image}
                  alt={active.description || `Artifact from ${active.date}`}
                  width={600}
                  height={600}
                  className="mx-auto h-auto max-h-[45vh] w-auto object-contain"
                  unoptimized
                />
              </div>

              {/* Info */}
              <div className="px-5 py-4">
                <p
                  className="font-sans text-ink-lighter uppercase"
                  style={{ fontSize: "0.7rem", letterSpacing: "0.1em" }}
                >
                  {active.date}
                  {active.mood && (
                    <span className="ml-2 normal-case italic text-ink-light">
                      {active.mood}
                    </span>
                  )}
                </p>
                {active.project && (
                  <p className="mt-1 font-mono text-xs text-ink-light">
                    {active.project}
                  </p>
                )}
                {active.description && (
                  <p className="mt-2 text-sm text-ink-light leading-relaxed">
                    {active.description}
                  </p>
                )}
                <Link
                  href="/now"
                  className="mt-3 inline-block font-sans text-xs text-scarlet hover:text-scarlet-dark transition-colors"
                  style={{ letterSpacing: "0.05em" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  View full entry &rarr;
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
