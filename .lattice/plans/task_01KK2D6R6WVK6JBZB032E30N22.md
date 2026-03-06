# ASMV-21: Riso Engine + Raw Photo Inbox

## Approach
1. Create `scripts/riso_engine.py` — Pillow-based 4-color Riso processor
2. Create `_raw/.gitkeep` as photo inbox
3. Add `_raw/` to .gitignore

## Files
- `scripts/riso_engine.py` (new)
- `_raw/.gitkeep` (new)
- `.gitignore` (modify)

## Acceptance Criteria
- Engine processes a test image into Riso-styled output
- `_raw/` directory exists but contents are gitignored
- `pnpm build` still passes
