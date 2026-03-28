"use client";

import { useSearchParams } from "next/navigation";
import { type LayoutMode } from "./LayoutSwitcher";
import LayoutSwitcher from "./LayoutSwitcher";
import InfiniteCanvas from "./InfiniteCanvas";
import MasonryLayout from "./MasonryLayout";

export interface StudioDeskEntry {
  slug: string;
  date: string;
  mood?: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  project?: string;
  description?: string;
}

const VALID_LAYOUTS: LayoutMode[] = ["scatter", "masonry"];

interface StudioDeskProps {
  entries: StudioDeskEntry[];
}

export default function StudioDesk({ entries }: StudioDeskProps) {
  const searchParams = useSearchParams();
  const layoutParam = searchParams.get("layout") ?? "scatter";
  const layout: LayoutMode = VALID_LAYOUTS.includes(layoutParam as LayoutMode)
    ? (layoutParam as LayoutMode)
    : "scatter";
  return (
    <>
      {/* Subtle page subtitle -- fixed top-center, restrained */}
      <div className="fixed top-[4.5rem] left-0 right-0 z-20 pointer-events-none text-center">
        <p
          className="font-mono uppercase text-ink-lighter/30 tracking-widest"
          style={{ fontSize: "0.55rem", letterSpacing: "0.12em" }}
        >
          the studio desk
        </p>
      </div>

      {layout === "scatter" && <InfiniteCanvas entries={entries} />}
      {layout === "masonry" && <MasonryLayout entries={entries} />}
      <LayoutSwitcher current={layout} />
    </>
  );
}
