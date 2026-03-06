# Personal Site — Mission Asimov

A personal website for Julianna at the quality level of an Asimov Collective site — restrained, typographic, philosophical, alive. Bridges architecture practice and software/AI practice into a unified identity artifact.

## Project Stage

**Phase 3: Design & Build.** Project scaffolding is live. The codebase uses:
- **Framework:** Next.js 15 (App Router) with React Server Components
- **Styling:** Tailwind CSS 3 + CSS custom properties (design tokens)
- **Content:** MDX files in `src/content/`, loaded via `gray-matter` + `next-mdx-remote`
- **Package manager:** pnpm
- **Fonts:** Jost (body/nav, stand-in for Futura PT) + Cormorant Garamond (headings, semibold italic) + DM Mono (stand-in for Degular Mono) via `next/font/google`; see `brand-guide.md` §4
- **Brand:** "Parallax" / parallax.studio — full brand guide in `brand-guide.md`

Research, PRD, and task tracking remain in their original locations.

## Repository Structure

```
.
├── CLAUDE.md                # This file — project context for agents
├── .gitignore               # OS, Node, Next.js, pinterest board, ASMV-3 source research
├── PRD.md                   # Product requirements document
├── brand-guide.md           # Brand identity — name, domain, colors, typography, voice
├── package.json             # pnpm dependencies
├── pnpm-lock.yaml
├── next.config.mjs          # Next.js configuration
├── tailwind.config.ts       # Tailwind with full design token system
├── tsconfig.json            # TypeScript configuration
├── postcss.config.mjs       # PostCSS (Tailwind + Autoprefixer)
├── eslint.config.mjs        # ESLint (flat config, next/core-web-vitals)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout — fonts, global styles, metadata, Header/Footer
│   │   ├── page.tsx         # Home page
│   │   ├── about/page.tsx
│   │   ├── work/
│   │   │   ├── page.tsx             # Work overview (both disciplines)
│   │   │   ├── architecture/
│   │   │   │   ├── page.tsx         # Architecture portfolio listing
│   │   │   │   └── [slug]/page.tsx  # Architecture project detail (SSG)
│   │   │   └── software/
│   │   │       ├── page.tsx         # Software portfolio listing
│   │   │       └── [slug]/page.tsx  # Software project detail (SSG)
│   │   ├── writing/
│   │   │   ├── page.tsx             # Writing listing
│   │   │   └── [slug]/page.tsx      # Writing detail (SSG)
│   │   └── now/page.tsx             # Now / studio desk
│   │
│   ├── components/
│   │   ├── global/          # Header (hide-on-scroll), Footer
│   │   ├── ui/              # GrainOverlay
│   │   └── interactive/     # Future: WebGL, Three.js, shader components (.gitkeep)
│   │
│   ├── content/             # MDX content collections
│   │   ├── now/             # YYYY-MM-DD.mdx — daily entries
│   │   ├── writing/         # slug.mdx — essays/posts
│   │   ├── work-architecture/  # slug.mdx — architecture projects
│   │   └── work-software/   # slug.mdx — software projects
│   │
│   ├── lib/
│   │   ├── content.ts       # Content loading utilities (MDX + frontmatter)
│   │   ├── fonts.ts         # Brand fonts (Jost/Cormorant Garamond/DM Mono)
│   │   └── metadata.ts      # Shared metadata helpers
│   │
│   └── styles/
│       ├── globals.css      # Tailwind imports, base resets, grain overlay styles
│       └── tokens.css       # Design tokens as CSS custom properties
│
├── public/
│   ├── fonts/               # Self-hosted WOFF2 files (when brand fonts arrive)
│   └── textures/            # Build-time generated textures
│
├── research/                # Existing research (unchanged)
│   ├── 01-asimov-collective-analysis.md
│   ├── 02-porter-robinson-interactive-research.md
│   ├── 03-graphics-pipeline-final.md  # ★ THE KEY REFERENCE for visual/graphics decisions
│   └── asset-workflows/
├── notes/                   # Code review artifacts and working notes
└── .lattice/                # Task tracking (Lattice)
```

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Quality target | Asimov Collective level | PRD §2 — restrained, typographic, editorial |
| Interactivity model | Asimov-first; interactive later | Porter Robinson research is banked for future phases. V1 targets Asimov restraint — architecture the site so interactive layers can be added later, but don't build them now. |
| Daily updates | Claude skill (`/update-site`) | PRD §7 — quick mode + developed mode, generates MDX content |
| Content format | MDX via `next-mdx-remote` + `gray-matter` | Rich content with embedded React components; files in `src/content/` |
| Deployment | Vercel (not yet connected) | First-party Next.js support, image optimization CDN, preview deploys |
| Tech stack | Next.js 15 (App Router) + Tailwind CSS 3 + pnpm | Matches Asimov Collective stack; RSC by default, client islands for interactivity |
| Site name | Parallax | Single word — captures shifting perspective across disciplines |
| Domain | parallax.studio | Short, memorable, studio connotation |
| Typography | Cormorant Garamond (headings, semibold italic) + Futura PT (body/nav) + Degular Mono (code) | Calligraphic warmth for headings, geometric precision for body; see `brand-guide.md` §4 |
| Design philosophy | "The site IS the bridge" | PRD §8 — architecture × software demonstrated, not explained |

