# ASMV-103 — Add secret-garden + renoverse-ai works (Agent D)

## Scope
APPEND two entries to src/data/works.json (renoverse-ai #11, secret-garden #10). Capture media into public/lab/ and public/lab/shots/. Do NOT touch page.tsx, content.ts, pipeline/. No commit/push.

## Approach
1. renoverse-ai: serve ~/Dev/renoverse-ai-website static site via pipeline/capture.mjs --serve, capture hero GIF; capture home/about/demo/solutions screenshots via playwright.
2. secret-garden: Vite + three.js WebGL app w/ ws multiplayer. npm install in scratchpad, run vite dev, drive overlay + camera motion via custom interaction script, capture GIF of 3D env in motion. Screenshots too.
3. Append entries; validate JSON parses; npx tsc --noEmit clean.

## Acceptance
- 2 new entries validate against Work schema; all media paths exist under public/lab; existing 9 untouched; tsc clean.
