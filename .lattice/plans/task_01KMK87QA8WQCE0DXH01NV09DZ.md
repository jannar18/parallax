# ASMV-81: Arch Voice MCP: replace blurry thumbnail with higher quality image, order clips numerically

## Plan

**Scope:** Single-file change to `src/content/work-software/arch-voice-mcp.mdx`.

1. Replace `thumbImage` value from `/images/software/arch-voice-mcp/riso.1.png` to `/images/home/merge.riso.1.png` (already exists, already riso-processed, ~11.7MB).
2. The `videos` array does not exist on `origin/main` yet (it's part of ASMV-81 panel work). Skip clip ordering — it will be handled when that branch merges.
3. Verify with `pnpm build`.

**Acceptance criteria:** Build succeeds; thumbImage points to the higher-quality merge riso image.
