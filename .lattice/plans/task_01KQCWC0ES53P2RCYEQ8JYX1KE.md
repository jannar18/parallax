# ASMV-95: Add 'rotate phone' prompt to video clip section on home page (mobile)

## Problem

On mobile in portrait orientation, the ClipReel video gallery on the home page is cramped — videos are letterboxed inside `100dvh` with `object-contain`, so the actual playable area is small. Landscape orientation gives the videos a much better aspect ratio. We want to gently nudge mobile users to rotate their phone for a better viewing experience without blocking interaction.

## Scope constraint

All changes must be made inside `src/components/interactive/ClipReel.tsx`. **Do NOT touch `src/app/page.tsx`** — owned by ASMV-86 in this wave.

## Approach — CSS-only with media query

CSS-only is the right call here:
- The site already uses `100dvh` and tailwind utilities consistently
- No JS state to manage; the browser re-evaluates the media query on rotation
- Avoids hydration concerns and `matchMedia` boilerplate
- The prompt simply hides itself when orientation changes

The hint is added inside `MobileClipReel` (it's mobile-only and component-scoped, so it never renders on desktop). It is rendered as a small typographic banner at the top of the stage and disappears at `(orientation: landscape)` via Tailwind's `landscape:hidden` / `portrait:flex` variants (built-in to Tailwind 3).

## Where it lives in `ClipReel.tsx`

Inside `MobileClipReel`'s returned JSX, just before or after the clip-counter element. Both are absolutely positioned so order doesn't matter. The prompt sits at the top-center of the video stage, above the clip counter (top-right) and out of the way of the prev/next tap zones.

Visual:
- Position: `absolute top-4 left-1/2 -translate-x-1/2 z-20`
- Visibility: `portrait:flex landscape:hidden` — Tailwind 3 has these orientation variants built in.
- A small SVG rotation glyph + short typographic line.
- `pointer-events-none` so it never blocks the tap-to-play overlay.

## Copy

Primary: **"rotate for full view"**

- Lowercase, mono font (`font-mono` is already used elsewhere in `MobileClipReel` for the counter), `tracking-wider` — matches existing `0.7rem` scale of the counter.
- Short and instructional without being pushy. Mirrors the restrained Asimov voice.

## Markup sketch

```tsx
{/* Rotate-phone hint — portrait only */}
<div
  className="absolute top-4 left-1/2 -translate-x-1/2 z-20 portrait:flex landscape:hidden items-center gap-2 text-paper/60 pointer-events-none"
  aria-hidden="true"
>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    {/* phone-rotate glyph */}
    <rect x="7" y="3" width="10" height="18" rx="1.5" />
    <path d="M3 8a9 9 0 0 1 6-3" />
    <path d="M5 5l-2 3 3 1" />
  </svg>
  <p className="font-mono uppercase tracking-wider" style={{ fontSize: "0.65rem" }}>
    rotate for full view
  </p>
</div>
```

Notes:
- `aria-hidden="true"` because it's a visual nudge, not essential content; screen readers should ignore.
- Icon stroke matches the existing chevron buttons (`strokeWidth="1.5"`, `currentColor`).
- Color `text-paper/60` keeps it subtle against the black mobile background and consistent with the existing `text-paper/30`–`text-paper/50` palette in `MobileClipReel`.
- The clip counter at `top-4 right-4` and this hint at `top-4 left-1/2` will not overlap on any reasonable viewport because the hint is roughly `~140px` wide and centered.

## Acceptance criteria

1. On mobile in portrait orientation, a small "rotate for full view" hint with a phone-rotate glyph is visible at the top-center of the ClipReel section.
2. On mobile in landscape orientation (after rotating), the hint disappears.
3. The hint never appears on desktop (it lives inside `MobileClipReel` which only renders for touch devices).
4. The hint does not block tap-to-play, prev/next buttons, or progress dots.
5. Visual style matches existing mobile typography: `font-mono`, lowercase, `tracking-wider`, `~0.65rem`, `text-paper/60`.
6. No changes to `src/app/page.tsx` or any file outside `ClipReel.tsx`.
7. `pnpm build` passes; no new TypeScript or ESLint errors.

## Out of scope

- Animating the hint (no rotating phone wiggle). Keep it static and restrained.
- Hiding it after first rotation across sessions / localStorage. Cheap CSS-only behavior is fine.
- Changes to the desktop reel.
- Changes to `page.tsx`.

## Files touched

- `src/components/interactive/ClipReel.tsx` (single insertion inside `MobileClipReel`'s JSX)
