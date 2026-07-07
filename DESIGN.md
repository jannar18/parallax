---
version: "0.1.0"
name: "Parallax"
description: "Riso-print editorial aesthetic for Julianna Roberts' portfolio — warm paper cream and oxblood ink, a semibold-italic Cormorant Garamond serif leading at display scale over geometric Futura PT body and Degular Mono technical accents, with a six-color Riso palette (scarlet, olive, moss, spruce). Flat and typographic — no rounded chrome, no dark mode. The wordmark sets 'parallax' in italic serif with the double-L swapped to two upright geometric strokes: the parallax concept made typographic."
colors:
  background: "#FDFCEA"
  surface: "#f8f6ea"
  paper: "#FDFCEA"
  foreground: "#471f20"
  foreground-muted: "#6d4344"
  foreground-faint: "#946768"
  border: "#e8e5d8"
  ink: "#471f20"
  ink-light: "#6d4344"
  ink-lighter: "#946768"
  oxblood: "#471f20"
  scarlet: "#f65058"
  scarlet-dark: "#d4434a"
  olive: "#b49f29"
  moss: "#68724d"
  spruce: "#4a635d"
  accent: "#f65058"
  accent-hover: "#d4434a"
typography:
  font-serif:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    role: "Display / headings — semibold (600) italic; the emotional center of each page"
    cssVar: "--font-serif"
    devStandIn: "Cormorant Garamond (Google Fonts); production: Adobe Fonts"
  font-sans:
    fontFamily: "Futura PT, Jost, system-ui, sans-serif"
    role: "Body, navigation, wordmark, labels, structural UI"
    cssVar: "--font-sans"
    devStandIn: "Jost (Google Fonts); production: Futura PT (Adobe CC)"
  font-mono:
    fontFamily: "Degular Mono, DM Mono, monospace"
    role: "Code, metadata, technical labels"
    cssVar: "--font-mono"
    devStandIn: "DM Mono (Google Fonts); production: Degular Mono (Adobe CC)"
  weights:
    extralight: "200"
    light: "300"
    normal: "400"
    medium: "500"
    semibold: "600"
  scale:
    xs: { size: "0.75rem", lineHeight: "1.6" }
    sm: { size: "0.875rem", lineHeight: "1.6" }
    base: { size: "1rem", lineHeight: "1.6" }
    lg: { size: "1.125rem", lineHeight: "1.6" }
    xl: { size: "1.25rem", lineHeight: "1.35" }
    "2xl": { size: "1.5rem", lineHeight: "1.35" }
    "3xl": { size: "1.875rem", lineHeight: "1.2" }
    "4xl": { size: "2.25rem", lineHeight: "1.2" }
    "5xl": { size: "3rem", lineHeight: "1.2" }
    "6xl": { size: "3.75rem", lineHeight: "1.2" }
    "7xl": { size: "4.5rem", lineHeight: "1.2" }
  letterSpacing:
    tighter: "-0.02em"
    normal: "0"
    wide: "0.05em"
    wider: "0.1em"   # monospace labels
  lineHeight:
    tight: "1.2"
    snug: "1.35"
    normal: "1.6"
    relaxed: "1.75"
rounded:
  none: "0"           # default — the system is flat/editorial
  sm: "0.125rem"      # sparingly, on small interactive chips only
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "6": "1.5rem"
  "8": "2rem"
  "12": "3rem"
  "16": "4rem"
  "18": "4.5rem"
  "22": "5.5rem"
  "26": "6.5rem"
  "30": "7.5rem"
  "34": "8.5rem"
  "38": "9.5rem"
  "42": "10.5rem"
layout:
  content-max-width: "72rem"
  text-max-width: "40rem"
components:
  link:
    color: "{colors.scarlet}"
    hoverColor: "{colors.scarlet-dark}"
    decoration: "underline on hover; large interactive elements get button affordance"
  heading:
    fontFamily: "{typography.font-serif.fontFamily}"
    fontStyle: "italic"
    fontWeight: "600"
    color: "{colors.oxblood}"
  label-mono:
    fontFamily: "{typography.font-mono.fontFamily}"
    letterSpacing: "0.1em"
    textTransform: "uppercase"
    color: "{colors.ink-lighter}"
  wordmark:
    text: "parallax"
    case: "lowercase"
    detail: "the 'll' swaps from italic serif to two thin upright geometric-sans strokes (parallel planes)"
    favicon: "'p' lettermark"
---

# Design Notes — Parallax

## Voice
Confident, expressive, spatial. Where the reference Asimov aesthetic leads with geometric sans for
everything, Parallax gives the loudest moment — the heading — to a **semibold italic serif** for
warmth and craft, and keeps geometric precision (Futura PT) everywhere else. Mono is a technical
accent only.

## Palette logic
- **Paper `#FDFCEA` + Oxblood `#471f20`** are the base pair (background + ink). All neutrals are
  derived from oxblood (`ink-light`, `ink-lighter`).
- **Scarlet `#f65058`** is the single primary accent — links, interactive elements, hover darkens to
  `#d4434a`. Use it as an accent on Paper only at large sizes with extra affordance (underline/hover).
- **Olive / Moss / Spruce** are the secondary Riso colors for illustration, tags, and section
  differentiation — not for body text.

## Do
- Lead pages with large italic serif headings; let generous section gaps (spacing 18–42) breathe.
- Keep chrome flat — this is a print-inspired system; avoid rounded cards and drop shadows.
- Use mono labels (uppercase, `0.1em` tracking) for metadata and technical captions.

## Don't
- Don't add dark mode.
- Don't round corners or add shadows as default UI texture.
- Don't set body copy in the serif or the mono — Futura PT/Jost carries the body.

## Fonts — dev vs production
The repo currently uses Google Fonts stand-ins (Cormorant Garamond, Jost, DM Mono) to keep the dev
server buildable. Production upgrades to Adobe Fonts (Futura PT, Degular Mono) by dropping `.woff2`
into `public/fonts/` and swapping `src/lib/fonts.ts` from `next/font/google` to `next/font/local`.
The CSS variable names (`--font-sans`, `--font-serif`, `--font-mono`) stay the same.

## Sources
Derived from `brand-guide.md` (§3 Color, §4 Typography, §7 Design Tokens), `tailwind.config.ts`, and
`src/styles/tokens.css`. When those change, regenerate this file.
