# ASMV-105 — Recapture: append Vellum + Secret Garden

## Scope
APPEND-ONLY to `src/data/works.json`: two new entries (vellum #11, secret-garden #12).
Do NOT modify the 10 existing works, page.tsx, content.ts, or pipeline. No commit/push.

## Approach
1. Vellum (easy): capture `~/vellum-explorer.html` via pipeline/capture.mjs with an
   interaction script that drives the Motion sliders (speed>0) so the translucent
   sheets drift. Save public/lab/vellum.gif (<6MB), verify visually, append entry.
   date 2026-06-20 is a FLAGGED placeholder.
2. Secret Garden (hard): clone jannar18/secret-garden into scratchpad, inspect
   camera/scene, frame the LIT FRONT of the cottage, hide dev GUI, capture gentle
   motion → public/lab/secret-garden.gif. Append entry. Flag if framing is poor.

## Acceptance
- works.json parses; both new entries present; all referenced media resolves.
- `npx tsc --noEmit` clean. Report both entries + flags.
