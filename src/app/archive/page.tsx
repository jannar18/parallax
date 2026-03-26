import type { Metadata } from "next";
import { getAllNowEntries } from "@/lib/content";
import { getImageDimensions } from "@/lib/image-utils";
import StudioDesk from "@/components/interactive/StudioDesk";
import type { LayoutMode } from "@/components/interactive/LayoutSwitcher";

export const metadata: Metadata = {
  title: "Archive",
  description: "A living archive of what I'm working on, thinking about, and making.",
};

const VALID_LAYOUTS: LayoutMode[] = ["scatter", "masonry"];

/**
 * Archive / Studio Desk page.
 *
 * Switchable layout prototypes: ?layout=scatter|masonry
 * Default is scatter (infinite canvas).
 */
export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ layout?: string }>;
}) {
  const params = await searchParams;
  const layoutParam = params.layout ?? "scatter";
  const layout: LayoutMode = VALID_LAYOUTS.includes(layoutParam as LayoutMode)
    ? (layoutParam as LayoutMode)
    : "scatter";

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

  return <StudioDesk entries={canvasEntries} layout={layout} />;
}
