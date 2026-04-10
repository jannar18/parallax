# ASMV-85: ArtifactBar performance — slow load and gallery lag on /archive InfiniteCanvas

User reports the studio desk gallery feels slow, glitchy, and laggy. Investigate:

(1) ArtifactBar autoplays every video simultaneously (autoPlay loop muted on every <video> in the strip) — that's N concurrent video decodes. Use poster + IntersectionObserver-driven play instead.

(2) Image artifacts use Next/Image with width=600 height=800 unoptimized. unoptimized=true means we serve full-resolution originals straight from /public — no responsive variants. Determine if this is intentional (riso textures need pixel-perfect) or whether we can re-enable optimization.

(3) InfiniteCanvas (/archive) — pannable virtual surface with all entries rendered at once. Check if it's actually virtualizing or rendering all DOM nodes regardless of viewport. With many entries this scales linearly.

Goal: measure first (Chrome perf trace, network panel), then fix the biggest contributor. Don't optimize blindly.
