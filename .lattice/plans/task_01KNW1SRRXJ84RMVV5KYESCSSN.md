# ASMV-89: Add regression tests to prevent recurring video/mobile/layout bugs

Several issues have come back repeatedly because nothing catches them in CI. Establish a test floor that covers the bug classes the user keeps hitting:

- Playwright (or vitest + @testing-library + jsdom for unit) — pick the lighter option that still catches layout regressions.
- Smoke tests:
  * Homepage loads, hero canvas mounts, no console errors
  * Section 2 software image is roughly square at 375px wide AND at 1440px wide (snapshot or computed style)
  * ClipReel mounts on desktop AND mobile viewports without throwing
  * /archive InfiniteCanvas mounts without throwing
  * Studio desk title 'the studio desk' is present on the homepage
  * ArtifactBar shows >0 artifacts when content exists
- Visual regression: optional Playwright screenshots of homepage at 375 / 768 / 1440.

Wire into CI (GitHub Actions) so PRs that break any of these go red. Spec the test list with the user before building — testing infra is currently zero, so the first cut should be small and targeted.
