"use client";

import { Suspense } from "react";
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
  return (
    <Suspense>
      <StudioDeskInner entries={entries} />
    </Suspense>
  );
}

function StudioDeskInner({ entries }: StudioDeskProps) {
  const searchParams = useSearchParams();
  const layoutParam = searchParams.get("layout") ?? "scatter";
  const layout: LayoutMode = VALID_LAYOUTS.includes(layoutParam as LayoutMode)
    ? (layoutParam as LayoutMode)
    : "scatter";
  return (
    <>
      {layout === "scatter" && <InfiniteCanvas entries={entries} />}
      {layout === "masonry" && <MasonryLayout entries={entries} />}
      <LayoutSwitcher current={layout} />
    </>
  );
}
