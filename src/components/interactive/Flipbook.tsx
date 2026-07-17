"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import type { PageFlip as PageFlipType } from "page-flip";

/**
 * Flipbook — Julianna's architecture portfolio as a book you turn.
 *
 * The source PDF is already laid out as a cover + 19 facing-page spreads.
 * We pre-render two asset sets (see /public/images/architecture-book):
 *   • leaf-000…leaf-039  — cover, each spread split at the gutter into two
 *     portrait leaves, plus a plain back cover. Fed to StPageFlip so the
 *     visitor turns one leaf at a time, exactly like the printed book.
 *   • page-01…page-20    — full cover + full spreads, shown as a vertical
 *     scroll on mobile where a page-curl would be awkward.
 *
 * Desktop uses the vanilla `page-flip` (StPageFlip) library, which owns its
 * own DOM — so it never fights React reconciliation.
 */

const BOOK_DIR = "/images/architecture-book";

// 40 leaves: cover (000) + 19 spreads × 2 (001–038) + back cover (039).
const LEAVES: string[] = [
  `${BOOK_DIR}/leaf-000.jpg`,
  ...Array.from({ length: 38 }, (_, i) => `${BOOK_DIR}/leaf-${String(i + 1).padStart(3, "0")}.jpg`),
  `${BOOK_DIR}/leaf-039.png`,
];

// Mobile: full cover + 19 full spreads (facing-page compositions preserved).
const SPREADS: { src: string; cover: boolean }[] = [
  { src: `${BOOK_DIR}/page-01.jpg`, cover: true },
  ...Array.from({ length: 19 }, (_, i) => ({
    src: `${BOOK_DIR}/page-${String(i + 2).padStart(2, "0")}.jpg`,
    cover: false,
  })),
];

const TOTAL_SPREADS = 19;

function spreadLabel(leafIndex: number): string {
  if (leafIndex <= 0) return "Cover";
  if (leafIndex >= LEAVES.length - 1) return "Back cover";
  return `Spread ${Math.ceil(leafIndex / 2)} / ${TOTAL_SPREADS}`;
}

export default function Flipbook() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const flipRef = useRef<PageFlipType | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [leafIndex, setLeafIndex] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Pick mode on mount + on breakpoint changes.
  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Initialise / tear down the flipbook when we're in desktop mode.
  useEffect(() => {
    if (!isDesktop || !containerRef.current) return;

    let disposed = false;
    let pageFlip: PageFlipType | null = null;
    let fallback = 0;
    setReady(false);

    (async () => {
      const { PageFlip } = await import("page-flip");
      if (disposed || !containerRef.current) return;

      pageFlip = new PageFlip(containerRef.current, {
        size: "stretch",
        width: 550,
        height: 712,
        minWidth: 300,
        maxWidth: 600,
        minHeight: 388,
        maxHeight: 777,
        showCover: true,
        usePortrait: false,
        drawShadow: true,
        maxShadowOpacity: 0.4,
        flippingTime: 750,
        mobileScrollSupport: false,
      });

      flipRef.current = pageFlip;
      pageFlip.loadFromImages(LEAVES);
      pageFlip.on("flip", (e) => !disposed && setLeafIndex(e.data));

      // StPageFlip fires `init` almost immediately (before any JPEG paints),
      // so gate the reveal on the first-visible leaves actually loading —
      // that's what "Binding the book…" should wait for.
      const markReady = () => !disposed && setReady(true);
      const preload = [LEAVES[0], LEAVES[1], LEAVES[2]].map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new window.Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = src;
          }),
      );
      Promise.all(preload).then(markReady);
      // Backstop in case a load event never resolves.
      fallback = window.setTimeout(markReady, 3000);
    })();

    return () => {
      disposed = true;
      window.clearTimeout(fallback);
      try {
        pageFlip?.destroy();
      } catch {
        /* already gone */
      }
      flipRef.current = null;
    };
  }, [isDesktop]);

  // Keyboard navigation (desktop).
  useEffect(() => {
    if (!isDesktop) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") flipRef.current?.flipNext();
      if (e.key === "ArrowLeft") flipRef.current?.flipPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDesktop]);

  // Lightbox escape.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const flipPrev = useCallback(() => flipRef.current?.flipPrev(), []);
  const flipNext = useCallback(() => flipRef.current?.flipNext(), []);

  // Avoid SSR/client mismatch — render nothing structural until we know the mode.
  if (!mounted) {
    return <div className="min-h-[60vh]" aria-hidden />;
  }

  // ── Mobile: vertical scroll of full spreads ──
  if (!isDesktop) {
    return (
      <>
        <p className="mb-6 text-center font-mono text-[0.7rem] uppercase tracking-wider text-ink-lighter">
          Scroll to read · tap a page to enlarge
        </p>
        <div className="flex flex-col gap-6">
          {SPREADS.map((s) => (
            <button
              key={s.src}
              onClick={() => setLightbox(s.src)}
              className="block w-full overflow-hidden rounded-sm shadow-md ring-1 ring-border transition-transform active:scale-[0.99]"
            >
              <Image
                src={s.src}
                alt={s.cover ? "Portfolio cover" : "Portfolio spread"}
                width={s.cover ? 1700 : 3400}
                height={2200}
                sizes="100vw"
                className="h-auto w-full"
              />
            </button>
          ))}
        </div>

        {lightbox && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Portfolio page, enlarged"
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <button
              aria-label="Close"
              onClick={() => setLightbox(null)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-lg text-ink shadow-md"
            >
              ✕
            </button>
            <Image
              src={lightbox}
              alt="Portfolio page"
              width={3400}
              height={2200}
              sizes="100vw"
              className="h-auto max-h-[92vh] w-auto max-w-full object-contain"
            />
          </div>
        )}
      </>
    );
  }

  // ── Desktop: page-curl flipbook ──
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full" style={{ maxWidth: "1180px" }}>
        {!ready && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <p className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-lighter">
              Binding the book…
            </p>
          </div>
        )}
        <div
          ref={containerRef}
          className="mx-auto w-full transition-opacity duration-700"
          style={{ opacity: ready ? 1 : 0 }}
        />
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center gap-6">
        <button
          onClick={flipPrev}
          aria-label="Previous page"
          className="group flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-border transition-colors hover:bg-ink/[0.04]"
        >
          <span className="text-lg text-ink-light transition-colors group-hover:text-ink">
            ‹
          </span>
        </button>
        <span className="min-w-[9rem] text-center font-mono text-[0.7rem] uppercase tracking-wider text-ink-lighter">
          {spreadLabel(leafIndex)}
        </span>
        <button
          onClick={flipNext}
          aria-label="Next page"
          className="group flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-border transition-colors hover:bg-ink/[0.04]"
        >
          <span className="text-lg text-ink-light transition-colors group-hover:text-ink">
            ›
          </span>
        </button>
      </div>

      <p className="mt-4 font-sans text-xs italic text-ink-lighter">
        Drag a corner or use ← → to turn the page
      </p>
    </div>
  );
}
