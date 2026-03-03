# Personal Site — Mission Asimov

A personal website for Julianna at the quality level of an Asimov Collective site — restrained, typographic, philosophical, alive. Bridges architecture practice and software/AI practice into a unified identity artifact. Currently in **pre-code research & planning phase**.

## Project Stage

**Phase 0–1: Research & Inspiration.** No source code exists yet. The repo contains:
- `PRD.md` — comprehensive product requirements (6 phases, from research through polish)
- `research/` — Asimov Collective analysis, Porter Robinson interactive web, graphics pipeline & AI platforms, asset workflow scripts
- `notes/` — code review artifacts and working notes
- `.lattice/` — task tracking (9 tasks mapped from PRD phases)

Code will emerge in Phase 3 (Design & Build) after research, branding, and tech stack decisions.

## Repository Structure

```
.
├── CLAUDE.md              # This file — project context for agents
├── PRD.md                 # Product requirements document
├── research/
│   ├── 01-asimov-collective-analysis.md        # Phase 0 — Asimov Collective reverse-engineering
│   ├── 02-porter-robinson-interactive-research.md  # Phase 1a — banked for future interactive phases
│   ├── 03-graphics-pipeline-final.md           # Phase 1b — ★ THE KEY REFERENCE for visual/graphics decisions
│   └── asset-workflows/                        # Runnable scripts & prompt templates
│       ├── canvas-paper-texture.mjs            # Node.js paper texture generator
│       ├── svg-stipple-field.mjs               # SVG stipple dot field generator
│       ├── css-grain-overlay.html              # CSS grain technique demo
│       ├── midjourney-prompts.md               # 8 prompt templates + --sref strategy
│       └── gpt-image-prompts.md                # 8 API prompt templates + code
├── notes/                 # Code review artifacts and working notes
└── .lattice/              # Task tracking (Lattice)
    ├── config.json
    ├── context.md
    └── tasks/             # 9 tasks (ASMV-1 through ASMV-9)
```

<!-- TODO: Update this tree once the codebase is scaffolded in Phase 3. Expect src/, public/, content/ (MDX daily entries), and config files for the chosen framework. -->

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Quality target | Asimov Collective level | PRD §2 — restrained, typographic, editorial |
| Interactivity model | Asimov-first; interactive later | Porter Robinson research is banked for future phases. V1 targets Asimov restraint — architecture the site so interactive layers can be added later, but don't build them now. |
| Daily updates | Claude skill (`/update-site`) | PRD §7 — quick mode + developed mode, generates MDX content |
| Content format | MDX (or similar) | Must support mixing rich content with components |
| Deployment | Static/hybrid (Vercel or Netlify likely) | PRD §11 — no heavy server infrastructure |
| Tech stack | TBD — pending ASMV-5 (tech stack selection) | PRD §11 — likely Next.js or Astro |
| Design philosophy | "The site IS the bridge" | PRD §8 — architecture × software demonstrated, not explained |

## Design Language References

- **V1 target:** Asimov Collective — restrained typography, editorial pacing, quiet navigation, generous whitespace. This is the quality bar for launch.
- **Visual language:** Defined in `research/03-graphics-pipeline-final.md` §2. Warm earth palette (terracotta, amber, ochre, cream, sage), stipple/grain textures, watercolor-wash edges, collage/layering as the central design move. Transparency support is a first-class requirement.
- **Future (banked):** Porter Robinson / Active Theory — browser as portal, WebGL, physics sim, exploration over scrolling. Research is complete (Doc 02) and available when we're ready. Architecture the site so these layers can be added without a rewrite.
- **Content:** "Studio desk" metaphor — populated but not messy, daily entries that feel like looking at a designer's desk

## Research Deliverables

| Phase | Deliverable | Status |
|-------|-------------|--------|
| 0 | `research/01-asimov-collective-analysis.md` | Complete |
| 1a | `research/02-porter-robinson-interactive-research.md` | Complete (banked for future — V1 is Asimov-first) |
| 1b | **`research/03-graphics-pipeline-final.md`** | Complete |

