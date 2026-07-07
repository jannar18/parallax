# ASMV-100: Merge prototypes pipeline into parallax — data layer + publish.mjs repoint

Wave-1 (Agent A) of the prototypes→parallax merge. Per handoff CONTRACT
(`2026-07-06-merge-00-CONTRACT.md`). Establishes the data foundation that Agents B
(gallery UI) and C (fractal-nyc entry) depend on.

## Scope (files I own)
- `src/data/works.json` (new — seed from prototypes/projects.json, 4 entries)
- `src/lib/content.ts` (add `Work` interface + `getAllWorks()`)
- `public/lab/*.gif` (copy 4 gifs)
- `pipeline/` (copy from prototypes, repoint publish.mjs)
- `.gitignore` (add pipeline ignores)
- `~/.claude/commands/post-prototype.md` (repoint fixed locations)

## Do NOT touch
- `src/app/work/software/page.tsx` (Agent B)
- Sibling uncommitted changes (CLAUDE.md, brand-guide.md, now/*.mdx, DESIGN.md, README.md)
- Do NOT commit/push. Do NOT delete ~/Dev/prototypes. Never print/commit pipeline/.env.

## Approach
1. Create `src/data/works.json` with `{ "works": [...] }`, gif paths → `/lab/prototype-0N.gif`,
   add `"url": ""` and `"screenshots": []` to each entry.
2. Copy 4 gifs to `public/lab/`.
3. Add `Work` interface + `getAllWorks()` (reads works.json, sort by number DESC).
4. Copy `pipeline/` into parallax (exclude node_modules, .DS_Store; keep .env untracked).
5. Repoint publish.mjs: manifestPath→src/data/works.json, `works` array, gif dest
   public/lab/<id>.gif + `/lab/<id>.gif`, commit target parallax root, commit prefix
   `content: add <label> — <title>`, SITE_URL parallax.haus, add `--url` support.
6. Add explicit pipeline ignores to .gitignore.
7. Update post-prototype.md fixed locations + publish block + step 8.

## Verify
- `node pipeline/publish.mjs --id prototype-01 ... --no-push --no-tweet` updates works.json + copies gif; revert mutation to clean seed.
- `npx tsc --noEmit` passes.

## Acceptance
- works.json matches CONTRACT data model exactly (4 clean entries, newest-first via loader).
- Pipeline publishes into parallax; no commit/push performed; .env never exposed.
