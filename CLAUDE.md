# Personal Site — Mission Asimov

A personal website for Julianna at the quality level of an Asimov Collective site — restrained, typographic, philosophical, alive. Bridges architecture practice and software/AI practice into a unified identity artifact. Currently in **pre-code research & planning phase**.

## Project Stage

**Phase 0–1: Research & Inspiration.** No source code exists yet. The repo contains:
- `PRD.md` — comprehensive product requirements (6 phases, from research through polish)
- `research/` — deep dives on interactive web (Porter Robinson, Active Theory, WebXR)
- `.lattice/` — task tracking (9 tasks mapped from PRD phases)

Code will emerge in Phase 3 (Design & Build) after research, branding, and tech stack decisions.

## Repository Structure

```
.
├── CLAUDE.md              # This file — project context for agents
├── PRD.md                 # Product requirements document
├── research/              # Research deliverables
│   └── 02-porter-robinson-interactive-research.md
└── .lattice/              # Task tracking (Lattice)
    ├── config.json        # Project: ASMV, classic workflow
    ├── context.md         # Lattice instance purpose
    └── tasks/             # 9 tasks (ASMV-1 through ASMV-9)
```

<!-- TODO: Update this tree once the codebase is scaffolded in Phase 3. Expect src/, public/, content/ (MDX daily entries), and config files for the chosen framework. -->

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Quality target | Asimov Collective level | PRD §2 — restrained, typographic, editorial |
| Interactivity model | "Play within polish" | Porter Robinson research — site as a space, not a page, but within Asimov restraint |
| Daily updates | Claude skill (`/update-site`) | PRD §7 — quick mode + developed mode, generates MDX content |
| Content format | MDX (or similar) | Must support mixing rich content with components |
| Deployment | Static/hybrid (Vercel or Netlify likely) | PRD §11 — no heavy server infrastructure |
| Tech stack | TBD — pending Asimov research | PRD §11 — likely Next.js or Astro |
| Design philosophy | "The site IS the bridge" | PRD §8 — architecture × software demonstrated, not explained |

## Design Language References

- **Polish:** Asimov Collective — restrained typography, editorial pacing, quiet navigation, generous whitespace
- **Play:** Porter Robinson / Active Theory — browser as portal, WebGL, physics sim, exploration over scrolling
- **Content:** "Studio desk" metaphor — populated but not messy, daily entries that feel like looking at a designer's desk

## Research Deliverables

| Phase | Deliverable | Status |
|-------|-------------|--------|
| 0 | `research/01-asimov-collective-analysis.md` | Not started |
| 1a | `research/02-porter-robinson-interactive-research.md` | Complete |
| 1b | `research/03-ai-graphics-pipeline.md` | Not started |

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
