# ASMV-92: Fix popover cards on /work/software and /archive (mobile + shared bug)

## TL;DR

The user reported "popover cards broken on mobile" on two pages. Investigation shows **two distinct root causes**, not a shared bug. Despite the user's intuition, hover-vs-touch is not the issue — both surfaces already have touch-aware code paths. Recommend keeping this as a single task (one PR, one wave), but treating it as two independent fixes documented below. No sub-task split needed; the changes touch disjoint files.

## Root cause #1 — `/archive` (InfiniteCanvas + MasonryLayout + ArtifactPopover)

**The popover opens correctly on tap** — `onClick` fires on touch and `hasDragged` guards prevent accidental triggers. But the popover is then **unusable / unclosable** on mobile because of how it nests inside the canvas container.

Specific problems found in `ArtifactPopover.tsx` and its callers (`InfiniteCanvas.tsx`, `MasonryLayout.tsx`):

1. **Pointer-capture leak.** When a user taps an artifact, `handlePointerDown` in the canvas calls `containerRef.current?.setPointerCapture(e.pointerId)`. The pointer remains captured by the canvas container for the duration of that touch. Then `onClick` fires, `setActiveEntry(entry)` runs, React re-renders, and `<ArtifactPopover>` mounts **as a child of the canvas container** (line 733 of InfiniteCanvas, line 538 of MasonryLayout). On mobile, the released pointer-capture timing + nested DOM means the next tap on the scrim or Close button can get re-routed to the canvas container's `onPointerDown` instead of the popover's `onClick`. Result: tapping the scrim or Close looks like a no-op, and any subsequent drag pans the canvas behind the popover.

2. **`touch-action: none` propagates to the dialog.** The canvas container sets `style={{ touchAction: "none" }}` to disable native scroll for pan/zoom. Because `ArtifactPopover` is a descendant in the React tree (and the DOM tree), browsers apply that touch-action on descendants too — meaning scrolling the popover's content area (e.g., the image overflows on narrow screens) is silently disabled and tap recognition can also be affected.

3. **z-index works, layout doesn't — but that's secondary.** `z-[60]` scrim + `z-[70]` dialog are above the canvas's `z-10` grain overlay; positioning is fine. The real problem is event routing, not stacking.

4. **No mobile-specific layout for the popover content.** The popover uses `p-8`, `max-w-3xl`, and a flex row with the `Esc` close affordance on the right. On a 375px-wide phone the metadata column + "Esc" button cramp the date/description, the image's `max-h-[75vh]` plus `p-6` make it fit poorly, and a textual "Esc" close target is meaningless on touch.

