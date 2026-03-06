import { Cormorant_Garamond, Jost, DM_Mono } from "next/font/google";

/**
 * Font configuration — Parallax brand typography.
 *
 * Role assignment:
 *   Body text / Nav:   Jost (stand-in for Futura PT)    — geometric sans, clean readability
 *   Headings:          Cormorant Garamond                — semibold italic, warmth + character
 *   Mono / Labels:     DM Mono (stand-in for Degular Mono)
 *
 * Upgrade path: Acquire Futura PT and Degular Mono web font licenses
 * (e.g., via MyFonts or a foundry that permits self-hosting), place
 * .woff2 files in public/fonts/, then swap to next/font/local.
 * The CSS variable names stay the same — no downstream changes needed.
 */

export const fontSans = Jost({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const fontSerif = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const fontMono = DM_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  display: "swap",
  weight: ["300", "400", "500"],
});
