# Plan: ASMV-46 — Replace legacy color aliases with canonical Riso names

## Scope

Replace all usages of legacy Tailwind color class names (`vermillion`, `cream`, `forest`) and CSS custom property aliases (`--color-vermillion`, `--color-cream`, `--color-forest`) with their canonical Riso equivalents. Then remove the alias definitions from `tailwind.config.ts` and `tokens.css`.

## Mapping

| Legacy | Canonical |
|--------|-----------|
| `vermillion` (Tailwind class) | `scarlet` |
| `cream` (Tailwind class) | `paper` |
| `forest` (Tailwind class) | `spruce` |
| `--color-vermillion` (CSS var) | `--color-scarlet` |
| `--color-cream` (CSS var) | `--color-paper` |
| `--color-forest` (CSS var) | `--color-spruce` |

## Files to modify

### 1. Source files — class name replacements

| File | Legacy classes | Replacement |
|------|----------------|-------------|
| `src/app/page.tsx` | `hover:text-vermillion` (x3), `bg-cream` (x2), `bg-forest` (x4) | `hover:text-scarlet`, `bg-paper`, `bg-spruce` |
| `src/app/work/page.tsx` | `group-hover:text-vermillion` (x2) | `group-hover:text-scarlet` |
| `src/app/work/architecture/page.tsx` | `group-hover:text-vermillion` (x1) | `group-hover:text-scarlet` |
| `src/app/work/software/page.tsx` | `group-hover:text-vermillion` (x1) | `group-hover:text-scarlet` |
| `src/app/writing/page.tsx` | `group-hover:text-vermillion` (x1) | `group-hover:text-scarlet` |
| `src/components/interactive/ArtifactBar.tsx` | `bg-cream` (x1) | `bg-paper` |
| `src/components/interactive/StudioDeskScroll.tsx` | `bg-forest/20`, `group-hover:bg-forest/35` | `bg-spruce/20`, `group-hover:bg-spruce/35` |
| `src/components/global/Footer.tsx` | `text-cream/*` (x11 instances with opacity modifiers) | `text-paper/*` |

### 2. CSS files — variable replacements

| File | Change |
|------|--------|
| `src/styles/globals.css` | `var(--color-vermillion)` -> `var(--color-scarlet)`, `var(--color-cream)` -> `var(--color-paper)` |

### 3. Alias removal (after all references are updated)

| File | Remove |
|------|--------|
| `src/styles/tokens.css` | Lines 78-81: the three `--color-cream`, `--color-vermillion`, `--color-forest` aliases and the "Legacy aliases" comment |
| `tailwind.config.ts` | Lines 20-23: `vermillion`, `cream`, `forest` entries and the "Legacy aliases" comment |

## Acceptance criteria

1. Zero occurrences of `vermillion`, `cream` (as a color class/var), or `forest` (as a color class/var) in any source file under `src/`.
2. Legacy alias definitions removed from `tailwind.config.ts` and `tokens.css`.
3. `pnpm build` passes with no errors.
4. No visual changes -- all canonical colors resolve to the same hex values.
