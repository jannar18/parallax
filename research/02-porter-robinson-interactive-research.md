# Porter Robinson & Interactive Web Research

> **Status:** Deep research (finalized)
> **Date:** 2026-03-02 (initial) | 2026-03-02 (expanded)
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

## "Look at the Sky" — WebXR Multiplayer Listening Experience

**Case Study:** https://activetheory.medium.com/look-at-the-sky-b03ac8d48252
**Built by:** Active Theory

### What It Was
An interactive, multiplayer listening experience for the "Look at the Sky" single launch. Users are placed into an environment that evolves as the track plays, listening together with others from around the world.

### How It Worked
- **Waiting rooms** fill with up to 100 users over 45 seconds
- Users placed in a **spiral formation** as they join — ensures everyone feels surrounded by other listeners
- **Gaze-based mechanic** linked to the device gyroscope — move your phone "magic window" style to look around
- The **laser pointer from your gaze doubles as an art tool** — light trails form as you look around
- Mobile-only or WebVR — designed for the device in your hand
- 360-degree environment that evolves in sync with the music
- Everyone's audiovisual experience synced regardless of global location

### Visual Direction
- Stayed in the Nurture universe: natural scenery contrasted with stark black palette
- **Line scribbles as individual expression** — each user's gaze trail becomes a drawing in the shared space

### Why It Matters
This is the most intimate-scale version of Active Theory's work. Not a festival, not a game — a shared moment. The gaze-as-art-tool concept is particularly relevant: **the user's attention literally becomes a creative act**. That idea — interaction as expression, not just navigation — is powerful for Julianna's site.

---

## Michael Kim — Active Theory Developer (Porter Robinson Projects)

**URL:** https://maikool.com/project/porter-robinson
**Role:** 3D, Modeling, R&D, Lookdev, WebGL Shaders, VR/AR Prototyping

### Projects
- Nurture album website (virtual space)
- "Look at the Sky" mobile AR experience
- Secret Sky / Dreamwave festival platform
- "Mirror" music video

### Technical Skills Demonstrated
- WebGL shader development
- 3D modeling and visualization
- **Photogrammetry** (Meshroom, terrain mesh generation)
- VR/AR prototyping
- Terrain and environment generation

### Why It Matters
Kim's role shows the cross-disciplinary skill set needed: 3D modeling, shader code, AR prototyping, photogrammetry. This is the kind of hybrid creative-technical work that maps onto Julianna's architecture-software bridge.

---

## Jack Entee — Porter Robinson Portfolio Piece

**URL:** https://jackentee.com/porter-robinson/
**Note:** Full project details couldn't be extracted (CSS-heavy page render), but this represents another creative collaborator in the Porter Robinson ecosystem.

---

## Key Studio: Active Theory

Active Theory is the recurring name across Porter Robinson's web work. They are the team that turns these visions into browser-based realities. Founded in 2012, on Fast Company's 2022 Most Innovative Companies list. **Three offices: LAX (Venice Beach), NYC, and AMS (Amsterdam).** Remote-friendly, globally distributed team.

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

---

## Missing Porter Robinson Web Experience: Virtual Self (2017)

**URL:** https://virtualself.co/ (original, likely archived)
**Era:** November 2017

### What It Was
A cryptic, interactive website launched alongside the Virtual Self EP -- Porter Robinson's side project channeling Y2K internet aesthetics and early-2000s trance culture. The site was designed to feel like a relic of the 1999-2003 internet: vast, mysterious, and user-hostile.

### Design & Interaction
- **Homepage plays "EON BREAK" and "Ghost Voices"** over interactive imagery of two characters: **Technic-Angel** (faster, trance tracks) and **Pathselector** (mid-tempo tracks)
- **Hidden forum** — clicking deep enough reveals a locked web forum where AI chatbots hold ethereal, cryptic conversations with one another in italic text
- **Source code Easter eggs** — fans dug through the HTML source and found hidden messages, reflecting Robinson's belief that the early internet rewarded exploration
- **Fictional Twitter accounts** created alongside the site to extend the universe beyond the browser
- Blue-and-black sci-fi palette with a sense of "techno-spiritualism"

### Design Philosophy
Robinson explicitly stated the goal: *"I'm trying to recreate this feeling I had when I was younger of the internet being this vast, mysterious, user-hostile world that could never at one time be fully comprehended."*

This is not about usability. It is about atmosphere. The site is not welcoming; it is intriguing. It rewards curiosity. It punishes passivity.

