# ASMV-48: Optimize hero canvas performance on mobile

Hero canvas renders 80 slices × 2 during crossfade = 160 drawImage calls/frame plus wireframe rendering. No quality degradation path for mobile devices. User reports noticeable jank on mobile. Investigate: reduce slice count on mobile, skip crossfade, use requestAnimationFrame throttling, or degrade to static image below a viewport threshold. File: src/lib/hero-canvas.ts. Found by Claude Critical review (C9), confirmed by user.
