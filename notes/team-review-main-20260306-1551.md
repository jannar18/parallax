# Team Code Review: ASMV-24 — Full Repo Audit

**Reviewed:** 2026-03-06
**Agents:** Claude Opus 4.6 (Standard + Critical), Codex GPT-5 (Standard + Critical)
**Gemini:** Failed — gemini-3-pro-preview capacity exhausted (both standard and critical)
**Test Results:** lint PASS, build PASS (intermittent `.next/` artifact issue noted by some agents)

## Executive Summary

The codebase is functionally sound — lint passes, types check, all 13 pages generate. The critical issue is **documentation integrity**: the Riso palette update (ASMV-20) changed the actual colors throughout `tokens.css` and `tailwind.config.ts`, but `brand-guide.md`, `AGENTS.md`, `CLAUDE.md`, and hardcoded values in `hero-canvas.ts` / `HeroBrandVisual.tsx` were never updated. Additionally, `AGENTS.md` has typography roles backwards. Any agent or contributor reading these docs will build the wrong thing.

## Synthesis

### High Confidence Issues (Found by ALL 4 agents)

1. **AGENTS.md typography roles are backwards** — AGENTS.md says "Futura PT (headings) + Cormorant Garamond (body)" and "Body defaults to serif". Actual code: headings = serif (Cormorant Garamond), body = sans (Jost). Every agent flagged this as a blocker.

2. **brand-guide.md §3 and §7 describe the wrong color palette** — brand-guide defines Terracotta/Amber/Cream/Coral. Actual palette is Riso: Paper/Oxblood/Scarlet/Olive/Moss/Spruce. The brand guide's entire color system is from a previous era.

3. **hero-canvas.ts hardcodes old palette** — `BG_COLOR = "#F5F0E8"` (old Cream, should be `#FDFCEA` Paper) and `INK_RGB = "44,40,36"` (old Ink, should be `71,31,32` Oxblood). The hero renders with the wrong colors.

