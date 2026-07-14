"use client";

import type { Work } from "@/lib/content";
import LabMedia from "./LabMedia";
import ArrowUpRight from "@/components/ui/ArrowUpRight";

interface LabCardProps {
  work: Work;
  /** Opens the lightbox for this work. */
  onOpen: () => void;
  /** First couple of cards load eagerly (above the fold). */
  priority?: boolean;
}

/**
 * LabCard — a single GIF-first entry in the lab gallery.
 *
 * The media IS the thumbnail and the primary click target: activating it
 * (click / Enter / Space) opens the lightbox. Repo + live links sit below
 * and stop propagation so they don't trigger the lightbox. Chrome is kept
 * minimal so the media carries the card.
 */
export default function LabCard({ work, onOpen, priority }: LabCardProps) {
  const label = work.label ?? `Prototype ${String(work.number).padStart(3, "0")}`;
  const tags = work.tags ?? [];

  return (
    <article className="group flex flex-col">
      {/* Media — the thumbnail and primary open target */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open ${work.title}`}
        className="relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-lg border border-border bg-surface transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[18px_26px_60px_-32px_rgba(71,31,32,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-scarlet focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <LabMedia
          src={work.gif}
          alt={`${work.title} preview`}
          priority={priority}
          className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
        />
      </button>

      {/* Body */}
      <div className="mt-5">
        <span className="font-mono text-xs uppercase tracking-wider text-scarlet">
          {label}
        </span>
        <h2 className="mt-2 font-serif text-2xl font-normal leading-tight tracking-tighter text-ink">
          {work.title}
        </h2>
        {work.description && (
          <p className="mt-2 max-w-[46ch] text-sm leading-normal text-ink-light">
            {work.description}
          </p>
        )}

        {(tags.length > 0 || work.repo || work.url) && (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            {tags.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10.5px] tracking-wide text-ink-lighter"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}

            <div className="ml-auto flex items-center gap-4">
              {work.url && (
                <a
                  href={work.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 border-b border-transparent text-sm text-ink-light transition-colors hover:border-scarlet hover:text-scarlet"
                >
                  Live <ArrowUpRight />
                </a>
              )}
              {work.repo && (
                <a
                  href={work.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 border-b border-transparent text-sm text-ink-light transition-colors hover:border-scarlet hover:text-scarlet"
                >
                  Repo <ArrowUpRight />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
