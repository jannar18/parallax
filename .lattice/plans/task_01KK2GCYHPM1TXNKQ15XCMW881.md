# ASMV-42: Fix ArtifactBar hover state (vermillion-light = vermillion, no visual feedback)

## Problem

`ArtifactBar.tsx` line 168 uses `text-vermillion hover:text-vermillion-light` for the "View full entry" link. In `tailwind.config.ts` line 21, the `vermillion` color is defined as:

```ts
vermillion: { DEFAULT: "#f65058", light: "#f65058" },
```

Both DEFAULT and light resolve to the identical color `#f65058`, so the hover state produces zero visual change.

## Approach

Two changes:

1. **`ArtifactBar.tsx` line 168:** Replace `text-vermillion hover:text-vermillion-light` with `text-scarlet hover:text-scarlet-dark`. The `scarlet` color in the Tailwind config already has distinct values: `DEFAULT: "#f65058"`, `dark: "#d4434a"`. The dark variant is also defined in `tokens.css` as `--color-accent-hover: #d4434a`. This is the semantically correct hover color for accent links.

2. **`tailwind.config.ts` line 21:** Fix the `vermillion.light` alias so future use is not a trap. Change `light: "#f65058"` to `light: "#f8787e"` (a lighter tint of scarlet, ~15% lighter). This prevents future developers from falling into the same bug. Alternatively, leave `vermillion` as a plain legacy alias (no `light` variant) since the canonical color names are `scarlet` / `scarlet-dark`.

   **Decision:** Remove the `light` key entirely from `vermillion` and make it a simple string alias (like `cream` and `forest`), since the canonical token is `scarlet`. This is cleaner and avoids inventing a color that does not appear in the brand guide.

## Files Changed

- `src/components/interactive/ArtifactBar.tsx` — line 168 hover class
- `tailwind.config.ts` — line 21 vermillion definition

## Acceptance Criteria

- The "View full entry" link in the ArtifactBar popover has visible color change on hover
- `scarlet` (default) and `scarlet-dark` (hover) are the colors used
- `vermillion` in tailwind.config is simplified to a plain string alias `"#f65058"` (no misleading `light` variant)
- `pnpm build` passes with no errors
