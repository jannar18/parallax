## Critical Code Review
- **Date:** 2026-03-06 16:30
- **Model:** Gemini CLI
- **Branch:** main
- **Latest Commit:** 579d57b
- **Linear Story:** ASMV-24
- **Review Type:** Critical/Adversarial
---

## The Ugly Truth
The codebase is currently gaslighting its agents. `CLAUDE.md`, `AGENTS.md`, and `brand-guide.md` contradict each other on fundamental design decisions (typography, colors), and the actual code (`tokens.css`) implements a third reality (Riso palette) that matches none of the documentation perfectly. A new agent reading `brand-guide.md` would implement features using a deprecated color palette. A new agent reading `AGENTS.md` would implement typography backward (Serif body/Sans headings).

## What Will Break
1.  **Visual Consistency:** Any new component built by an agent using `brand-guide.md` will use the old "Terracotta/Cream" palette, clashing with the actual "Riso/Paper" palette in `tokens.css`.
2.  **Typography Hierarchy:** Agents following `AGENTS.md` will invert the brand's core typographic identity, making the site look like a generic template instead of the intended "Asimov-level" editorial design.
3.  **Hero Component:** The `HeroBrandVisual` and `hero-canvas.ts` are hardcoded to the old palette (`#F5F0E8`, `44,40,36`). If the global background changes in `tokens.css`, the canvas background will not update, creating a visible seam or mismatch.

## What's Missing
1.  **Tests:** `npm run test` fails (script missing). There is no test harness.
2.  **Single Source of Truth:** There are too many "sources of truth" (`brand-guide.md`, `CLAUDE.md`, `AGENTS.md`, `tokens.css`) and they are not synchronized.
3.  **Dependencies:** `simplex-noise` and `@napi-rs/canvas` are missing from `package.json` but are required for the asset generation scripts mentioned in `CLAUDE.md`.

## The Nits
-   `CLAUDE.md` lists research docs `01`, `02`, `03` but misses `04-brand-identity-notes.md`.
-   `AGENTS.md` contains a "Visual References" section that is valuable but missing from `CLAUDE.md`.
-   Lattice tasks for the Riso update are stuck in "review" despite the code being merged.

---

## Blockers
-   [ ] **Typography Contradiction:** `AGENTS.md` (lines 98, 183) claims "Futura PT (headings) + Cormorant Garamond (body)". `CLAUDE.md` and `brand-guide.md` claim the opposite. **Code (`globals.css`) follows `CLAUDE.md`. `AGENTS.md` must be fixed immediately.**
-   [ ] **Color Palette Drift:** `brand-guide.md` defines a palette (Terracotta, Cream, etc.) that is **totally different** from `tokens.css` (Oxblood, Paper, Scarlet). The brand guide is effectively describing a different website.

## Important
-   [ ] **Hardcoded Colors:** `src/lib/hero-canvas.ts` defines `BG_COLOR = "#F5F0E8"` and `INK_RGB = "44,40,36"`. These are magic strings that do not use the CSS variables or the `tokens.css` values. They match the *old* palette.
-   [ ] **Missing Dev Dependencies:** Add `simplex-noise` and `@napi-rs/canvas` to `devDependencies` if the asset workflows are to remain reproducible.
-   [ ] **Missing Tests:** Add a basic test script (even if just `echo "no tests"` exit 0) or scaffolding to prevent CI confusion, or update documentation to reflect the lack of tests.

## Potential
-   [ ] **Docs Consolidation:** `AGENTS.md` and `CLAUDE.md` have ~80% overlap. Consider consolidating into `CLAUDE.md` and having `AGENTS.md` just point to it or contain only the moodboard/visual references.
-   [ ] **Research Index:** Update `CLAUDE.md` to list `04-brand-identity-notes.md`.

## Closing
The codebase is solid (builds, lints), but the documentation rot is critical. If we unleashed 5 agents on this repo right now, 3 of them would build features that look wrong. Fix the docs before building more features.
