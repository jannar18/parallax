import type { Metadata } from "next";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllNowEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Now",
  description: "What I'm working on, thinking about, and making right now.",
};

/**
 * Formats a date string (YYYY-MM-DD) into a human-readable form.
 * Example: "2026-03-03" -> "3 March 2026"
 */
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Checks whether the given date string matches today's date.
 */
function isToday(dateStr: string): boolean {
  const today = new Date();
  const todayStr = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  return dateStr === todayStr;
}

/**
 * Now / Studio Desk page.
 *
 * Daily entries rendered chronologically (newest first).
 * "Studio desk" metaphor — populated but not messy.
 * Sparse days look as intentional as rich days.
 * No timestamps unless they add meaning — dates only.
 */
export default function NowPage() {
  const entries = getAllNowEntries();

  return (
    <div className="mx-auto max-w-content px-5">
      <section className="py-24">
        <h1 className="text-4xl font-light text-ink md:text-5xl">Now</h1>
        <p className="mt-4 max-w-text text-ink-light leading-relaxed">
          What I am working on, thinking about, and making right now.
        </p>

        <div className="mt-16 flex flex-col gap-20">
          {entries.length === 0 ? (
            <p className="text-ink-light">Nothing here yet.</p>
          ) : (
            entries.map((entry) => {
              const today = isToday(entry.date);
              return (
                <article
                  key={entry.slug}
                  className={`max-w-text ${
                    today
                      ? "border-l-2 border-terracotta pl-6"
                      : "border-l border-border pl-6"
                  }`}
                >
                  {/* Date */}
                  <time className="font-mono text-sm tracking-wider text-ink-lighter">
                    {formatDate(entry.date)}
                  </time>

                  {/* Mood */}
                  {entry.mood && (
                    <span className="ml-4 font-mono text-sm italic tracking-wider text-ink-lighter">
                      {entry.mood}
                    </span>
                  )}

                  {/* Tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="mt-2 font-mono text-xs tracking-wider text-ink-lighter">
                      {entry.tags.map((tag, i) => (
                        <span key={tag}>
                          {i > 0 && (
                            <span className="mx-1.5 text-warm-gray">&middot;</span>
                          )}
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Hero image */}
                  {entry.image && (
                    <div className="mt-6 overflow-hidden rounded-sm">
                      <Image
                        src={entry.image}
                        alt={entry.imageAlt || ""}
                        width={640}
                        height={400}
                        className="w-full object-cover"
                        sizes="(max-width: 640px) 100vw, 640px"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="prose mt-6">
                    <MDXRemote source={entry.content} />
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
