import Link from "next/link";
import { getRecentNowEntries, getNowEntrySummary } from "@/lib/content";

/**
 * Formats a date string (YYYY-MM-DD) into a compact human-readable form.
 * Example: "2026-03-03" -> "3 Mar"
 */
function formatDateCompact(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

/**
 * NowPreview — compact preview of recent Now entries for the homepage.
 *
 * Renders as a React Server Component. Displays the most recent entries
 * with date, mood, and a one-line summary. Links to the full Now page.
 *
 * Usage:
 *   <NowPreview count={3} />
 */
export default function NowPreview({ count = 3 }: { count?: number }) {
  const entries = getRecentNowEntries(count);

  if (entries.length === 0) return null;

  return (
    <section className="w-full">
      <div className="flex items-baseline justify-between">
        <h2 className="font-sans text-sm font-medium uppercase tracking-wide text-ink-lighter">
          Studio desk
        </h2>
        <Link
          href="/now"
          className="font-mono text-xs tracking-wider text-terracotta hover:text-coral"
        >
          View all
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {entries.map((entry) => {
          const summary = getNowEntrySummary(entry);
          return (
            <div key={entry.slug} className="group">
              <div className="flex items-baseline gap-3">
                <time className="shrink-0 font-mono text-xs tracking-wider text-ink-lighter">
                  {formatDateCompact(entry.date)}
                </time>
                {entry.mood && (
                  <span className="shrink-0 font-mono text-xs italic tracking-wider text-ink-lighter">
                    {entry.mood}
                  </span>
                )}
              </div>
              {summary && (
                <p className="mt-1 text-sm leading-relaxed text-ink-light line-clamp-2">
                  {summary}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
