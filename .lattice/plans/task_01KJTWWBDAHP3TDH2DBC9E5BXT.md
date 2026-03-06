# ASMV-18: Daily update skill (/update-site)

## Scope
Build a Claude Code slash command at `.claude/commands/update-site.md` (project-scoped) that automates the daily content pipeline for parallax.studio. This is the production version of the `/update` prototype.

## Key Files
- **Output:** `.claude/commands/update-site.md` — the skill itself
- **Reference:** `notes/update-skill-steps.md` — manual process spec
- **Reference:** `~/.claude/commands/update.md` — existing prototype
- **Schema:** `src/lib/content.ts` (NowEntry interface)
- **Examples:** `src/content/now/2026-03-{03,04,05,06}.mdx`
- **Pipeline:** `scripts/riso_engine.py`, `research/asset-workflows/`

## Design Decisions (from ASMV-25 review)
1. Project-scoped command (.claude/commands/ in repo) — not global
2. Two modes: quick (default, 3 questions) and developed (explicit, all questions)
3. Supports both photo input (Riso-processed) and texture generation
4. Smart preflight: check Python deps, check for running dev server
5. Archive only session-specific files, not entire directories
6. Auto-infer tags from project+description
7. Voice guidance: studio-desk tone, not flowery or corporate
8. Support --no-riso flag for pre-processed/screenshot images
9. Handle existing entry collision (overwrite/append/skip)

## Approach
1. Create .claude/commands/ directory in the repo
2. Write the update-site.md command file
3. Commit on feature/asmv-18-update-skill branch

## Acceptance Criteria
- `/update-site` command exists and is loadable by Claude Code
- Quick mode asks 3 questions and produces a valid MDX entry
- Developed mode asks all questions with richer input
- Riso engine integration with preflight checks
- Texture generation as alternative to photo input
- Handles existing entries (overwrite/append/skip)
- Voice guidance matches existing entries' tone
- Build validation that doesn't clobber running dev server
