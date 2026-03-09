"use client";

import Image from "next/image";

export interface ArtifactEntry {
  slug: string;
  date: string;
  mood?: string;
  image: string;
  project?: string;
  description?: string;
}

function isVideo(src: string) {
  return /\.(mov|mp4|webm)$/i.test(src);
}

interface ArtifactPopoverProps {
  entry: ArtifactEntry;
  onClose: () => void;
}

export default function ArtifactPopover({
  entry,
  onClose,
}: ArtifactPopoverProps) {
  return (
    <>
      {/* Scrim */}
      <div
        className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-8 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-3xl rounded-lg bg-surface shadow-2xl ring-1 ring-border overflow-hidden">
          <div className="bg-paper p-6">
            {isVideo(entry.image) ? (
              <video
                src={entry.image}
                muted
                autoPlay
                loop
                playsInline
                controls
                className="mx-auto h-auto max-h-[75vh] w-auto object-contain"
              />
            ) : (
              <Image
                src={entry.image}
                alt={entry.description || `Artifact from ${entry.date}`}
                width={1200}
                height={1200}
                className="mx-auto h-auto max-h-[75vh] w-auto object-contain"
                unoptimized
              />
            )}
          </div>

          <div className="px-5 py-4">
            <p
              className="font-sans text-ink-lighter uppercase"
              style={{ fontSize: "0.7rem", letterSpacing: "0.1em" }}
            >
              {entry.date}
              {entry.mood && (
                <span className="ml-2 normal-case italic text-ink-light">
                  {entry.mood}
                </span>
              )}
            </p>
            {entry.project && (
              <p className="mt-1 font-mono text-xs text-ink-light">
                {entry.project}
              </p>
            )}
            {entry.description && (
              <p className="mt-2 text-sm text-ink-light leading-relaxed">
                {entry.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
