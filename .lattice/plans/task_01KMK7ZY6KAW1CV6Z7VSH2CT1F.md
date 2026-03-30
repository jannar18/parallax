# ASMV-82: Arch Voice MCP thumbnail + clip ordering

## Scope
1. Replace `thumbImage` in `arch-voice-mcp.mdx` from `/images/software/arch-voice-mcp/riso.1.png` to `/images/home/merge.riso.1.png` (already exists, already riso-processed, higher quality).
2. Since `origin/main` does NOT have the `videos` array (that comes from ASMV-81), only the thumbImage change applies now. The clip ordering will be correct when ASMV-81 merges.

## Key files
- `src/content/work-software/arch-voice-mcp.mdx` — frontmatter change

## Acceptance criteria
- `thumbImage` points to `/images/home/merge.riso.1.png`
- `pnpm build` passes
