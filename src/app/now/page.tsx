import type { Metadata } from "next";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllNowEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Now",
  description: "What I'm working on, thinking about, and making right now.",
};

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
    <div className="studio-desk-surface grain-texture mx-auto max-w-content px-5">
      <section className="py-24">
        <h1 className="text-4xl font-light text-ink md:text-5xl">Now</h1>
        <div className="mt-16 flex flex-col gap-20">
          {entries.length === 0 ? (
            <p className="text-ink-light">Nothing here yet.</p>
          ) : (
            entries.map((entry) => (
              <article key={entry.slug} className="max-w-text">
                <time className="text-sm text-ink-lighter tracking-wide">
                  {entry.date}
                </time>
                {entry.mood && (
                  <span className="ml-3 text-sm text-ink-light font-serif italic">
                    {entry.mood}
                  </span>
                )}
                {entry.image && (
                  <div className="mt-4">
                    <div className="artifact-treatment rounded-sm">
                      <Image
                        src={entry.image}
                        alt={entry.description || `Artifact from ${entry.date}`}
                        width={640}
                        height={640}
                        className="max-w-md h-auto rounded-sm"
                        unoptimized
                      />
                    </div>
                    {entry.description && (
                      <p className="mt-2 text-xs text-ink-lighter">
                        {entry.description}
                      </p>
                    )}
                  </div>
                )}
                <div className="prose mt-4">
                  <MDXRemote source={entry.content} />
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
