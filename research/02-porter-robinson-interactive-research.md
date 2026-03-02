# Porter Robinson & Interactive Web Research

> **Status:** Initial research
> **Date:** 2026-03-02
> **Purpose:** Understand the "play" side of the site's design language — Asimov defines the polish, Porter Robinson defines the play.

---

## The Through-Line

Every Porter Robinson web project treats the browser as a **portal into a world, not a document**. The screen is an entrance to somewhere. Standard web behavior (scrolling, clicking links, reading text) is replaced with exploration, interaction, and discovery.

This is the quality Julianna wants to bring into the personal site — not at the scale of a game engine, but as a design philosophy: **the site as a space you enter, not a page you read**.

---

## porterrobinson.com (SMILE! :D)

**URL:** https://porterrobinson.com/
**Built by:** Active Theory, with developer Richard Zhou

### Tech Stack
- **WebGL + GLSL shaders** — custom-built rendering, no standard framework
- **Houdini** — 3D authoring
- **Physics-based simulation** — driving all interactions
- Custom internal tools built specifically for this project
- Major performance optimization work ("escaping a performance black hole")

### What It Does
- Opens on a **Pokemon-style 3D map** with a walkable Porter Robinson sprite
- Clickable buildings serve as navigation (Album, Store, Tour) — **navigation disguised as gameplay**
- Mini-games menu styled like an **Xbox start menu** — 20+ numbered games
- Cat-themed games ("PAT THE KITTY," "SQUEEZE THE KITTY," "BOWL THE KITTY")
- **Fully destructible environments** — games require destroying surroundings to find progression buttons
- Sequential mini-game progression across 3 tracks
- Floating white glove (Master Hand reference)

### Why It Matters
The entire site is a video game. There is no "normal" website underneath — the game IS the website. Navigation, content discovery, and fan engagement all happen through play. This is the maximum end of the interactivity spectrum.

