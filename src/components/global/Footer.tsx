import Link from "next/link";

/**
 * Footer — Minimal site footer.
 *
 * Restrained, typographic. Matches Asimov pattern:
 * quiet, generous whitespace, no visual clutter.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto max-w-content px-5 font-sans">
        <div className="border-b border-border py-14 md:py-20">
          <p className="text-sm uppercase text-ink-lighter">Parallax</p>
          <p className="mt-4 max-w-3xl text-4xl font-light leading-tight text-ink md:text-6xl">
            A studio where architecture and software inform each other.
          </p>
        </div>

        <div className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p
            className="text-sm text-ink-lighter"
            style={{ letterSpacing: "var(--tracking-wide)" }}
          >
            &copy; {currentYear} Parallax
          </p>
          <nav className="flex gap-6">
            <Link
              href="/about"
              className="text-sm text-ink-lighter transition-colors hover:text-ink"
              style={{ letterSpacing: "var(--tracking-wide)" }}
            >
              About
            </Link>
            <Link
              href="/work"
              className="text-sm text-ink-lighter transition-colors hover:text-ink"
              style={{ letterSpacing: "var(--tracking-wide)" }}
            >
              Work
            </Link>
            <Link
              href="/writing"
              className="text-sm text-ink-lighter transition-colors hover:text-ink"
              style={{ letterSpacing: "var(--tracking-wide)" }}
            >
              Writing
            </Link>
            <Link
              href="/now"
              className="text-sm text-ink-lighter transition-colors hover:text-ink"
              style={{ letterSpacing: "var(--tracking-wide)" }}
            >
              Now
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
