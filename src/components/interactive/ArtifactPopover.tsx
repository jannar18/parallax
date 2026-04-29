"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { isVideo } from "@/lib/media-utils";

export interface ArtifactEntry {
  slug: string;
  date: string;
  mood?: string;
  image: string;
  project?: string;
  description?: string;
}

interface ArtifactPopoverProps {
  entry: ArtifactEntry;
  onClose: () => void;
}

export default function ArtifactPopover({
  entry,
  onClose,
}: ArtifactPopoverProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Mount guard for SSR / portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus trap + Escape key
  useEffect(() => {
    if (!mounted) return;
    const el = dialogRef.current;
    if (!el) return;

    // Focus the dialog on open
    el.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      // Simple focus trap: keep Tab within dialog
      if (e.key === "Tab") {
        const focusable = el.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, mounted]);

  if (!mounted) return null;

  const content = (
    <>
      {/* Scrim */}
      <div
        className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
        style={{ touchAction: "auto" }}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={entry.description || `Artifact from ${entry.date}`}
        tabIndex={-1}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8 pointer-events-none outline-none"
        style={{ touchAction: "auto" }}
      >
        <div
          className="pointer-events-auto w-full max-w-3xl rounded-lg bg-surface shadow-2xl ring-1 ring-border overflow-hidden flex flex-col"
          style={{ maxHeight: "90dvh", touchAction: "auto" }}
        >
          <div className="bg-paper p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
            {isVideo(entry.image) ? (
              <video
                src={entry.image}
                muted
                autoPlay
                loop
                playsInline
                controls
                className="mx-auto h-auto max-h-[60dvh] w-auto object-contain"
              />
            ) : (
              <Image
                src={entry.image}
                alt={entry.description || `Artifact from ${entry.date}`}
                width={1200}
                height={1200}
                className="mx-auto h-auto max-h-[60dvh] w-auto object-contain"
                unoptimized
              />
            )}
          </div>

          <div className="px-4 sm:px-5 py-4 flex items-start justify-between gap-3 border-t border-border/50 shrink-0">
            <div className="min-w-0 flex-1">
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
            <button
              onClick={onClose}
              className="shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-lighter hover:text-ink hover:bg-ink/5 transition-colors -mr-2 -mt-1"
              aria-label="Close"
            >
              <span aria-hidden="true" className="text-2xl leading-none font-light">
                &times;
              </span>
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}