**Fix:**
- Render `<ArtifactPopover>` via a **portal to `document.body`** instead of as a child of the canvas container. This severs the pointer-capture parent chain and the `touch-action: none` inheritance. Use `createPortal` from `react-dom`. Guard with a `mounted` state for SSR safety.
- On `setActiveEntry`, **release any active pointer capture** explicitly (loop over `pointers.current` keys and call `releasePointerCapture`) and reset `isDragging.current = false; isPinching.current = false; velocity.current = {x:0,y:0}`. Belt-and-suspenders against stuck-pointer state.
- In `ArtifactPopover`'s root scrim/dialog divs, add `style={{ touchAction: "auto" }}` to override any inherited `touch-action: none` so the image area behaves natively.
- Replace the close-label "Esc" with a visible close glyph (×) that's at least 44×44 (Apple HIG minimum tap target). Keep an `sr-only` label "Close" for a11y.
- Ensure the dialog content uses `overflow-y-auto` and `max-h-[90dvh]` (dvh, not vh — handles iOS Safari's dynamic viewport) so on small phones the user can scroll the popover if needed.

## Root cause #2 — `/work/software` (parallel-route panel)

The intercepting parallel route (`/work/software/@panel/(.)[slug]/page.tsx`) renders a `<ProjectPanel>` overlay when a user clicks a project card. The route *opens* fine on mobile (Next.js soft navigation works); the **panel layout is desktop-only** and breaks at narrow viewports.

Specific problems in `@panel/(.)[slug]/page.tsx` + `ProjectPanel.tsx`:

1. **Hard-coded `w-[18%]` text column.** On a 375px viewport this is ~67px wide — text wraps to 2-character columns and is unreadable.
2. **Hard-coded `75vh` height row of videos/screenshots** in a horizontal `overflow-x-auto`. On a phone in portrait, items are nearly viewport-tall; horizontal scrolling competes with the page's body-scroll lock and feels broken.
3. **`HoverVideo`** has both hover and click handlers — touch fallback works for the hero video (tap toggles play). Not the primary bug, but `onClick` next to a horizontal-scroll container can mis-fire on mobile (a swipe to scroll fires click on the video element). Acceptable but worth noting.
4. **Close button at fixed `top-6 right-6`** — likely covered by a notched device's safe-area or the site Header. Should respect `env(safe-area-inset-top)`.
5. **Body scroll lock works** (`document.body.style.overflow = "hidden"`) — fine.
6. **`-translate-y-1/2 top-1/2 h-[75vh]`** — on small phones in portrait, 75vh leaves only ~12.5vh top/bottom. Combined with the close button at `top-6`, the close button can sit *inside* the panel's visual area, not above it. Visually confusing.

**Fix:**
- Add a mobile breakpoint variant to the panel content layout in `(.)[slug]/page.tsx`. Below `md` (768px):
  - Stack vertically: text column on top (`w-full`), media row below.
  - Reduce media row height to a sensible mobile aspect (e.g., `h-[45vh]` or auto with `max-h-[60dvh]`).
  - Allow the entire panel to scroll vertically.
  - Concretely: change the outer flex from `flex h-full w-[18%]` (left) + `flex-1 ... overflow-x-auto` (right) to `flex-col md:flex-row`, `w-full md:w-[22%]`, and let the right side become `overflow-x-auto` only on `md+` (or keep horizontal-scroll but with shorter mobile height).
- In `ProjectPanel.tsx`:
  - Replace `h-[75vh]` with `max-h-[90dvh]` and let inner content control height; switch the inner container to `overflow-y-auto` so content can scroll if it overflows on mobile.
  - Use `top: max(1rem, env(safe-area-inset-top))` for the close button and bump z-index to ensure it floats above the panel content on mobile.
  - Use `dvh` instead of `vh` for any viewport-relative sizing (iOS Safari address-bar dynamic viewport).
- Verify the listing's `<Link>` navigation works on touch (it should — it's a plain `<Link>`; we don't need to change it).

## Files to touch

| File | Change |
|------|--------|
| `src/components/interactive/ArtifactPopover.tsx` | Portal to body; touch-action auto; mobile content layout; visible × close button; `dvh` units; `overflow-y-auto` |
| `src/components/interactive/InfiniteCanvas.tsx` | Release pointer capture + reset drag/pinch state when opening popover |
| `src/components/interactive/MasonryLayout.tsx` | Same pointer-capture cleanup on item click |
| `src/app/work/software/@panel/(.)[slug]/page.tsx` | Mobile-stacked layout (`flex-col md:flex-row`, full-width text column on mobile, smaller media row) |
| `src/components/ui/ProjectPanel.tsx` | `dvh` instead of `vh`; `max-h` + scroll on mobile; safe-area inset on close button; mobile-aware sizing |

## Approach (implementation order)

1. **Portal `ArtifactPopover`.** Easiest, biggest win. Test on physical mobile or DevTools touch emulation: tap an artifact in `/archive` (both layouts), verify scrim tap closes, × button closes, Escape closes, and the canvas behind doesn't pan.
2. **Pointer-capture cleanup in canvas components.** Add a small helper inside the click handler — iterate `pointers.current.keys()` and call `containerRef.current?.releasePointerCapture(id)`, clear the map, and reset `isDragging`/`isPinching`/`velocity` — before calling `setActiveEntry`.
3. **Popover mobile content polish.** Bigger × close glyph, `max-h-[90dvh]`, `overflow-y-auto`, `touchAction: "auto"`. Keep the typographic style consistent with the rest of the site.
4. **Software panel mobile layout.** Convert flex direction in `(.)[slug]/page.tsx`, drop `w-[18%]`, replace fixed `75vh` with responsive media height.
5. **`ProjectPanel` mobile polish.** `dvh`, safe-area inset on close, scrollable container.

Run `pnpm build` after each step to catch type/lint errors. Manual smoke test in DevTools at iPhone 12 Pro (390×844) and iPhone SE (375×667).

## Acceptance criteria

- [ ] On `/archive` mobile (both `scatter` / InfiniteCanvas and `masonry` / MasonryLayout): tap an artifact opens the popover; scrim tap, × button, and Escape all close it; the canvas does not pan while the popover is open or in response to taps inside the popover.
- [ ] On `/archive` mobile: popover content (image + metadata) is readable, the image is constrained to the viewport, and metadata wraps cleanly. The × close button is at least 44×44.
- [ ] On `/work/software` mobile (<768px): tapping a project card opens the panel; the panel stacks vertically with a readable full-width text column and a reasonable media row height; the close button is visible, not obscured by the site header or device notch, and works on tap.
- [ ] On both pages, no regressions on desktop (>=md): popovers/panels look the same as before this change.
- [ ] `pnpm build` is clean; `pnpm lint` is clean.
- [ ] No new dependencies (use built-in `react-dom` `createPortal`).

## Why we are NOT splitting this task

- The two fixes touch disjoint files and disjoint concerns, but they're both small and both block the same mobile-polish wave.
- Splitting adds Lattice overhead (two plans, two reviews) for no parallelism gain — same implementer can do both on one branch in under a session.
- The user reported them as one issue and expects a single PR.
- If the reviewer pushes back during review, splitting at review time is cheap; we'd file ASMV-92a/92b from the existing diff.

## Out of scope

- Redesigning the studio-desk artifact card (ASMV-64 territory).
- Changing the parallel-route mechanic itself (still useful for desktop "open in panel" UX).
- Refactoring `InfiniteCanvas`/`MasonryLayout` shared code (heavy duplication, but a separate refactor task).
- Hover/click behavior in `HoverVideo` — already has touch fallback; not the reported bug.

## Complexity

`medium` — investigation done; implementation is straightforward but spans 5 files and two visual surfaces, both requiring manual mobile testing in DevTools touch emulation.
