# ASMV-106: Recapture Stem + Relief Hover GIFs at 1000px pipeline quality (overwrite prototype-01/02)

Re-capture two local prototypes at updated pipeline quality (width 1000, fps 24, ~6s, <6MB) and OVERWRITE existing media in `public/lab/` (same filenames, no works.json change).

## Approach
- Use `pipeline/capture.mjs` with custom interaction scripts (in scratchpad).
- **Stem** (`~/stem`, Vite): `--start "npm run dev -- --port 5188"` on port 5188. Interaction script mocks `POST /urls` via `page.route` (backend on :3000 is unrelated), types a long URL, clicks Trim, shows the branded short link. -> `public/lab/prototype-01.gif`.
- **Relief Hover** (`~/Dev/wild week rebuild/tool`, static WebGL): `--serve` the tool dir (capture's own static server, no port conflict). Interaction script traces a smooth cursor path across `#stage` so the light-follows-cursor reveal animates. -> `public/lab/prototype-02.gif`.

## Acceptance
- Both GIFs overwritten in place, ~1000px wide, <6MB, verified visually (Read).
- No edits to works.json/page.tsx/content.ts; no publish; no commit/push.
