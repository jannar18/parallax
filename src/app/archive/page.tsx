import type { Metadata } from "next";
import Link from "next/link";
import { getAllNowEntries } from "@/lib/content";
import { getImageDimensions } from "@/lib/image-utils";
import StudioDesk from "@/components/interactive/StudioDesk";

export const metadata: Metadata = {
  title: "Archive",
  description: "A living archive of what I'm working on, thinking about, and making.",
};

// Force static generation — all data is read at build time, no runtime fs access needed.
// This avoids creating a serverless function that would bundle public/ assets.
export const dynamic = "force-static";

/**
 * Archive / Studio Desk page.
 *
 * Layout switching (scatter|masonry) is handled client-side by StudioDesk
 * via URL search params. This page is statically generated to stay under
 * Vercel's 300MB serverless function size limit.
 */
export default function ArchivePage() {
  const entries = getAllNowEntries();

  // Filter to entries with images/videos and compute real dimensions
  const canvasEntries = entries
    .filter((entry) => entry.image)
    .map((entry) => {
      const dims = getImageDimensions(entry.image!);
      return {
        slug: entry.slug,
        date: entry.date,
        mood: entry.mood,
        image: entry.image!,
        imageWidth: dims.width,
        imageHeight: dims.height,
        project: entry.project,
        description: entry.description,
      };
    });

  return (
    <>
      <StudioDesk entries={canvasEntries} />
      <Link
        href="/pretext"
        className="fixed right-5 z-30 font-mono uppercase text-ink-lighter/40 transition-colors hover:text-scarlet"
        style={{
          bottom: "max(1.25rem, env(safe-area-inset-bottom, 1rem))",
          fontSize: "0.5rem",
          letterSpacing: "0.08em",
        }}
      >
        Pretext &rarr;
      </Link>
    </>
  );
}
