---
description: Capture a project as a looping GIF, publish it to the prototypes portfolio, and draft/post a console-log tweet.
argument-hint: "[focus hint] [--recording <file>] [--dir <path>] [--tweet-post] [--no-tweet]"
allowed-tools: Bash(node:*), Bash(git:*), Read, Glob, Grep
---

# /post-prototype

Publish the current project as the next **Prototype NN** in the portfolio — one command,
zero manual editing — and announce it on X (Twitter) in a console-log style with the GIF
attached.

Live site: **https://jannar18.github.io/prototypes/** · portfolio: **https://parallax.haus/work/software**

## Inputs

`$ARGUMENTS` may contain, in any order:

- **A focus hint** (free text) — what to show, e.g. `show the drag-and-drop canvas`.
- `--recording <file>` — use an existing screen clip (`.mov`/`.mp4`) instead of auto-capturing.
- `--dir <path>` — target a different project directory (default: the current working dir).
- `--tweet-post` — REAL-post to X for this run (spends ~$0.20 on X's paid API). Default is a $0 **draft**.
- `--no-tweet` — skip the tweet/draft step entirely.
- `--id prototype-NN` — update an existing entry in place instead of adding a new one.

The pipeline scripts live in `pipeline/` (relative to this repo root): `capture.mjs`,
`publish.mjs`, `tweet.mjs`. GIFs land in `public/lab/`, the manifest is `src/data/works.json`.

## Procedure

### 1. Understand the project

Read the target project (default: cwd, or `--dir`). Look at its `README`, entry files, and
`package.json` to understand **what it is** and **what to show**. If the user gave a focus hint,
honor it. Pick the single best moment that reads in ~6 seconds as a loop (a hover reveal, a
drag, a paste-and-transform — not a slow scroll).

Derive the **title** (short, human), a **one-sentence description** (what it does, present
tense, no fluff), and **3–5 tech tags** (lowercase, e.g. `webgl`, `threejs`, `react`, `framer`).

### 2. Capture the GIF

Auto-launch the app headless and record it, or convert the user's `--recording`.

```bash
# Static site (a dir of files):
node pipeline/capture.mjs --serve /path/to/site --out pipeline/.tmp/out.gif --width 1000 --fps 24 --duration 6

# Dev-server app (Vite/Next/etc.):
node pipeline/capture.mjs --start "pnpm dev" --port 3000 --cwd /path/to/app --out pipeline/.tmp/out.gif

# A single HTML file, or a live URL:
node pipeline/capture.mjs --file /path/to/index.html --out pipeline/.tmp/out.gif
node pipeline/capture.mjs --url https://example.com --out pipeline/.tmp/out.gif

# Convert an existing recording instead of driving the app:
node pipeline/capture.mjs --recording ~/Desktop/demo.mov --out pipeline/.tmp/out.gif
```

For a specific interaction (hover/click/drag), write a tiny interaction module and pass
`--script pipeline/interaction.mjs` (see `pipeline/interaction.example.mjs`). `capture.mjs`
optimizes to a clean looping GIF via a two-pass ffmpeg palette. **Requires `ffmpeg` and
Playwright's Chromium** (`npx playwright install chromium`).

### 3. Link the repo

`publish.mjs` derives the GitHub repo from the project's `git remote get-url origin`
automatically (pass `--project-dir <dir>`), or override with `--repo <url>`. Add `--url <live>`
if the project has a live deploy.

### 4. Publish (and tweet)

`publish.mjs` assigns the next `Prototype NN`, copies the GIF to `public/lab/<id>.gif`, updates
`src/data/works.json`, commits, and pushes (Vercel/Pages redeploys). It then calls `tweet.mjs`.

```bash
node pipeline/publish.mjs \
  --gif pipeline/.tmp/out.gif \
  --title "Grain Explorer" \
  --description "A live WebGL grain field that reacts to your cursor." \
  --project-dir /path/to/app \
  --tags "webgl,threejs,interactive" \
  --tweet                 # draft by default; add --tweet-post to REAL-post
```

**Tweet behavior:**
- **Draft (default, $0):** stages `pipeline/.tmp/draft-prototype-NNN.txt` + `.gif` for you to
  post manually. No credentials needed.
- **Real post:** happens only when `--tweet-post` is passed, or `X_AUTOPOST=true` in
  `pipeline/.env`. Requires the 4 X API keys in `pipeline/.env` (see `pipeline/.env.example`).
  Verify auth first with `node pipeline/tweet.mjs --check`.
- `--no-tweet` skips it. A tweet/draft failure never fails the publish — the prototype is
  already live.

### 5. The tweet format (console-log style)

`tweet.mjs` composes this (default `--style hybrid`, `--pad 3` → `001`):

```
> prototype[001] Grain Explorer
  ↳ A live WebGL grain field that reacts to your cursor.
  ↳ github.com/jannar18/grain-explorer
  ↳ parallax.haus/work/software
  #webgl #threejs #interactive
```

Other styles: `clean` (`prototype 001 — Title`), `console` (terminal only, no site/tags),
`full` (plain, with site + hashtags). Set with `--tweet-style`.

**≤280 characters, handled automatically.** The GIF is attached as media (X renders it as a
looping video), so it does not count against the limit — but the composed text does. `tweet.mjs`
auto-fits to 280 by trimming **only the description** back to a word boundary with an ellipsis
(the site card keeps the full version); it prints an `ℹ description auto-trimmed` note when it
does. No manual editing needed.

## Direct script use (no orchestration)

```bash
# Draft a tweet for an already-captured GIF, no posting:
node pipeline/tweet.mjs --number 1 --title "Stem" \
  --description "An elegant URL shortener that trims, brands, and tracks every link." \
  --repo https://github.com/jannar18/stem \
  --site https://parallax.haus/work/software \
  --tags "react,typescript,vite,product" \
  --gif pipeline/.tmp/out.gif --draft

node pipeline/tweet.mjs --check         # verify X credentials
node pipeline/tweet.mjs ... --dry-run   # print composed text only (no GIF/auth needed)
```

## Requirements

Node 22+, `ffmpeg`, Playwright Chromium, and (for real posting only) the 4 X API keys in
`pipeline/.env`. `pipeline/.env` is gitignored — never commit or print real keys. First run in
a fresh checkout: `cd pipeline && npm install`.
