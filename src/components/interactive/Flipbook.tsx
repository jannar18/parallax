"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import type { PageFlip as PageFlipType } from "page-flip";

/**
 * Flipbook — Julianna's architecture portfolio as a book you turn.
 *
 * The source PDF is a cover + 19 facing-page spreads. We pre-render two WebP
 * asset sets at 300dpi (see /public/images/architecture-book):
 *   • leaf-000…leaf-039 — cover, each spread split at the gutter into two
 *     portrait leaves, plus a plain back cover. Turned one leaf at a time on
 *     desktop, exactly like the printed book.
 *   • page-01…page-20   — full cover + full spreads, shown as a vertical
 *     scroll on mobile.
 *
 * Desktop uses `page-flip` (StPageFlip) in **HTML mode** (`loadFromHTML`), so
 * each page is a real <img> the browser scales crisply on retina — the canvas
 * (`loadFromImages`) path rasterises at CSS pixels and looks soft on 2× screens.
 * The page DOM is injected imperatively into a JSX-childless host, so React's
 * reconciler never touches the subtree StPageFlip owns.
 */

const BOOK_DIR = "/images/architecture-book";

// 40 leaves: cover (000) + 19 spreads × 2 (001–038) + back cover (039).
const LEAVES: string[] = [
  `${BOOK_DIR}/leaf-000.webp`,
  ...Array.from({ length: 38 }, (_, i) => `${BOOK_DIR}/leaf-${String(i + 1).padStart(3, "0")}.webp`),
  `${BOOK_DIR}/leaf-039.webp`,
];

// Mobile: full cover + 19 full spreads (facing-page compositions preserved).
const SPREADS: { src: string; cover: boolean }[] = [
  { src: `${BOOK_DIR}/page-01.webp`, cover: true },
  ...Array.from({ length: 19 }, (_, i) => ({
    src: `${BOOK_DIR}/page-${String(i + 2).padStart(2, "0")}.webp`,
    cover: false,
  })),
];

// Navigable "openings": cover + 19 spreads + back cover.
const TOTAL_VIEWS = (LEAVES.length - 2) / 2 + 2;

// 1-based position of the current opening, from the left-page leaf index.
function bookPosition(leafIndex: number): number {
  if (leafIndex <= 0) return 1;
  if (leafIndex >= LEAVES.length - 1) return TOTAL_VIEWS;
  return (leafIndex + 1) / 2 + 1;
}

// Which edge of a leaf meets the spine (so we can shade the gutter).
//   cover (0): sits on the right → gutter on its left
//   back cover (last): sits on the left → gutter on its right
//   interior: odd index = left page (gutter right), even = right page (gutter left)
function gutterSide(i: number): "left" | "right" {
  if (i === 0) return "left";
  if (i === LEAVES.length - 1) return "right";
  return i % 2 === 1 ? "right" : "left";
}

// Build the page DOM StPageFlip will adopt. Covers are "hard" (rigid).
// Each page carries a soft shadow baked onto its spine-side edge — visible at
// rest (the two halves meet as a center-fold shadow) and, because it's part of
// the page, it turns and lifts with the page instead of sitting as a fixed band.
function buildPagesHTML(): string {
  return LEAVES.map((src, i) => {
    const density = i === 0 || i === LEAVES.length - 1 ? "hard" : "soft";
    const side = gutterSide(i);
    const dir = side === "right" ? "right" : "left";
    const gutter = `<div style="position:absolute;top:0;bottom:0;${side}:0;width:9%;pointer-events:none;background:linear-gradient(to ${dir}, rgba(71,31,32,0) 0%, rgba(71,31,32,0.10) 100%)"></div>`;
    return `<div class="fb-page" data-density="${density}"><img src="${src}" alt="" draggable="false" style="width:100%;height:100%;display:block;object-fit:cover" />${gutter}</div>`;
  }).join("");
}

export default function Flipbook() {
  const hostRef = useRef<HTMLDivElement | null>(null);
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
    if (!isDesktop || !hostRef.current) return;

    const host = hostRef.current;
    let disposed = false;
    let pageFlip: PageFlipType | null = null;
    let fallback = 0;
    setReady(false);

    (async () => {
      const { PageFlip } = await import("page-flip");
      if (disposed || !host) return;

      host.innerHTML = buildPagesHTML();

      pageFlip = new PageFlip(host, {
        size: "stretch",
        width: 550,
        height: 712,
        minWidth: 320,
        maxWidth: 640,
        minHeight: 414,
        maxHeight: 828,
        showCover: true,
        usePortrait: false,
        drawShadow: true,
        maxShadowOpacity: 0.4, // native StPageFlip fold + gutter shadow
        flippingTime: 750,
        mobileScrollSupport: false,
      });

      flipRef.current = pageFlip;
      pageFlip.loadFromHTML(host.querySelectorAll(".fb-page"));
      pageFlip.on("flip", (e) => !disposed && setLeafIndex(e.data));

      // Reveal once the first-visible leaves have actually painted.
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
      host.innerHTML = "";
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

  // Lightbox escape (mobile).
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
              className="block w-full overflow-hidden rounded-sm shadow-sm ring-1 ring-border transition-transform active:scale-[0.99]"
            >
              <Image
                src={s.src}
                alt={s.cover ? "Portfolio cover" : "Portfolio spread"}
                width={s.cover ? 2550 : 5100}
                height={3300}
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
              width={5100}
              height={3300}
              sizes="100vw"
              className="h-auto max-h-[92vh] w-auto max-w-full object-contain"
            />
          </div>
        )}
      </>
    );
  }

  // ── Desktop: page-curl flipbook (HTML mode, crisp on retina) ──
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full" style={{ maxWidth: "1220px" }}>
        {!ready && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <p className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-lighter">
              Binding the book…
            </p>
          </div>
        )}
        <div
          ref={hostRef}
          className="mx-auto w-full transition-opacity duration-700"
          style={{ opacity: ready ? 1 : 0 }}
        />
      </div>

      {/* Minimal control row: ‹ 1/21 › */}
      <div className="mt-8 flex items-center gap-4 font-mono text-xs tracking-wider text-ink-lighter">
        <button
          onClick={flipPrev}
          aria-label="Previous page"
          className="select-none px-1 text-lg leading-none transition-colors hover:text-ink"
        >
          ‹
        </button>
        <span className="tabular-nums">
          {bookPosition(leafIndex)}/{TOTAL_VIEWS}
        </span>
        <button
          onClick={flipNext}
          aria-label="Next page"
          className="select-none px-1 text-lg leading-none transition-colors hover:text-ink"
        >
          ›
        </button>
      </div>
    </div>
  );
}
