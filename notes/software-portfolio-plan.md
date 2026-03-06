# Software Portfolio Plan

Reference document for Lattice tasks implementing the software portfolio section.

## Live Projects

| Project | URL | Stack | Notes |
|---------|-----|-------|-------|
| **Schelling Points** | `schellingpoints.ulyssepence.com` | React 19 + Express + WebSocket | Team project (Hart, Marianne, Julianna, Ulysse) |
| **Arch Cupid Matchmaker** | `arch-cupid-t0ptu.sevalla.app` | React 19 + Claude API + Supabase | Solo — chatbot for architecture |
| **Rainbow Crawler** | `enchanted-rainbow-dungeon-crawler.netlify.app` | PixiJS 8 + TypeScript + Vite | Solo — dungeon crawler game |
| **Snails vs Garden** | `tic-tac-toe-sp-2026-anna-fj3n3.sevalla.app` | TBD (check repo) | Solo — reskinned tic tac toe |

## Portfolio Presentation

- **Grid/scroll overview** at `/work/software/` — short cards with Riso-processed thumbnail, title, one-liner, tech stack pills
- **Click-through detail pages** at `/work/software/[slug]` — real (unprocessed) screenshots, problem → approach → media showcase → links
- **Schelling Points** presented as team project with collaborator credits; others are solo
- **Image treatment rule:** Riso for thumbnails/cards only. Detail pages show actual app screenshots.

## Visual Capture Plan

**Per project, capture:**
- 1 hero screenshot (best state of the app)
- 1-2 supporting screenshots (different screens/states)
- 1 GIF (5-10s interaction loop) — optional but ideal
- 1 short video (15-30s) — optional

**Capture tools (macOS):**
- `Cmd+Shift+4` for quick region screenshots
- Kap (`brew install --cask kap`) for GIFs and video
- Shottr (`brew install --cask shottr`) for pixel-perfect screenshots

**What to capture per project:**

| Project | Shots |
|---------|-------|
| **Schelling Points** | Game lobby, round in progress, scoring/results, mobile view |
| **Arch Cupid** | Chat interface mid-conversation, sidebar with multiple chats, login |
| **Rainbow Crawler** | Dungeon gameplay with characters/enemies, start screen |
| **Snails vs Garden** | Game board mid-game |

**Note:** Schelling Points is multiplayer — capturing a full round needs multiple players or multiple browser tabs.

## Content Structure

MDX files in `src/content/work-software/`:

```yaml
# Frontmatter template (matches SoftwareProject type in src/lib/content.ts)
---
title: Project Name
subtitle: One-liner
date: YYYY-MM-DD
stack: [tech, stack, items]
role: Solo Developer | UX Designer
team: [optional collaborator list]
url: https://live-url.com
repo: https://github.com/jannar18/repo
heroImage: /work/software/project/hero.png
order: 1
---
```

Body follows mini case study format:
- **The Idea** — 1-2 sentences
- **How It Works** — interesting technical/design decisions
- Media woven throughout

## Content Pipeline Practice

Before building portfolio pages, practice the `/update` skill by creating a combined Now entry about reviewing all 4 projects. This tests the content pipeline and generates the first set of Riso-processed thumbnails.

**Flow:** Take screenshots → save to `~/Documents/Artifacts/raw/` → run `/update` → Riso process → generate Now entry MDX → validate build → commit.

## File Organization

```
public/work/software/
├── schelling-points/
│   ├── thumb.png        # Riso-processed (for grid card)
│   ├── hero.png         # Real screenshot (for detail page)
│   └── ...              # Additional real screenshots
├── arch-cupid/
├── rainbow-crawler/
└── snails-vs-garden/
```

## Key Files

| File | Purpose |
|------|---------|
| `~/.claude/commands/update.md` | `/update` skill definition |
| `notes/update-skill-steps.md` | Content pipeline manual spec |
| `scripts/riso_engine.py` | Riso image processing |
| `src/lib/content.ts` | Content loading (`NowEntry`, `SoftwareProject` types) |
| `src/content/work-software/` | Software project MDX files |
| `src/app/work/software/page.tsx` | Software portfolio listing page |
| `src/app/work/software/[slug]/page.tsx` | Software project detail page |
