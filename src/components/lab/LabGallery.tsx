"use client";

import { useState } from "react";
import type { Work } from "@/lib/content";
import LabCard from "./LabCard";
import LabLightbox from "./LabLightbox";

interface LabGalleryProps {
  works: Work[];
}

/**
 * LabGallery — responsive GIF-first grid + lightbox coordinator.
 *
 * Owns the "which work is open" state. Cards render the media as the
 * thumbnail; opening one mounts the lightbox. Works arrive pre-sorted
 * newest-first from getAllWorks().
 */
export default function LabGallery({ works }: LabGalleryProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openWork = works.find((w) => w.id === openId) ?? null;

  if (works.length === 0) {
    return (
      <p className="py-20 text-center text-ink-lighter">
        Nothing posted yet — check back soon.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-x-12 gap-y-14 md:grid-cols-2">
        {works.map((work, i) => (
          <LabCard
            key={work.id}
            work={work}
            priority={i < 2}
            onOpen={() => setOpenId(work.id)}
          />
        ))}
      </div>

      {openWork && (
        <LabLightbox work={openWork} onClose={() => setOpenId(null)} />
      )}
    </>
  );
}
