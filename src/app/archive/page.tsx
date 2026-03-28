import type { Metadata } from "next";
import { getAllNowEntries } from "@/lib/content";
import { getImageDimensions } from "@/lib/image-utils";
import StudioDesk from "@/components/interactive/StudioDesk";

export const metadata: Metadata = {
  title: "Archive",
  description: "A living archive of what I'm working on, thinking about, and making.",
};

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

  return <StudioDesk entries={canvasEntries} />;
}
