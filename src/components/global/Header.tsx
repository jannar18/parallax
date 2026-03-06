"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
 *
 * Mobile (<768px):
 *   The inline expanding links are hidden. Instead, the cross button
 *   toggles a fullscreen overlay with vertical typographic links.
 *   The cross button has higher opacity on mobile for discoverability.
 */

const allLinks = [
  { href: "/work/architecture", label: "Architecture" },
  { href: "/now", label: "Now" },
  { href: "/writing", label: "Writing" },
  { href: "/work/software", label: "Software" },
  { href: "/about", label: "About" },
];

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [brandRevealed, setBrandRevealed] = useState(false);
  const inHeroRef = useRef(true);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Check if viewport is mobile-width (below md breakpoint). */
  const isMobile = useCallback(() => {
    return typeof window !== "undefined" && window.innerWidth < 768;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const heroEnd = vh * 1; // 200vh section minus 100vh viewport

      // Reveal wordmark once scrolling starts — never hides again
      if (scrollY > 30) setBrandRevealed(true);

      // Nav open during hero scroll range (desktop only — mobile uses overlay)
      if (scrollY > 30 && scrollY < heroEnd) {
        inHeroRef.current = true;
        if (!isMobile()) setNavOpen(true);
      } else if (scrollY >= heroEnd) {
        inHeroRef.current = false;
        if (!isMobile()) setNavOpen(false);
      } else {
        inHeroRef.current = true;
        if (!isMobile()) setNavOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on resize past breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (!isMobile() && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile, mobileMenuOpen]);

  const handleMouseEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    if (!inHeroRef.current && !isMobile()) setNavOpen(true);
  };

  const handleMouseLeave = () => {
    if (!inHeroRef.current && !isMobile()) {
      closeTimeout.current = setTimeout(() => setNavOpen(false), 400);
    }
  };

  const handleCrossClick = () => {
    if (isMobile()) {
      setMobileMenuOpen((prev) => !prev);
    } else if (!inHeroRef.current) {
      setNavOpen((prev) => !prev);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Determine if nav indicator should show (cross or mobile open state)
  const showCrossbar = !navOpen && !mobileMenuOpen;

  return (
    <>
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
          onClick={mobileMenuOpen ? closeMobileMenu : undefined}
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
          {/* Left links — expand outward (desktop only) */}
          <nav
            className={`hidden md:flex items-center gap-[2vw] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
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
            onClick={handleCrossClick}
            className="group relative flex items-center justify-center w-10 h-10 cursor-pointer bg-transparent border-none transition-colors duration-500 text-ink/50 hover:text-ink/70 md:text-ink/25 md:hover:text-ink/40"
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen || navOpen}
          >
            <svg
              viewBox="0 0 16 40"
              className={`h-8 transition-all duration-500 ${
                mobileMenuOpen ? "!text-ink/60" : ""
              }`}
              fill="currentColor"
            >
              {/* Vertical tapered line — point at top, widest at 1/3, long taper to bottom */}
              <path d="M8 0 L9 13 L8 40 L7 13 Z" />
              {/* Horizontal tapered crossbar at 1/3 height */}
              <path
                d="M0 13 L8 12 L16 13 L8 14 Z"
                className="transition-opacity duration-500"
                style={{ opacity: showCrossbar ? 1 : 0 }}
              />
            </svg>
          </button>

          {/* Right links — expand outward (desktop only) */}
          <nav
            className={`hidden md:flex items-center gap-[2vw] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
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

      {/* ── Mobile Navigation Overlay ── */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Background */}
        <div
          className={`absolute inset-0 bg-background transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        />

        {/* Navigation content */}
        <nav
          className={`relative flex flex-col justify-center items-center h-full px-[5vw] transition-opacity duration-500 ${
            mobileMenuOpen ? "opacity-100 delay-150" : "opacity-0"
          }`}
        >
          {/* Links — vertical stack, large serif italic */}
          <div className="flex flex-col items-center gap-8">
            {allLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="font-serif font-semibold italic text-ink/70 transition-all duration-300 hover:text-ink active:text-ink"
                style={{
                  fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
                  letterSpacing: "var(--tracking-tight)",
                  lineHeight: "var(--leading-tight)",
                  transitionDelay: mobileMenuOpen
                    ? `${150 + index * 50}ms`
                    : "0ms",
                  transform: mobileMenuOpen
                    ? "translateY(0)"
                    : "translateY(1rem)",
                  opacity: mobileMenuOpen ? 1 : 0,
                }}
                tabIndex={mobileMenuOpen ? 0 : -1}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Wordmark at bottom */}
          <div
            className="absolute bottom-[8vh] left-0 right-0 flex justify-center"
            style={{
              opacity: mobileMenuOpen ? 0.15 : 0,
              transition: "opacity 600ms ease",
              transitionDelay: mobileMenuOpen ? "400ms" : "0ms",
            }}
          >
            <p
              className="text-ink"
              style={{
                fontSize: "clamp(2rem, 8vw, 3.5rem)",
                letterSpacing: "var(--tracking-tight)",
              }}
            >
              <span className="font-serif font-semibold italic">para</span>
              <span className="font-sans font-extralight not-italic">ll</span>
              <span className="font-serif font-semibold italic">ax</span>
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}
