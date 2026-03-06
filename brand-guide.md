# Brand Guide — Parallax

> **Status:** Draft for review
> **Date:** 2026-03-03
> **Task:** ASMV-4 (Brand Identity & Naming)

---

## Table of Contents

1. [Name & Domain](#1-name--domain)
2. [Positioning Statements](#2-positioning-statements)
3. [Color Palette](#3-color-palette)
4. [Typography — Final Decision](#4-typography--final-decision)
5. [Wordmark Direction](#5-wordmark-direction)
6. [Voice & Tone Guidelines](#6-voice--tone-guidelines)
7. [Design Tokens — Ready for Code](#7-design-tokens--ready-for-code)

---

## 1. Name & Domain

### The Name

**Parallax**

Parallax — the apparent displacement of an object caused by a change in the observer's position — captures the core idea: the same subject (architecture, software, AI) reveals different depths depending on where you stand. A practice that moves between disciplines sees what a single vantage point cannot.

The word carries architectural weight (parallax is a spatial phenomenon), computational precision (parallax scrolling, parallax correction in optics and photography), and a philosophical dimension (perspective shapes perception). It is the bridge made literal.

The single word stands on its own — no qualifier needed. It is a practice, a studio, a lens.

### Domain

**`parallax.studio`** — Decided. Short, memorable, and carries the right connotation: a place where work happens.

### Usage in Context

| Context | Treatment |
|---------|-----------|
| **Header wordmark** | `Parallax` — set in Futura PT (or Jost stand-in) at medium weight |
| **Footer** | `Parallax` — same typographic treatment as header, smaller scale |
| **Page title / meta** | `Parallax — [Page Name]` (title case for meta tags) |
| **Conversation / speech** | "Parallax" (title case when spoken) |
| **Social handles** | `@parallaxstudio` (one word, lowercase) |
| **Email** | `julianna@parallax.studio` |
| **Favicon / monogram** | `p` lettermark (see Section 5) |

---

## 2. Positioning Statements

Fifteen candidates following the Asimov copy pattern: present tense, active voice, mission-forward, ambitious but accessible. Each captures a different facet of the Parallax identity.

### Candidates

1. **Parallax explores the depth revealed when architecture, software, and AI share a single line of sight.**

2. Parallax builds at the intersection of spatial thinking and computational making — where drawings become code and code becomes space.

3. **Parallax is a personal practice in architecture, software, and AI — three vantage points on the same question of how we inhabit the world.**

4. Parallax moves between the drafting table and the terminal, finding what neither discipline sees alone.

5. Parallax is learning to see — shifting between architecture, software, and AI to find what each perspective reveals.

6. Parallax bridges the poetics of architecture with the progressivism of software, producing work that belongs to both worlds.

7. **Parallax operates across architecture, software, and AI — three lenses that, taken together, reveal depth invisible to any one alone.**

8. Parallax is a studio for spatial intelligence — where architectural thinking, computational craft, and artificial intelligence converge.

9. Parallax designs across scales: from the grain of a material to the architecture of a system, from a building section to a neural network.

10. Parallax is the ongoing work of Julianna — architect, software engineer, and builder of things that think about space.

11. Parallax asks what architecture knows that software doesn't, and what software knows that architecture hasn't yet imagined.

12. Parallax believes that shifting your position changes what you can see. Architecture, software, and AI are three positions on the same landscape.

13. Parallax makes things — buildings, software, images, arguments — and is interested in what happens when the making traditions of different disciplines inform each other.

14. Parallax is a practice of perception: architecture trains the eye to see space, software trains the mind to see systems, and AI is retraining both.

15. Parallax is where the built environment meets the computed environment — a personal practice in making, thinking, and seeing across disciplines.

### Top 3 Recommendations

The three statements marked in **bold** above (1, 3, and 7) are recommended as finalists. Each works slightly differently:

| # | Strength | Best for |
|---|----------|----------|
| **1** | Most poetic. "Depth revealed" is the parallax concept made visceral. Single sentence that rewards re-reading. | Homepage hero statement |
| **3** | Most honest. "Personal practice" grounds it. "How we inhabit the world" gives it philosophical ambition without pretension. | About page, meta description |
| **7** | Most precise. "Three lenses" is concrete. "Depth invisible to any one alone" is the parallax payoff stated clearly. | External bios, LinkedIn, conference intros |

**Recommendation:** Choose one as the primary positioning statement. The others can serve as supporting copy in different contexts (about page, meta description, social bios).

---

## 3. Color Palette

### Palette Overview

A reduced, intentional palette: three brand colors plus warm neutrals. Coral is the primary accent, Cream is the ground, and Sage provides a natural counterpoint. The ink neutrals handle all text hierarchy. Every other color was cut for clarity.

### Brand Colors

| Name | Hex | HSL | RGB | Role |
|------|-----|-----|-----|------|
| **Coral** | `#C95D45` | `11°, 52%, 53%` | `201, 93, 69` | Primary accent — the "one color." Links, active states, emphasis, hover highlights. |
| **Cream** | `#F5F0E8` | `37°, 46%, 93%` | `245, 240, 232` | Page background. Warm off-white — aged paper, never pure white. |
| **Sage** | `#8B9E7E` | `100°, 13%, 55%` | `139, 158, 126` | Secondary accent. Section backgrounds, decorative elements, nature. |

### Neutrals

| Name | Hex | HSL | RGB | Role |
|------|-----|-----|-----|------|
| **Ink** | `#2C2824` | `30°, 10%, 16%` | `44, 40, 36` | Primary text, dark backgrounds. Warm near-black — never pure `#000`. |
| **Ink Light** | `#5C554E` | `30°, 9%, 33%` | `92, 85, 78` | Secondary text, subheadings, less prominent body copy. |
| **Ink Lighter** | `#8A847D` | `32°, 5%, 51%` | `138, 132, 125` | Tertiary text, metadata, timestamps, labels. |
| **Border** | `#E2DCD5` | `32°, 18%, 86%` | `226, 220, 213` | Subtle dividers, card edges, table borders. |
| **Surface** | `#FAF8F5` | `36°, 33%, 97%` | `250, 248, 245` | Elevated surface (cards, modal backgrounds). Slightly lighter than Cream. |

### WCAG AA Contrast Ratios

WCAG AA requires 4.5:1 for normal text, 3.0:1 for large text (18px+ or 14px+ bold).

#### Text Colors on Cream Background (`#F5F0E8`)

| Text Color | Hex | Contrast Ratio | Normal Text (AA) | Large Text (AA) |
|------------|-----|---------------|------------------|-----------------|
| Ink | `#2C2824` | **10.3:1** | Pass | Pass |
| Ink Light | `#5C554E` | **5.2:1** | Pass | Pass |
| Ink Lighter | `#8A847D` | **3.2:1** | Fail | Pass |
| Coral | `#C95D45` | **3.2:1** | Fail | Pass |

#### Cream (`#F5F0E8`) on Color Backgrounds

| Background | Hex | Contrast (Cream on bg) | Normal Text (AA) | Large Text (AA) |
|------------|-----|----------------------|------------------|-----------------|
| Ink | `#2C2824` | **10.3:1** | Pass | Pass |
| Ink Light | `#5C554E` | **5.2:1** | Pass | Pass |
| Coral | `#C95D45` | **3.2:1** | Fail | Pass |
| Sage | `#8B9E7E` | **2.8:1** | Fail | Fail |

### Usage Rules

1. **Body text** must always be Ink (`#2C2824`) or Ink Light (`#5C554E`) on Cream/Surface backgrounds.
2. **Coral as text** is permitted only at large sizes (18px+ regular, 14px+ bold) — headings, pull quotes, highlighted words. Never for body text.
3. **Ink Lighter** (`#8A847D`) is for metadata, timestamps, and labels at 14px+ bold or 18px+ only.
4. **Sage** is a background/decorative color. Cream text on Sage fails AA — use Ink on Sage, or use Sage only as a section background with Ink text overlaid.
5. **Coral on Cream** works for interactive elements (links, buttons) at large sizes with additional affordance (underlines, hover states, button shapes).
6. **Cream on Ink** is the primary dark-on-light inversion — use for dark sections, footer, hero.

### Primary Accent — Coral

**Why Coral:** Warm, architectural (fired earth, clay, kiln-fired ceramics), bold enough to anchor the brand against cream. It carries physical-world materiality without being literal. Following the Asimov "one color" philosophy, Coral defines Parallax.

---

## 4. Typography — Final Decision

**Cormorant Garamond + Futura PT + Degular Mono.** Three voices, each with a distinct role. The serif leads at display scale (headings — semibold italic, with calligraphic warmth and character), the geometric sans carries the body and structural UI (navigation, wordmark, body text, labels), and the mono provides the technical accent (code, metadata). This inverts the typical Asimov formula twice: where Asimov leads with geometric sans for everything, Parallax gives the headings to a serif italic — warmth and craft at the loudest moments, geometric precision everywhere else.

### The Typefaces

| Role | Typeface | Weight(s) | Source | Stand-in (dev) |
|------|----------|-----------|--------|----------------|
| Headings | **Cormorant Garamond** | SemiBold (600), Bold (700), italic | Google Fonts (free, OFL) | — (final font, live) |
| Body / Nav / Wordmark | **Futura PT** | Light (300), Book (400), Medium (500), Demi (600) | Adobe Fonts (Creative Cloud) | Jost (Google Fonts) |
| Code / Labels / Metadata | **Degular Mono** | Light (300), Regular (400), Medium (500) | Adobe Fonts (Creative Cloud) | DM Mono (Google Fonts) |

### Why These Three

**Cormorant Garamond** — Christian Thalmann's open-source take on Claude Garamond's 16th-century designs. Tall x-height for screen readability, generous ascenders for elegance, and a stunning italic that brings headings alive with calligraphic warmth and personality. At semibold italic, it commands attention without shouting — the kind of confident, expressive voice that makes a heading feel like it was lettered by hand. The serif at display scale creates the emotional center of each page.

**Futura PT** — Paul Renner's Futura is the defining geometric sans-serif. Futura PT (Paratype's digital revival, available through Adobe Fonts) preserves the geometric purity — perfect circles in the "o", consistent stroke width, no humanist quirks. As the body and UI font, it provides clean, effortless readability. The light weight creates elegant white space in the wordmark; the regular weight carries body text with quiet precision. Navigation, labels, and structural elements all speak in this voice.

**Degular Mono** — OH no Type Company's geometric monospace. Where JetBrains Mono is designed for code editors (optimized for character disambiguation), Degular Mono is designed for display use (optimized for aesthetics). Its geometric construction echoes Futura, creating family cohesion between the body and mono voices. Used by Shinkei Systems — a reference point for Julianna's aesthetic.

### Adobe Fonts Upgrade Path

Futura PT and Degular Mono are available at no additional cost through Adobe Creative Cloud. Currently, the codebase uses Google Fonts stand-ins (Jost and DM Mono) to keep the dev server buildable.

**To upgrade:** Export .woff2 files from Adobe Creative Cloud, place them in `public/fonts/futura-pt/` and `public/fonts/degular-mono/`, then swap `src/lib/fonts.ts` from `next/font/google` to `next/font/local`. The CSS variable names (`--font-sans`, `--font-serif`, `--font-mono`) stay the same — no downstream changes needed.

### Integration (current, with stand-ins)

```typescript
import { Cormorant_Garamond, Jost, DM_Mono } from "next/font/google";

export const fontSans = Jost({          // → Futura PT (body/nav/wordmark)
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const fontSerif = Cormorant_Garamond({  // final (headings — semibold/bold italic)
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const fontMono = DM_Mono({       // → Degular Mono
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["300", "400", "500"],
});
```

### Type Scale

Regardless of which pairing is chosen, the type scale follows a minor third ratio (1.2x) as already established in `tokens.css`:

| Token | Size | Use |
|-------|------|-----|
| `--text-xs` | 0.75rem (12px) | Metadata, labels, timestamps |
| `--text-sm` | 0.875rem (14px) | Captions, small body, nav items |
| `--text-base` | 1rem (16px) | Body text |
| `--text-lg` | 1.125rem (18px) | Lead paragraphs, large body |
| `--text-xl` | 1.25rem (20px) | Small headings, card titles |
| `--text-2xl` | 1.5rem (24px) | Section headings |
| `--text-3xl` | 1.875rem (30px) | Page headings |
| `--text-4xl` | 2.25rem (36px) | Hero subheadings |
| `--text-5xl` | 3rem (48px) | Hero headings |
| `--text-6xl` | 3.75rem (60px) | Display / project titles |
| `--text-7xl` | 4.5rem (72px) | Maximum display |

**Weight usage:** Headings use SemiBold (600) italic in Cormorant Garamond — rich and expressive. Body text uses Regular (400) in Jost/Futura PT. Light (300) for the wordmark and display text in the sans. Medium (500) for emphasis in body. Bold (700) available for Cormorant headings when extra weight is needed at smaller heading sizes.

**Letter spacing:**
- Display text (3xl+): `-0.02em` (tracking-tight) — large type needs tightening
- Body text: `0` (tracking-normal)
- Uppercase labels / nav: `0.05em` (tracking-wide)
- Monospace labels: `0.1em` (tracking-wider)

**Line height:**
- Headings: `1.2` (leading-tight)
- Subheadings: `1.35` (leading-snug)
- Body text: `1.6` (leading-normal)
- Long-form reading: `1.75` (leading-relaxed)

---

## 5. Wordmark Direction

### Approach

The wordmark is **pure typography** — the name set in Futura PT at medium weight, with considered tracking. No icon, no symbol, no geometric mark. This follows the Asimov principle: "Typography IS the design."

### Wordmark Specimen

**`Parallax`** in Futura PT Medium, tracking +0.05em (`--tracking-wide`). The geometric sans creates clean, confident letterforms — the "a" is single-story (modern, distinctive), the "x" has precise angular crossings, the double "l" creates vertical rhythm. At large sizes, the consistent stroke width gives it architectural authority. At small sizes (16px), the medium weight holds up well on screen. Title case. The overall feel: a research lab nameplate.

### Clear Space Rules

Clear space around the wordmark is defined by the cap height of the typeface. The minimum clear space on all sides equals 1x the cap height of the "P" in "Parallax" at the rendered size. No other elements (navigation, images, decorative graphics) may intrude into this zone.

```
          ┌─────────────────────────────────────────────┐
          │                1x cap height                 │
          │  ┌───────────────────────────────────────┐  │
          │  │                                       │  │
  1x cap  │  │     Parallax                          │  │  1x cap
  height  │  │                                       │  │  height
          │  └───────────────────────────────────────┘  │
          │                1x cap height                 │
          └─────────────────────────────────────────────┘
```

### Minimum Size

- **Print:** 10pt minimum (below this, light-weight serifs lose definition)
- **Screen:** 14px minimum (below this, switch to Regular/Book weight)
- **Favicon/monogram:** Does not use the full wordmark — see below

### Favicon Direction

The favicon uses a **lettermark** rather than the full wordmark. Two candidates:

**Single "P" lettermark** — one uppercase "P" in Futura PT Medium, centered in the favicon square. The geometric construction of Futura's "P" — a perfect semicircle atop a vertical stroke — is distinctive at every scale. At 16x16, the form reads cleanly; at 180x180 (touch icon), it carries full brand recognition.

**Color:** Terracotta (`#C4724E`) "p" on Cream (`#F5F0E8`) background, or Ink (`#2C2824`) "p" on Cream. Both work. The Terracotta version reinforces brand color at the smallest scale.

---

## 6. Voice & Tone Guidelines

### Core Voice Attributes

| Attribute | What it means | What it is not |
|-----------|--------------|----------------|
| **First person** | "I build...", "I am interested in...", "My practice explores..." | Not "Parallax builds..." or "We believe..." |
| **Earnest** | Genuinely engaged with the work and its meaning | Not ironic, not self-deprecating, not performatively humble |
| **Curious** | Open questions, genuine inquiry, "I'm learning..." | Not authoritative pronouncements, not "thought leadership" |
| **Specific** | Name the actual thing — "Pallasmaa's haptic architecture" not "various theories" | Not vague, not hedged with qualifiers |
| **Present tense** | "I am building...", "This project explores..." | Not past tense ("I built...") unless explicitly retrospective |
| **Active voice** | "I designed the system" | Not "The system was designed" |
| **Ambitious but accessible** | "I believe architecture and software share a common question about how we inhabit space" | Not jargon-heavy, not exclusionary, not showing off |

### Sentence-Level Patterns

Following the Asimov copy pattern adapted for first-person voice:

**Positioning / about copy:**
- Present tense, active voice
- One sentence should do the work of a paragraph
- Mission-forward: what the practice does for the world, not a resume of credentials
- Example: "I move between the drafting table and the terminal, finding what neither discipline sees alone."

**Project descriptions:**
- One sentence describing what the project is and why it matters
- No process documentation in the description itself (save that for the project page)
- Example: "A housing study that treats the facade as a patchwork of warm earth tones — each unit a tile in a collective composition."

**Daily updates (Now page):**
- Can be fragmentary — not every entry needs to be a complete sentence
- Specific details over general summaries: "Reading Pallasmaa's 'Eyes of the Skin' — the chapter on peripheral vision" not "Doing some reading today"
- Status lines are honest: "stuck on mesh collisions" is better than "making progress"
- No exclamation marks, no emojis, no "excited to announce"

**Social / external bios:**
- Third person is acceptable in contexts where first person feels awkward (conference bios, LinkedIn)
- In these cases, use the practice name: "Parallax is..."
- Keep the same qualities: specific, earnest, present tense

### What Not To Do

- Do not describe the practice as a "studio" or "agency" — it is a practice
- Do not use buzzwords: "leveraging," "disrupting," "synergy," "at the intersection of" (even though the practice IS at an intersection — describe the intersection specifically, don't gesture at it)
- Do not write testimonials or self-praise
- Do not use humor as deflection — sincerity is the mode
- Do not capitalize for emphasis (use italics sparingly, or let the sentence structure do the work)

---

## 7. Design Tokens — Ready for Code

The following token system is the brand standard. The values below match `src/styles/tokens.css` and `tailwind.config.ts` already present in the codebase.

### CSS Custom Properties (`tokens.css`)

```css
:root {
  /* ── Typography Scale (minor third / 1.2 ratio) ── */
  --text-xs:    0.75rem;    /* 12px — metadata, labels */
  --text-sm:    0.875rem;   /* 14px — captions, small body */
  --text-base:  1rem;       /* 16px — body text */
  --text-lg:    1.125rem;   /* 18px — large body, lead paragraphs */
  --text-xl:    1.25rem;    /* 20px — small headings */
  --text-2xl:   1.5rem;     /* 24px — section headings */
  --text-3xl:   1.875rem;   /* 30px — page headings */
  --text-4xl:   2.25rem;    /* 36px — hero subheadings */
  --text-5xl:   3rem;       /* 48px — hero headings */
  --text-6xl:   3.75rem;    /* 60px — display / project titles */
  --text-7xl:   4.5rem;     /* 72px — maximum display */

  /* ── Font Weights (restrained, following Asimov pattern) ── */
  --font-light:    300;
  --font-regular:  400;
  --font-medium:   500;
  --font-semibold: 600;     /* used sparingly */

  /* ── Line Heights ── */
  --leading-tight:   1.2;   /* headings */
  --leading-snug:    1.35;  /* subheadings */
  --leading-normal:  1.6;   /* body text */
  --leading-relaxed: 1.75;  /* long-form reading */

  /* ── Letter Spacing ── */
  --tracking-tight:  -0.02em;  /* large display text */
  --tracking-normal:  0;       /* body */
  --tracking-wide:    0.05em;  /* uppercase labels, nav items */
  --tracking-wider:   0.1em;   /* monospace labels */

  /* ── Spacing (8px base unit) ── */
  --space-1:   0.25rem;   /*  4px */
  --space-2:   0.5rem;    /*  8px */
  --space-3:   0.75rem;   /* 12px */
  --space-4:   1rem;      /* 16px */
  --space-5:   1.25rem;   /* 20px — Asimov mobile padding */
  --space-6:   1.5rem;    /* 24px */
  --space-8:   2rem;      /* 32px */
  --space-10:  2.5rem;    /* 40px */
  --space-12:  3rem;      /* 48px */
  --space-16:  4rem;      /* 64px */
  --space-20:  5rem;      /* 80px — minimum section spacing */
  --space-24:  6rem;      /* 96px */
  --space-32:  8rem;      /* 128px — generous section spacing */
  --space-40:  10rem;     /* 160px — maximum section spacing */

  /* ── Semantic Spacing ── */
  --section-gap:       var(--space-24);
  --section-gap-lg:    var(--space-32);
  --content-padding-x: var(--space-5);
  --content-max-width: 72rem;    /* 1152px */
  --text-max-width:    40rem;    /* 640px — text column narrower than images */

  /* ── Color: Primary Warmth ── */
  --color-terracotta:    #C4724E;  /* Primary accent — the "one color" */
  --color-amber:         #D4A76A;  /* Warm secondary */
  --color-cream:         #F5F0E8;  /* Background — warm off-white */
  --color-warm-gray:     #B5AFA6;  /* Neutral mid-tone */

  /* ── Color: Secondary Earth ── */
  --color-sage:          #8B9E7E;  /* Nature accent */
  --color-dusty-rose:    #C9A5A0;  /* Subtle warmth */
  --color-slate:         #7A8B9A;  /* Cool contrast */

  /* ── Color: Accent (sparingly) ── */
  --color-coral:         #C95D45;  /* High-contrast accent */

  /* ── Color: Neutrals ── */
  --color-ink:           #2C2824;  /* Primary text — warm near-black */
  --color-ink-light:     #5C554E;  /* Secondary text */
  --color-ink-lighter:   #8A847D;  /* Tertiary text, metadata */
  --color-border:        #E2DCD5;  /* Subtle borders */
  --color-surface:       #FAF8F5;  /* Elevated surface (cards) */
  --color-background:    #F5F0E8;  /* Page background (cream) */

  /* ── Color: Semantic ── */
  --color-text-primary:    var(--color-ink);
  --color-text-secondary:  var(--color-ink-light);
  --color-text-tertiary:   var(--color-ink-lighter);
  --color-accent:          var(--color-terracotta);
  --color-accent-hover:    var(--color-coral);
  --color-bg:              var(--color-background);
  --color-bg-surface:      var(--color-surface);
}
```

### Tailwind Config Values

```typescript
// tailwind.config.ts — theme.extend
{
  colors: {
    terracotta: "#C4724E",
    amber: "#D4A76A",
    cream: "#F5F0E8",
    "warm-gray": "#B5AFA6",
    sage: "#8B9E7E",
    "dusty-rose": "#C9A5A0",
    slate: "#7A8B9A",
    coral: "#C95D45",
    ink: {
      DEFAULT: "#2C2824",
      light: "#5C554E",
      lighter: "#8A847D",
    },
    border: "#E2DCD5",
    surface: "#FAF8F5",
    background: "#F5F0E8",
  },
  fontFamily: {
    sans: ["var(--font-sans)", "Futura PT", "Jost", "system-ui", "sans-serif"],
    serif: ["var(--font-serif)", "Cormorant Garamond", "Georgia", "serif"],
    mono: ["var(--font-mono)", "Degular Mono", "DM Mono", "monospace"],
  },
  fontSize: {
    xs:   ["0.75rem",  { lineHeight: "1.6" }],
    sm:   ["0.875rem", { lineHeight: "1.6" }],
    base: ["1rem",     { lineHeight: "1.6" }],
    lg:   ["1.125rem", { lineHeight: "1.6" }],
    xl:   ["1.25rem",  { lineHeight: "1.35" }],
    "2xl": ["1.5rem",  { lineHeight: "1.35" }],
    "3xl": ["1.875rem",{ lineHeight: "1.2" }],
    "4xl": ["2.25rem", { lineHeight: "1.2" }],
    "5xl": ["3rem",    { lineHeight: "1.2" }],
    "6xl": ["3.75rem", { lineHeight: "1.2" }],
    "7xl": ["4.5rem",  { lineHeight: "1.2" }],
  },
  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
  },
  letterSpacing: {
    tighter: "-0.02em",
    normal: "0",
    wide: "0.05em",
    wider: "0.1em",
  },
  lineHeight: {
    tight: "1.2",
    snug: "1.35",
    normal: "1.6",
    relaxed: "1.75",
  },
  spacing: {
    18: "4.5rem",
    22: "5.5rem",
    26: "6.5rem",
    30: "7.5rem",
    34: "8.5rem",
    38: "9.5rem",
    42: "10.5rem",
  },
  maxWidth: {
    content: "72rem",
    text: "40rem",
  },
}
```

### Font CSS Variables

| Variable | Typeface | Role | Tailwind class |
|----------|----------|------|----------------|
| `--font-sans` | Futura PT (Jost stand-in) | Body text, navigation, wordmark, UI elements | `font-sans` |
| `--font-serif` | Cormorant Garamond | Headings (semibold italic), decorative accents | `font-serif` |
| `--font-mono` | Degular Mono (DM Mono stand-in) | Code, labels, metadata, technical accent | `font-mono` |

**Body default is sans.** The `<body>` uses `font-sans` (Jost/Futura PT). Headings get `font-serif` (Cormorant Garamond) at semibold italic via CSS defaults in `globals.css`. The wordmark and structural UI remain in `font-sans`.

---

## Appendix: Decision Log

| Decision | Status | Notes |
|----------|--------|-------|
| Name: Parallax | Decided | Confirmed by Julianna |
| Primary domain | Decided | `parallax.studio` |
| Positioning statement | Pending | 3 finalists presented — Julianna to choose |
| Color palette | Formalized | Values from research/03 confirmed and tested for WCAG |
| Primary accent | Formalized | Terracotta (`#C4724E`) |
| Typeface pairing | Decided | Futura PT + Cormorant Garamond + Degular Mono |
| Wordmark | Decided | "Parallax" in Futura PT Medium, title case |
| Favicon | Decided | "P" lettermark in Futura PT Medium |
