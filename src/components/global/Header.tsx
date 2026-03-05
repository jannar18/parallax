import Link from "next/link";

/**
 * Header — Minimal site navigation.
 *
 * Features:
 * - Static position for wireframe review clarity
 * - Simple horizontal nav links
 * - Wordmark: "Parallax" in Futura PT (Jost stand-in) at medium weight
 */

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/now", label: "Now" },
];

export default function Header() {
  return (
    <header className="border-b border-border" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-5 font-sans">
        <Link
          href="/"
          className="text-lg font-medium tracking-wide text-ink no-underline"
          style={{ letterSpacing: "var(--tracking-wide)" }}
        >
          Parallax
        </Link>

        <nav className="flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-normal tracking-wide text-ink-light transition-colors hover:text-ink"
              style={{ letterSpacing: "var(--tracking-wide)" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
