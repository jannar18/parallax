import type { Metadata } from "next";
import Link from "next/link";
import { getAllWritingPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays and reflections on architecture, software, and practice.",
};

/**
 * Writing listing page.
 *
 * Chronological listing of essays and posts.
 * Editorial pacing — generous spacing between entries.
 */
export default function WritingPage() {
  const posts = getAllWritingPosts();

  return (
    <div className="mx-auto max-w-content px-5">
      <section className="py-24">
        <h1 className="text-4xl font-light text-ink md:text-5xl">Writing</h1>
        <div className="mt-16 flex flex-col gap-12">
          {posts.length === 0 ? (
            <p className="text-ink-light">Essays coming soon.</p>
          ) : (
            posts.map((post) => (
              <Link
                key={post.slug}
                href={`/writing/${post.slug}`}
                className="group block"
              >
                <h2 className="text-2xl font-light text-ink transition-colors group-hover:text-coral">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="mt-2 max-w-text text-base text-ink-light">
                    {post.description}
                  </p>
                )}
                <p className="mt-1 text-sm text-ink-lighter">{post.date}</p>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
