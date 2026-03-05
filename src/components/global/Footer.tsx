import Link from "next/link";

/**
 * Footer — Full viewport slide.
 *
 * Its own h-screen section with textured/grainy dark background,
 * PARALLAX wordmark, contact/quote placeholders, and page links.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative flex h-screen flex-col justify-between bg-ink overflow-hidden">
      {/* Grain texture overlay — localized to footer */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "300px 300px",
        }}
      />

      <div className="relative flex flex-1 flex-col justify-between px-[5vw] py-[6vh] font-sans">
        {/* Top: quote + contact */}
        <div className="grid grid-cols-1 gap-[4vw] md:grid-cols-2">
          <div>
            <p
              className="text-cream/60 italic font-serif leading-relaxed max-w-text"
              style={{ fontSize: "clamp(0.875rem, 1.2vw, 1.125rem)" }}
            >
              &ldquo;Quote placeholder — a line that captures the ethos of the
              practice.&rdquo;
            </p>
          </div>
          <div className="md:text-right">
            <p
              className="text-cream/40 uppercase"
              style={{
                fontSize: "clamp(0.65rem, 0.8vw, 0.75rem)",
                letterSpacing: "var(--tracking-wider)",
              }}
            >
              Contact
            </p>
            <p
              className="mt-[1vh] text-cream/60"
              style={{ fontSize: "clamp(0.8rem, 1vw, 0.95rem)" }}
            >
              hello@parallax.studio
            </p>
          </div>
        </div>

        {/* Middle: navigation links */}
        <nav className="flex flex-wrap gap-[3vw]">
          <Link
            href="/"
            className="text-cream/40 transition-colors hover:text-cream/80"
            style={{
              fontSize: "clamp(0.8rem, 1vw, 0.95rem)",
              letterSpacing: "var(--tracking-wide)",
            }}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-cream/40 transition-colors hover:text-cream/80"
            style={{
              fontSize: "clamp(0.8rem, 1vw, 0.95rem)",
              letterSpacing: "var(--tracking-wide)",
            }}
          >
            About
          </Link>
          <Link
            href="/work"
            className="text-cream/40 transition-colors hover:text-cream/80"
            style={{
              fontSize: "clamp(0.8rem, 1vw, 0.95rem)",
              letterSpacing: "var(--tracking-wide)",
            }}
          >
            Work
          </Link>
          <Link
            href="/writing"
            className="text-cream/40 transition-colors hover:text-cream/80"
            style={{
              fontSize: "clamp(0.8rem, 1vw, 0.95rem)",
              letterSpacing: "var(--tracking-wide)",
            }}
          >
            Writing
          </Link>
          <Link
            href="/now"
            className="text-cream/40 transition-colors hover:text-cream/80"
            style={{
              fontSize: "clamp(0.8rem, 1vw, 0.95rem)",
              letterSpacing: "var(--tracking-wide)",
            }}
          >
            Now
          </Link>
        </nav>

        {/* Bottom: wordmark + year */}
        <div className="flex flex-col gap-[2vh] sm:flex-row sm:items-end sm:justify-between">
          <p
            className="font-light text-cream/20 tracking-tighter"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              letterSpacing: "var(--tracking-tight)",
            }}
          >
            PARALLAX
          </p>
          <p
            className="text-cream/30"
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
