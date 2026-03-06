# ASMV-44: Rewrite brand-guide.md §3 (Color Palette) and §7 (Design Tokens) for Riso palette

## Scope

Rewrite two sections of `brand-guide.md` plus fix stale color references elsewhere in the file:

1. **§3 (Color Palette)** — lines 101-198. Replace the old Vermillion/Terracotta/Amber/Cream palette with the Riso palette: Paper, Oxblood, Scarlet, Olive, Moss, Spruce. Document hex values, usage roles, relationships, WCAG contrast ratios, and usage rules.

2. **§7 (Design Tokens — Ready for Code)** — lines 389-567. Replace the old CSS custom properties and Tailwind config snippets with the actual values from `tokens.css` and `tailwind.config.ts`.

3. **§5 Favicon** — line 335 references "Terracotta (`#C4724E`)". Update to Scarlet or Oxblood (the new accent/text colors).

4. **Appendix Decision Log** — line 579 references "Terracotta (`#C4724E`)". Update to Scarlet.

## Source of Truth

- `src/styles/tokens.css` — the actual CSS custom properties (Riso palette)
- `tailwind.config.ts` — the actual Tailwind color config (Riso palette)

## Approach

- Keep the same structural patterns (tables, headings, code blocks) used in the rest of the brand guide
- Write in the same voice — a designer's reference document, not engineering docs
- Compute WCAG contrast ratios for the new palette and document them
- Preserve legacy alias documentation (the `--color-cream`, `--color-vermillion`, `--color-forest` aliases exist in tokens.css for backward compat)
- Keep non-color content in §7 (typography, spacing, font CSS vars) unchanged

## Acceptance Criteria

- Every hex value in §3 and §7 matches `tokens.css` exactly
- No references to the old Terracotta/Amber/Sage/Dusty-Rose/Coral/Warm-Gray palette remain in the file
- Vermillion references updated to note it's a legacy alias for Scarlet
- WCAG contrast ratios computed for new palette
- Writing voice consistent with rest of brand guide
