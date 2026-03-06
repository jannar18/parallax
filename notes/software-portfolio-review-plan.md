# Plan: Software Portfolio Review & `/update` Skill Practice

## Context

Julianna has 4 live software projects she wants to document for her Parallax personal site. Rather than jumping straight to portfolio page implementation, she wants to **practice the `/update` content pipeline** — visiting each project, capturing visuals, and creating a combined Now entry about reviewing her software work. This serves two purposes: (1) practice the daily content pipeline, and (2) gather media that will later feed into the `/work/software/` portfolio pages.

## Live Projects

| Project | URL | Stack | Notes |
|---------|-----|-------|-------|
| **Schelling Points** | `schellingpoints.ulyssepence.com` | React 19 + Express + WebSocket | Team project (Hart, Marianne, Julianna, Ulysse) |
| **Arch Cupid Matchmaker** | `arch-cupid-t0ptu.sevalla.app` | React 19 + Claude API + Supabase | Solo — chatbot for architecture |
| **Rainbow Crawler** | `enchanted-rainbow-dungeon-crawler.netlify.app` | PixiJS 8 + TypeScript + Vite | Solo — dungeon crawler game |
| **Snails vs Garden** | `tic-tac-toe-sp-2026-anna-fj3n3.sevalla.app` | TBD (check repo) | Solo — reskinned tic tac toe |

## Steps

### Step 1: Verify All 4 Projects Are Running

Visit each URL in the browser and confirm the apps load and function:
- **Schelling Points** — does the lobby load? Can you create/join a game?
- **Arch Cupid** — does the chat interface render? Can you send a message?
- **Rainbow Crawler** — does the game start? Can you move/play?
- **Snails vs Garden** — does the game board render? Can you play?

For SPAs (all of these are), WebFetch won't render them — need to use the browser or Claude-in-Chrome/iOS Simulator MCP for verification if we want agent validation. Otherwise, Julianna confirms manually.

### Step 2: Capture Screenshots

Take at least 1-2 screenshots per project showing the app in its best state:

| Project | What to capture |
|---------|----------------|
| **Schelling Points** | Game lobby, a round in progress, scoring/results |
| **Arch Cupid** | Chat interface with a conversation, sidebar with multiple chats |
| **Rainbow Crawler** | Dungeon gameplay with characters and enemies |
| **Snails vs Garden** | Game board mid-game |

**How to capture:**
- **Manual:** `Cmd+Shift+4` (macOS region screenshot) — fastest, Julianna selects the best frame
- **Kap:** `brew install --cask kap` for GIFs/video if desired
- **Shottr:** `brew install --cask shottr` for pixel-perfect screenshots

**Save raw screenshots to:** `~/Documents/Artifacts/raw/` (the `/update` skill's default input directory)

### Step 3: Run `/update` Skill

Invoke the `/update` skill to create the combined Now entry. The skill will:

1. **Discover** raw images from `~/Documents/Artifacts/raw/`
2. **Riso process** them via `scripts/riso_engine.py` (applies the brand's warm/stipple aesthetic)
3. **Copy** processed images to `public/images/now/2026-03-06/` (or today's date)
4. **Gather input** — mood, project, description from Julianna
5. **Generate MDX** at `src/content/now/YYYY-MM-DD.mdx`
6. **Validate** with `pnpm build`
7. **Commit**

**Suggested entry content:**
```yaml
---
date: "2026-03-06"
mood: "reviewing"
tags: ["software", "portfolio", "projects"]
image: /images/now/2026-03-06/software-review.png  # hero/composite image
project: "parallax.studio"
description: "Reviewing live software projects — Schelling Points, Arch Cupid, Rainbow Crawler, Snails vs Garden"
---
```

Body would reference all 4 projects with their screenshots and brief descriptions in the studio-desk voice.

### Step 4: Verify Entry Renders

- Run `pnpm dev` and check the Now page to see the new entry
- Confirm images display correctly
- Confirm entry appears in the ArtifactBar (since it has an image)

### Step 5: Save Visuals for Future Portfolio Use

Two versions of each screenshot serve different purposes:

| Context | Image treatment | Why |
|---------|----------------|-----|
| **Thumbnails / cards** (grid overview, Now entries) | Riso-processed | Matches the brand's warm, textured aesthetic |
| **Project detail pages** | Raw / unprocessed | Show the actual app — real UI, real colors, real interactions |

Save both versions to a staging location for the future `/work/software/` pages:

```
public/work/software/
├── schelling-points/
│   ├── thumb.png        # Riso-processed (for grid card)
│   ├── hero.png         # Real screenshot (for detail page hero)
│   └── ...              # Additional real screenshots
├── arch-cupid/
├── rainbow-crawler/
└── snails-vs-garden/
```

This is prep work — the actual software portfolio pages will be built in a separate task.

## Key Files

| File | Purpose |
|------|---------|
| `~/.claude/commands/update.md` | `/update` skill definition |
| `notes/update-skill-steps.md` | Content pipeline manual spec |
| `scripts/riso_engine.py` | Riso image processing script |
| `src/content/now/*.mdx` | Existing daily entries (4 so far) |
| `src/lib/content.ts` | Content loading utilities (`NowEntry`, `SoftwareProject` types) |
| `public/images/now/` | Processed daily images |

## What Julianna Does vs What the Agent Does

| Step | Who |
|------|-----|
| Verify projects work in browser | Julianna (SPAs need real browser) |
| Take screenshots | Julianna (manual `Cmd+Shift+4`, saves to `~/Documents/Artifacts/raw/`) |
| Run Riso processing | Agent (via `/update` skill) |
| Provide mood/description | Julianna (interactive prompt) |
| Generate MDX, validate, commit | Agent (via `/update` skill) |
| Review final entry | Julianna |

## Verification

- [ ] All 4 project URLs confirmed working in browser
- [ ] At least 1 screenshot per project saved to `~/Documents/Artifacts/raw/`
- [ ] Riso processing runs successfully on screenshots
- [ ] New Now entry created at `src/content/now/YYYY-MM-DD.mdx`
- [ ] Entry renders correctly on the Now page
- [ ] `pnpm build` passes
- [ ] Changes committed

## Prerequisite Note

`numpy` is not installed — run `pip3 install numpy` before the Riso engine will work.
