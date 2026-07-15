# ASMV-110 — Fractal NYC page shots: hover/spin the node before entering

**Problem.** The 5 Fractal NYC house-page shots (`public/lab/shots/fractal-nyc-{visit,events,campus,education,publications}.mp4`) cut harshly from a ~0.4s glimpse of the octahedron straight into the house page. `pipeline/enter-page.mjs` clicks the *navbar link* after only a 300ms glimpse — it never touches the 3D node. Julianna wants the octahedron shown longer and the specific node hovered (grow + glow + label) — "hover or even a spin to click onto the node for that page" — before entering.

**Approach.**
- Freeze the scene deterministically with `prefers-reduced-motion` (auto-rotation `rotation.y += delta*0.12` is gated by `usePrefersReducedMotion`, so reduced motion pins rotation.y=0). Add an opt-in `CAPTURE_REDUCED_MOTION` env to `capture.mjs`'s `newContext` so this only affects fractal captures.
- Node screen coords at 1440×900 (frozen orientation), validated by hover probe (correct label pops for each): Visit (716,654), Events (716,242), Campus (922,450), Education (512,450), Story (718,464).
- Rewrite `enter-page.mjs` house branch: settle → glide mouse to the node → dwell ~1.5s (node grows to 1.8×, glow boosts, label shows) → `page.emulateMedia({reducedMotion:'no-preference'})` to un-freeze so the destination page's `FadeIn` entrances animate → click node (navbar-link fallback) → hold + slow scroll (unchanged).
- **Publications** node is occluded behind the front faces at rest → no reliable hover. Give it an extended octahedron dwell + un-freeze + navbar entry (softened, but no node-specific glow). Flag to Julianna.

**Key files:** `pipeline/enter-page.mjs`, `pipeline/capture.mjs`, regenerated `public/lab/shots/fractal-nyc-*.mp4`.

**Acceptance:** Each of the 5 shots opens on the octahedron (~1.5s+), the correct node visibly grows/glows/labels, then a smooth (un-frozen) entrance into the house page. No harsh instant cut. Preview approved by Julianna before committing all clips.

**Complexity:** medium. Interactive/creative — Julianna reviews via preview clips (her approval is the review gate) rather than a cold sub-agent.
