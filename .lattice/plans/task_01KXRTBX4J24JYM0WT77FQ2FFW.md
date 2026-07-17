# ASMV-114 — Architecture portfolio flipbook

## Goal
Replace the "In development…" placeholder on `/work/architecture` with an
interactive book of Julianna's *selected works 2022–2024* portfolio — a
literal page-curl flipbook the visitor turns, matching how it reads in
print. Hybrid: page-curl on desktop, clean vertical scroll on mobile.

## Source
`roberts_selectedworks_2025_v2.pdf` (iCloud) — 20 pages, letter.
- Page 1 = portrait **cover** (1700×2200).
- Pages 2–20 = **landscape spreads** (3400×2200), composed as facing pages.

## Asset pipeline (DONE — committed under public/images/architecture-book/)
- `page-01…page-20.jpg` — full-page renders (cover + 19 spreads). Used by the
  **mobile** vertical-scroll view (keeps facing-page compositions intact).
- `leaf-000…leaf-038.jpg` — flipbook leaves. Cover (000) + each spread split
  at the gutter into left/right 1700×2200 portrait leaves (re-rendered from
  PDF vector via `pdftoppm` crop — no double-JPEG loss).
- `leaf-039.png` — plain paper (#FDFCEA) **back cover**, so `showCover`'s
  first+last single-cover behaviour leaves an even interior and all 19
  original spreads pair correctly: (001,002)…(037,038).

## Approach
- Library: **`page-flip`** (vanilla StPageFlip) — no React peer-dep coupling
  (safer under React 19 than the `react-pageflip` wrapper), owns its own DOM
  so it won't fight React reconciliation.
- New client component `src/components/interactive/Flipbook.tsx`:
  - `matchMedia("(min-width: 768px)")` picks mode on mount + on resize.
  - **Desktop:** init `PageFlip` on a container, `loadFromImages(leafUrls)`,
    `showCover:true`, `size:"stretch"`, maxShadowOpacity for a soft page
    shadow. Prev / next controls + "spread X / N" indicator. Arrow-key nav.
  - **Mobile:** no PageFlip; vertical scroll column of full spreads
    (`page-01…page-20`), each full-width, tap to open full-res.
  - Loading state until images are ready.
- Wire into `src/app/work/architecture/page.tsx` (keep `metadata`, drop the
  placeholder). Framing uses design tokens (paper bg, oxblood ink, mono
  labels), a short title/intro above the book, generous whitespace.

## Key files
- `src/components/interactive/Flipbook.tsx` (new)
- `src/app/work/architecture/page.tsx` (rewrite body)
- `public/images/architecture-book/*` (assets, done)
- `package.json` (add `page-flip`)

## Acceptance criteria
- `/work/architecture` shows the portfolio as a turnable book on desktop
  (drag/click corner to flip, cover opens alone, spreads read correctly).
- On mobile, the same pages are legible in a vertical scroll.
- `pnpm build` passes; no RSC/client boundary errors; no console errors.
- Matches the site's visual language (paper/oxblood/scarlet, Jost + Cormorant).
- Keyboard + prev/next controls work; page indicator accurate.

## Out of scope
- Per-project deep-dive pages ([slug]) — "book IS the section" for now.
- Deep-linking to a specific page; zoom/pan inside the desktop flip.
