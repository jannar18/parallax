"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * SplitViewMerge — the merge moment after Sections 2 and 3.
 *
 * A 150vh sticky container (50vh of scroll range). Shows Section 3's
 * layout initially (text left, software visual right). As the user
 * scrolls, the architecture visual slides down from above into the
 * left half while text fades out. Quick and immediate.
 */
export default function SplitViewMerge() {
  const containerRef = useRef<HTMLDivElement>(null);
  const archRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el || !archRef.current || !textRef.current) return;

      const rect = el.getBoundingClientRect();
      const scrollRange = el.clientHeight - window.innerHeight;
      if (scrollRange <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / scrollRange));

      // Ease: smooth in-out
      const ease =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // Architecture visual: slides from above to resting position
      archRef.current.style.transform = `translateY(${-100 + ease * 100}%)`;
      archRef.current.style.opacity = String(ease);

      // Text: fades out
      textRef.current.style.opacity = String(1 - ease);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} style={{ height: "150vh" }}>
      <div className="sticky top-0 h-screen grid grid-cols-1 md:grid-cols-2">
        {/* Left column */}
        <div className="relative overflow-hidden">
          {/* Text (visible initially, fades out) */}
          <div
            ref={textRef}
            className="absolute inset-0 flex items-center bg-paper px-[5vw] py-[5vh]"
          >
            <div>
              <h2
                className="text-ink"
                style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}
              >
                Software Engineering + AI Research
              </h2>
              <p
                className="mt-[2vh] max-w-text text-ink-light leading-relaxed"
                style={{ fontSize: "clamp(0.875rem, 1.2vw, 1.125rem)" }}
              >
                ...and I realized I wanted to respond to it. Now I&#39;m taking
                the time to look into the future and predict the skills I will
                need to be successful in the future version of my field.
              </p>
            </div>
          </div>

          {/* Architecture visual (slides down from above) */}
          <div
            ref={archRef}
            className="absolute inset-0 overflow-hidden"
            style={{
              transform: "translateY(-100%)",
              opacity: 0,
              backgroundColor: "var(--color-paper)",
              backgroundImage: "url(/textures/paper.png)",
              backgroundSize: "cover",
            }}
          >
            <div className="absolute inset-0 bg-paper/70" />
            <Image
              src="/images/homepage/processed/arch-split-riso.png"
              alt="Architecture split view"
              fill
              className="object-cover"
              style={{ mixBlendMode: "multiply" }}
              unoptimized
            />
          </div>
        </div>

        {/* Right column — Software visual (always visible) */}
        <div className="relative overflow-hidden">
          <Image
            src="/images/homepage/processed/software-split-riso.png"
            alt="Software split view"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
