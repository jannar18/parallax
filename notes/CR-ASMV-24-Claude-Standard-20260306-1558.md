## Code Review — ASMV-24: Full Repo Audit
- **Date:** 2026-03-06 15:58 EST
- **Model:** Claude Opus 4.6 (claude-opus-4-6)
- **Branch:** main
- **Latest Commit:** 579d57b (Merge pull request #19 from jannar18/feature/riso-engine)
- **Linear Story:** ASMV-24
---

## General Assessment

The codebase is in solid shape functionally — lint passes clean, TypeScript compiles, and all 13 static pages generate. The primary issues are **documentation drift**: the Riso palette update (ASMV-20) changed the actual colors throughout `tokens.css` and `tailwind.config.ts`, but several docs, hardcoded values, and legacy references were never updated to match. There's also significant duplication between `CLAUDE.md` and `AGENTS.md` that has already caused contradictory information.

The build does fail at the final manifest step (`pages-manifest.json` ENOENT), which warrants investigation — it may be a Next.js 15.5.12 regression or an artifact of the App Router-only setup.

---

## Findings

### Blockers

**1. Build fails at manifest generation step** — ✅ Confirmed
`pnpm build` compiles successfully, type-checks, and generates all 13 static pages, but then crashes with `ENOENT: pages-manifest.json`. This is the Pages Router manifest, which shouldn't exist in an App Router-only project. This blocks production deployment.
- **File:** Build output / `next.config.mjs`
- **Action:** Investigate — may be a Next.js 15.5.12 bug, or the `pageExtensions` config (`["js", "jsx", "md", "mdx", "ts", "tsx"]`) may be triggering Pages Router codepaths. Try removing `md`/`mdx` from `pageExtensions` (content is loaded via `gray-matter`, not as pages) or upgrading/downgrading Next.js.

**2. AGENTS.md has typography roles BACKWARDS** — ✅ Confirmed
- `AGENTS.md:98` says: "Futura PT (headings) + Cormorant Garamond (body)"
- `AGENTS.md:183` says: "Body defaults to serif (Cormorant Garamond); headings default to sans"
- **Actual code** (`globals.css:33-40`): headings = serif (Cormorant Garamond semibold italic), body = sans (Jost)
- **CLAUDE.md:96** is correct: "Cormorant Garamond (headings, semibold italic) + Futura PT (body/nav)"
- This will cause any agent reading AGENTS.md to make wrong typography decisions.
- **File:** `AGENTS.md:98, 183`
- **Action:** Fix AGENTS.md to match CLAUDE.md and the actual code.

**3. brand-guide.md color palette (§3, §7) is entirely outdated** — ✅ Confirmed
- `brand-guide.md` §3 defines: Terracotta (#C4724E), Amber (#D4A76A), Cream (#F5F0E8), Coral (#C95D45), Vermillion (#CC4422), etc.
- `tokens.css` ACTUALLY uses Riso palette: Paper (#FDFCEA), Oxblood (#471f20), Scarlet (#f65058), Olive (#b49f29), Moss (#68724d), Spruce (#4a635d)
- `brand-guide.md` §7 (Design Tokens) shows a complete CSS block with the old palette values
- The brand-guide.md Tailwind config section also shows the old palette
- **The brand guide's entire §3 and §7 are documentation for a palette that no longer exists in the codebase.**
- **Files:** `brand-guide.md:101-198` (§3), `brand-guide.md:389-481` (§7)
- **Action:** Rewrite §3 to document the Riso palette. Rewrite §7 to match `tokens.css` and `tailwind.config.ts`.

### Important

**4. hero-canvas.ts hardcodes OLD palette colors** — ✅ Confirmed
- `src/lib/hero-canvas.ts:68`: `BG_COLOR = "#F5F0E8"` — old Cream, should be Paper `#FDFCEA`
- `src/lib/hero-canvas.ts:69`: `INK_RGB = "44,40,36"` — old Ink (#2C2824 = rgb(44,40,36)), should be Oxblood (#471f20 = rgb(71,31,32))
- The hero canvas renders with colors from the pre-Riso palette.
- **Action:** Update to use current Riso palette values.

**5. HeroBrandVisual.tsx hardcodes OLD ink color throughout** — ✅ Confirmed (5 instances)
- Lines 189, 205, 219, 233, 241: `rgba(44,40,36,...)` — old Ink (#2C2824)
- Current Ink/Oxblood is #471f20 = rgb(71,31,32)
- These are metadata overlay colors that will render in the wrong tone.
- **File:** `src/components/interactive/HeroBrandVisual.tsx`
- **Action:** Replace all `rgba(44,40,36,...)` instances with `rgba(71,31,32,...)` to match Oxblood.

**6. AGENTS.md and CLAUDE.md have massive duplication** — ✅ Confirmed
- Both are 345+ and 415+ lines respectively, with ~60% overlap.
- Identical or near-identical sections: Key Decisions, Essential Commands, Key Conventions, Safety Rules, Architecture Portfolio Display, Debugging Heuristics, Lattice.
- They've already diverged in contradictory ways (finding #2).
- **Action:** Either (a) make AGENTS.md a thin wrapper that says "read CLAUDE.md" for the canonical version, or (b) eliminate AGENTS.md entirely and have all agents read CLAUDE.md. The current two-source-of-truth approach guarantees future drift.

**7. CLAUDE.md "Design Language References" references pre-Riso palette** — ✅ Confirmed
- `CLAUDE.md:103`: "Warm earth palette (terracotta, amber, ochre, cream, sage)" — this describes the old palette
- The actual palette is Riso: paper, oxblood, scarlet, olive, moss, spruce
- **File:** `CLAUDE.md:103`
- **Action:** Update to reference the Riso palette.

**8. CLAUDE.md repository structure tree is outdated** — ✅ Confirmed
- Lists `interactive/` as "Future: WebGL, Three.js, shader components (.gitkeep)" but it actually contains `HeroBrandVisual.tsx`, `ArtifactBar.tsx`, `StudioDeskScroll.tsx`
- Missing `hero-canvas.ts` from `src/lib/`
- Does not list `research/03-gemini-imagen-research.md` or `research/04-brand-identity-notes.md`
- **File:** `CLAUDE.md:55, 64-66`
- **Action:** Update the tree to reflect actual repo contents.

**9. ASMV-20 and ASMV-21 Lattice status stuck at `review`** — ✅ Confirmed
- ASMV-20 ("Site palette update — Riso colors") was merged via PR #18 but is still `review` in Lattice.
- ASMV-21 ("Riso engine script + raw photo inbox") was merged via PR #19 but is still `review` in Lattice.
- This pollutes the board — anyone checking `lattice list` sees them as incomplete work.
- **Action:** Move both to `done`.

**10. PRD.md §11 still says "Tech stack: TBD" and "Hosting: TBD"** — ✅ Confirmed
- `PRD.md:326`: "Tech stack: TBD pending Asimov research (Phase 0). Likely Next.js or Astro."
- `PRD.md:327`: "Hosting: TBD. Likely Vercel or Netlify."
- Both were decided long ago (Next.js 15, Vercel).
- **File:** `PRD.md:326-327`
- **Action:** Update to reflect decided values (needs user approval per safety rules).

**11. globals.css ::selection uses legacy aliases** — ✅ Confirmed
- `globals.css:67`: `background-color: var(--color-vermillion)` — legacy alias for `--color-scarlet`
- `globals.css:68`: `color: var(--color-cream)` — legacy alias for `--color-paper`
- These work functionally (legacy aliases resolve to Riso values) but are semantically misleading.
- **File:** `src/styles/globals.css:67-68`
- **Action:** Replace with canonical Riso variable names.

**12. Legacy color class names used across MANY files** — ✅ Confirmed (wider than initially scoped)
- `page.tsx`: `hover:text-vermillion` (3x), `bg-cream` (2x), `bg-forest` (4x)
- `work/page.tsx`: `group-hover:text-vermillion` (2x)
- `work/architecture/page.tsx`: `group-hover:text-vermillion` (1x)
- `work/software/page.tsx`: `group-hover:text-vermillion` (1x)
- `writing/page.tsx`: `group-hover:text-vermillion` (1x)
- `ArtifactBar.tsx`: `bg-cream` (1x), `text-vermillion` (1x)
- `StudioDeskScroll.tsx`: `bg-forest/20`, `bg-forest/35` (1x)
- These all resolve correctly via Tailwind aliases, but should use canonical Riso names.
- **Action:** Search-and-replace across all files: `vermillion` -> `scarlet`, `bg-cream` -> `bg-paper`, `bg-forest` -> `bg-spruce`.

### Potential

**13. ArtifactBar.tsx uses legacy color classes**
- `ArtifactBar.tsx:168`: `text-vermillion hover:text-vermillion-light`
- Note: `vermillion-light` resolves to the same value as `vermillion` DEFAULT in the Tailwind config (`#f65058`), making the hover state a no-op.
- **File:** `src/components/interactive/ArtifactBar.tsx:168`
- **Action:** Replace with `text-scarlet hover:text-scarlet-dark` for a visible hover state.

**14. CLAUDE.md Lessons Learned mentions `simplex-noise` + `@napi-rs/canvas` as devDeps but they're not in package.json**
- These may have been removed or never added to main. The lesson is misleading.
- **File:** `CLAUDE.md` Lessons Learned section
- **Action:** Remove or correct the lesson.

**15. brand-guide.md §3 "Primary Accent" is Vermillion (#CC4422) but actual accent is Scarlet (#f65058)**
- The brand guide describes Vermillion as "the one color" primary accent
- The code uses Scarlet as `--color-accent`
- The entire §3 accent philosophy needs updating for the Riso palette
- **File:** `brand-guide.md:194-197`
- **Action:** Addressed by finding #3 (full §3 rewrite).

**16. brand-guide.md §5 Wordmark references old colors**
- `brand-guide.md:335`: Favicon color suggestion says "Terracotta (#C4724E)" — old palette
- **File:** `brand-guide.md:335`
- **Action:** Update to current accent (Scarlet #f65058) or Oxblood.

**17. Research deliverables table in CLAUDE.md and AGENTS.md is incomplete**
- `research/03-gemini-imagen-research.md` exists but is not listed
- `research/04-brand-identity-notes.md` exists but is not listed
- **Files:** `CLAUDE.md`, `AGENTS.md` Research Deliverables tables
- **Action:** Add these to the research table or note them in the repo structure.

**18. Footer grain overlay is duplicated inline**
- `Footer.tsx:17-21` duplicates the exact same SVG grain texture that exists in `globals.css:103-110` (`.grain-overlay::before`)
- **File:** `src/components/global/Footer.tsx:17-21`
- **Action:** Consider extracting to a shared utility or using the existing `.grain-overlay` class pattern.

**19. `next lint` deprecation warning**
- `next lint` reports it's deprecated and will be removed in Next.js 16. Suggests migrating to ESLint CLI.
- **Action:** Low priority — migrate when upgrading to Next.js 16.

---

## Summary

| Severity | Count |
|----------|-------|
| Blocker | 3 |
| Important | 9 |
| Potential | 7 |

**Top priorities:**
1. Fix the build failure (finding #1) — blocks deployment
2. Fix AGENTS.md typography contradiction (finding #2) — blocks correct agent behavior
3. Update brand-guide.md palette sections (finding #3) — the brand guide is lying about the brand
4. Fix hardcoded old palette values in hero-canvas.ts and HeroBrandVisual.tsx (findings #4, #5) — visible color mismatch
5. Resolve AGENTS.md/CLAUDE.md duplication (finding #6) — prevents future drift
