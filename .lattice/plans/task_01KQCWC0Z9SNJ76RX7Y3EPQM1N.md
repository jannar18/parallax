# ASMV-96: Reorder mobile nav and footer nav

## Scope

Reorder nav links on TWO surfaces only:
1. Mobile fullscreen overlay (Header.tsx, the `allLinks` array)
2. Footer nav (Footer.tsx, hard-coded `<Link>` list)

Desktop header (`leftLinks` / `rightLinks`) is **unchanged** — it has its own balanced left/right axis layout.

## Target order (both surfaces)

1. Software → `/work/software`
2. Architecture → `/work/architecture`
3. Archive → `/archive`
4. Writing → `/writing`
5. About → `/about`

## Current order

**Header `allLinks` (mobile overlay), Header.tsx lines 23–29:**
Architecture, Archive, Writing, Software, About

**Footer.tsx lines 36–85 (hard-coded `<Link>` blocks):**
Architecture, Archive, Writing, Software, About

## Implementation

### File 1: `src/components/global/Header.tsx`

Reorder the `allLinks` array (lines 23–29) to:

```ts
const allLinks = [
  { href: "/work/software", label: "Software" },
  { href: "/work/architecture", label: "Architecture" },
  { href: "/archive", label: "Archive" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
];
```

Do NOT touch `leftLinks` or `rightLinks` (desktop axis nav stays as-is).

### File 2: `src/components/global/Footer.tsx`

Reorder the five `<Link>` blocks inside the `<nav>` (lines 36–85) so the rendered order is Software, Architecture, Archive, Writing, About. Each block keeps its existing className/style/href — only the sequence of blocks moves.

## Notes / gotchas

- `allLinks` is **not shared** with desktop — it's only consumed by the mobile overlay (line 279). Safe to reorder freely.
- Footer links are duplicated inline (no shared array) — physically reorder the JSX blocks.
- All five hrefs already exist as routes in `src/app/` (verified: `/work/software`, `/work/architecture`, `/archive`, `/writing`, `/about`).
- Mobile overlay uses `index` for staggered transition delay (line 290) — order change just changes which item animates first; no logic adjustment needed.

## Acceptance criteria

- Mobile overlay renders links top-to-bottom: Software, Architecture, Archive, Writing, About.
- Footer renders links left-to-right: Software, Architecture, Archive, Writing, About.
- Desktop header axis nav is unchanged (Architecture/Archive on left, Writing/Software on right).
- All link hrefs unchanged. No styling/layout changes.
- `pnpm lint` clean; `pnpm build` succeeds.
