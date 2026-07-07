# ASMV-99: Migrate parallax.studio label → parallax across content

## Scope
Migrate the content taxonomy category label `project: "parallax.studio"` to the neutral,
domain-agnostic value `parallax`. This is a category label ("work on the site itself"), not a URL.

## Label choice
`parallax` (not `parallax.haus`). Rationale:
- Domain-agnostic — we never chase the label again if the domain changes.
- The value is displayed to users as a small mono-font metadata tag (ArtifactPopover,
  ArtifactBar) alongside sibling values `architecture` and `personal`. A single lowercase
  word `parallax` reads consistently with those siblings; `parallax.studio` would read oddly.

## Files
- 12 x `src/content/now/*.mdx` frontmatter `project:` values equal to `parallax.studio`.
- `docs/site-update-guide.md` — allowed-values list, MDX example, reference table,
  TS-shape comment, and intro line.

## Verification (grep-first, done)
- `grep -rn '"parallax.studio"' src/ docs/` — only the above files; no TS/TSX keys off the literal.
- `grep -rn 'parallax\.studio' src/ --include='*.ts' --include='*.tsx'` — empty (no hardcoded
  domain in source). Site URL comes from env `NEXT_PUBLIC_SITE_URL`.

## Out of scope (do NOT touch)
- Historical records: `notes/CR-*.md`, `.lattice/`.
- Social handle `@parallaxstudio` in brand-guide.md — separate decision, flag only.
- Already-updated brand docs: `brand-guide.md`, `CLAUDE.md`.

## Acceptance criteria
- All `project: "parallax.studio"` → `project: "parallax"` in now content + doc guide.
- `pnpm build` and `pnpm lint` pass.
- No commit/push — leave staged for Julianna's review.
