# ASMV-74: Audit homepage & studio desk: bugs, performance, data loading, reload issues

Full analysis of the current site focusing on three areas:

1. **Home header animation** — Check for bugs in the hero canvas animation, scroll-triggered transitions, plane merge behavior. Verify it works consistently across reloads.

2. **Studio desk (/now) page** — Test scatter and masonry layouts for rendering bugs, data loading issues, image dimension calculation, popover behavior. Check for hydration mismatches or flicker on load.

3. **Homepage scroll behavior** — Investigate the full scroll flow (hero → split views → artifact bar → footer). Look for jank, layout shifts, broken intersection observers, or stale state.

4. **Data loading & system design** — Analyze content loading pipeline (MDX parsing, image dimension computation, getImageDimensions server-side). Check for:
   - Unnecessary re-renders or re-fetches
   - Heavy synchronous operations blocking render
   - Race conditions on fast navigation/reload
   - .next cache invalidation issues causing stale content
   - ChunkLoadError or hydration mismatches on cold start

5. **Reload issues** — Specifically test: hard refresh, back/forward navigation, direct URL entry, and dev server hot reload. Document any inconsistencies.

Deliverable: A findings document with categorized issues (critical/medium/low) and recommended fixes.