### Why It Matters for This Project
Virtual Self is the **opposite end of the Porter Robinson spectrum from SMILE! :D**. Where SMILE! is joyful, colorful, and game-like, Virtual Self is dark, cryptic, and literary. Both share the core principle: the browser is a world to explore, not a document to read. For Julianna's site, Virtual Self's approach -- hidden depths, rewarded exploration, source-code Easter eggs -- may actually be more relevant than SMILE!'s full-game approach.

### Sources
- [The Fader: "Porter Robinson's ambitious, human Virtual Self"](https://www.thefader.com/2018/02/28/porter-robinson-virtual-self-interview)
- [Dazed: "The Y2K cyber worlds that inspired Porter Robinson"](https://www.dazeddigital.com/music/article/39536/1/porter-robinson-virtual-world-y2k-faves-interview)
- [EDM Sauce: "Fans Dig Deep Into Porter Robinson's Virtual Self Website"](https://www.edmsauce.com/2017/11/19/fans-dig-deep-virtual-self/)
- [Billboard: "Porter Robinson Talks Becoming His Virtual Self"](https://www.billboard.com/music/music-news/porter-robinson-virtual-self-interview-8299810/)

---

## Missing Collaborator: Picnic Studio (Worlds Tour Visuals)

**URL:** https://www.picnicstudio.tv/portervisuals
**Role:** Visual production for Porter Robinson live shows

Picnic Studio handled visual content for Porter Robinson performances, working alongside the constellation of creative collaborators (Luke Hall, Active Theory, Michael Kim) that orbit Robinson's projects. They represent yet another node in the network of studios that translate Robinson's vision across media.

---

## Deep Dive: Active Theory's Hydra Framework & Performance Philosophy

### Origins & Architecture

Hydra began in 2012 as Active Theory's response to the Flash-to-HTML5 transition. Rather than adopting early frameworks wholesale, they built from scratch using a **"top down" approach**: identify the performance bottlenecks in WebGL projects, then engineer targeted solutions.

The result is a modular engine with these core principles:

1. **State-based, functional programming style** — everything is modular, composable, and fast to reason about
2. **Plugin-based architecture** — features are added per-project without touching the core engine, reducing shipped code
3. **Dual interface** — Hydra GUI lets designers build 3D scenes visually; developers can manipulate the same nodes directly in JavaScript

### Performance Optimization Techniques

Active Theory's optimization work is the most transferable part of their practice. These techniques apply at any scale:

#### 1. Aggressive Main-Thread Offloading
They moved as much code off the main thread and into **WebWorkers** as possible. Tasks handled entirely in workers:
- Loading and parsing geometry
- Computing dimensions
- Generating particle systems
- Computing physics collisions

The main thread is reserved for rendering and DOM interaction. Everything else is parallelized.

#### 2. Lazy Matrix Updates
Standard 3D engines recalculate transformation matrices for every object on every frame. Hydra tracks **whether an object's matrix actually needs updating** and only recalculates when something has changed. On scenes with hundreds of objects where most are static on any given frame, this eliminates enormous amounts of wasted computation.

#### 3. GPGPU for Complex Simulations
For particle-heavy scenes (like the Neon installation), they use **GPGPU (General-Purpose GPU) textures** where each pixel in a texture represents a particle's state. The GPU processes all particle physics in parallel, with the CPU only providing high-level instructions. The Neon project used this for chains of particles forming neon tubes, where pixel 0 in the chain carries origin/lifecycle data and subsequent pixels are "followers" catching up to the one before them.

#### 4. Multi-Pass Rendering Pipeline
For visual effects that need to look expensive without being expensive:
- Render elements to isolated **RenderTargets**
- Apply blur passes to the isolated render
- Composite back into the main scene with blend modes (linear burn, etc.)
- Add focal depth-of-field in a final pass using the depth buffer

This creates the visual richness of neon glows, soft focus, and atmospheric effects without the cost of real-time ray tracing.

#### 5. Device-Adaptive Rendering
For the Secret Sky festival platform (160,000 concurrent users):
- **Frustum culling** — don't render what the camera can't see
- **Distance-based culling** — reduce detail or skip objects beyond a threshold
- **Device-adaptive instance scaling** — fewer particles, lower-resolution textures, simpler shaders on mobile
- The same codebase serves desktop, mobile, and VR, but the visual fidelity adapts to what the device can handle

#### 6. Asset Delivery Optimization
- **Draco compression** for 3D mesh delivery (significant size reduction over raw geometry)
- **requestIdleCallback** for lazy-loading videos — videos only load when the browser's main thread is idle
- Cache-busting via timestamps for aggressive CDN caching without stale content

### Mobile vs. Desktop Strategy

Active Theory's philosophy is **same experience, adapted fidelity**. They don't build separate mobile sites. Instead:

- **Desktop:** Full shader complexity, maximum particle counts, high-resolution textures, full post-processing pipeline
- **Mobile:** Same scene graph and interaction model, but with reduced particle counts, simplified shaders, lower texture resolution, fewer post-processing passes
- **VR:** Native-level performance via their Aura platform, which runs the Hydra engine natively on iOS, Android, desktop VR (Vive/Oculus), and mobile VR (Daydream/Oculus Go)

The key insight: **device detection happens at initialization, not at runtime**. The scene is configured once based on the device's capabilities, not dynamically adjusted frame-by-frame (which would itself be a performance cost).

### Loading Strategy

Their sites achieve remarkably fast LCP despite being entirely JS-rendered:
- **LCP ~1.3s desktop / ~1.7s on 4G** on their own portfolio site
- Static markup contains essentially nothing — everything is rendered by Hydra
- Initial paint is a pitch-black canvas (fast to render), with content streaming in progressively
- Videos are the heaviest assets and are deferred via requestIdleCallback
- 3D meshes arrive Draco-compressed

### What We Can Learn from Hydra (Without Building Hydra)

We're not building a custom engine. But Hydra's principles translate directly:

| Hydra Principle | Our Application |
|----------------|-----------------|
| Main-thread offloading | Use Web Workers for any heavy computation (particle physics, geometry generation) |
| Lazy matrix updates | If using Three.js, use `matrixAutoUpdate = false` on static objects |
| Device-adaptive rendering | Detect device tier at load; serve appropriate shader/texture complexity |
| GPGPU particles | If we need particle systems, use GPU-based approaches (Three.js GPUComputationRenderer or TSL compute nodes) |
| Progressive loading | Black canvas first, content streams in. Perceived performance over actual performance. |
| Draco compression | Standard for any 3D mesh delivery. GLTF + Draco is the format. |

### Sources
- [Active Theory: "The Story of Technology Built at Active Theory"](https://medium.com/active-theory/the-story-of-technology-built-at-active-theory-5d17ae0e3fb4)
- [Active Theory: "Neon: A WebGL Installation"](https://medium.com/active-theory/neon-a-webgl-installation-fdf540c42152)
- [Active Theory: "Mira: Exploring the potential of the future web"](https://medium.com/active-theory/mira-exploring-the-potential-of-the-future-web-e1f7f326d58e)
- [Active Theory GitHub](https://github.com/activetheory)
- [webgpu.com: Active Theory Portfolio](https://www.webgpu.com/showcase/active-theory-portfolio/)

---

## Interactive Web Technology Landscape (2025-2026)

This section catalogs the current state of tools available for building "play within polish" level interactivity. Organized by category, with specific assessments of each technology's readiness and relevance.

### 3D Rendering: Three.js vs. Alternatives

#### Three.js (r183+, as of March 2026) [corrected — previously stated r171, September 2025; actual current release is r183]

**What it is:** A low-level 3D rendering library providing scene graph, cameras, lights, materials, and a renderer. The dominant choice for creative web 3D.

**Current state (as of r183):**
- **WebGPU support is production-ready** with zero-config imports (available since r171, now mature)
- **TSL (Three Shader Language)** — a JavaScript-based shader system that compiles to both WGSL (WebGPU) and GLSL (WebGL). Write shaders once, run everywhere.
- **WebGPURenderer** falls back automatically to WebGL 2 if WebGPU is not available — transparent to the developer
- **Bundle size:** ~320-590 KB minified depending on features used. Tree-shaking helps but has limits — importing WebGLRenderer pulls most of the library.
- **Community:** By far the largest. Thousands of examples, massive ecosystem of tools and helpers.
- **React integration:** React Three Fiber (R3F) provides a React renderer for Three.js with no overhead (renders outside React's VDOM). The @react-three/drei helper library is a goldmine of pre-made components. @react-three/rapier provides physics.

**Best for:** Teams wanting full control, creative/experimental projects, React-based applications.

#### Babylon.js

**What it is:** A full game engine for the browser. Ships physics, sound, UI, particle systems, and more out of the box.

**Current state:**
- Extensive WebGPU support
- **Node Material Editor** — visual shader creation for non-programmers
- **Online Playground** — prototype without local setup
- Significantly heavier than Three.js (ships what game devs need)
- Strong VR/AR support built-in

**Best for:** Browser games, VR/AR, complex simulations, teams that prefer integrated solutions over assembling pieces.

**Verdict for this project:** Overkill. Babylon is a game engine; we're building a portfolio site with moments of interactivity, not a game. The weight is not justified.

#### PlayCanvas

**What it is:** A cloud-based 3D engine with a visual editor (like Figma for 3D). Real-time collaboration built in.

**Current state:**
- Visual editor is the standout feature
- Cloud-based — no local dev environment needed for scene editing
- WebGPU support
- Strong for teams with non-technical members

**Best for:** Game studios, rapid prototyping, teams where designers need direct 3D editing.

**Verdict for this project:** The visual editor is compelling but the cloud dependency adds complexity. Three.js gives us more control for less overhead.

#### Spline

**What it is:** A browser-based, no-code 3D design tool. Export interactive 3D scenes as embeds (iframe), React components, or static assets.

**Current state (2025):**
- New **Timeline tool** for higher-quality animations
- Export to embed code (iframe), React/Next.js components, static formats
- Webflow and Framer integrations
- No coding required for scene creation
- Web exports optimized for performance

**Best for:** Designers creating interactive 3D elements without writing shader code. Quick embeddable moments of 3D.

**Verdict for this project:** Potentially useful for rapid prototyping of a specific interactive element (e.g., the studio desk, a spatial navigation element). Not the foundation of the site, but a potential tool for one-off 3D moments that don't justify writing custom Three.js code.

#### Recommendation: Three.js (via R3F if using React)

Three.js is the correct choice. The ecosystem is unmatched, TSL future-proofs shader work for WebGPU, the community provides answers for any problem, and R3F makes it ergonomic in a React project. Use it for any 3D/WebGL elements on the site. Consider Spline for quick one-off embeds if a specific element doesn't justify custom code.

### Scroll & Animation: GSAP 3.x

#### GSAP (GreenSock Animation Platform) — Now Free

**The big change:** Webflow acquired GSAP in fall 2024 and made the **entire platform free for all users**, including previously paid Club plugins. Commercial use included. No license restrictions.

**Key plugins (all now free):**

| Plugin | What It Does | Relevance |
|--------|-------------|-----------|
| **ScrollTrigger** | Links animations to scroll position. Play/pause/reverse/scrub based on scroll. Pin elements. Batch processing. | Essential. The backbone of scroll-driven interactivity. |
| **ScrollSmoother** | Smooth scrolling with parallax. Wraps native scroll. | Alternative to Lenis. See comparison below. |
| **MotionPath** | Animate along SVG paths or coordinate arrays | Useful for curved, organic motion |
| **SplitText** | Split text into characters/words/lines for per-element animation | Text reveal effects, staggered typography |
| **DrawSVG** | Animate SVG stroke drawing | Line-art reveals, diagram animations |
| **MorphSVG** | Morph between SVG shapes | Shape transitions, icon morphing |
| **Flip** | Animate between two states by calculating deltas | Layout transitions, card reflows |

**ScrollTrigger capabilities (2025):**
- Scrub mode: continuously maps scroll distance to animation progress (0-1)
- Element pinning during scroll
- Batch processing for animating many elements efficiently
- Built-in **prefers-reduced-motion** accessibility support
- Integrates with native CSS scroll-driven animations as progressive enhancement
- Works with Lenis or as a standalone scroll engine

**Bundle size:** ScrollTrigger is lightweight. ScrollSmoother is 26 KB (relatively large if all you need is smooth scrolling).

**Sources:**
- [Webflow: "GSAP is now free"](https://webflow.com/blog/gsap-becomes-free)
- [GSAP: "Joining Webflow"](https://gsap.com/blog/webflow-GSAP/)
- [GSAP ScrollTrigger docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Codrops: Scroll-Revealed WebGL Gallery with GSAP + Three.js + Astro](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/)

### Smooth Scrolling: Lenis vs. ScrollSmoother

#### Lenis (by darkroom.engineering)

**What it is:** An ultra-lightweight (~3 KB) smooth scroll library. "Smooth" in Latin.

**Key strengths:**
- **3 KB** — tiny footprint
- Compatible with CSS `position: sticky` (most smooth scroll libraries break this)
- Plays well with GSAP ScrollTrigger — syncing their scroll positions is trivial
- Framework-agnostic: vanilla JS, React, Vue, etc.
- `autoRaf` option handles requestAnimationFrame loop automatically
- Open source (MIT license)
- Created by **darkroom.engineering**, a creative dev studio known for high-quality interactive work (clients include Poly.ai, Bad Omens, ibi.cash)

**Philosophy:** Lenis does less and ends up doing more. It handles scroll smoothing and gets out of the way. Pair it with ScrollTrigger for animation.

#### ScrollSmoother (GSAP)

**What it is:** GSAP's integrated smooth scrolling solution. Works natively with ScrollTrigger.

**Key strengths:**
- Uses native scroll (not a fake scrollbar — you are actually scrolling the page)
- Tight integration with all GSAP plugins
- Parallax effects built in

**Key weaknesses:**
- 26 KB (vs. Lenis's 3 KB)
- Alters scroll context — `position: fixed` elements must be moved outside the scroll container
- Can require significant layout restructuring for non-standard designs
- Rigid when you deviate from its expected patterns

#### Verdict: Lenis + ScrollTrigger

Use **Lenis for smooth scrolling** and **GSAP ScrollTrigger for scroll-driven animation**. This gives:
- Minimal bundle impact (3 KB for scroll smoothing)
- Full compatibility with `position: sticky` and standard CSS layout
- No layout restructuring required
- All of ScrollTrigger's animation power without ScrollSmoother's rigidity
- The same stack used by top creative studios (darkroom.engineering, Studio Freight/Darkroom)

**Sources:**
- [Lenis GitHub](https://github.com/darkroomengineering/lenis)
- [Zun Creative: "ScrollSmoother vs Lenis"](https://zuncreative.com/blog/smooth_scroll_meditation/)
- [Born Digital: Smooth Scrolling Libraries Comparison](https://www.borndigital.be/blog/our-smooth-scrolling-libraries)

### Browser-Native: View Transitions API

#### What It Is
A browser-native API for animating transitions between DOM states (same-document/SPA) or between pages (cross-document/MPA). No library required.

#### Browser Support (as of early 2026)

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| Same-document (SPA) | 111+ | 111+ | 133+ | 18+ |
| Cross-document (MPA) | 126+ | 126+ | In development | 18.2+ |

**Key milestone:** Same-document view transitions are now supported in **all four major browsers**. Cross-document transitions are in Chrome, Edge, and Safari, with Firefox in development.

#### 2025-2026 Developments
- View Transitions is a focus area of **Interop 2025**, meaning browsers are actively coordinating on implementation
- Firefox intends to ship view transition types in **Firefox 144** (October 2025 stable)
- Cross-document transitions may make it into **Interop 2026** for broader standardization
- `document.activeViewTransition` shipping in **Chrome 142** (2026)

#### How It Works
```css
/* Assign transition names to elements */
.card { view-transition-name: card-hero; }

/* Customize the transition animation */
::view-transition-old(card-hero) {
  animation: fade-out 0.3s ease-out;
}
::view-transition-new(card-hero) {
  animation: fade-in 0.3s ease-in;
}
```

For SPAs, wrap DOM changes in `document.startViewTransition()`. For MPAs, opt in with a meta tag and the browser handles cross-page transitions automatically.

#### Verdict: Use as Progressive Enhancement

View Transitions are production-ready for SPA transitions today (all major browsers including Firefox 144+). Cross-document MPA transitions have broad support — Chrome 126+, Edge 126+, Safari 18.2+, and Firefox 144+ (partial, Level 1 only) [updated 2026-03-02]. Strategy:
- Use for **page transitions** — SPA support is universal; MPA works in all browsers with minor Firefox limitations
- Combine with Astro/Next.js for framework-level integration
- **Zero bundle cost** — it's a browser API, not a library
- Dramatic visual impact for minimal code

**Sources:**
- [Chrome for Developers: "View Transitions in 2025"](https://developer.chrome.com/blog/view-transitions-in-2025)
- [MDN: View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- [Can I Use: View Transitions](https://caniuse.com/view-transitions)

### Browser-Native: CSS Scroll-Driven Animations

#### What It Is
Native CSS properties (`animation-timeline`, `scroll()`, `view()`) that link CSS animations to scroll position — no JavaScript required.

#### Browser Support (as of early 2026) [verified 2026-03-02]

| Browser | Status |
|---------|--------|
| Chrome 115+ | Supported (stable) |
| Edge 115+ | Supported (stable) |
| Firefox | Behind flag — not enabled by default as of March 2026. Focus area for Interop 2026. |
| Safari 26.0+ | Supported (desktop and iOS) |

Global support: ~78% (caniuse).

#### Key Properties
- `animation-timeline: scroll()` — links animation to a scroll container's progress
- `animation-timeline: view()` — links animation to an element's visibility in the viewport
- `animation-range` — defines when the animation starts/ends relative to scroll

#### How It Works
```css
.reveal-element {
  animation: fade-slide-in linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}

@keyframes fade-slide-in {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```

#### Verdict: Use for Simple Scroll Animations, GSAP for Complex Ones

CSS scroll-driven animations are ideal for:
- Fade-in-on-scroll effects
- Progress bars
- Parallax backgrounds
- Simple element reveals

For anything complex (sequenced animations, physics-based easing, callbacks, dynamic targets), GSAP ScrollTrigger remains necessary. **Progressive enhancement strategy:** use CSS scroll-driven animations as the baseline, layer GSAP for advanced effects, wrap in `@supports` for graceful degradation.

**Sources:**
- [MDN: CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
- [Cyd Stumpel: "Start using Scroll-driven animations today!"](https://cydstumpel.nl/start-using-scroll-driven-animations-today/)
- [Builder.io: "Create Apple-style scroll animations with CSS view-timeline"](https://www.builder.io/blog/view-timeline)

### WebGPU

#### What It Is
The successor to WebGL. A modern, low-level graphics API for the web, modeled after Vulkan/Metal/Direct3D 12. Enables compute shaders, better GPU utilization, and significantly higher performance for complex scenes.

#### Browser Support (as of late 2025) [verified 2026-03-02]

**WebGPU now ships in all major browsers as of November 2025.** Global support: ~78% (caniuse).

| Browser | Status | Platform Notes |
|---------|--------|----------------|
| Chrome 113+ | Stable | Windows (D3D12), macOS, ChromeOS. Android 12+ (Chrome 121+, Qualcomm/ARM GPUs) |
| Edge 113+ | Stable | Same as Chrome |
| Firefox 141+ | Stable | Windows (shipped July 22, 2025). macOS Apple Silicon added in Firefox 145. Linux in Nightly. Android TBD (2026). |
| Safari 26+ | Stable | macOS Tahoe (Apple Silicon only), iOS 26, iPadOS 26, visionOS 26. Intel Macs do not get WebGPU by default. |

**Key gaps:** Linux support not universal; Safari desktop limited to Apple Silicon Macs on macOS Tahoe.

#### What It Means in Practice
- **Three.js WebGPURenderer** works today and falls back to WebGL 2 transparently
- **TSL (Three Shader Language)** compiles to WGSL for WebGPU and GLSL for WebGL — one codebase, both renderers
- **Compute shaders** on the web for the first time — enables GPU-based particle physics, fluid simulation, and other massively parallel workloads without GPGPU texture hacks
- **3-8x performance gains** for equivalent GPU workloads vs. WebGL [corrected — the previously cited "15x" figure applies only to a specific scenario comparing CPU-side particle updates in WebGL against GPU compute shaders in WebGPU, which is not an apples-to-apples comparison. Benchmarks from PixelsCommander, SitePoint, and others show 3-8x for comparable GPU tasks. Still significant.]

#### Verdict: Use Three.js WebGPURenderer, Let It Fall Back

Since Three.js (r171+, now r183) handles the WebGPU/WebGL fallback transparently, there is no reason not to target WebGPU. Write shaders in TSL, use WebGPURenderer, and users on older browsers get WebGL 2 automatically. Zero additional development cost for forward-compatible 3D.

The main benefit for this project: if we build any particle systems or compute-heavy effects, WebGPU compute shaders will perform dramatically better than WebGL GPGPU hacks on supported browsers.

**Sources:**
- [web.dev: "WebGPU is now supported in major browsers"](https://web.dev/blog/webgpu-supported-major-browsers)
- [webgpu.com: "WebGPU Hits Critical Mass"](https://www.webgpu.com/news/webgpu-hits-critical-mass-all-major-browsers-now-ship-it/)
- [Can I Use: WebGPU](https://caniuse.com/webgpu)
- [Three.js WebGPURenderer docs](https://threejs.org/docs/pages/WebGPURenderer.html)
- [Codrops: "Interactive Text Destruction with Three.js, WebGPU, and TSL"](https://tympanus.net/codrops/2025/07/22/interactive-text-destruction-with-three-js-webgpu-and-tsl/)

### Framework: Astro (Islands Architecture)

#### What It Is
A web framework that renders static HTML by default and selectively hydrates interactive components ("islands"). Ships near-zero JavaScript unless you explicitly opt in.

#### Why It Matters for This Project
Astro's islands architecture is **the ideal container for "play within polish"**:
- The site is mostly content (portfolio, writing, project pages) = static HTML, fast, SEO-friendly
- Interactive moments (3D elements, animations, the "portal" page) are hydrated islands
- `client:visible` — only hydrate when the element scrolls into view (critical for performance)
- `client:idle` — hydrate when the browser is idle (for below-fold interactivity)
- `client:load` — hydrate immediately (for above-fold hero elements)
- **Multi-framework support** — use React (for R3F/Three.js), Svelte, or vanilla JS islands on the same page

#### Performance Contract
Each `client:*` directive is a performance contract:
1. Astro renders the component to static HTML
2. Ships the island's JavaScript only when the directive condition is met
3. No monolithic JS bundle — each island is independent

This means a page with one Three.js island and ten static content sections ships only the Three.js code (when the island becomes visible), not a framework runtime for the entire page.

#### Verdict: Strong Candidate for Site Framework

Astro is the natural fit for a site that is primarily content with selective interactivity. It enforces the "Asimov polish" baseline (fast, accessible, well-structured) while allowing "Porter Robinson play" moments to exist as hydrated islands without penalizing the rest of the site.

> **Framework note — open decision for ASMV-5:** Doc 01 (Asimov Collective Analysis) recommends **Next.js** based on Asimov's own stack choices (11/12 projects use Next.js with App Router and RSC). That recommendation is valid — Next.js is the proven path for the Asimov-quality baseline, with a mature ecosystem, server components, and `next/font`/`next/image` optimizations. This document recommends Astro because the islands architecture better serves a content-heavy site with isolated interactive moments. **Both are defensible choices. ASMV-5 (Tech Stack Selection) should evaluate the tradeoffs:**
>
> | Factor | Next.js | Astro |
> |--------|---------|-------|
> | Asimov precedent | Direct match (11/12 projects) | No Asimov precedent |
> | Default JS shipped | Full React runtime | Near-zero (static HTML default) |
> | Interactive islands | All pages hydrated | Selective hydration (`client:visible`, etc.) |
> | React ecosystem (R3F, etc.) | Native | Via React islands |
> | Content pages (portfolio, writing) | RSC helps but still ships React | Static HTML, no JS unless opted in |
> | MDX daily updates | Supported | Excellent MDX support |

**Sources:**
- [Astro: Islands Architecture](https://docs.astro.build/en/concepts/islands/)
- [Strapi: "Astro Islands Architecture Explained"](https://strapi.io/blog/astro-islands-architecture-explained-complete-guide)

---

## Technology Recommendations: The Stack for Play Within Polish

This section is opinionated. It answers the question: for a site that wants Asimov polish with moments of Porter Robinson play, what specific technologies should we use?

### The Core Principle

**Every byte of JavaScript must earn its place.** The site should be fast, accessible, and well-structured by default. Interactivity is added surgically, not sprayed on.

This maps directly to the Asimov-Porter spectrum:
- **Asimov = the baseline.** Fast page loads, smooth scrolling, refined typography, elegant transitions. This costs near-zero JavaScript if done right.
- **Porter = the islands.** A 3D element here, a particle system there, an Easter egg hidden in the source code. These are hydrated only when needed.

### Recommended Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | **Astro** | Islands architecture enforces the performance contract. Static by default, interactive where chosen. |
| **Smooth scrolling** | **Lenis** (~3 KB) | Lightest option, compatible with sticky positioning, pairs with GSAP ScrollTrigger. |
| **Scroll animation** | **GSAP ScrollTrigger** (free) | Industry standard. Scrub, pin, batch, sequence. Now fully free. |
| **Micro-animations** | **GSAP core** + **CSS scroll-driven animations** | GSAP for complex choreography, native CSS for simple reveals/fades. Progressive enhancement. |
| **Page transitions** | **View Transitions API** + **GSAP Flip** | Browser-native transitions as baseline, GSAP Flip for complex state changes. Zero-bundle-cost transitions. |
| **3D / WebGL** | **Three.js** (via R3F if using React islands) | WebGPURenderer with automatic WebGL fallback. TSL for future-proof shaders. |
| **Text animation** | **GSAP SplitText** (free) | Per-character/word/line animation for typography reveals. |
| **Interaction** | **Custom cursor** + **CSS custom properties** + **pointer events** | Lightweight, no library needed. Custom cursor changes based on content context. |
| **Easter eggs** | **HTML comments** + **console.log art** + **hidden DOM elements** | Zero performance cost. Reward source-code explorers. Virtual Self approach. |

### What NOT to Use

| Technology | Why Not |
|-----------|---------|
| **Babylon.js** | Game engine weight for a portfolio site. Overkill. |
| **Locomotive Scroll** | Deprecated in favor of Lenis by the same community. |
| **ScrollSmoother** | 26 KB, rigid layout requirements, breaks position:fixed. Lenis is lighter and more flexible. |
| **Heavy particle libraries** (tsParticles, particles.js) | If we need particles, use Three.js GPU-based particles or TSL compute. Don't add another library. |
| **Framer Motion** (for scroll) | Good for React component animation, but ScrollTrigger is more capable for scroll-driven work and doesn't require React everywhere. |

### Interactive Element Roadmap (Ordered by Complexity)

These are ordered from "can ship in MVP" to "stretch goal":

#### Tier 1: MVP-Ready (Low Effort, High Impact)
1. **Lenis smooth scrolling** — global, immediate quality lift. 3 KB.
2. **GSAP scroll-driven content reveals** — fade-in, slide-up, stagger text. The Asimov baseline.
3. **Custom cursor** — changes personality near architecture work vs. code work. CSS + JS, no library.
4. **View Transitions** — smooth page-to-page transitions. Browser-native, zero JS.
5. **Console/source Easter eggs** — hidden messages for curious visitors. The Virtual Self approach. Zero cost.

#### Tier 2: Post-MVP (Medium Effort, Distinctive)
6. **Typography animation** — GSAP SplitText for hero text reveals, section headers that animate on scroll.
7. **Hover-driven micro-interactions** — project cards that respond to mouse position (tilt, depth, parallax).
8. **Generative background element** — a subtle, ambient Canvas 2D or simple WebGL shader that responds to scroll/mouse. Not a full 3D scene, just a living texture.

#### Tier 3: Signature Moment (High Effort, Memorable)
9. **The "portal" page** — one page on the site goes full Three.js immersive. Maybe the "bridge" between architecture and software. A spatial experience that feels like stepping through a door. This is the Porter Robinson moment.
10. **The studio desk** — the Now page could feature an interactive desk scene. Not a flat list of "currently reading/listening/building" but a spatial desk you explore. Three.js island, hydrated on visible.
11. **Physics-based page transitions** — elements don't just fade between pages; they have weight and momentum. GSAP Flip + custom physics easing.

### Performance Budget

For a site targeting "Asimov polish":

| Metric | Target | Why |
|--------|--------|-----|
| **LCP** | < 1.5s (desktop), < 2.5s (mobile) | Content-first. Active Theory achieves 1.3s with full WebGL. |
| **Total JS (initial)** | < 100 KB (gzipped) | Astro + Lenis + GSAP core. Three.js loads only on pages that use it. |
| **Three.js island JS** | < 350 KB (gzipped) | Only on pages with 3D content. Loaded via `client:visible`. |
| **CLS** | 0 | No layout shifts. Astro's static-first approach helps. |
| **TTI** | < 3s (mobile) | Islands hydrate lazily, not all at once. |

### The Design Philosophy (Synthesized)

From studying Porter Robinson's web projects, Active Theory's engineering, and the current tech landscape, the design philosophy for this site is:

1. **The site is a space, not a document.** Every page should feel like somewhere, not something. This doesn't require 3D everywhere — it requires intentional atmosphere (color, motion, rhythm).

2. **Interaction is expression, not navigation.** The best Porter Robinson moments (gaze-as-art-tool in Look at the Sky, exploration-as-play in SMILE! :D, curiosity-as-reward in Virtual Self) turn the user's actions into something creative. The site should have at least one moment where interaction produces something beautiful.

3. **Reward the curious.** Source code messages. Hidden pages. Console art. Easter eggs in the DOM. The internet should feel vast and mysterious, not fully comprehensible at a glance.

4. **Performance is design.** A slow site is a broken site. Active Theory's 1.3s LCP with full WebGL proves that performance and richness are not opposites. The island architecture enforces this — interactivity lives in islands, not in the baseline.

5. **Adapt, don't degrade.** Same experience on mobile and desktop, but the fidelity adjusts. A particle system with 10,000 particles on desktop might have 2,000 on mobile. The experience is the same; the rendering is different.

---

## Key Studios & Creators to Watch

Beyond Active Theory, these studios and individuals are pushing the "play within polish" frontier:

### darkroom.engineering (Lenis Creators)
- **URL:** https://darkroom.engineering
- Dev-first creative studio, creators of Lenis
- Also built: **Nuntio** (CRM), **Theca** (design asset management), **Specto** (performance monitoring)
- Notable projects: ibi.cash, badomensofficial.com, looped.poly.ai
- Philosophy: "If something is slow, buggy, or brittle, we fix it"
- Represent the quality bar for creative development with performance discipline

### Codrops / Tympanus
- **URL:** https://tympanus.net/codrops
- Consistently publishing cutting-edge tutorials combining GSAP + Three.js + Astro + Barba.js
- Recent relevant tutorials (2025-2026):
  - [Scroll-Revealed WebGL Gallery with GSAP, Three.js, Astro](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/)
  - [Cinematic 3D Scroll Experiences with GSAP](https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/)
  - [Interactive Text Destruction with Three.js, WebGPU, and TSL](https://tympanus.net/codrops/2025/07/22/interactive-text-destruction-with-three-js-webgpu-and-tsl/)
  - [Animating a 3D Scene with Spline's Timeline Tool](https://tympanus.net/codrops/2025/11/05/animating-a-3d-scene-with-splines-new-timeline-tool/)

### SMSY (Samsy.ninja)
- Paris-based creative technologist
- 50+ international awards including Cannes Lions and Awwwards
- 12+ years blending 3D interactive graphics, computational design, and motion
- Represents the individual practitioner version of what Active Theory does as a studio
