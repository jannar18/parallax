# ASMV-20: Site Palette Update — Riso Colors

## Approach
Replace existing warm earth palette in tokens.css and tailwind.config.ts with the 6-color Riso palette. Keep CSS variable names stable so globals.css references remain valid.

## Files
- `src/styles/tokens.css` — rewrite color section
- `tailwind.config.ts` — update extend.colors

## Acceptance Criteria
- `pnpm build` passes
- All semantic color variables still resolve
- Riso palette colors match spec exactly
