# ASMV-10: Homepage visual concept & wireframe

## Reset 2026-03-04 by agent:codex

Implement the first homepage wireframe directly in `src/app/page.tsx` as a real, scrollable layout that encodes narrative flow before final art direction.

### Scope
- Replace current minimal hero with a structured wireframe sequence.
- Keep palette restrained and token-aligned; use placeholder blocks where imagery/content will be refined.
- Focus on layout, hierarchy, and pacing across desktop and mobile.

### Planned Structure
- Hero thesis band with restrained nav context and primary statement.
- Bridge split section for architecture + software/AI practices.
- Selected work preview grid (balanced architecture/software cards).
- “Now / Studio Desk” preview section with latest-entry placeholder.
- Writing strip for intellectual thread.
- Footer brand field with quiet navigation.

### Implementation Notes
- Use existing Tailwind + token system (`max-w-content`, `text-ink`, surface tokens).
- Keep section primitives simple and reusable in-page for fast iteration.
- Avoid final visual treatment details (no heavy animation/webgl); wireframe fidelity only.

### Acceptance Criteria
- Homepage communicates identity + bridge in first viewport and first 60 seconds.
- Scroll order matches Asimov-inspired editorial pacing (thesis -> bridge -> proof -> living signal).
- Mobile layout remains coherent with clean stacking and spacing.
- Code is ready for next task (`ASMV-14 Homepage frontend build`) to layer in final visuals.