**`03-graphics-pipeline-final.md` is the primary reference for all visual and graphics decisions.** It consolidates design DNA (Julianna's color palette, texture vocabulary, typography), computational tools (SVG, shaders, Canvas, CSS), AI platforms (GPT Image, Midjourney, Gemini), and the recommended hybrid pipeline. Key insight: **transparency support is a first-class requirement** for the collage/layering design language — GPT Image API and generative code (SVG/Canvas) are the two paths that support it; Midjourney and Gemini do not.

The `research/asset-workflows/` directory contains runnable starter scripts and prompt templates for testing each pipeline.

## Essential Commands

<!-- TODO: After tech stack is chosen (Phase 3), document:
  - Package manager: npm/pnpm/bun
  - Dev server: npm run dev / astro dev / next dev
  - Build: npm run build
  - Lint: eslint/biome command
  - Type check: tsc --noEmit or equivalent
  - Test: vitest/jest/playwright
  - Deploy: vercel deploy / netlify deploy
  Check package.json, tsconfig.json, and any Makefile. -->

Currently pre-code. No build commands exist yet.

## Key Conventions

### Content & Writing
- Research docs go in `research/` with numeric prefix (`01-`, `02-`, etc.)
- Task tracking via Lattice (`.lattice/`), project code `ASMV`
- PRD is the source of truth for scope and phasing

### Design (from PRD)
- Every daily entry uses the same typographic system as the rest of the site
- Sparse days look as intentional as rich days
- No timestamps unless they add meaning — dates only
- Architecture portfolio: project pages with intentional sequencing, not image grids
- Let drawings breathe — generous whitespace

<!-- TODO: After code exists, document:
  - Component structure (functional, hooks-based, etc.)
  - Naming conventions (PascalCase components, camelCase utils, etc.)
  - File organization patterns
  - Import style (path aliases, barrel exports, etc.)
  - Error handling patterns -->

## Git Workflow

- **Branch naming:** `feature/<short-description>`, `research/<topic>`, `fix/<issue>`
- **PR target:** `main`
- **Commit style:** Imperative mood, concise. Reference PRD phase when relevant (e.g., "Add Asimov Collective analysis (Phase 0)")
- **PR flow:** Feature branch → PR → review → merge to `main`

## Safety Rules

Covered by global `~/.claude/CLAUDE.md` (destructive commands gated, ask before irreversible operations). Project-specific additions:

- **No force-pushing to `main`** — this is the production branch
- **Don't delete research docs** — they're reference material, not disposable artifacts
- **Don't modify PRD.md without user approval** — it's the source of truth

## Architecture Portfolio Display (from PRD §9)

When building portfolio pages, follow these principles:
1. **Project pages, not image grids** — each project gets its own page with intentional sequencing
2. **Mixed media** — drawings, renderings, models, diagrams at appropriate scales
3. **Context** — brief text situating each project (question, position, outcome)
4. **Let drawings breathe** — generous whitespace, no crammed thumbnails
5. **Study the Asimov approach** — large-format imagery, minimal text, careful pacing

## Debugging Heuristics

<!-- TODO: After code exists, add framework-specific heuristics. For now: -->

- **Research-phase debugging:** If a research doc seems incomplete, check the PRD for the original deliverable spec before expanding scope
- **Lattice task confusion:** Check `.lattice/config.json` for workflow states. Valid transitions are documented there — don't invent statuses.

## Self-Improvement

**When to add entries below:** Whenever you discover something non-obvious about this project — a convention that isn't documented, a gotcha, a pattern that works well, a tool preference. Low bar, high value. A 30-second addition here saves hours across future sessions.

**Format:** `- **[Topic]**: What you learned and why it matters`

## Lessons Learned

- **Porter Robinson research depth:** The deep research format (tech stack breakdown + "why it matters" + design principles extracted) works well. Use this format for future research deliverables.
- **Lattice initialized early:** Task tracking was set up before code exists — good for maintaining phase discipline. Tasks map 1:1 to PRD phases.
- **Scope discipline (2026-03-02):** Active Theory / Porter Robinson interactive work is inspiring but out of scope for V1. The research is banked. V1 = Asimov-level quality (typography, restraint, editorial pacing). Architecture the codebase so interactive layers (WebGL, shaders, physics) can be added later without a rewrite. Don't let "play within polish" become scope creep — nail the polish first.
