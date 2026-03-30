# ASMV-80: Hero auto-animate on page load

Replace scroll-driven rotation in HeroBrandVisual with a timed entrance animation.

## Approach
- Remove the scroll event handler that maps scroll position → `rotation`
- Add a timed animation: after ~2s delay on page load, smoothly animate `rotation` from 0 → 1 over ~4s using ease-in-out
- Keep all other behavior: photo slideshow, wireframe parallax, mouse tracking, intersection observer
- The scroll hint text can be removed since scrolling no longer drives the animation

## Files
- `src/components/interactive/HeroBrandVisual.tsx` — replace scroll handler with timer + animation logic
