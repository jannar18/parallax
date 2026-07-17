# ASMV-112: Update resume: add Renoverse entry, retitle Fractal role, close open-ended dates

Content-only edit to all three resume sources, keeping formatting identical:
`src/app/about/page.tsx` (website), `scripts/generate-resume-pdf.mjs` (generates the live PDF), `src/lib/resume-pdf.tsx` (orphaned but kept in sync).

Four changes:
1. Renoverse AI — website: add new first Experience entry; PDF sources: replace the "AI Engineer Intern … Building AI-powered product experiences for architects" placeholder. Role "Design Engineering Intern", dates "May 2026", full description supplied by Julianna.
2. Fractal Tech NYC — role "Software Developer" → "Software/AI Engineer".
3. Fractal Tech NYC — dates "Feb 2026 — present" → "Feb 2026 — May 2026".
4. Anderson Presidential Scholarship — "2022 — present" → "2022 — May 2025".

Then regenerate `public/Julianna-Roberts-Resume.pdf`. No other content or formatting touched.
