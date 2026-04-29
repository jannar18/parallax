# ASMV-97 — Relocate pretext link from home to /archive

## Scope
- Remove the "Pretext" nav link from the home page bottom nav row.
- Surface a "Pretext" link inside `/archive` so it remains discoverable from the experiments/archive context.
- Do NOT touch the `/pretext` route itself — it stays as-is.

## Files
- `src/app/page.tsx` — remove the `<Link href="/pretext">` block (lines ~176–188), inside the nav at line ~136.
- `src/app/archive/page.tsx` — render a small fixed overlay link to `/pretext` alongside the existing `LayoutSwitcher`. Keep visual treatment consistent with `LayoutSwitcher` (fixed bottom-corner, mono uppercase, faint ink-lighter color, scarlet on hover).

## Approach
1. Delete the Pretext `<Link>` from `src/app/page.tsx`. The remaining nav becomes Architecture / Software / Writing — three items, still balanced.
2. In `src/app/archive/page.tsx`, render an `<ArchivePretextLink />` next to (or paired with) `<StudioDesk>`. Place it `fixed right-5 bottom-...` mirroring the LayoutSwitcher's `left-5` position so the two corner anchors balance. Use the same font/size/letter-spacing as LayoutSwitcher.
3. Since `archive/page.tsx` is a Server Component and the link is just a `next/link`, no `"use client"` boundary is needed for the link itself.

## Acceptance criteria
- Home page (`/`) no longer shows a Pretext link anywhere.
- `/archive` renders a discreet "Pretext →" link in a fixed corner, navigating to `/pretext`.
- `/pretext` route still works unchanged.
- `pnpm lint` and `pnpm build` pass.

## Out of scope
- Restructuring the StudioDesk to mix in non-now-entry cards.
- Editing the `/pretext` page itself.
- Footer or mobile nav changes (covered by ASMV-96).

complexity: low
