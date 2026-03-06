# ASMV-22: /update Skill Command

## Approach
Create `~/.claude/commands/update.md` — a slash command that orchestrates the full daily content pipeline. Uses absolute paths so it works from any repo.

## Files
- `~/.claude/commands/update.md` (new)

## Acceptance Criteria
- `/update` appears in Claude Code skill list
- Skill references correct paths and follows the 8-step workflow
