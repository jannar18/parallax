"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/**
 * Header — Axis navigation.
 *
 * Flow:
 *   1. Page load: just the cross, centered top. Nothing else.
 *   2. Start scrolling into hero: nav links expand from cross,
 *      "Parallax" wordmark fades in. Nav stays open through hero.
 *   3. After hero (scroll past ~200vh): nav closes.
 *   4. Cross + wordmark persist for the entire scroll experience.
 *   5. After hero, nav is toggleable by hover/click on the cross.
 */

const leftLinks = [
  { href: "/work/architecture", label: "Architecture" },
  { href: "/now", label: "Now" },
];

const rightLinks = [
  { href: "/writing", label: "Writing" },
  { href: "/work/software", label: "Software" },
];

export default function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const [brandRevealed, setBrandRevealed] = useState(false);
  const inHeroRef = useRef(true);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const heroEnd = vh * 1; // 200vh section minus 100vh viewport

      // Reveal wordmark once scrolling starts — never hides again
      if (scrollY > 30) setBrandRevealed(true);

      // Nav open during hero scroll range
      if (scrollY > 30 && scrollY < heroEnd) {
        inHeroRef.current = true;
        setNavOpen(true);
      } else if (scrollY >= heroEnd) {
        inHeroRef.current = false;
        setNavOpen(false);
      } else {
        inHeroRef.current = true;
        setNavOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    if (!inHeroRef.current) setNavOpen(true);
  };

  const handleMouseLeave = () => {
    if (!inHeroRef.current) {
      closeTimeout.current = setTimeout(() => setNavOpen(false), 400);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center pointer-events-none">
      {/* Parallax wordmark — fades in on first scroll, stays forever */}
      <Link
        href="/"
        className={`absolute left-[5vw] no-underline pointer-events-auto transition-opacity duration-700 ${
          brandRevealed
            ? "text-ink/80 opacity-100 hover:text-ink"
            : "opacity-0"
        }`}
        style={{
          fontSize: "clamp(1.4rem, 2vw, 1.8rem)",
          letterSpacing: "var(--tracking-wide)",
        }}
        tabIndex={brandRevealed ? 0 : -1}
      >
        <span className="font-serif font-semibold italic">para</span>
        <span className="font-sans font-extralight not-italic">ll</span>
        <span className="font-serif font-semibold italic">ax</span>
      </Link>

      {/* Centered axis nav */}
      <div
        className="relative mx-auto flex items-center py-5 pointer-events-auto"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left links — expand outward */}
        <nav
          className={`flex items-center gap-[2vw] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            navOpen
              ? "max-w-[40vw] opacity-100 mr-[2vw]"
              : "max-w-0 opacity-0 mr-0"
          }`}
        >
          {leftLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap font-sans text-ink/70 transition-colors hover:text-ink"
              style={{
                fontSize: "clamp(0.7rem, 0.9vw, 0.85rem)",
                letterSpacing: "var(--tracking-wide)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Center cross — always visible, tapered, crossbar at 1/3 from top */}
        <button
          onClick={() => {
            if (!inHeroRef.current) setNavOpen((prev) => !prev);
          }}
          className="group relative flex items-center justify-center w-10 h-10 cursor-pointer bg-transparent border-none text-ink/25 transition-colors duration-500 hover:text-ink/40"
          aria-label="Toggle navigation"
        >
          <svg
            viewBox="0 0 16 40"
            className="h-8 transition-all duration-500"
            fill="currentColor"
          >
            {/* Vertical tapered line — point at top, widest at 1/3, long taper to bottom */}
            <path d="M8 0 L9 13 L8 40 L7 13 Z" />
            {/* Horizontal tapered crossbar at 1/3 height */}
            <path
              d="M0 13 L8 12 L16 13 L8 14 Z"
              className="transition-opacity duration-500"
              style={{ opacity: navOpen ? 0 : 1 }}
            />
          </svg>
        </button>

        {/* Right links — expand outward */}
        <nav
          className={`flex items-center gap-[2vw] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            navOpen
              ? "max-w-[40vw] opacity-100 ml-[2vw]"
              : "max-w-0 opacity-0 ml-0"
          }`}
        >
          {rightLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap font-sans text-ink/70 transition-colors hover:text-ink"
              style={{
                fontSize: "clamp(0.7rem, 0.9vw, 0.85rem)",
                letterSpacing: "var(--tracking-wide)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
