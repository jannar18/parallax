"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/**
 * Header — Axis navigation.
 *
 * A thin vertical axis line centered at the top of the viewport.
 * On hover, click, or scroll-up it expands outward to reveal nav links:
 *   Architecture — Now — [axis] — Writing — Software
 * No background — the links float over the page content.
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
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 80) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down — hide and close
        setIsVisible(false);
        setIsOpen(false);
      } else {
        // Scrolling up — show and open
        setIsVisible(true);
        setIsOpen(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleMouseEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setIsOpen(false);
    }, 400);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      {/* Parallax wordmark — left side */}
      <Link
        href="/"
        className="absolute left-[5vw] font-light text-ink/80 no-underline transition-colors hover:text-ink"
        style={{
          fontSize: "clamp(1.1rem, 1.5vw, 1.4rem)",
          letterSpacing: "var(--tracking-wide)",
        }}
      >
        Parallax
      </Link>

      {/* Centered axis nav */}
      <div
        className="relative mx-auto flex items-center py-5"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left links — expand outward */}
        <nav
          className={`flex items-center gap-[2vw] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isOpen
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

        {/* Center axis — always visible */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="group relative flex items-center justify-center w-8 h-8 cursor-pointer bg-transparent border-none"
          aria-label="Toggle navigation"
        >
          {/* Vertical axis line */}
          <div
            className={`w-px bg-ink/40 transition-all duration-500 group-hover:bg-ink/70 ${
              isOpen ? "h-3" : "h-5"
            }`}
          />
          {/* Small crossbar when closed */}
          <div
            className={`absolute w-2 h-px bg-ink/40 transition-all duration-500 group-hover:bg-ink/70 ${
              isOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
            }`}
          />
        </button>

        {/* Right links — expand outward */}
        <nav
          className={`flex items-center gap-[2vw] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isOpen
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
