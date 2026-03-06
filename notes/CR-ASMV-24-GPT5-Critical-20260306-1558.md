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
- CI/release confidence is reduced by intermittent build behavior: one `pnpm build` failed with missing `.next/server/pages-manifest.json`, then subsequent build passed.

### What's Missing
- No guardrails to detect doc drift against live tokens/fonts (no docs validation checks, no “source of truth” ownership).
- No tests around design-token consumption or semantic color usage (legacy alias drift is silent).
- No closure workflow for merged Lattice tasks (ASMV-20/21 remain in `review` after merge).

### The Nits
- `AGENTS.md` points to `research/pinterest-board/`, but that directory does not exist.
- Research deliverables tables omit `research/03-gemini-imagen-research.md` and `research/04-brand-identity-notes.md`, reducing discoverability.

### Findings

1. **Blockers**
- ❓ Likely but hard to verify: Intermittent production build reliability issue.
  - Evidence: first `pnpm build` failed with `ENOENT ... .next/server/pages-manifest.json`; immediate retry succeeded.
  - Verification pass: executed `pnpm build` twice. First run failed once; second run completed successfully. Could not run clean build because sandbox blocks deletion commands.
  - Impact: flaky CI/build pipelines can block deploys unpredictably.

1. **Important**
- ✅ Confirmed: AGENTS typography guidance is backwards relative to implementation.
  - `AGENTS.md:98` says “Futura PT (headings) + Cormorant Garamond (body)”.
  - `AGENTS.md:183` repeats body=serif, headings=sans.
  - Actual code: headings use serif in `src/styles/globals.css:33-36`; font role comments in `src/lib/fonts.ts:7-9` set body/nav to Jost and headings to Cormorant.

- ✅ Confirmed: Brand guide color and token sections are pre-Riso and conflict with live code.
  - Outdated palette shown in `brand-guide.md:101-196` and token examples in `brand-guide.md:451-506` (terracotta/cream/coral).
  - Live palette is Riso in `src/styles/tokens.css:62-89` and `tailwind.config.ts:12-34` (paper/oxblood/scarlet/olive/moss/spruce).

- ✅ Confirmed: PRD still marks resolved technical decisions as TBD.
  - `PRD.md:326-327` says stack and hosting are TBD.
  - Current project state is explicitly Next.js 15 + pnpm and Vercel target in agent docs and codebase.

- ✅ Confirmed: Documentation claims installed deps that are absent from `package.json`.
  - Claim in `CLAUDE.md:217` (“simplex-noise + @napi-rs/canvas installed as devDeps”).
  - Neither dependency exists in `package.json`.

- ✅ Confirmed: Lattice state is stale for merged work.
  - `ASMV-20` and `ASMV-21` are still `review` despite merged PRs (`feature/riso-palette`, `feature/riso-engine`).
  - This makes board state inaccurate for future agents.

- ⬇️ Real but lower priority than initially thought: Legacy alias usage is semantically misleading but functionally resolves.
  - `src/styles/globals.css:67-68` uses `--color-vermillion`/`--color-cream`.
  - `src/components/interactive/ArtifactBar.tsx:168` uses `text-vermillion`/`hover:text-vermillion-light`.
  - These map to Riso values via aliases (`src/styles/tokens.css:78-81`, `tailwind.config.ts:20-23`), so behavior is correct but naming encourages drift.

1. **Potential**
- ✅ Confirmed: Old palette literals remain hardcoded in hero visuals.
  - `src/lib/hero-canvas.ts:68-69` hardcodes old cream/ink values (`#F5F0E8`, `44,40,36`).
  - `src/components/interactive/HeroBrandVisual.tsx:189,205,219,233,241` hardcodes old ink RGBA overlays.
  - Impact: visual inconsistency with Riso token system; future theme evolution harder.

- ✅ Confirmed: Research/index documentation incompleteness.
  - `CLAUDE.md:75-79` and `AGENTS.md:76-81` research trees omit existing files `research/03-gemini-imagen-research.md` and `research/04-brand-identity-notes.md`.

- ✅ Confirmed: Nonexistent reference path in AGENTS visual references.
  - `AGENTS.md:131` references `research/pinterest-board/` but directory is missing.

### Validation Pass Notes
- Re-read each cited file/line and traced expected behavior vs documented claims.
- Build failure item is marked ❓ because reproducibility is inconsistent (1 fail, 1 pass) and clean build could not be forced in sandbox.
- Typography/color/process findings are ✅ confirmed directly from source text and code.

### Command Results
- `pnpm lint`: PASS, 0 warnings, 0 errors.
- `pnpm build` (first run): FAIL, 1 fatal error (`ENOENT ... pages-manifest.json`).
- `pnpm build` (validation rerun): PASS, 0 errors.

### Closing
Not ready for production-quality collaboration at 100k-user scale because operational docs can misdirect implementation and process state is untrustworthy. Before mass deployment, fix the typography/palette docs, resolve PRD TBD drift, reconcile Lattice statuses for merged tasks, and investigate the intermittent build ENOENT to restore CI confidence.
