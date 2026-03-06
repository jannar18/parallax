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

---

## Phase 5: Validation Pass

**B1. AGENTS.md typography roles backwards** — ✅ Confirmed. AGENTS.md:98 says "Futura PT (headings) + Cormorant Garamond (body)". globals.css:33-40 shows `h1-h6 { font-family: var(--font-serif)... }`. Layout.tsx:21 sets body to `font-sans`. The roles are definitively reversed in AGENTS.md.

**B2. brand-guide.md describes wrong palette** — ✅ Confirmed. Compared brand-guide.md §3 hex values against tokens.css line-by-line. Not a single primary color matches. brand-guide says Terracotta `#C4724E`; tokens.css has no terracotta at all. The entire §3 and §7 code block in brand-guide.md are from the pre-Riso era.

**B3. hero-canvas.ts hardcoded colors** — ✅ Confirmed. Line 68: `BG_COLOR = "#F5F0E8"`, tokens.css line 76: `--color-background: #FDFCEA`. Line 69: `INK_RGB = "44,40,36"` (= #2C2824), tokens.css line 71: `--color-ink: #471f20` (= rgb(71,31,32)). Both are verifiably wrong.

**I1. HeroBrandVisual hardcoded rgba** — ✅ Confirmed. Lines 189, 205, 219, 233 all contain literal `rgba(44,40,36,...)`. Compared to tokens.css `--color-ink: #471f20`. Wrong.

**I2. ArtifactBar hover broken** — ✅ Confirmed. tailwind.config.ts:21: `vermillion: { DEFAULT: "#f65058", light: "#f65058" }`. Both values identical. Hover produces no visual change.

**I3. Mobile nav unreachable** — ✅ Confirmed. Header.tsx:65: `handleMouseEnter` triggers `setNavOpen(true)` only on `mouseenter`, which doesn't fire on touch. The `onClick` on the cross button (line 126-128) does work for touch, but the button is visually near-invisible at 25% opacity with no label or affordance. ⬇️ Downgrading slightly — the cross IS technically tappable, but the UX is poor. It's discoverable only if you already know it's there.

**I4. About missing from header** — ✅ Confirmed. Header.tsx:18-27 defines exactly four links. No "About" appears.

**I5. AGENTS.md duplication** — ✅ Confirmed. Side-by-side comparison shows ~70% overlap with CLAUDE.md. The contradictions on typography are verified (B1).

**I6. Design language wrong palette** — ✅ Confirmed. CLAUDE.md:105 and AGENTS.md:105 both reference "terracotta, amber, ochre, cream, sage" — none of which exist in the current token system.

---

## Closing

**Is this code ready for production? Would I mass deploy this to 100k users?**

No. Not because of the code quality — the TypeScript is clean, the architecture is sound, the build produces valid static pages. But because of three things:

1. **The documentation layer is a trap.** AGENTS.md, brand-guide.md, and parts of CLAUDE.md describe a different product than what exists. Any new contributor — human or agent — will build the wrong thing. This is not a hypothetical risk; it's a certainty given the agent-first development model of this project.

2. **The hero visual renders with the wrong colors.** The most prominent visual element on the site uses a palette from a previous design era. This is like launching a brand refresh but forgetting to update the billboard.

3. **Mobile navigation doesn't work.** After scrolling past the hero, the primary nav is effectively invisible to touch users. Half your visitors can't navigate your site.

**What needs to change before this ships:**

1. Fix the hero-canvas.ts hardcoded colors to match the Riso palette (B3)
2. Fix HeroBrandVisual.tsx hardcoded rgba values (I1)
3. Fix ArtifactBar hover state (I2)
4. Either delete AGENTS.md or fix the typography roles and bring it in sync (B1, I5)
5. Rewrite brand-guide.md §3 and §7 for the Riso palette (B2)
6. Add mobile-friendly navigation (I3)
7. Add About to the header nav (I4)

The documentation fixes (1-2 hours of work) prevent the next agent from building broken pages. The code fixes (1-2 hours) prevent visitors from seeing the wrong colors and broken interactions. The mobile nav (half a day) prevents 50%+ of visitors from being stranded.

Everything else is polish. These seven items are the minimum bar.