### Source
- [Exron Music: "Porter Robinson's website is a video game lover's dream"](https://exronmusic.com/2024/10/11/porter-robinsons-website-is-a-video-game-lovers-dream/)
- [Richard Zhou portfolio](https://www.richardczhou.com/posts/porterrobinson)
- [Awwwards SOTD](https://www.awwwards.com/sites/porter-robinson-smile-d)

---

## nurture.art (Nurture Album Site)

**URL:** https://nurture.art/
**Built by:** Active Theory (likely, based on pattern)

### Tech Stack
- Custom JavaScript application (not a standard framework)
- Google Fonts: **Nunito** (body), **Playfair Display** (display), **Lora** (headings at 52px, lowercase)
- Custom scroll/navigation paradigm — overflow hidden, touch actions disabled, user selection disabled
- Cache-busting via timestamps
- Google Tag Manager + Analytics + Facebook Pixel

### What It Does
- **Dark, immersive, app-like experience** — black background, high contrast
- Per-album color palettes (soft blues, deep navy, greens) create visual variety across releases
- `bounce-fade` animation (opacity 0.3–1.0 over 0.7s) creates subtle visual rhythm
- Absolute positioning throughout — suggests parallax or animated scene transitions
- Five main routes: Home, Music, Newsletter, Store, Tour
- **Feels like entering an application, not browsing a website**

### Why It Matters
This is a more restrained version of the SMILE! :D approach. Still immersive, still custom, but the interactivity is atmospheric rather than game-like. Closer to what might work for Julianna's site — the feeling of entering a space without requiring a full game engine.

---

## Secret Sky 2021 (Virtual Festival)

**URL:** https://www.webbyawards.com/crafted-with-code/secret-sky-2021/
**Built by:** Active Theory using their **Dreamwave Platform**

### Tech Stack
- **Dreamwave Platform** — Active Theory's proprietary platform for virtual events (launched 2020)
- WebGL-based 3D environments
- Performance techniques: **frustum culling**, **distance-based culling**, **device-adaptive instance scaling**
- Cross-platform: mobile, desktop, VR

### What It Did
- 10+ hour virtual music festival, 16 artists, 4 unique 3D environments
- **160,000 attendees from 163 countries**
- Teleportation between zones
- Integrated audio chat for fan interaction
- Embedded festival livestream within the 3D environment
- 50,000+ VR sessions
- 8.5-minute average exploration time (400% YoY increase)
- #SecretSky trended #1 on Twitter
- Webby Award nominee (2022)

### Why It Matters
This is the full-scale version of "browser as world." The performance optimization techniques (culling, device-adaptive scaling) are relevant even at smaller scales — any interactive 3D elements on Julianna's site would benefit from these same principles.

---

## Luke Hall — Nurture Live Tour Creative

**URL:** https://www.lukehall.media/project/nurture
**Role:** Creative director, working directly with Porter Robinson (2020–2023)

### Tech & Tools
- **Cinema 4D** with Forester plugin (tree growth simulation)
- **Houdini** with GrowInfinite plugin (organic simulations)
- **VR headsets + video game engines** — real-time audition of content on life-scale virtual stages
- **3D modeling and rendering** — environment creation, unboxing videos
- **Augmented Reality** — Instagram filters ("Mirror" AR filter)

### Key Work
- "Look at the Sky" lyric video (7M+ YouTube views)
- 70+ venue tour visuals including Coachella
- Two massive LED screens covering the stage — optical illusions and visual effects
- Hundreds of digitally created plants, trees, rock formations
- For "Mother": reconstructed Porter's childhood home in 3D from family interview footage and memories
- Mini-documentary, multi-camera concert recording

### Design Philosophy
- **Vulnerability and environmental immersion**
- Contrasting digital and organic elements
- Blending live-action nature footage with procedurally generated simulations
- Theme: "hope, overcoming despair, faithfully pursuing a sense of purpose"

### Why It Matters
The Nurture production shows how the same aesthetic (digital/organic blend, emotional storytelling, immersive environments) translates across media — web, stage, AR, video. This cross-media thinking is relevant to Julianna's goal of bridging architecture (spatial, physical) with software (digital, interactive).

---

## Jack Entee — Porter Robinson Portfolio Piece

**URL:** https://jackentee.com/porter-robinson/
**Note:** Full project details couldn't be extracted (CSS-heavy page render), but this represents another creative collaborator in the Porter Robinson ecosystem.

---

## Key Studio: Active Theory

Active Theory is the recurring name across Porter Robinson's web work. They are the team that turns these visions into browser-based realities. Venice Beach-based, founded in 2012, on Fast Company's 2022 Most Innovative Companies list.

**URL:** https://activetheory.net/

### Their Own Site Design
- **Pitch-black canvas** (#0B0B0B) with full-bleed WebGL reels
- **Monument Grotesk XXL** headlines on a 12-column grid
- Hover tiles that bloom into 60fps in-place trailers
- Accent violet (#A970FF) for CTAs
- Performance: LCP ~1.3s desktop / ~1.7s on 4G
- **Radial menu** functioning as both navigation and progress tracker
- NBArchitekt font family (Regular, Light, Bold)
- Entirely JS-dependent — no content in static markup, everything rendered via their engine

### Hydra Framework (Custom, In-House)
- **Custom 3D engine** built in-house since 2012, optimized for maximum graphics throughput with reduced CPU usage
- Started as a way to stay agile during the Flash-to-HTML5 transition
- Grown into a full 3D engine with a **visual GUI (Hydra GUI)** that lets designers build entire 3D scenes without writing code
- State-based, functional programming style — modular and fast
- Runs on: web, native iOS, native Android, desktop, desktop VR (Vive/Oculus), mobile VR (Daydream/Oculus Go), Magic Leap
- Core of everything they build

### Tech Stack
- **Hydra** — their custom JS/WebGL framework (replaces Three.js for most work)
- **Three.js** — used on every 3D project before mid-2018, then supplemented by Hydra
- **GLSL** — custom shaders
- **Electron** — native wrapper for physical installations
- **Node.js + C++** — for native API access on desktop (GLFW for OpenGL contexts)
- **Draco compression** — for mesh delivery
- **requestIdleCallback** — lazy-loading videos for performance
- **Dreamwave Platform** — proprietary tool for virtual events (Secret Sky, etc.)
- **Google App Engine** — backend

### Major Clients
- **Google** — Chrome experiments, Google I/O interactive experiences, B2B virtual events
- **NASA**
- **Spotify**
- **Apple** — Mira prototype (web, native mobile, Apple TV, Kinect installation)
- **Porter Robinson** — SMILE! :D, Secret Sky, likely nurture.art
- **Pottermore** — 3D tour of Hogwarts (Awwwards Site of the Month)
- **HubSpot** — virtual conference with avatar-based roaming

### Why Active Theory Matters for This Project
They represent the ceiling of what's possible in the browser. We're not building at Active Theory scale, but studying their work reveals:
1. **Performance patterns** that apply at any scale (culling, lazy loading, device adaptation)
2. **The Hydra GUI concept** — designers building scenes without code. Relevant if Julianna wants to update interactive elements without dev work.
3. **Cross-platform thinking** — same experience across devices, graceful degradation
4. **The radial menu as nav** — a non-traditional navigation pattern that could inspire the site's own nav design

---

## Spectrum: From Play to Polish

For Julianna's site, the question is where on this spectrum to land:

| Level | Example | What It Means |
|-------|---------|---------------|
| **Maximum play** | porterrobinson.com (SMILE! :D) | Full game engine in the browser. Navigation is gameplay. Destructible environments. |
| **Atmospheric immersion** | nurture.art | Dark, app-like, custom scroll. Feels like a space, not a page. No explicit games. |
| **Subtle interactivity** | Asimov Collective sites | Lenis smooth scroll, micro-interactions, hover states. Polish over play. |
| **The target** | Julianna's site | Asimov-level polish with moments of Porter Robinson play. The site surprises you. |

### Possible Interactive Elements (Play Within Polish)

- Custom cursor that responds to content (changes near architecture work vs code)
- Subtle particle systems or generative graphics that react to scroll or mouse
- An explorable element on the Now/studio desk page — maybe the desk IS spatial
- Easter eggs or hidden interactions that reward exploration
- Smooth, physics-based transitions between pages (not just fade-in/out)
- A single "portal" page that goes full immersive — maybe the bridge between architecture and software lives here
- WebGL background elements that are subtle enough for Asimov restraint but technically sophisticated

### Open Questions
- How much interactivity is realistic for the MVP timeline?
- Should the interactive elements be core to the experience or discoverable easter eggs?
- Is Three.js the right tool, or are lighter alternatives (canvas 2D, CSS animations, GSAP) sufficient for the target level?
- Could Julianna's game design interest manifest as an actual playable element on the site?
