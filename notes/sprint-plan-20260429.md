# Sprint plan — 2026-04-29 mobile-polish wave

Reported issues batch from 2026-04-29. After dedup, five active high-priority tasks remain. All five touch disjoint files and can run as parallel agents in a single wave.

## Active tasks (high priority)

| Task | Title | Primary files |
|------|-------|---------------|
| ASMV-86 | Mobile: 'Software Development + AI Research' image squishes — should stay square | `src/app/page.tsx` (Section 2 image block), possibly `tailwind.config.ts` |
| ASMV-87 | Hero brand visual — wireframe nodes don't animate on mobile / smaller viewport | `src/components/interactive/HeroBrandVisual.tsx`, `src/lib/hero-canvas.ts` |
| ASMV-92 | Fix popover cards on /work/software and /archive (mobile) | `src/components/interactive/ArtifactPopover.tsx`, `src/app/work/software/{layout,page}.tsx`, `src/app/work/software/@panel/(.)[slug]/page.tsx` |
| ASMV-95 | Add 'rotate phone' prompt to video clip section on home page (mobile) | `src/components/interactive/ClipReel.tsx` (constrain to component — do NOT touch `page.tsx`) |
| ASMV-96 | Reorder mobile nav and footer nav | `src/components/global/Header.tsx`, `src/components/global/Footer.tsx` |

## Cancelled / superseded
- **ASMV-91** — Cancelled. Resume PDF already at `public/Julianna-Roberts-Resume.pdf`, linked via `PrintButton.tsx`. No work needed.
- **ASMV-93** — Duplicate of ASMV-87. Cancelled.
- **ASMV-94** — Duplicate of ASMV-86. Cancelled.

## Done
- **ASMV-97** — Relocated pretext link from home to /archive. Branch `feature/ASMV-97-relocate-pretext` ready to push.

## Conflict matrix

```
                page.tsx  Hero*  hero-canvas  ArtifactPopover  software/*  ClipReel  Header  Footer
ASMV-86            X
ASMV-87                    X         X
ASMV-92                                              X              X
ASMV-95                                                                          X
ASMV-96                                                                                    X       X
```

No two active tasks touch the same file. Safe to parallelise all five.

## Constraint notes for agents
- **ASMV-95**: Implement the rotate-phone prompt entirely inside `ClipReel.tsx` (or a sibling component imported from inside ClipReel). Do NOT modify `src/app/page.tsx` — that file is owned by ASMV-86 in this wave.
- **ASMV-92**: Two popover implementations exist — the parallel-route panel under `/work/software/@panel/...` and the `ArtifactPopover` overlay used by `InfiniteCanvas`/`MasonryLayout` on `/archive`. Investigate whether the bug is shared (touch-vs-hover handling) or separate; split into sub-tasks if root causes diverge.
- **ASMV-86**: Likely a `aspect-square` or fixed-aspect container fix on the Section 2 image. Don't refactor unrelated sections of `page.tsx`.
- **ASMV-96**: Mobile menu (Header.tsx mobile drawer) + Footer.tsx footer nav only. Desktop header order is unchanged.
- **ASMV-87**: Mobile/small-viewport static animation. Likely a media-query, IntersectionObserver, or RAF-gating issue. Verify on viewport <768px.

## Recommended order
All five can be claimed in parallel by separate agents. If serialising, suggested order is:
1. **ASMV-96** (smallest scope, no JS logic) — quick win.
2. **ASMV-86** (small CSS fix).
3. **ASMV-95** (component-scoped UI add).
4. **ASMV-87** (animation debugging).
5. **ASMV-92** (popover bug — likely the deepest investigation).
