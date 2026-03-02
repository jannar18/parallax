# Product Requirements Document — Personal Site

> **Status:** Draft
> **Author:** Julianna
> **Last Updated:** 2026-03-02

---

## 1. Problem Statement

**The problem:** Julianna is a practitioner across two disciplines — architecture and software engineering / AI research — with no unified artifact that communicates who she is, what she's working on, and how these practices connect. The existing personal site is functional but doesn't reflect the quality of the work or the ambition of the practice. When someone asks "who are you?" or "what are you working on?", there's no single thing to hand them.

**Evidence:** The current site has a bio, blog posts, photo, and architecture portfolio, but it doesn't tell a cohesive story. The architecture work and the software work live in separate worlds. There's no mechanism for keeping the site alive — it goes stale the day it ships.

**The deeper problem:** Julianna knows her architecture practice and her software/AI practice are connected but hasn't fully articulated how. The site needs to be more than a portfolio — it needs to be a *tool for figuring that out* and a *space where the bridge becomes visible*.

---

## 2. Vision & Solution Summary

A personal website at the quality level of an [Asimov Collective](https://www.asimovcollective.com/) site — restrained, typographic, philosophical, alive. It serves as a universal identity artifact: hand it to an employer, a collaborator, a stranger, and they understand who Julianna is and what he's building. The site auto-updates daily via a Claude skill, presenting a "studio desk" view of current work that feels both polished and active. The design language itself bridges the poetics of architecture with the progressivism of software and AI — not by explaining the bridge, but by *being* it.

---

## 3. Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| Universal identity artifact | Someone can visit the site and understand who Julianna is within 60 seconds | Pass/fail — test with 5 people |
| Asimov-quality design | Side-by-side with Asimov Collective sites, it holds its own | Subjective but honest assessment |
| Living site | Daily updates are happening consistently | Updated at least 5 of 7 days per week |
| Bridge visibility | Both architecture and software work feel like they belong together | Visitors don't perceive "two separate portfolios" |
| Low friction updates | The Claude skill takes < 5 minutes to run | Timed |

---

## 4. Target Users

**Primary user:** Julianna herself — the site is a thinking tool and a self-presentation tool.

**Secondary users (the audience):**
- Future employers (tech hiring managers, architecture firms, hybrid roles)
- Peers and potential collaborators (other builders, researchers, architects)
- Friends and acquaintances ("what do you do?")
- Strangers who find the site (should be self-explanatory)

**Key user stories:**
- *As Julianna,* I want to run a Claude skill at the end of the day and have my site reflect what I worked on, so the site is always current without manual web development.
- *As Julianna,* I want the site to help me articulate the connection between my architecture and software practices, so I can develop that thinking over time.
- *As a visitor,* I want to understand who Julianna is and what she does within a minute of landing on the site, so I can decide if I want to connect or learn more.
- *As an employer,* I want to see the quality and range of Julianna's work across disciplines, so I can evaluate fit.
- *As a peer,* I want to see what Julianna is working on *right now*, so I know if there's an opportunity to collaborate.

---

## 5. Scope

### In Scope (MVP)

1. **Brand identity & naming** — develop a studio/practice name and visual identity
2. **Domain acquisition** — select and register a domain that fits the brand
3. **Asimov Collective research** — deep study of their sites (see Phase 1 below)
4. **AI graphics pipeline** — research + establish a workflow for generating original visual assets
5. **Site design & build** — homepage, about/bio, architecture portfolio, software portfolio, writings, daily update page
6. **Content migration** — pull bio, writing, and portfolio data from existing site
7. **Claude skill for daily updates** — `/update-site` or similar, handles quick updates and longer entries
8. **Deployment & hosting**

### Stretch Goals

- Curated library/influences page (like Asimov's Library page)
- Interactive or computational elements that demonstrate the architecture-software bridge in the site itself
- RSS feed
- Email newsletter integration

---

## 6. Site Architecture

### Pages

| Page | Purpose | Content |
|------|---------|---------|
| **Home** | First impression, identity statement | Name/brand, one-line positioning. Surfaces a live preview of the Now page (today's studio desk), plus highlighted portfolio pieces from both architecture and software work. The homepage is a window into everything, not a static landing page. |
| **About** | Who Julianna is | Bio, photo, background spanning architecture + software + AI, contact/social links |
| **Work: Architecture** | Architecture portfolio | Academic/studio projects — renderings, drawings, models, thesis work. Presented in a way that honors the medium (not just an image grid) |
| **Work: Software & AI** | Software/AI portfolio | Projects, tools, research. Code as creative practice, not just a resume |
| **Writing** | Blog posts and essays | Migrated from existing site + new writing. Not positioned as a "blog" — more like a collection of thinking |
| **Now** | Daily update / studio desk | The living page. Updated daily via Claude skill. Artifacts, fragments, links, quotes, current threads. Feels like looking at someone's desk. |

### Navigation

Restrained. Likely a fixed minimal header or a side element. The Asimov pattern is a small, quiet nav that doesn't compete with content.

### Core Flows

1. **New visitor** → lands on Home → understands identity → explores Work or Now
2. **Employer** → lands on Home or About → reviews Work (both portfolios) → sees breadth + quality
3. **Peer/collaborator** → checks Now page → sees current threads → reaches out
4. **Return visitor** → goes straight to Now → sees what's new today

---

## 7. The Daily Update Page — "Living Polish"

This is the hardest design problem in the project. The page must be simultaneously:

- **Polished** — Asimov-quality typography, spacing, restraint
- **Active** — clearly updated today, not a static artifact
- **Personal** — feels like Julianna's actual workspace, not a corporate changelog

### Design Concept: Studio Desk

The metaphor is a designer's desk — not messy, but *populated*. On any given day it might contain:

- A thumbnail of an architectural sketch or rendering in progress
- A code snippet or commit message
- A sentence or two about what's being researched
- A quote from something being read
- Links to references
- A status line ("deep in research mode" / "building" / "writing")

### What the Claude Skill Produces

The skill should accept variable-depth input:
- **Quick mode:** Julianna runs `/update-site "Spent the day on mesh collisions and reading Pallasmaa"` → skill formats a minimal but beautiful daily entry
- **Developed mode:** Julianna provides richer input — images, links, longer reflections → skill formats a fuller studio desk entry

The output is a structured content file (MDX or similar) that the site builds and deploys automatically.

### Design Rules for "Living Polish"

1. Every daily entry uses the same typographic system as the rest of the site — same fonts, same spacing rules
2. The "today" entry is visually distinct (subtle, not loud) from previous days
3. Older entries don't disappear — they scroll down, forming a timeline
4. Sparse days (one line) should look as intentional as rich days (multiple artifacts)
5. No timestamps unless they add meaning. Dates only.

---

## 8. The Bridge — Architecture × Software × AI

### The Challenge

Julianna's architecture practice (academic/studio — renderings, drawings, conceptual projects) and her software/AI practice exist as separate bodies of work. She knows they connect but hasn't fully articulated how. **The site should be a tool for developing this articulation, not a finished statement of it.**

### How the Site Can Be That Tool

1. **Unified design language** — The visual system itself should draw from both worlds. Architectural drawing conventions (line weight, plan/section logic, materiality) can inform the web design. Software conventions (syntax, systems thinking, version control) can inform the content structure. Neither dominates.

2. **Portfolio presentation** — Don't separate "architecture" and "software" into siloed pages that never touch. Consider:
   - A unified "Work" section organized by *theme* or *inquiry* rather than discipline
   - Project pages that show how architectural thinking informed a software project (or vice versa)
   - Side-by-side or interwoven presentations

3. **The daily "Now" page** — This is where the bridge becomes most visible day-to-day. When the studio desk shows an architectural sketch next to a code snippet next to a Pallasmaa quote, the proximity *is* the argument. The juxtaposition does the work that an essay couldn't.

4. **Writing** — Essays that explicitly explore the intersection. Over time, the writing section becomes the intellectual backbone of the bridge.

5. **The site itself as artifact** — If the site is beautifully designed (architectural sensibility) AND technically sophisticated (software craft) AND auto-updates via AI — it *is* the bridge. It doesn't need to explain it. It demonstrates it.

### Open Questions (To Resolve Through the Project)

- Should the portfolio be organized by discipline or by theme?
- What's the one-line positioning that captures both practices? (This comes from the brand identity work)
- Are there specific projects that already live at the intersection?
- What architectural concepts/vocabulary should inform the web design? (Circulation, threshold, materiality, light?)

---

## 9. Architecture Portfolio Display

### The Problem with Standard Portfolio Sites

Most portfolio sites display architecture work as a grid of thumbnails → click → image gallery. This flattens the work. Architecture projects have:

- **Sequence** — the order you experience drawings matters (site plan → plan → section → detail)
- **Scale** — a site plan and a door detail operate at different scales; showing them the same size loses meaning
- **Medium** — a hand drawing, a rendering, and a physical model photo have different qualities
- **Narrative** — the project has a story, a thesis, a position

### Display Principles

1. **Project pages, not image grids** — each project gets its own page with intentional sequencing
2. **Mixed media** — drawings, renderings, models, diagrams presented at appropriate scales
3. **Context** — brief text that situates the project: what was the question, what was the position, what was the outcome
4. **Let the drawings breathe** — generous whitespace, no thumbnails crammed together. Treat each image like a plate in a monograph.
5. **Study the Asimov approach** — their Rainmaker case study uses large-format imagery, minimal text, and careful pacing. Apply this to architecture work.

---

## 10. Phases

### Phase 0: Asimov Collective Deep Research

**Goal:** Develop a thorough understanding of the Asimov Collective design language so we can build at their level.

**Activities:**
- Catalog all Asimov Collective project sites (Rainmaker, etc.) and their own site
- Reverse-engineer their tech stack (frameworks, fonts, animation libraries, hosting)
- Document the "Asimov signature" — what makes a site recognizably theirs:
  - Typography choices and hierarchy
  - Color usage (or restraint)
  - Spacing and grid system
  - Animation and interaction patterns (Lenis scroll, micro-interactions)
  - Content structure and pacing
  - Imagery style and treatment
  - Tone of voice in copy
- Julianna identifies specific sites, pages, and elements that resonate most
- Create a design reference document with screenshots and annotations

**Deliverable:** `research/01-asimov-collective-analysis.md` — a comprehensive design analysis that becomes the design brief for the site.

### Phase 1: Visual Inspiration, Interactivity Research & AI Graphics Pipeline

**Goal:** Establish visual and interactive references for the site, and build a workflow for creating original assets.

#### 1a: Porter Robinson & Interactive/Playful Web Research

Asimov Collective defines the *polish* — Porter Robinson's web presence defines the *play*. His sites treat the browser as a game engine: interactive, surprising, rewarding exploration. This maps directly to Julianna's interest in video game design.

**Activities:**
- Deep study of Porter Robinson's websites (Julianna will provide links) — catalog what makes them feel playful: WebGL, canvas interactions, easter eggs, sound design, cursor effects, parallax, particle systems, etc.
- Reverse-engineer the tech: Three.js? GSAP? Custom shaders? What frameworks enable this?
- Research other interactive/game-like personal sites for additional inspiration
- Identify which interactive elements could work within the Asimov aesthetic restraint — the goal is *play within polish*, not chaos
- Explore how Julianna's interest in video game design could manifest in the site itself (the site as a playable space, not just a viewable one)
- Define a spectrum: what's the minimum interactivity (subtle, rewarding hover states and transitions) vs. maximum (a full interactive experience on one page)?

**Deliverable:** `research/02-interactive-web-research.md` — Porter Robinson analysis, tech stack breakdown, interactive element catalog, and recommendations for what fits this project.

#### 1b: Gathering Visual Inspiration & AI Graphics Pipeline

**Activities:**
- Julianna gathers graphics, illustrations, textures, and visual motifs she loves (from Asimov, Porter Robinson, and elsewhere)
- Compile an inspiration board / moodboard
- Research AI graphics generation platforms:
  - **Midjourney** — style replication, illustration generation
  - **Codex** — generative code art, SVG generation, computational graphics
  - **Gemini** — image generation capabilities
  - **DALL-E / other platforms** — compare output quality for this specific aesthetic
- Test each platform: give it the Asimov reference material and see what it produces
- Determine which tool(s) best reproduce the restrained, editorial, Art Nouveau/Art Deco-meets-digital aesthetic
- Establish a repeatable workflow: reference images → prompt → refinement → export → site-ready asset

**Deliverable:** `research/03-ai-graphics-pipeline.md` — platform comparison, prompt templates, and established workflow. Plus an initial set of generated assets.

### Phase 2: Brand Identity & Naming

**Goal:** Develop a studio/practice name and core visual identity.

**Activities:**
- Explore naming directions that capture the architecture + software + AI intersection
- Domain availability check for top candidates
- Define the visual identity basics: primary typeface(s), color palette, logo/wordmark if applicable
- Write the one-line positioning statement
- Register domain

**Deliverable:** Brand guide (lightweight — name, fonts, colors, positioning statement, domain).

### Phase 3: Design & Build

**Goal:** Design and build the site.

**Activities:**
- Choose tech stack (recommendation will come from Phase 0 research — see what Asimov uses)
- Design system: typography scale, spacing, color, components
- Build all pages (Home, About, Work, Writing, Now)
- Implement smooth scroll and any interaction patterns from the Asimov research
- Architecture portfolio: build project pages with intentional sequencing and scale
- Writing section: migrate existing posts
- Now page: build the "studio desk" layout

**Deliverable:** Live site, deployed.

### Phase 4: Content Migration & Population

**Goal:** Fill the site with real content.

**Activities:**
- Pull bio, photo, writing from existing site
- Curate and sequence architecture portfolio projects
- Document software/AI projects
- Write any new copy needed (homepage statement, project descriptions)
- Generate initial AI graphics for the site

**Deliverable:** Site populated with all content.

### Phase 5: Claude Skill Development

**Goal:** Build the `/update-site` Claude skill for daily updates.

**Activities:**
- Design the skill interface (what inputs it accepts, quick mode vs developed mode)
- Build the content generation pipeline: user input → formatted MDX/content file
- Build the deployment pipeline: new content file → git commit → auto-deploy
- Handle media: if Julianna includes images/sketches, the skill processes and includes them
- Test the full loop: run skill → content generated → site updated → live in < 5 minutes

**Deliverable:** Working Claude skill + documentation.

### Phase 6: Refinement & Polish

**Goal:** Get the site to Asimov quality.

**Activities:**
- Side-by-side comparison with Asimov Collective sites
- Typography refinement
- Animation and interaction polish
- Mobile responsiveness
- Performance optimization
- Cross-browser testing

**Deliverable:** Site at ship quality.

---

## 11. Technical Constraints & Dependencies

### Decided
- Content for daily updates authored through a Claude skill (not a CMS GUI)
- Design quality target: Asimov Collective level
- Static or hybrid deployment (no heavy server infrastructure)

### Constraints
- Tech stack: TBD pending Asimov research (Phase 0). Likely Next.js or Astro.
- Hosting: TBD. Likely Vercel or Netlify.
- Must support MDX or similar for mixing rich content with components
- Claude skill must work within Claude Code's existing skill/command system

### Fallback
- If AI graphics tools can't match the Asimov aesthetic → use curated stock/open-source graphics + manual refinement
- If daily auto-deploy pipeline is complex → start with manual git push after skill generates content

---

## 12. Risks & Open Questions

| Risk / Question | Impact | Mitigation | Status |
|----------------|--------|------------|--------|
| Asimov quality is a high bar — can we hit it without a design team? | High | Deep research phase + iterative refinement + honest assessment | Open |
| "The bridge" between architecture and software is undefined | Medium | The site is the tool for figuring it out. Start with proximity (studio desk), develop through writing over time. Don't force a thesis before it's ready. | Open |
| AI graphics may not match the aesthetic | Medium | Test multiple platforms early. Have fallback plan (curated assets + manual work). | Open |
| Daily update habit may not stick | Medium | Make the skill so fast and easy that friction isn't the barrier. Start with quick mode. | Open |
| Brand naming is hard and could block everything | Medium | Timebox it. Pick a good-enough name and evolve later. The domain matters more than perfection. | Open |
| Portfolio organization (by discipline vs theme) | Low | Start with discipline-based, allow reorganization later as the bridge becomes clearer | Open |

---

## 13. Demo Philosophy

**Audience:** Universal — the site is the demo. It needs to work for employers, peers, friends, and strangers.

**Tone:** Confident but not arrogant. Intellectual but accessible. The Asimov tone: "We take our work seriously but we don't take ourselves too seriously."

**What to show:** The Now page is the killer feature. When someone visits and sees today's date with real artifacts from real work — that's the moment. That's what no other portfolio site does.

**What to hide:** The machinery. The Claude skill, the auto-deploy pipeline, the MDX files — nobody needs to see how the sausage is made. The site should feel effortless even though it's deeply engineered.

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-03-02 | Initial draft from PRD interview | Julianna + Claude |