## Design Language References

- **V1 target:** Asimov Collective — restrained typography, editorial pacing, quiet navigation, generous whitespace. This is the quality bar for launch.
- **How Asimov actually ships:** No WebGL, Three.js, shaders, or Canvas on any production client site. Rich motion is pre-rendered video (MP4), not runtime graphics. The web layer is CSS transitions + smooth scroll + optimized images. The impressive visuals come from pre-production, not from heavy frontend tech.
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

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start local dev server (http://localhost:3000) |
| `pnpm build` | Production build (static export) |
| `pnpm start` | Serve production build locally |
| `pnpm lint` | Run ESLint (next/core-web-vitals + next/typescript) |

- **Package manager:** pnpm (v10+)
- **Framework:** Next.js 15.x (App Router)
- **Node:** v22+
- **Type checking:** Handled by `next build` (incremental TS compilation). For standalone: `npx tsc --noEmit`
- **Testing:** Not yet configured (will add Vitest/Playwright in a future task)
- **Deployment:** Vercel (not yet connected — pending ASMV-9)

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

### Code Conventions
- **Components:** Functional React components, default exports. PascalCase filenames.
- **Client components:** Explicit `"use client"` directive at the top of file. RSC by default.
- **Imports:** Path alias `@/*` maps to `src/*`. Prefer `@/components/...`, `@/lib/...`, etc.
- **Styling:** Tailwind utility classes. Design tokens in `src/styles/tokens.css` as CSS custom properties. Both are accessible — use Tailwind for layout/spacing, CSS vars for semantic values shared with future interactive components.
- **Content:** MDX files in `src/content/<collection>/`. Frontmatter parsed by `gray-matter`. Content loaded via helpers in `src/lib/content.ts`.
- **Fonts:** Configured in `src/lib/fonts.ts` via `next/font/google`. Body defaults to sans (Jost/Futura PT); headings default to serif semibold italic (Cormorant Garamond) via `globals.css`. Wordmark and structural UI use `font-sans` explicitly. CSS variables `--font-sans`, `--font-serif`, `--font-mono` applied to `<html>`. Adobe Fonts upgrade: swap to `next/font/local`, keep same variable names.

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

- **Build fails:** Run `pnpm build` to see errors. Next.js type-checks during build. Common issues: missing imports, bad MDX frontmatter, RSC/client boundary violations.
- **RSC vs client component errors:** If you see "useState is not defined" or similar, the component needs `"use client"`. If you see "async Server Component" errors, the component should NOT have `"use client"`.
- **Content not showing:** Check that the MDX file exists in `src/content/<collection>/`, has valid frontmatter, and the collection name matches the directory name in `src/lib/content.ts`.
- **Tailwind classes not applying:** Verify the file path is included in `tailwind.config.ts` `content` array. Check for typos in class names.
- **Font not loading:** Check `src/lib/fonts.ts` — the font must be imported and its `.variable` class applied to `<html>` in `layout.tsx`.
- **Research-phase debugging:** If a research doc seems incomplete, check the PRD for the original deliverable spec before expanding scope.
- **Lattice task confusion:** Check `.lattice/config.json` for workflow states. Valid transitions are documented there — don't invent statuses.

## Self-Improvement

**When to add entries below:** Whenever you discover something non-obvious about this project — a convention that isn't documented, a gotcha, a pattern that works well, a tool preference. Low bar, high value. A 30-second addition here saves hours across future sessions.

**Format:** `- **[Topic]**: What you learned and why it matters`

## Lessons Learned

- **Porter Robinson research depth:** The deep research format (tech stack breakdown + "why it matters" + design principles extracted) works well. Use this format for future research deliverables.
- **Lattice initialized early:** Task tracking was set up before code exists — good for maintaining phase discipline. Tasks map 1:1 to PRD phases.
- **Scope discipline (2026-03-02):** Active Theory / Porter Robinson interactive work is inspiring but out of scope for V1. The research is banked. V1 = Asimov-level quality (typography, restraint, editorial pacing). Architecture the codebase so interactive layers (WebGL, shaders, physics) can be added later without a rewrite. Don't let "play within polish" become scope creep — nail the polish first.
- **Nested Claude nesting (2026-03-03):** `claude -p` fails inside a Claude Code session due to `CLAUDECODE` env var. Fix: `env -u CLAUDECODE claude -p "..." --dangerously-skip-permissions`. This is needed for the /wrap-it-up quad review pattern.
- **Adobe Fonts ≠ self-host (2026-03-03):** Adobe Fonts (Creative Cloud) does not permit exporting .woff2 for self-hosting. Options: (1) use Adobe's hosted web project CSS embed, (2) buy separate web license from MyFonts/foundry for `next/font/local`, or (3) keep Google Fonts stand-ins (Jost, DM Mono). Documented in `brand-guide.md` §4.
- **Wireframes/visual concepts = needs_human (2026-03-03):** Never close a design/wireframe task without human review. Visual concepts require Julianna's approval before implementation begins. Move to `needs_human`, not `done`.
- **Ship visible output first (2026-03-03):** Build the page, create components as needed along the way. Don't build a component library for a page that doesn't exist. Infrastructure-first is the wrong priority for this project — the MVP is a visible homepage.
- **One task = one branch = one PR (2026-03-03):** Never bundle multiple tasks into a single branch or PR. Each Lattice task gets its own feature branch and its own pull request.
- **Stay in scope (2026-03-03):** If a task says "create design system components," don't also refactor every page file. That's a different task. Touching files outside your task's scope is scope creep.
- **Visual-first design (2026-03-04):** Agents must SEE visual references (images) before designing or wireframing — written descriptions of aesthetics produce generic output. The workflow: (1) assemble moodboard images in `research/moodboard/`, (2) agent views every image via Read tool, (3) wireframe as HTML or in-app at wireframe fidelity, (4) iterate visually. You can't hit a visual target you've never seen.
- **The design formula (2026-03-04):** Soul/vibe comes from Julianna's work (portfolio, mae graphics, pinterest board) — warm textures, stipple, watercolor, handcraft, materiality, architectural drawing language. Structure/execution comes from Asimov Collective sites — editorial pacing, typographic hierarchy, bento grids, full-bleed sections, strong branding, restrained nav, scroll flow. The goal is NOT an Asimov clone — it's pouring Julianna's visual DNA into Asimov's level of web craft.
- **Wireframes = HTML, not text (2026-03-04):** Build wireframes as standalone HTML files or directly in the Next.js app. Text/ASCII wireframes don't give the human enough to react to. The human needs to see real proportions, real type hierarchy, real spacing in a browser.

## Lattice

> **MANDATORY: This project has Lattice initialized (`.lattice/` exists). You MUST use Lattice to track all work. Creating tasks, updating statuses, and following the workflow below is not optional — it is a hard requirement. Failure to track work in Lattice is a coordination failure: other agents and humans cannot see, build on, or trust untracked work. If you are about to write code and no Lattice task exists for it, stop and create one first.**

Lattice is file-based, event-sourced task tracking built for minds that think in tokens and act in tool calls. The `.lattice/` directory is the coordination state — it lives alongside the code, not behind an API.

### Creating Tasks (Non-Negotiable)

Before you plan, implement, or touch a single file — the task must exist in Lattice. This is the first thing you do when work arrives.

```
lattice create "<title>" --actor agent:<your-id>
```

**Create a task for:** Any work that will produce commits — features, bugs, refactors, cleanup, pivots.

**Skip task creation only when:** The work is a sub-step of a task you're already tracking (lint fixes within your feature, test adjustments from your change), pure research with no deliverable, or work explicitly scoped under an existing task.

When in doubt, create the task. A small task costs nothing. Lost visibility costs everything.

**Recurring observations become tasks.** If you observe the same issue in 2+ consecutive sessions or advances (e.g., a failing test, a lint warning, a flaky behavior), create a task for it. Agents are disciplined about tracking assigned work but not discovered work — this convention closes that gap. Create discovered issues at `needs_human` if they need scoping, or `backlog` if they're well-understood.

### Descriptions Carry Context

Descriptions tell *what* and *why*. Plan files tell *how*.

- **Fully specified** (bug located, fix named, files identified): still go through `in_planning`, but the plan can be a single line (e.g., "Fix the typo on line 77"). Mark `complexity: low`.
- **Clear goal, open implementation**: go through `in_planning`. The agent figures out the approach and writes a substantive plan.
- **Decision context from conversations**: bake decisions and rationale into the description — without it, the next agent re-derives what was already decided.

### Status Transitions

Every transition is an immutable, attributed event. **The cardinal rule: update status BEFORE you start the work, not after.** If the board says `backlog` but you're actively working, the board is lying and every mind reading it makes decisions on false information.

```
lattice status <task> <status> --actor agent:<your-id>
```

```
backlog → in_planning → planned → in_progress → review → done
                                       ↕            ↕
                                    blocked      needs_human
```

**Transition discipline:**
- `in_planning` — before you open the first file to read. Then write the plan.
- `planned` — only after the plan file has real content.
- `in_progress` — before you write the first line of code.
- `review` — when implementation is complete, before review starts. Then actually review.
- `done` — only after a review has been performed and recorded.
- Spawning a sub-agent? Update status in the parent context first.

### Sub-Agent Execution Model

Each lifecycle stage gets its own sub-agent with fresh context. This is the default execution pattern — not a suggestion, not complexity-gated. Every task, every time.

**Why this matters:** When a planning agent writes a plan and a separate implementation agent reads it, the plan *must* be clear and complete — there's no shared context to fall back on. This forces better plans. When a review agent reads the diff cold, it catches things the implementer's context-polluted mind would miss. The plan file and git diff are the handoff artifacts.

**The three sub-agents:**

| Stage | Sub-agent does | Reads | Produces |
|-------|---------------|-------|----------|
| **Plan** | Explore codebase, write plan, move to `planned` | Task description | Plan file |
| **Implement** | Read plan, build it, test, commit, move to `review` | Plan file | Committed code |
| **Review** | Read diff cold, review against acceptance criteria, record findings | Git diff + plan | Review comment (`--role review`), move to `done` |

**The parent orchestrator** (the main agent session) manages the lifecycle:
1. Move the task to `in_planning` before spawning the planning sub-agent.
2. After the planner finishes, move to `in_progress` and spawn the implementation sub-agent.
3. After the implementer finishes, the review sub-agent runs independently.

Each sub-agent should use a distinct actor ID (e.g., `agent:claude-opus-4-planner`, `agent:claude-opus-4-impl`, `agent:claude-opus-4-reviewer`) so the event log shows who did what.

### The Planning Gate

The plan file lives at `.lattice/plans/<task_id>.md` — scaffolded on creation, empty until you fill it.

This is the **planning sub-agent's** job. Spawn a sub-agent whose sole purpose is to explore the codebase, understand the problem, and write the plan. It should:
1. Read the task description and any linked context.
2. Explore the relevant source files — understand existing patterns and constraints.
3. Write the plan to `.lattice/plans/<task_id>.md` — scope, approach, key files, acceptance criteria. For trivial tasks, a single sentence is fine. For substantial work, be thorough.
4. Move to `planned` only when the plan file reflects what it intends to build.

**The test:** If you moved to `planned` and the plan file is still empty scaffold, you didn't plan. Every task gets a plan — even trivial tasks get a one-line plan. The CLI enforces this: transitioning to `in_progress` is blocked when the plan is still scaffold.

### The Review Gate

Moving to `review` is a commitment to actually review the work.

This is the **review sub-agent's** job. Spawn a sub-agent with fresh context — it did NOT write the code and comes in cold. It should:
1. Read the plan file to understand what was supposed to be built.
2. Read the git diff to see what was actually built.
3. Run tests and linting to verify nothing is broken.
4. Compare the implementation against the plan's acceptance criteria.
5. Record findings with `lattice comment --role review` — what was reviewed, what was found, and whether it meets acceptance criteria.

**When moving to `done`:** If the completion policy blocks you for a missing review artifact, do the review. Do not `--force` past it. `--force --reason` is for genuinely exceptional cases, not a convenience shortcut.

**The test:** If the same agent that wrote the code also reviewed it without a fresh context boundary, the review gate is not doing its job. The whole point is independent verification.

### Review Rework Loop

When a review agent evaluates work, it produces one of three outcomes:

1. **Pass (with optional minor fix):** The review agent uses vibes-based judgment. If the only issues are trivial (obvious typos, missing semicolons, etc.), fix them inline, record what was changed in the review comment, and move to `done`. No strict line-count threshold — the review agent decides.

2. **Fail — implementation-level:** The plan was sound but the implementation has issues. The review agent explicitly states "implementation-level rework needed" in its comment. The orchestrator transitions the task `review -> in_progress`. Critical findings from the review are appended to the plan file under a new `## Review Cycle N Findings` section. A fresh sub-agent is encouraged (but not mandated) for the rework.

3. **Fail — plan-level:** The original plan was flawed — wrong approach, missing requirements, etc. The review agent explicitly states "plan-level rework needed" in its comment. The orchestrator transitions the task `review -> in_planning`. The plan gets reworked (not just amended), then back through the full lifecycle.

**Who decides what:**

| Decision | Who | How |
|----------|-----|-----|
| Fix inline vs send back | Review agent | Vibes-based judgment, recorded in review comment |
| Implementation-level vs plan-level | Review agent | Explicitly stated in review comment |
| Route to in_progress vs in_planning | Orchestrator | Follows review agent's recommendation |
| Whether to spawn fresh sub-agent | Orchestrator | Encouraged by convention, not enforced |

**3-cycle safety valve:** After 3 review-to-rework transitions (any combination of `review -> in_progress` and `review -> in_planning`), the CLI blocks the 4th attempt. The error message instructs the agent to move the task to `needs_human` with a comment explaining the situation. The limit is configurable via `review_cycle_limit` in the workflow config (default: 3). Override with `--force --reason` for genuinely exceptional cases.

**Allowed lifecycle paths:**

```
Normal:       in_progress -> review -> done
Minor fix:    in_progress -> review -> (fix inline) -> done
1 impl rework: in_progress -> review -> in_progress -> review -> done
1 plan rework: in_progress -> review -> in_planning -> planned -> in_progress -> review -> done
Max cycles:   3 review->rework transitions, then CLI blocks -> needs_human
```

### When You're Stuck

Use `needs_human` when you need human decision, approval, or input. This is distinct from `blocked` (generic external dependency) — it creates a scannable queue.

```
lattice status <task> needs_human --actor agent:<your-id>
lattice comment <task> "Need: <what you need, in one line>" --actor agent:<your-id>
```

Use for: design decisions requiring human judgment, missing access/credentials, ambiguous requirements, approval gates. The comment is mandatory — explain what you need in seconds, not minutes. The human's queue should be scannable.

### Actor Attribution

Every operation requires `--actor`. Attribution follows authorship of the *decision*, not the keystroke.

- Agent decided autonomously → `agent:<id>`
- Human typed it directly → `human:<id>`
- Human meaningfully shaped the outcome → `human:<id>` (agent was the instrument)

When in doubt, credit the human.

### Branch Linking

Link feature branches to tasks: `lattice branch-link <task> <branch-name> --actor agent:<your-id>`. Auto-detection works when the branch contains the short code (e.g., `feat/LAT-42-login`), but explicit linking is preferred.

### Leave Breadcrumbs

You are not the last mind that will touch this work. Use `lattice comment` for what you tried, chose, and left undone. Use `plans/<task_id>.md` for structured plans and `notes/<task_id>.md` for working notes and context dumps. The record you leave is the only bridge to the next agent's context.

### Shared Worktree Discipline

Multiple agents may work in the same repository concurrently on different tasks. The `git status` snapshot from your session start goes stale the moment another agent commits.

**When you encounter unfamiliar changes** (unexpected files, diffs you didn't make, new commits on HEAD):
1. **Investigate first.** Check `git log` and `lattice list` to see if another task/agent is responsible.
2. **Ask "who made this?" before "this shouldn't be here."** The change is almost certainly another agent's legitimate work.
3. **Never revert, reset, or delete changes you can't attribute.** If you're unsure, leave them alone and ask the human.

This applies to uncommitted changes in the working tree, unexpected commits on the branch, and new files that weren't there when your session started. The instinct to "clean up" unfamiliar state is exactly wrong in a multi-agent worktree — it destroys a sibling agent's work.

### Where Learnings Go

When you discover something important about how this project works — a pattern, a gotcha, a convention — **do not save it to auto-memory**. Memory is per-session and per-user; future Lattice agents in other installations will never see it. Instead, add it to this project's `CLAUDE.md` (for project-specific conventions) or propose updating the Lattice template (for universal patterns that should ship with every `lattice init`). The goal: every future agent, in every future installation, benefits from what you learned.

### Quick Reference

```
lattice create "<title>" --actor agent:<id>
lattice status <task> <status> --actor agent:<id>
lattice assign <task> <actor> --actor agent:<id>
lattice comment <task> "<text>" --actor agent:<id>
lattice link <task> <type> <target> --actor agent:<id>
lattice branch-link <task> <branch> --actor agent:<id>
lattice next [--actor agent:<id>] [--claim]
lattice show <task>
lattice list
```

**Useful flags:**
- `--quiet` — prints only the task ID (scripting: `TASK=$(lattice create "..." --quiet)`)
- `--json` — structured output: `{"ok": true, "data": ...}` or `{"ok": false, "error": ...}`
- `lattice list --status in_progress` / `--assigned agent:<id>` / `--tag <tag>` — filters
- `lattice link <task> subtask_of|depends_on|blocks <target>` — task relationships

For the full CLI reference, see the `/lattice` skill.