4. **HeroBrandVisual.tsx hardcodes old ink color** — 5 instances of `rgba(44,40,36,...)` — old Ink (#2C2824). Current Oxblood is rgb(71,31,32).

5. **CLAUDE.md and AGENTS.md design language references describe old palette** — Both say "warm earth palette (terracotta, amber, ochre, cream, sage)" — the pre-Riso palette.

6. **ASMV-20 and ASMV-21 stuck in `review` status** — Both were merged to main via PRs #18 and #19 but never moved to `done` in Lattice.

7. **CLAUDE.md claims `simplex-noise` + `@napi-rs/canvas` are devDeps** — Neither exists in package.json.

8. **PRD.md §11 still says "Tech stack: TBD" and "Hosting: TBD"** — Both were decided long ago (Next.js 15, Vercel).

9. **Research docs `03-gemini-imagen-research.md` and `04-brand-identity-notes.md` not listed** — Exist in repo but not in CLAUDE.md/AGENTS.md research deliverables tables.

### Standard Review Consensus

- AGENTS.md/CLAUDE.md duplication (~60-70% overlap, already contradictory) is a structural problem
- Legacy alias naming (`vermillion`, `cream`, `forest`) is semantic debt — works but confusing
- `globals.css ::selection` uses legacy alias variable names
- `next lint` deprecation warning (removed in Next.js 16)
- Placeholder content in portfolio/writing collections is fine for build phase but should be tracked

### Critical Review Findings

- **ArtifactBar hover state is broken** — `text-vermillion hover:text-vermillion-light` both resolve to `#f65058`. No visual feedback on hover. (Claude Critical)
- **Mobile navigation is unreachable after hero** — Nav opens on hover only; touch devices can't hover. Cross button at 25% opacity doesn't afford tappability. (Claude Critical)
- **About page missing from header nav** — Listed as primary page in PRD but only linked from footer. (Claude Critical)
- **Hero canvas performance on mobile** — 80 slices × 2 during crossfade = 160 drawImage calls/frame plus wireframe rendering. No quality degradation for mobile. (Claude Critical)
- **AGENTS.md references `research/pinterest-board/` which doesn't exist** — (Codex Critical)
- **Intermittent build failure** — Some agents saw `pages-manifest.json` ENOENT on first build. Clean builds pass. Likely stale `.next/` artifacts. (All Codex agents)

### Contradictions

- **Build status:** Claude Standard flagged the build ENOENT as a Blocker; Claude Critical and Codex Standard also noted it. However, on a clean build (which is what CI would do), it passes fine. This is a local dev experience issue, not a deployment blocker. The main orchestrator verified build PASS before launching agents.

## Combined Issues

### Blockers (must fix)

| # | Issue | Files | Found by |
|---|-------|-------|----------|
| B1 | AGENTS.md typography roles backwards | `AGENTS.md:98,183` | All 4 |
| B2 | brand-guide.md §3 and §7 describe wrong palette | `brand-guide.md:101-481` | All 4 |
| B3 | hero-canvas.ts hardcodes old palette colors | `src/lib/hero-canvas.ts:68-69` | All 4 |

### Important (should fix)

| # | Issue | Files | Found by |
|---|-------|-------|----------|
| I1 | HeroBrandVisual.tsx hardcodes old ink rgba | `HeroBrandVisual.tsx:189,205,219,233,241` | All 4 |
| I2 | ArtifactBar hover state is a no-op | `ArtifactBar.tsx:168`, `tailwind.config.ts:21` | Claude Critical |
| I3 | Mobile nav unreachable after hero (hover-only) | `Header.tsx:60-72` | Claude Critical |
| I4 | About page missing from header nav | `Header.tsx:18-27` | Claude Critical |
| I5 | AGENTS.md is a drifting near-duplicate of CLAUDE.md | Both files | All 4 |
| I6 | CLAUDE.md + AGENTS.md design language refs use old palette | `CLAUDE.md:103`, `AGENTS.md:105` | All 4 |
| I7 | ASMV-20 and ASMV-21 Lattice status stuck at `review` | `.lattice/` | All 4 |
| I8 | CLAUDE.md repo structure tree outdated | `CLAUDE.md:55,64-66` | Claude Standard |
| I9 | PRD.md §11 says tech/hosting TBD | `PRD.md:326-327` | All 4 |

### Consider (nice-to-have)

| # | Issue | Files | Found by |
|---|-------|-------|----------|
| C1 | CLAUDE.md claims missing devDeps exist | `CLAUDE.md:217` | All 4 |
| C2 | Legacy alias naming across codebase | Many files | All 4 |
| C3 | globals.css ::selection uses legacy aliases | `globals.css:67-68` | Claude Standard, Codex Standard |
| C4 | Research docs not listed in deliverables table | `CLAUDE.md`, `AGENTS.md` | All 4 |
| C5 | brand-guide.md §5 favicon references old palette | `brand-guide.md:335` | Claude Standard, Claude Critical |
| C6 | Footer grain overlay duplicated inline | `Footer.tsx:17-21` | Claude Standard |
| C7 | `next lint` deprecation | Build output | Claude Standard, Claude Critical |
| C8 | AGENTS.md references nonexistent `pinterest-board/` dir | `AGENTS.md:131` | Codex Critical |
| C9 | Hero canvas performance on mobile | `hero-canvas.ts` | Claude Critical |
| C10 | Duplicate ASMV-19 Lattice task ID | `.lattice/` | Claude Critical |
| C11 | Placeholder content in portfolio/writing | `src/content/` | Codex Standard |

## Action Items

```markdown
- [ ] Fix AGENTS.md typography roles (B1) — found by: all 4, type: both
- [ ] Rewrite brand-guide.md §3 + §7 for Riso palette (B2) — found by: all 4, type: both
- [ ] Update hero-canvas.ts colors to Riso palette (B3) — found by: all 4, type: both
- [ ] Update HeroBrandVisual.tsx hardcoded rgba values (I1) — found by: all 4, type: both
- [ ] Fix ArtifactBar hover state (I2) — found by: Claude Critical, type: critical
- [ ] Add mobile navigation pattern (I3) — found by: Claude Critical, type: critical
- [ ] Add About to header nav (I4) — found by: Claude Critical, type: critical
- [ ] Resolve AGENTS.md/CLAUDE.md duplication (I5) — found by: all 4, type: both
- [ ] Update design language refs to Riso palette (I6) — found by: all 4, type: both
- [ ] Move ASMV-20 + ASMV-21 to done (I7) — found by: all 4, type: both
- [ ] Update CLAUDE.md repo structure tree (I8) — found by: Claude Standard, type: standard
- [ ] DECISION: Update PRD.md §11 TBD items (I9) — needs user approval per safety rules
- [ ] Remove stale devDeps lesson from CLAUDE.md (C1) — found by: all 4, type: both
- [ ] Search-replace legacy alias names (C2) — found by: all 4, type: both
- [ ] Update globals.css ::selection to canonical names (C3) — found by: 2 agents, type: standard
- [ ] Add missing research docs to deliverables table (C4) — found by: all 4, type: both
- [ ] Update brand-guide.md §5 favicon colors (C5) — found by: 2 agents, type: both
- [ ] Fix AGENTS.md pinterest-board reference (C8) — found by: Codex Critical, type: critical
```

---

<details>
<summary>Full Claude (Standard) Review</summary>

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

</details>

<details>
<summary>Full Claude (Critical) Review</summary>

## Critical Code Review
- **Date:** 2026-03-06 16:02 EST
- **Model:** Claude Opus 4.6 (claude-opus-4-6)
- **Branch:** main
- **Latest Commit:** 579d57b
- **Linear Story:** ASMV-24
- **Review Type:** Critical/Adversarial — Full Repo Audit
---

## The Ugly Truth

This codebase has a **documentation integrity crisis**. The code itself is clean — lint passes, build passes (when `.next/` isn't poisoned), types check, pages render. But the constellation of documents surrounding the code — AGENTS.md, brand-guide.md, CLAUDE.md, PRD.md — is riddled with contradictions, stale information, and outright lies. If you're a human reading these docs, you'll get confused. If you're an agent reading these docs, you'll build the wrong thing.

The most dangerous finding: **AGENTS.md has the typography roles backwards**. Any agent using AGENTS.md as its context file will assign headings to sans and body to serif — the exact opposite of what the code does. This isn't a nitpick; it's a documentation defect that will produce visibly broken pages.

The second most dangerous finding: **brand-guide.md §3 and §7 describe a color palette that doesn't exist in the codebase**. The entire color section refers to the pre-Riso palette (Terracotta, Amber, Cream, Coral, Vermillion). The actual palette is Riso (Paper, Oxblood, Scarlet, Olive, Moss, Spruce). The brand guide — the document that's supposed to be the authority on the visual identity — is lying about the most visible aspect of the brand.

The third finding: **hardcoded old-palette colors in hero-canvas.ts and HeroBrandVisual.tsx**. The hero — the first thing every visitor sees — renders with the wrong background color and the wrong ink color. Every pixel of `rgba(44,40,36,...)` in the hero overlays is the old ink, not the current Oxblood.

The code quality is solid. The architecture is good. But the documentation layer is a minefield for any agent or collaborator who reads it.

## What Will Break

1. **An agent reads AGENTS.md and builds a new page with serif body text and sans headings.** The typography roles are backwards on line 98 ("Futura PT (headings) + Cormorant Garamond (body)") and line 183 ("Body defaults to serif"). The actual code (globals.css:33-40, layout.tsx:21) uses serif for headings and sans for body. The page will look wrong, the review will catch it, and hours are wasted.

2. **An agent reads brand-guide.md and uses Terracotta (#C4724E) as the accent color.** The brand guide §3 says the primary accent is Terracotta/Vermillion (#CC4422). The actual accent is Scarlet (#f65058). The agent builds a component with the wrong color. Multiply this by every color in the palette — they're all wrong in the brand guide.

3. **The hover state on ArtifactBar "View full entry" link does nothing.** `text-vermillion hover:text-vermillion-light` in tailwind.config.ts maps both `vermillion.DEFAULT` and `vermillion.light` to `#f65058`. Same color. The hover is functionally broken — zero visual feedback on interaction.

4. **The hero visual renders with the wrong palette.** `hero-canvas.ts:68-69` hardcodes `BG_COLOR = "#F5F0E8"` (old Cream) and `INK_RGB = "44,40,36"` (old Ink). The current palette uses Paper (#FDFCEA) and Oxblood (#471f20 = rgb(71,31,32)). The hero background and all wireframe/metadata rendering use stale colors.

5. **Mobile nav is unreachable after the hero section.** The Header nav opens on hover after scrolling past the hero. Touch devices can't hover. The cross button is tappable (40x40px), but it's extremely subtle (25% opacity) and doesn't afford tappability. Mobile users past the hero section have no way to navigate except scrolling to the footer.

## What's Missing

1. **No test suite.** Zero tests. No Vitest, no Playwright, no Jest. The CLAUDE.md acknowledges this ("Testing: Not yet configured") but for a site targeting Asimov-quality, there's no automated way to verify anything works.

2. **No About link in the header nav.** The About page exists (`/about`), but Header.tsx only links to Architecture, Now, Writing, Software. About is only reachable from the Footer. PRD §6 lists About as a primary page.

3. **No mobile navigation fallback.** After the hero, nav requires hover. No hamburger menu, no bottom nav, no swipe gesture. On mobile, you scroll to the footer or use the browser back button.

4. **ASMV-20 and ASMV-21 Lattice tasks not closed.** Both were merged to main (PRs #18 and #19) but sit in `review` status. The board lies about the state of these tasks.

5. **Missing package.json dependencies.** CLAUDE.md lessons learned claims `simplex-noise` and `@napi-rs/canvas` are installed as devDeps. They're not in package.json. Either they were removed without updating the docs, or they were never installed on this branch.

6. **Two research docs exist but aren't documented.** `research/03-gemini-imagen-research.md` and `research/04-brand-identity-notes.md` are not in CLAUDE.md's research deliverables table or repo structure tree.

## The Nits

1. **Duplicate Lattice task ID.** Two `ASMV-19` entries exist with different titles and priorities. Lattice IDs should be unique.

2. **`::selection` uses legacy aliases.** globals.css:67-68 uses `--color-vermillion` and `--color-cream`. Functionally works through the alias chain, but semantically misleading for maintenance.

3. **Homepage page.tsx uses `hover:text-vermillion`** (lines 151, 162, 175). Same legacy alias issue — works but confusing.

4. **PRD.md §11 says "Tech stack: TBD" and "Hosting: TBD."** Both were decided months ago. The PRD doesn't need frequent updates, but these are factually wrong.

5. **Hero metadata text at 7.5-8px.** Deliberately decorative, but renders to the DOM as real text that assistive tech may try to read at effectively invisible contrast ratios.

6. **`next lint` deprecation warning.** `next lint` is deprecated in Next.js 15.5 and will be removed in 16. Should migrate to ESLint CLI: `npx @next/codemod@canary next-lint-to-eslint-cli .`

7. **Design language references in CLAUDE.md and AGENTS.md** still describe "warm earth palette (terracotta, amber, ochre, cream, sage)" — the old palette. Should reference the Riso palette.

8. **brand-guide.md §5 (Favicon Direction)** references Terracotta (#C4724E) on Cream (#F5F0E8) — both old palette colors.

9. **brand-guide.md §1 (Primary accent section)** defines Vermillion (#CC4422) as the primary accent. The actual accent is Scarlet (#f65058).

10. **AGENTS.md exists as a 345-line near-duplicate of CLAUDE.md.** Maintaining two parallel agent context files that drift apart is a structural problem. One should be the authority; the other should be a pointer or deleted.

---

## Numbered Findings

### Blockers

**B1. AGENTS.md typography roles are backwards**
- File: `AGENTS.md:98`, `AGENTS.md:183`
- AGENTS.md says: "Futura PT (headings) + Cormorant Garamond (body)" and "Body defaults to serif"
- Actual code (globals.css:33-40): headings = serif (Cormorant Garamond, semibold italic), body = sans (Jost)
- **Impact:** Any agent using AGENTS.md builds pages with reversed typography.
- **Fix:** Correct AGENTS.md or delete it entirely in favor of CLAUDE.md.

**B2. brand-guide.md §3 and §7 describe the wrong color palette**
- File: `brand-guide.md:101-481`
- brand-guide defines: Terracotta (#C4724E), Vermillion (#CC4422), Cream (#F5F0E8), Coral (#C95D45), Amber (#D4A76A), Sage (#8B9E7E)
- tokens.css actually has: Paper (#FDFCEA), Oxblood (#471f20), Scarlet (#f65058), Olive (#b49f29), Moss (#68724d), Spruce (#4a635d)
- **Impact:** The brand's authoritative color document is completely wrong. Agents/designers will use the wrong palette.
- **Fix:** Rewrite §3 and §7 to reflect the current Riso palette.

**B3. hero-canvas.ts hardcodes old palette colors**
- File: `src/lib/hero-canvas.ts:68-69`
- `BG_COLOR = "#F5F0E8"` should be `"#FDFCEA"` (Paper)
- `INK_RGB = "44,40,36"` should be `"71,31,32"` (Oxblood)
- **Impact:** The hero — the first thing visitors see — renders with the wrong colors.
- **Fix:** Update to current Riso palette values. Better: read from CSS custom properties instead of hardcoding.

### Important

**I1. HeroBrandVisual.tsx hardcodes old ink color in overlays**
- File: `src/components/interactive/HeroBrandVisual.tsx:189,205,219,233`
- All use `rgba(44,40,36,...)` — the old Ink (#2C2824), not current Oxblood (#471f20 = rgb(71,31,32))
- **Impact:** All hero metadata overlays render in the wrong color.
- **Fix:** Update to `rgba(71,31,32,...)` or use CSS custom properties.

**I2. ArtifactBar hover state is broken**
- File: `src/components/interactive/ArtifactBar.tsx:168`
- `text-vermillion hover:text-vermillion-light` — both resolve to `#f65058`
- File: `tailwind.config.ts:21` — `vermillion: { DEFAULT: "#f65058", light: "#f65058" }`
- **Impact:** "View full entry" link has no hover feedback. Dead interaction.
- **Fix:** Change `vermillion.light` to a distinct hover color, or use `scarlet-dark` for the hover state.

**I3. Mobile navigation is unreachable after hero**
- File: `src/components/global/Header.tsx:60-72`
- Nav opens on hover (line 65: `if (!inHeroRef.current) setNavOpen(true)`)
- Touch devices can't trigger hover
- Cross button (40x40, 25% opacity) doesn't afford tappability
- **Impact:** Mobile users can't navigate after scrolling past the hero.
- **Fix:** Add touch/click support to open nav, or add a mobile navigation pattern.

**I4. About page missing from header navigation**
- File: `src/components/global/Header.tsx:18-27`
- Header links: Architecture, Now, Writing, Software — no About
- About page exists and is linked from Footer only
- PRD §6 lists About as a primary page ("Who Julianna is")
- **Impact:** Key page unreachable from primary navigation.
- **Fix:** Add About to either leftLinks or rightLinks in Header.tsx.

**I5. AGENTS.md is a drifting 345-line near-duplicate of CLAUDE.md**
- Both files describe the same project to agents
- They overlap on ~70% of content but contradict on typography, palette references, and details
- Maintaining two parallel files guarantees drift
- **Impact:** Agents get conflicting instructions depending on which file their tool reads.
- **Fix:** Either delete AGENTS.md (CLAUDE.md is authoritative), or reduce AGENTS.md to a minimal pointer. One source of truth, not two.

**I6. Design language references describe the wrong palette**
- Files: `CLAUDE.md:105`, `AGENTS.md:105`
- Both say: "Warm earth palette (terracotta, amber, ochre, cream, sage)"
- Actual palette: Riso (Paper, Oxblood, Scarlet, Olive, Moss, Spruce)
- **Impact:** Agents reading the design language section get the wrong mental model of the visual language.
- **Fix:** Update to describe the Riso palette.

### Potential

**P1. ASMV-20 and ASMV-21 stuck in `review` status**
- Both were merged to main via PRs #18 and #19
- Should be `done`, not `review`
- **Impact:** Lattice board misrepresents project state. Other agents may try to review already-merged work.
- **Fix:** `lattice status ASMV-20 done` and `lattice status ASMV-21 done`

**P2. CLAUDE.md lessons learned claims missing dependencies exist**
- CLAUDE.md says: "`simplex-noise` + `@napi-rs/canvas` installed as devDeps"
- package.json has neither
- **Impact:** An agent trusts the lesson and tries to `import` these — build fails.
- **Fix:** Remove the stale lesson or note that they're no longer installed.

**P3. Duplicate Lattice task ID ASMV-19**
- Two entries: "Homepage wireframe v2" (medium, agent:codex) and "asmv-12B" (high, agent:claude)
- **Impact:** Lattice event log and queries may return wrong task. Ambiguous references.
- **Fix:** Investigate and rename/remove the duplicate.

**P4. Research docs not listed in CLAUDE.md**
- `research/03-gemini-imagen-research.md` and `research/04-brand-identity-notes.md` exist but aren't in the research deliverables table or repo structure tree
- **Impact:** Agents don't know these docs exist; duplicate research may be produced.
- **Fix:** Add to CLAUDE.md research section.

**P5. PRD.md §11 says "Tech stack: TBD" and "Hosting: TBD"**
- Both were decided (Next.js 15, Vercel)
- **Impact:** Low — agents should check CLAUDE.md first. But the PRD shouldn't be factually wrong.
- **Fix:** Update §11 constraints or add a note that these are decided.

**P6. brand-guide.md §1 (Wordmark Usage) and §5 (Favicon) reference old palette colors**
- §1 table: header/footer wordmark treatments don't mention Riso palette context
- §5: "Terracotta (#C4724E) 'p' on Cream (#F5F0E8)" — both old colors
- **Impact:** Favicon created from brand guide will use wrong colors.
- **Fix:** Update to current Riso palette values.

**P7. `next lint` deprecation warning**
- `next lint` deprecated in 15.5, removed in 16
- **Impact:** Build pipeline will break on Next.js upgrade.
- **Fix:** Run `npx @next/codemod@canary next-lint-to-eslint-cli .` to migrate.

**P8. Build fragility with stale `.next/` directory**
- Build fails with cryptic errors (`middleware-manifest.json`, `pages-manifest.json` not found) if `.next/` has artifacts from a dev server or previous build
- Clean builds work fine
- **Impact:** CI would be fine (always clean), but local dev experience is frustrating.
- **Fix:** Document more prominently; consider adding `"prebuild": "rm -rf .next"` to package.json scripts.

**P9. Hero canvas performance on mobile**
- 80 slices per photo x 2 during crossfade = 160 `drawImage` calls per frame
- Plus O(n) wireframe rendering (90 nodes, ~200 edges)
- No device capability detection or quality degradation
- **Impact:** Likely very slow/janky on mobile devices.
- **Fix:** Reduce slice count on mobile, skip crossfade, or use CSS/image-based hero on small screens.

**P10. globals.css ::selection uses legacy aliases**
- File: `src/styles/globals.css:67-68`
- Uses `--color-vermillion` and `--color-cream` instead of `--color-scarlet` and `--color-paper`
- Functionally works through alias chain but confusing for maintenance
- **Fix:** Use canonical Riso palette variable names.

</details>

<details>
<summary>Full Codex (Standard) Review</summary>

## Code Review
- **Date:** 2026-03-06 15:57 EST
- **Model:** Codex (GPT-5)
- **Branch:** main
- **Latest Commit:** 579d57b
- **Linear Story:** ASMV-24
---

### Test Gate (Phase 2)
- `pnpm lint`: PASS, 0 ESLint warnings, 0 ESLint errors.
- `pnpm build`: FAIL.
- Build failures observed: 2 runs, 2 failures, both ENOENT filesystem errors during Next build output handling.
  - Run 1: missing `.next/server/pages-manifest.json`
  - Run 2: missing source during rename `.next/export/500.html -> .next/server/pages/500.html`

**Blocking status:** Build is currently not passing locally, so this branch is not merge-ready under the required quality gate.

### What The Current Repo Implements (Phase 3)
1. Next.js App Router site with MDX-backed content collections (`now`, `writing`, architecture work, software work).
2. Shared typography and color system through CSS tokens + Tailwind extension.
3. Homepage combines static editorial layout with a custom hero canvas and artifact rail fed from daily-entry content.
4. Documentation layer (`PRD.md`, `brand-guide.md`, `CLAUDE.md`, `AGENTS.md`) acts as operating spec for design, implementation, and agent workflow.

### General Feedback (Architectural + Tactical)
The implementation direction is coherent: content model, routing structure, and typographic hierarchy are aligned with the MVP. The major risk is now documentation/system drift: multiple top-level references disagree with the actual code and palette. That drift is already leaking into implementation details (hardcoded old palette values in visual components), which undermines the core brand/design objective and makes future agent/human work error-prone.

### Findings
#### Blockers
1. ✅ Confirmed — `pnpm build` fails reproducibly (2/2 runs), so the required release gate is red.

#### Important
2. ✅ Confirmed — `AGENTS.md` typography roles are incorrect vs actual code and internal docs.
3. ✅ Confirmed — `brand-guide.md` design-token section claims parity with code but contains outdated pre-Riso values.
4. ✅ Confirmed — visual runtime code still hardcodes old palette values in hero rendering path.
5. ✅ Confirmed — `HeroBrandVisual` overlay text/dot colors are hardcoded to old RGB values.
6. ✅ Confirmed — top-level docs still describe old color language in key guidance.
7. ✅ Confirmed — PRD technical constraints are stale relative to current decided stack/hosting.
8. ✅ Confirmed — Research deliverables tables are incomplete versus actual repository contents.
9. ✅ Confirmed — CLAUDE lessons mention dev dependencies that are not present.
10. ✅ Confirmed — Lattice workflow drift: merged tasks left in `review` state.

#### Potential
11. ⬇️ Lower priority — legacy alias naming remains in live UI classes/selection styles.
12. ❓ Uncertain — placeholder content is still shipping in portfolio/writing collections.

</details>

<details>
<summary>Full Codex (Critical) Review</summary>

## Critical Code Review
- **Date:** 2026-03-06 15:58 EST
- **Model:** GPT-5 Codex (gpt-5-codex)
- **Branch:** main
- **Latest Commit:** 579d57b
- **Linear Story:** ASMV-24
- **Review Type:** Critical/Adversarial
---

### The Ugly Truth
The repository ships working pages, but the docs are no longer trustworthy as operational truth. New agents will implement the wrong typography and wrong palette semantics if they follow AGENTS/brand-guide literally. Process metadata is also stale (PRD TBD items, Lattice tasks stuck in review). This is not a style problem; it is coordination debt that creates future production regressions.

### What Will Break
- A new contributor following AGENTS typography guidance will invert heading/body font roles, causing design regression across any new page or refactor.
- A contributor using `brand-guide.md` token snippets will reintroduce pre-Riso colors into live code, undoing ASMV-20 decisions.
- Planning conversations can reopen already-resolved stack/hosting decisions because PRD still says TBD.
- CI/release confidence is reduced by intermittent build behavior.

### What's Missing
- No guardrails to detect doc drift against live tokens/fonts.
- No tests around design-token consumption or semantic color usage.
- No closure workflow for merged Lattice tasks.

### The Nits
- `AGENTS.md` points to `research/pinterest-board/`, but that directory does not exist.
- Research deliverables tables omit `research/03-gemini-imagen-research.md` and `research/04-brand-identity-notes.md`.

### Findings
All findings confirmed via direct file/line verification. See full review for details.

</details>

<details>
<summary>Gemini (Standard) — FAILED</summary>

Gemini Standard agent hit `gemini-3-pro-preview` capacity limits (MODEL_CAPACITY_EXHAUSTED / 429 Too Many Requests). No review produced.

</details>

<details>
<summary>Gemini (Critical) — FAILED</summary>

Gemini Critical agent hit `gemini-3-pro-preview` capacity limits (RESOURCE_EXHAUSTED / 429 Too Many Requests). No review produced.

</details>
