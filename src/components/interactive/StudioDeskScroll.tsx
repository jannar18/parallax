"use client";

import Link from "next/link";

interface StudioDeskEntry {
  slug: string;
  date: string;
  mood?: string;
}

interface StudioDeskScrollProps {
  entries: StudioDeskEntry[];
}

/**
 * StudioDeskScroll — Full-bleed horizontal scroll band.
 *
 * Thin band of cards that stretches across the full viewport width.
 * Cards fill the band height and scroll horizontally.
 */
export default function StudioDeskScroll({ entries }: StudioDeskScrollProps) {
  const cards =
    entries.length > 0
      ? entries
      : Array.from({ length: 8 }, (_, i) => ({
          slug: `placeholder-${i}`,
          date: `2026-03-0${i + 1}`,
          mood: undefined,
        }));

  return (
    <div className="h-full overflow-x-auto scrollbar-hide">
      <div
        className="flex h-full items-stretch gap-[1vw] px-[1vw]"
        style={{ minWidth: "max-content" }}
      >
        {cards.map((entry) => (
          <Link
            key={entry.slug}
            href="/archive"
            className="group block h-full flex-shrink-0"
          >
            <div
              className="h-full rounded-xl bg-spruce/20 flex flex-col justify-end overflow-hidden transition-colors group-hover:bg-spruce/35"
              style={{ width: "clamp(12rem, 20vw, 24rem)" }}
            >
              <div className="p-[clamp(0.6rem,1.2vw,1.25rem)]">
                <p
                  className="font-sans text-ink-lighter uppercase"
                  style={{
                    fontSize: "clamp(0.6rem, 0.75vw, 0.75rem)",
                    letterSpacing: "var(--tracking-wider)",
                  }}
                >
                  {entry.date}
                </p>
                {entry.mood && (
                  <p
                    className="mt-[0.3vh] text-ink-light font-serif italic"
                    style={{ fontSize: "clamp(0.75rem, 0.9vw, 0.875rem)" }}
                  >
                    {entry.mood}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
