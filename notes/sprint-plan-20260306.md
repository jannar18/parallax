# Sprint Plan — 2026-03-06

## Wave 0 — Prerequisites
1. **ASMV-51** — Install riso Python deps (agent)
2. **ASMV-25** — Review update skill spec (agent)

## Wave 1 — Parallel fixes + tooling (agent)
1. **ASMV-18** (critical) — Build `/update-site` skill
2. **ASMV-40** (critical, absorbs ASMV-39) — Fix hero scroll/animation
3. **ASMV-44** (critical) — Brand guide Riso rewrite
4. **ASMV-45** (high) — Fix hardcoded old colors in hero-canvas.ts + HeroBrandVisual.tsx
5. **ASMV-42** (medium) — ArtifactBar hover fix
6. **ASMV-43** (high) — Mobile nav pattern

**Human (parallel):** Gather source photos for ASMV-28/29/30 and portfolio files for ASMV-23.

## Wave 2 — After Wave 1
1. **ASMV-26** — Practice `/update-site` pipeline (**human + agent**)
2. **ASMV-48** (high) — Hero canvas mobile perf (agent)
3. **ASMV-46** (medium) — Legacy alias cleanup (agent)
4. **ASMV-50** (medium) — About page doc audit (agent)
5. **ASMV-27** (medium) — Homepage split view animations (agent)
6. **ASMV-41** (medium) — Studio desk refinement (agent)
7. **ASMV-49** (low) — Footer grain refactor (agent)

## Wave 3 — Content buildout (human + agent, via `/update-site`)

Agents can gather screenshots of live projects via `screencapture` / Claude-in-Chrome. Human provides URLs/paths, agents self-serve visuals. **If an app requires login or interaction to reach the right screen, flag it as `needs_human` — don't screenshot a login page.**

1. **ASMV-31** — Set up software portfolio page
2. **ASMV-32** — Add Rainbow Crawler
3. **ASMV-33** — Add Chatbot
4. **ASMV-34** — Add Schelling Points
5. **ASMV-35** — Add Risograph pipeline
6. **ASMV-36** — Writing page + blog migration
7. **ASMV-52** — Human review of all Wave 3 content (**needs_human** — confirm formatting, screenshots, copy)
7. **ASMV-23** — Upload portfolio & generate visuals with Gemini (**human provides files**)
8. **ASMV-28/29/30** — Split view images (**human provides source photos**)

## Wave 4 — Ship
1. **ASMV-16** — Deploy to Vercel

## Cancelled
- **ASMV-9** — too vague, superseded by specific polish tasks
- **ASMV-17** — superseded by ASMV-31, 36, and individual tasks
- **ASMV-39** — merged into ASMV-40 (same hero animation issue)
