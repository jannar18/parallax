import Image from "next/image";
import Link from "next/link";
import FooterCanvas from "@/components/interactive/FooterCanvas";

/**
 * Footer — Full viewport slide.
 *
 * Its own h-screen section with textured/grainy dark background,
 * PARALLAX wordmark, contact/quote placeholders, and page links.
 * Background layers: brick wall photo + wire network canvas, both
 * very subtle behind the content.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative flex h-screen flex-col justify-between bg-ink overflow-hidden">
      {/* Background: brick wall photo */}
      <Image
        src="/images/home/hero/hero.raw.1.jpg"
        alt=""
        fill
        className="object-cover opacity-[0.1] mix-blend-screen pointer-events-none"
        unoptimized
      />

      {/* Background: static wire network canvas */}
      <FooterCanvas />

      {/* Grain texture overlay — localized to footer (uses shared .grain-texture class) */}
      <div className="grain-texture absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-soft-light" />

      <div className="relative flex flex-1 flex-col justify-between px-[2.5vw] py-[6vh] font-sans">
        {/* Navigation links — pushed down below the window */}
        <nav className="flex flex-wrap gap-[3vw] mt-auto mb-auto pt-[38vh] pl-0">
          <Link
            href="/work/architecture"
            className="font-mono uppercase text-paper/40 transition-colors hover:text-paper/80"
            style={{
              fontSize: "clamp(0.65rem, 0.8vw, 0.75rem)",
              letterSpacing: "var(--tracking-wider)",
            }}
          >
            Architecture
          </Link>
          <Link
            href="/archive"
            className="font-mono uppercase text-paper/40 transition-colors hover:text-paper/80"
            style={{
              fontSize: "clamp(0.65rem, 0.8vw, 0.75rem)",
              letterSpacing: "var(--tracking-wider)",
            }}
          >
            Archive
          </Link>
          <Link
            href="/writing"
            className="font-mono uppercase text-paper/40 transition-colors hover:text-paper/80"
            style={{
              fontSize: "clamp(0.65rem, 0.8vw, 0.75rem)",
              letterSpacing: "var(--tracking-wider)",
            }}
          >
            Writing
          </Link>
          <Link
            href="/work/software"
            className="font-mono uppercase text-paper/40 transition-colors hover:text-paper/80"
            style={{
              fontSize: "clamp(0.65rem, 0.8vw, 0.75rem)",
              letterSpacing: "var(--tracking-wider)",
            }}
          >
            Software
          </Link>
          <Link
            href="/about"
            className="font-mono uppercase text-paper/40 transition-colors hover:text-paper/80"
            style={{
              fontSize: "clamp(0.65rem, 0.8vw, 0.75rem)",
              letterSpacing: "var(--tracking-wider)",
            }}
          >
            About
          </Link>
        </nav>

        {/* Bottom: wordmark + year */}
        <div className="flex items-center justify-between">
          <p
            className="text-paper/20 tracking-tighter"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              letterSpacing: "var(--tracking-tight)",
            }}
          >
            <span className="font-serif font-semibold italic">para</span>
            <span className="font-sans font-extralight not-italic">ll</span>
            <span className="font-serif font-semibold italic">ax</span>
          </p>
          <p
            className="text-paper/30 translate-y-[1em]"
            style={{
              fontSize: "clamp(0.65rem, 0.8vw, 0.75rem)",
              letterSpacing: "var(--tracking-wide)",
            }}
          >
            &copy; {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
}
