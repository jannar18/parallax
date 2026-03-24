# Software Portfolio Execution Plan

**Created:** 2026-03-24
**Projects:** 4 (Schelling Points, Arch Cupid, Rainbow Crawler, Snails vs Garden)
**Approach:** Grid first → project pages via collaborative dialogue
**Screenshots:** Not yet captured — session needed before pages can be finalized

---

## Overview

```
Phase 0: Screenshot Capture          ← Julianna (manual)
Phase 1: Build Listing Grid          ← Agent (ASMV-31)
Phase 2: Project Pages (×4)          ← Collaborative (dialogue per project)
Phase 3: Polish & Connect            ← Agent + review
```

---

## Phase 0: Screenshot Capture Session

**Who:** Julianna
**When:** Before Phase 2 (Phase 1 grid can use placeholders)
**Time:** ~30 minutes

### Per Project, Capture:

| Project | What to capture | URL |
|---------|----------------|-----|
| **Schelling Points** | Game lobby, round in progress, scoring/results | `schellingpoints.ulyssepence.com` |
| **Arch Cupid** | Chat interface mid-conversation, sidebar with chats | `arch-cupid-t0ptu.sevalla.app` |
| **Rainbow Crawler** | Dungeon gameplay with characters/enemies, start screen | `enchanted-rainbow-dungeon-crawler.netlify.app` |
| **Snails vs Garden** | Game board mid-game, start screen | `tic-tac-toe-sp-2026-anna-fj3n3.sevalla.app` |

### Per Project, Target:
- **1 hero screenshot** — best visual state of the app
- **1–2 supporting screenshots** — different screens/states
- **1 GIF (optional)** — 5–10s interaction loop (use Kap: `brew install --cask kap`)

### File Organization:
```
Save raw captures to:  ~/Documents/Artifacts/raw/software/

Organized by project:
  ~/Documents/Artifacts/raw/software/schelling-points/
  ~/Documents/Artifacts/raw/software/arch-cupid/
  ~/Documents/Artifacts/raw/software/rainbow-crawler/
  ~/Documents/Artifacts/raw/software/snails-vs-garden/
```

After capture, agent processes images through Riso engine for thumbnails and copies originals for detail pages:
```
public/work/software/
├── schelling-points/
│   ├── thumb.png          # Riso-processed (listing grid card)
│   ├── hero.png           # Real screenshot (detail page)
│   ├── screenshot-01.png  # Supporting screenshots
│   └── screenshot-02.png
├── arch-cupid/
├── rainbow-crawler/
└── snails-vs-garden/
```

---

## Phase 1: Build Listing Grid (ASMV-31)

**Lattice task:** ASMV-31
**Dependency:** None (can use placeholder images)
**Deliverable:** Working `/work/software/` page with project cards

### What gets built:
- Grid/scroll layout showing all 4 projects as cards
- Each card: Riso-processed thumbnail, project title, one-liner, tech stack pills
- Click-through to `/work/software/[slug]`
- Responsive: 2-col on desktop, single column on mobile
- Matches Asimov editorial restraint — not a flashy gallery

### Design decisions to make:
- Card aspect ratio and image treatment
- Stack pills styling (mono font? ink-lighter text?)
- Sort order (manual via `order` frontmatter field)
- Whether to show "featured" badge or just use ordering

### Can start immediately — placeholder cards with project names while screenshots are pending.

---

## Phase 2: Project Pages (Collaborative Dialogue)

**One Lattice task per project. One dialogue session per project.**

The pattern for each project:

```
1. Agent asks structured questions about the project
2. Julianna answers (voice, context, decisions, what's interesting)
3. Agent synthesizes answers into MDX draft
4. Julianna reviews/edits
5. Agent commits final version
```

### Questions template (asked per project):

1. **What's the one-liner?** — If you had to describe this in one sentence to someone at a party, what would you say?
2. **What was the spark?** — Why did you build this? What problem or idea kicked it off?
3. **What's technically interesting?** — Any decision, architecture choice, or hack you're proud of or found interesting?
4. **What did you learn?** — Anything surprising, hard, or new that came out of building this?
5. **What's the current state?** — Is it done? Evolving? Abandoned? What would you change?
6. **Team or solo?** — Who worked on it? What was your specific role?
7. **What should someone notice?** — If they click through and play with it, what's the highlight?

### MDX structure (per project):

```yaml
---
title: "Project Name"
description: "One-liner from dialogue"
date: "YYYY-MM-DD"
stack: ["Tech", "Stack", "Items"]
url: "https://live-url.com"
repo: "https://github.com/jannar18/repo"
heroImage: "/work/software/project-slug/hero.png"
order: N
featured: true/false
---
```

Body structure (mini case study, NOT a resume entry):
- **The idea** — 1–2 sentences setting context
- **Screenshot/media** — hero image or GIF
- **How it works** — interesting technical/design decisions (from dialogue)
- **Supporting screenshots** — woven into narrative
- **Links** — live URL, repo (if public)

### Project order & Lattice tasks:

| # | Project | Lattice | Notes |
|---|---------|---------|-------|
| 1 | **Schelling Points** | ASMV-34 | Team project — needs collaborator credits |
| 2 | **Arch Cupid** | ASMV-33 | Solo — Claude API integration is the hook |
| 3 | **Rainbow Crawler** | ASMV-32 | Solo — game dev, PixiJS, visual |
| 4 | **Snails vs Garden** | — | Needs new Lattice task (not yet created) |

### Suggested session flow:
Do all 4 dialogues in one sitting (or two). Each dialogue takes ~5–10 minutes. Agent drafts MDX between sessions. Julianna reviews all 4 drafts in a batch.

---

## Phase 3: Polish & Connect

After all 4 project pages and the grid are live:

1. **Cross-link from homepage** — featured software projects surface on home
2. **Work overview page** (`/work/page.tsx`) — currently has simple links, may want featured highlights
3. **Image treatment pass** — verify Riso thumbnails look good, detail page screenshots render well
4. **Mobile QA** — check all pages on mobile viewport
5. **Build verification** — `pnpm build` passes, all static pages generate

---

## Deferred (Not in This Sprint)

These Lattice tasks exist but are not included in the current 4-project scope:
- **ASMV-35:** Risograph pipeline as portfolio piece
- **ASMV-75:** WisprFlow

Can be added later using the same pattern (dialogue → MDX → screenshots → commit).

---

## Summary: What Julianna Does vs What Agent Does

| Step | Who | Time |
|------|-----|------|
| Capture screenshots (4 projects) | Julianna | ~30 min |
| Build listing grid page | Agent | ASMV-31 |
| Answer dialogue questions (×4 projects) | Julianna | ~5–10 min each |
| Draft MDX from dialogue | Agent | — |
| Review/edit MDX drafts | Julianna | ~10 min each |
| Riso-process thumbnails | Agent | — |
| Polish, cross-link, QA | Agent + Julianna | — |
