# ASMV-113: Refresh Fractal Tech metrics to final May 2026 totals; unify website + PDF wording

The Fractal Tech NYC experience line drifted out of sync: website had older wording + stale numbers
(6+ apps · 451+ commits · 168+ PRs, set 2026-03-25); PDF sources had richer wording + newer numbers
(10+ apps · 528+ commits · 370+ PRs, set 2026-04-17).

Real GitHub totals for jannar18, Feb 1 – May 31 2026: 1,056 commits, 440 PRs (411 merged).
Julianna chose rounded "1,000+ commits and 400+ PRs" and to keep "10+ apps".

Action: set the Fractal description to ONE identical string in all three sources — the richer PDF wording
(mentions RhinoMCP, 3D modeling, architecture-software integration) with numbers updated to
"1,000+ commits and 400+ PRs". Files: src/app/about/page.tsx (full string replace),
scripts/generate-resume-pdf.mjs and src/lib/resume-pdf.tsx (number swap only — wording already matches).
Regenerate public/Julianna-Roberts-Resume.pdf. Nothing else touched.
