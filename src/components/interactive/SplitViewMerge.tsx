"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * SplitViewMerge — the merge moment after Sections 2 and 3.
 *
 * A 150vh sticky container (50vh of scroll range). Shows Section 3's
 * layout initially (architecture left, text right). As the user
 * scrolls, the software visual slides down from above into the
 * right half while text fades out. Quick and immediate.
 */
export default function SplitViewMerge() {
  const containerRef = useRef<HTMLDivElement>(null);
  const softwareRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el || !softwareRef.current || !textRef.current) return;

      const rect = el.getBoundingClientRect();
      const scrollRange = el.clientHeight - window.innerHeight;
      if (scrollRange <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / scrollRange));

      // Ease: smooth in-out
      const ease =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // Software visual: slides from above to resting position
      softwareRef.current.style.transform = `translateY(${-100 + ease * 100}%)`;
      softwareRef.current.style.opacity = String(ease);

      // Text: fades out
      textRef.current.style.opacity = String(1 - ease);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} style={{ height: "150vh" }}>
      <div className="sticky top-0 h-screen grid grid-cols-1 md:grid-cols-2">
        {/* Left column — Architecture visual (always visible) */}
        <div
          className="relative overflow-hidden"
          style={{
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

        {/* Right column */}
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
                Architectural Design
              </h2>
              <p
                className="mt-[2vh] max-w-text text-ink-light leading-relaxed"
                style={{ fontSize: "clamp(0.875rem, 1.2vw, 1.125rem)" }}
              >
                One year ago I was finishing a 5 year accredited architecture
                program at Illinois Tech. I was on track to follow the traditional
                path towards becoming a Licensed Architect through NCARB, but as I
                was nearing graduation I looked at the rapidly changing world
                around me, I looked at my field which seemed stuck in time...
              </p>
            </div>
          </div>

          {/* Software visual (slides down from above) */}
          <div
            ref={softwareRef}
            className="absolute inset-0 overflow-hidden"
            style={{ transform: "translateY(-100%)", opacity: 0 }}
          >
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
    </div>
  );
}
