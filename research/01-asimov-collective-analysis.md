# Asimov Collective -- Deep Research & Design Analysis

> **Status:** Complete
> **Date:** 2026-03-02
> **Purpose:** Foundational research document for the personal site build. Reverse-engineers the Asimov Collective design language, tech stack, and creative philosophy so we can build at their level.

---

## Table of Contents

1. [Who Is Asimov Collective](#1-who-is-asimov-collective)
2. [Complete Project Catalog](#2-complete-project-catalog)
3. [Tech Stack Analysis](#3-tech-stack-analysis)
4. [The Asimov Signature -- Design Language](#4-the-asimov-signature----design-language)
5. [Typography System](#5-typography-system)
6. [Color Philosophy](#6-color-philosophy)
7. [Grid, Spacing & Layout](#7-grid-spacing--layout)
8. [Animation & Interaction Patterns](#8-animation--interaction-patterns)
9. [Content Structure & Pacing](#9-content-structure--pacing)
10. [Imagery Treatment](#10-imagery-treatment)
11. [Tone of Voice](#11-tone-of-voice)
12. [The Library -- Intellectual Identity as Design](#12-the-library----intellectual-identity-as-design)
13. [The Playground -- Creative Coding as Brand](#13-the-playground----creative-coding-as-brand)
14. [Standout Sites & Elements to Study](#14-standout-sites--elements-to-study)
15. [What This Means for Our Site](#15-what-this-means-for-our-site)

---

## 1. Who Is Asimov Collective

**Asimov Collective** is a design and development studio founded in 2017 [corrected — LinkedIn lists 2017 as the founding year; the previously stated "2021" may refer to a rebrand or public relaunch], headquartered in Dumbo, Brooklyn. They describe themselves as "a small group of designers and developers" who "partner with founders who are creating transformative technology, broadening philosophical frontiers, enhancing human performance and building American Dynamism."

### Founding Team

| Name | Role | Location |
|------|------|----------|
| Thomas Kim (TK) | Co-Founder | New York |
| James Gilliland (JG) | Co-Founder (architecture background -- Syracuse School of Architecture) | New York |
| Chase Wheeler (CW) | Co-Founder | California |

### Key Team Members

| Name | Role | Notes |
|------|------|-------|
| Connor Rothschild (CR) | Director of Technology | Based in Texas. 6+ years design/dev experience, 68+ projects. Rice University graduate. Focus on data visualization and information design. |
| Hongrae Kim | Designer | New York-based multi-disciplinary designer focused on brand identity and advertising |

The team is deliberately small (2-10 people). The site maps team members to locations: **NY** (TK & JG), **CA** (CW), **TX** (CR).

### What Makes Them Notable

- James Gilliland studied architecture -- this is a direct parallel to Julianna's background and likely informs the studio's spatial, typographic, and compositional sensibility.
- They are not a large agency. They are a collective -- a small interdisciplinary team that works closely with founders.
- Their client roster reads like an a16z "American Dynamism" portfolio: nuclear energy, AI, robotics, maritime drones, cryptocurrency, cloud seeding.
- They do *everything*: brand design, strategy, copywriting, web design + development, video production, photography, 3D visualization, print/editorial design, industrial design, and product design.

### Channels

| Platform | URL |
|----------|-----|
| Website | [asimovcollective.com](https://www.asimovcollective.com/) |
| Twitter/X | [@asimov_co](https://x.com/asimov_co) |
| Instagram | [@asimov_co](https://www.instagram.com/asimov_co/) (276 posts, 219 followers) |
| GitHub | [asimov-collective](https://github.com/asimov-collective) (no public repos) |
| Medium | [@asimovcollective](https://medium.com/@asimovcollective) |
| Playground | [playground.asimovcollective.com](https://playground.asimovcollective.com/) |

---

## 2. Complete Project Catalog

All 12 projects listed on asimovcollective.com as of March 2026, in portfolio display order:

| # | Project | Description | Services | Accent Color | External URL |
|---|---------|-------------|----------|-------------|-------------|
| 1 | **Shinkei Systems** | State-of-the-art robotics and AI for American commercial fishing -- artisanal quality at industrial scale | Brand Design, Strategy, Web Design + Dev, Copywriting, Product Design, Identity Design | `#ff9500` (orange) | shinkeisystems.com |
| 2 | **Valar Atomics** | Scaling nuclear energy for heavy industrial power and clean hydrocarbon fuel production | Brand Design, Strategy, Copywriting, Web Design + Dev, Video Production, Photography, 3D Visualization, Product Design, Industrial Design | `#000000` (black) | valaratomics.com |
| 3 | **Rainmaker** | Cutting-edge cloud seeding systems providing abundant fresh water for farms, watersheds, and ecosystems | Brand Design, Strategy, Copywriting, Web Design + Dev | `#1c2c26` (deep forest green) | rainmaker.com |
| 4 | **Hadrian** | Building the planet's most efficient factories to accelerate a free, abundant, spacefaring future | Brand Design, Strategy, Copywriting, Web Design + Dev, Video Production | `#002548` (deep navy) | hadrian.co |
| 5 | **Midjourney** | Independent research lab exploring new mediums of thought and expanding the imaginative powers of the human species | Web Design + Dev, Print Production, Photography, Editorial Design | *N/A* | mag.midjourney.com |
| 6 | **Prime Intellect** | Democratizing AI development through its global compute platform and distributed training protocol | Brand Design, Strategy, Copywriting, Web Design + Dev | `#1c1c1c` (near-black) | primeintellect.ai |
| 7 | **Venice AI** | First private, censorship-free AI platform and API with access to the world's best open-source models | Brand Design, Strategy, Copywriting, Web Design + Dev, Product Design | `#bea989` (warm tan/gold) | venice.ai |
| 8 | **Monumental Labs** | Bridging workshop traditions of fine arts with cutting-edge technology for magnificent sculpture and stone architecture at scale | Brand Design, Strategy, Copywriting, Web Design + Dev | `#F4F0E5` (warm cream) | monumentallabs.co |
| 9 | **Reserve** | Cryptocurrency project developing infrastructure for stable, inflation-resistant money | Brand Design, Strategy, Copywriting, Web Design + Dev, Product Design | `#0152AC` (deep blue) | reserve.org |
| 10 | **Extropic** | Pioneering thermodynamic computing -- revolutionary hardware and software stack for generative AI | Brand Design, Strategy, Copywriting, Web Design + Dev, Industrial Design | `#ffca4a` (vibrant yellow) | extropic.ai |
| 11 | **Terrain** | Early-stage investment firm focused on software and technology | Brand Design, Strategy, Copywriting, Web Design + Dev | `#D2D1CA` (warm beige) | terrain.vc (currently offline) |
| 12 | **Ulysses** | Modular family of maritime UAVs enabling read-write access in the ocean, from environmental restoration to ISR | Identity Design, Strategy, Copywriting, Web Design + Dev, Brand Design | `#096fe8` (vibrant blue) | ulysses.inc |

### Service Frequency

Across all 12 projects, the most common service tags are:

| Service | Count |
|---------|-------|
| Web Design + Development | 12/12 |
| Copywriting | 12/12 |
| Strategy | 12/12 |
| Brand Design | 11/12 |
| Product Design | 4/12 |
| Video Production | 3/12 |
| Industrial Design | 3/12 |
| Identity Design | 2/12 |
| Photography | 2/12 |
| Editorial Design | 1/12 |
| Print Production | 1/12 |
| 3D Visualization | 1/12 |

**Key observation:** Every single project includes Web Design + Development, Copywriting, and Strategy. Asimov is not just a web design shop -- they are a brand consultancy that always ships a website as the primary deliverable. The copy and strategy are inseparable from the design.

---

## 3. Tech Stack Analysis

### Asimov's Own Portfolio Site (asimovcollective.com)

| Component | Technology |
|-----------|-----------|
| **Framework** | Next.js (React) with App Router and React Server Components |
| **Styling** | Tailwind CSS |
| **CMS** | BaseHub (AI-native headless CMS) |
| **Smooth Scroll** | Custom implementation with lerp-based interpolation (lerp: ~0.8, approximate — see Section 8 note) |
| **Analytics** | Google Analytics (GA-SDJD2PHPNG) |
| **Hosting** | Vercel (inferred from Next.js deployment patterns) |
| **Image Format** | WebP with blur data URL placeholders for progressive loading |
| **Fonts** | Custom OTF/WOFF2 files loaded via @next/static/media |
| **View Tracking** | Custom event ingestion system via BaseHub |

### Client Sites -- Stack Comparison

| Client | Framework | CMS | Animation | Fonts | Notable |
|--------|-----------|-----|-----------|-------|---------|
| **Hadrian** | Next.js | - | Lottie animations, CSS transitions | Sans-serif + monospace dual system | Gold accent, deep navy, grid-heavy |
| **Rainmaker** | Next.js (SSG) | TinaCMS | Minimal (CSS only) | Sans-serif system | Performance-focused, minimal JS |
| **Prime Intellect** | Next.js (RSC) | - | GSAP-style hover transitions | "Favorit" + system fonts | Dark theme, border-driven design |
| **Venice AI** | Next.js | - | Carousel/scroll-based | Contemporary sans-serif | Dark aesthetic, privacy-forward |
| **Extropic** | Next.js 15+ | Sanity.io | Video backgrounds, carousel | Monospace default + custom OTF | Deep brown/burgundy, thermodynamic theme |
| **Reserve** | Framer | - | Will-change transforms | TWK Lausanne + Inter | Blue-dominant, grid/cell patterns |
| **Monumental Labs** | Next.js (SSG) | TinaCMS-like + MDX | CSS-based (minimal) | Clean sans-serif | Stone renaissance aesthetic |
| **Valar Atomics** | Next.js (SSG) | - | Smooth scroll (lerp 0.8) | Sans-serif system | Industrial, 3D visualization |
| **Ulysses** | Next.js | Sanity.io | Intersection-based, slide transitions | Custom OTF/TTF | Ocean blue palette |
| **Shinkei Systems** | (older build) | - | - | Sans-serif system | Orange accent |

### Key Tech Stack Takeaways

1. **Next.js is the foundation.** 11 of 12 projects use Next.js. The lone exception (Reserve) uses Framer. Next.js with App Router and React Server Components is the clear default.

2. **Tailwind CSS everywhere.** Tailwind utility classes appear across all checked Next.js builds [verified on hadrian.co and valaratomics.com, 2026-03-02], often with custom design tokens (`bg-blue`, `text-gold`, `font-mono`). Likely universal across their Next.js projects, though not individually confirmed for every site.

3. **CMS varies by project.** BaseHub for their own site, TinaCMS for content-heavy sites, Sanity.io for newer projects. The choice seems client-dependent, not dogmatic.

4. **Animation is restrained.** No heavy GSAP or Framer Motion detected on most sites. The primary animation tool is CSS transitions + a custom lerp-based smooth scroll implementation (lerp: 0.8). Lottie is used for specific micro-interactions (Hadrian). Video is preferred over programmatic animation for rich motion.

5. **Custom fonts are delivered as OTF/WOFF2** via Next.js font optimization -- no Google Fonts, no CDN. Every project has its own typography.

6. **Image optimization is aggressive.** WebP format universally, blur data URL placeholders for progressive loading, responsive srcSets at multiple breakpoints.

7. **Hosting is likely Vercel** across the board (Next.js default deployment target).

### The Playground (playground.asimovcollective.com)

This is a separate creative coding laboratory with **80 experiments** [corrected — the site header reads "80 experiments" as of March 2026] spanning:
- Three.js / R3F (React Three Fiber) for 3D graphics
- Custom GLSL shaders
- CSS experiments
- Variable font explorations
- Video integrations
- Noise generators, watercolor effects, geometric patterns

Experiment names often reference their client work ("Extropic Gradient", "Illium", "Testudo"), suggesting these are R&D prototypes that feed directly into production work. This is where Asimov prototypes the visual effects that appear in their client sites.

---

## 4. The Asimov Signature -- Design Language

The "Asimov signature" is what makes any site they build instantly recognizable as theirs, even across wildly different industries (nuclear energy, AI, fishing, cryptocurrency). Here are the consistent patterns:

### Core Principles

1. **Restraint over spectacle.** Every element earns its place. There are no decorative flourishes. White space is the primary design element.

2. **Typography is the design.** The type system does 80% of the visual work. Layouts are typographically driven, not image-driven.

3. **One accent color per brand.** Each project gets a single defining color used sparingly. The rest is black, white, and gray. This creates immediate brand recognition with minimal visual complexity.

4. **Content pacing, not content density.** Sections breathe. Images are large. Text is sparse but precise. The experience unfolds vertically like reading a monograph.

5. **Intellectual seriousness.** The copy, the Library page, the reading list -- everything signals that this is a studio that reads Borges and Asimov. The design reflects this: it's literary, not flashy.

6. **The web as publication.** Sites feel like beautifully designed print pieces that happen to live on the web. There's a magazine/editorial quality to the layouts.

---

## 5. Typography System

### Font Strategy

Asimov uses **custom typefaces** for every project -- never system fonts, never obvious Google Fonts. Each project gets a carefully selected font pairing that reflects its identity. Fonts are delivered as self-hosted OTF/WOFF2 files.

### Observed Font Patterns

| Pattern | Description |
|---------|-------------|
| **Sans-serif dominant** | The primary typeface is almost always a clean, geometric or grotesque sans-serif |
| **Monospace as accent** | Several projects (Hadrian, Extropic, Prime Intellect) use a monospace font for labels, navigation elements, or metadata -- creating a "technical" register |
| **Dual-font system** | Most projects use exactly 2 typefaces: one for body/headlines, one for accents/labels |
| **Custom or rare foundries** | "Favorit" (Prime Intellect), "TWK Lausanne" (Reserve) -- these are from independent type foundries, not mainstream choices |

#### Asimov's Own Portfolio Fonts [verified 2026-03-02]

The typefaces used on asimovcollective.com itself are:

| Role | Typeface | Foundry | Notes |
|------|----------|---------|-------|
| **Primary sans-serif** | **TWK Lausanne** | Weltkern (WK) | Neo-grotesque by Nizar Kazan, inspired by Folio/Helvetica. Full 20-weight family launched 2021. This is the workhorse — headings, body, navigation. |
| **Serif accent** | **Libre Caslon** | Pablo Impallari (open source) | Available on Google Fonts in Text and Display variants. Used sparingly for editorial/literary moments. |
| **Monospace** | **Suisse Int'l Mono** | Swiss Typefaces (Ian Party) | Part of the Suisse superfamily. Used for labels, metadata, technical details. |

All three are self-hosted as OTF/WOFF2 files via `@next/static/media`, with Arial as the CSS fallback.

### Typography Hierarchy

Based on observation across all project pages:

| Level | Usage | Character |
|-------|-------|-----------|
| **Project Title** | Large, often the largest text on the page | Clean, bold, sans-serif. No decorative treatment. |
| **Project Description** | One sentence, always one sentence | Medium weight, substantial size. Acts as a subtitle/tagline. |
| **Service Tags** | Small caps or small text labels | Often monospace or light weight. Treated as metadata. |
| **Body Copy** | Rarely present on case study pages | When it appears, it's minimal. The images do the talking. |
| **Navigation** | Restrained, often uppercase small text | Never competing with content. Background element. |

### Spacing & Sizing Patterns

- **Generous line-height** throughout -- text is never cramped
- **Letter-spacing** is used on labels and nav items (slight tracking for uppercase text)
- **Font weights** are restrained: regular (400) and medium (500) dominate; bold is rare
- **Responsive scaling** is handled via Tailwind breakpoints, not fluid typography -- sizes step between mobile, tablet, and desktop

---

## 6. Color Philosophy

### The "One Color" Rule

The most distinctive aspect of Asimov's color approach: **each project is defined by a single accent color, used against a black/white/gray foundation.**

| Project | Accent Color | Hex | Character |
|---------|-------------|-----|-----------|
| Shinkei Systems | Orange | `#ff9500` | Energetic, industrial |
| Valar Atomics | Black | `#000000` | Severe, powerful |
| Rainmaker | Forest Green | `#1c2c26` | Natural, grounded |
| Hadrian | Navy Blue | `#002548` | Military-industrial, precise |
| Prime Intellect | Near-Black | `#1c1c1c` | Technical, anonymous |
| Venice AI | Warm Tan | `#bea989` | Luxurious, warm |
| Monumental Labs | Cream | `#F4F0E5` | Classical, stone-like |
| Reserve | Deep Blue | `#0152AC` (portfolio site) / `#0151AF` (case study text) | Financial, trustworthy — see note below |
| Extropic | Vibrant Yellow | `#ffca4a` | Energetic, thermodynamic |
| Terrain | Warm Beige | `#D2D1CA` | Understated, neutral |
| Ulysses | Vibrant Blue | `#096fe8` | Ocean, clarity |

### Color Observations

1. **No gradients** in the traditional sense. When color is used, it is flat and confident.
2. **Accent colors are thematic** -- they directly relate to the client's domain. Forest green for cloud seeding. Deep blue for finance. Cream for stone sculpture.
3. **Background is always white or very light.** Dark themes are reserved for specific client contexts (Prime Intellect, Extropic).
4. **The accent color appears in small doses:** a colored underline, a hover state, a navigation highlight. Never a full-bleed background color wash.
5. **The portfolio site itself uses NO accent color** -- it's pure black and white with subtle gray. The projects provide the color.

### The Reserve Brand Case Study -- Color Philosophy in Practice

From Asimov's published case study on the Reserve rebrand:

> "Reserve Blue is the hallmark of the brand aesthetic. We took inspiration from Yves Klein and his singular use of blue across all kinds of artistic mediums. The hue chosen, #0151AF, is a balance between a deep oceanic navy that is vast and serious, and a saturated cobalt that is energetic and tech-forward, communicating a calm confidence that can only come from years of focused work."

This is how Asimov thinks about color: as **philosophy**, not decoration. Every color choice has a thesis.

> **Hex code note [verified 2026-03-02]:** The Asimov portfolio site metadata uses `#0152AC` for Reserve's accent, while the published case study text (above) specifies `#0151AF`. These differ by only 3 units in the blue channel (AC=172 vs AF=175) — likely a rounding difference between the original design file and the web implementation. For our purposes, either value faithfully represents "Reserve Blue."

---

## 7. Grid, Spacing & Layout

### Grid System

The layout uses a **responsive grid** system built with Tailwind CSS, observed across all projects:

| Breakpoint | Behavior |
|------------|----------|
| **Mobile** | Single column, full-width content, 20px horizontal padding |
| **Tablet** (max-tablet class) | 2-column grid, adjusted padding |
| **Desktop** | Full grid layout, content centered with generous margins |

### Image Layout System

Every case study page uses exactly three image gallery formats:

| Format | Dimensions | Purpose |
|--------|-----------|---------|
| **Wide** | ~2336x1160px (or 4000x1987px, 5000x2483px) | Hero/showcase images, full-width landscape compositions |
| **Square** | ~1156x1156px (or 4000x4000px, 5000x5000px) | Detail shots, brand applications, side-by-side comparisons |
| **Tall** | ~1156x2340px (or 5000x10122px) | Mobile mockups, vertical compositions, editorial spreads |

This three-format system is **absolutely consistent** across every project. It's a template, and it works because the proportions are always the same, creating visual rhythm across the portfolio.

### Spacing Patterns

- **Between sections:** Very generous -- likely 80-120px or more
- **Between images:** Consistent spacing maintains the gallery rhythm
- **Content width:** Text content is narrower than full-width images, creating a hierarchy of scale
- **Padding on mobile:** 20px horizontal padding (confirmed from CSS class `max-tablet:px-[20px]`)
- **No visible grid lines or containers** -- the grid is felt, not seen

### Layout Philosophy

The layout reads like a **publication or monograph**. Key characteristics:
- **Vertical scroll is the primary navigation mode** -- no tabs, carousels (with rare exceptions), or complex navigation
- **Each section is one "thought"** -- one image composition, one piece of text
- **Images are the primary content** -- text is secondary, minimal, and precise
- **No sidebar, no secondary columns** on case study pages -- pure vertical flow

---

## 8. Animation & Interaction Patterns

### Smooth Scroll

The signature interaction across Asimov sites is **lerp-based smooth scrolling** with a lerp value of approximately 0.8. This creates a slightly "weighted" scroll feel -- content doesn't stop immediately when you stop scrolling, it decelerates smoothly. The implementation appears to be custom (not Lenis, not GSAP ScrollSmoother), though it shares the same principles.

> **Lerp interpretation note:** A lerp factor of 0.8 means the scroll position moves 80% of the remaining distance toward its target each frame — producing a fast, responsive feel that decelerates quickly. This is notably higher than Lenis's default (~0.1), which produces a slower, more cinematic glide. The difference in convention matters: Lenis uses `lerp` as a smoothing factor where lower = smoother, while a raw lerp implementation with 0.8 means "catch up quickly." Both produce smooth scrolling, but with very different character. The 0.8 value was observed in minified source and should be treated as approximate.

### Page Transitions

- **Navigation transitions** use CSS with `duration-500` (500ms)
- **Content fades** are subtle -- elements appear rather than animate in dramatically
- No full-page transitions detected (no Barba.js, no GSAP FLIP)

### Hover Interactions

- **Project cards on the homepage** respond to hover with subtle effects
- **Buttons and links** have restrained hover states (color shifts, underline reveals)
- **"Visit [Project]" CTAs** have animated arrow icons that slide in on hover

### Scroll-Triggered Animation

Minimal. Some sites use:
- **Intersection Observer** for lazy-loading and revealing content as it enters the viewport
- **CSS scroll-margin** for anchor navigation (`scroll-mt-17`)
- **ResizeObserver** for responsive recalculation

But there are **no dramatic scroll-triggered animations** -- no parallax, no text reveals, no staggered element entrances. This is a deliberate choice: the content speaks for itself.

### Video Over Animation

Where motion is needed, Asimov uses **actual video** (MP4) rather than programmatic animation. Multiple project pages embed video assets:
- Valar Atomics: hero video
- Extropic: video backgrounds
- Reserve: logo reveal animation as video
- Monumental Labs: embedded video in square gallery
- Terrain: video assets

This is a pragmatic choice -- video is easier to produce at high quality and doesn't introduce JavaScript complexity.

### The Exception: Lottie

Hadrian's site uses **Lottie animations** for interactive elements with staggered delays (0.9s-1.3s). This is the most animation-forward of all Asimov client sites and represents the upper bound of their animation complexity.

---

## 9. Content Structure & Pacing

### Homepage (asimovcollective.com)

The homepage is a **single vertical scroll** that serves as both portfolio and about page:

1. **Mission statement** at the top: "We partner with founders who are creating transformative technology, broadening philosophical frontiers, enhancing human performance and building American Dynamism."
2. **Project list** -- all 12 projects displayed in a scrollable list
3. **Team location** -- minimal: initials and city codes (NY, CA, TX)
4. **Footer** with social links and hiring note
5. **Two navigation links** only: Library and Projects (which loops back to homepage)

The navigation is almost invisible. Two links. That's it. The restraint is extreme and intentional.

### Case Study Pages

Every case study follows an identical structure:

```
[Back to Home]     [Visit {Project}]

{Project Name}
{One-sentence description}

{Service Tags -- comma-separated}

[Wide Image 1]
[Wide Image 2]
[Wide Image 3]

[Square Image 1] [Square Image 2] [Square Image 3]

[Tall Image 1]

<-- Previous: {Project}    Next: {Project} -->
```

Observations:
- **No prose.** There is no "about the project" paragraph, no process description, no testimonials. Just the one-line description, the service tags, and the images.
- **No captions** on images.
- **No dates** on projects (though metadata shows publish dates).
- **Sequential navigation** at the bottom encourages browsing through all projects.
- **View counter** is tracked internally but not displayed.

This is extremely disciplined. The work speaks entirely through images and a single sentence.

### Library Page

The Library is organized as a **visual grid of curated references** -- films, essays, and talks. No categorization beyond format (Watch/Read). 16 items total. Each has:
- A cover image
- A title and author
- A one-line description

The Library is not a blog. It's a reading list. It communicates intellectual identity through curation.

---

## 10. Imagery Treatment

### Photography & Visuals

- **Full-bleed images** dominate every project page
- **Image quality is extremely high** -- dimensions go up to 5000x10122px for tall format
- **WebP format** universally for performance
- **Blur data URL placeholders** create a progressive loading effect (content appears to "develop" like a photograph)
- **No image borders, rounded corners, or drop shadows** -- images sit directly in the white space
- **No filters or overlays** on photographs (except where video masks are used)

### Composition Patterns

| Pattern | Description |
|---------|-------------|
| **Hero as full-width landscape** | The first image is always a wide-format hero that establishes the project's visual world |
| **Detail grid** | Square-format images show brand applications, details, and close-ups |
| **Mobile/vertical showcase** | Tall-format images show mobile interfaces, editorial spreads, or vertical compositions |
| **Mixed media** | Video and static images coexist in the same gallery system |

### What's NOT in the imagery

- No mockup frames (no laptop/phone frames holding screenshots)
- No decorative backgrounds behind images
- No infographics or diagrams
- No team photos or behind-the-scenes content
- No process documentation

The imagery is pure portfolio: the finished work, presented cleanly, at high resolution.

---

## 11. Tone of Voice

### Copy Style

Asimov's copy is **minimal, precise, and philosophical.** Every project gets exactly one sentence of description, and that sentence is carefully crafted.

Examples:
- "Shinkei Systems is applying state of the art robotics and AI to American commercial fishing, enabling artisanal quality at industrial scale."
- "Monumental Labs bridges the workshop traditions of fine arts with cutting-edge technology to make magnificent sculpture and stone architecture accessible at scale."
- "Extropic is pioneering thermodynamic computing, a revolutionary hardware and software stack that will unlock the potential of generative AI."

### Copy Patterns

1. **Present tense, active voice** -- "{Company} is doing/building/creating..."
2. **Mission-forward** -- the description is about what the company does for the world, not about the design work Asimov did
3. **No self-promotion** -- Asimov never says "we designed a beautiful website for X." They describe the client's mission.
4. **Ambitious scope** -- "expanding the imaginative powers of the human species," "accelerate a free, abundant, spacefaring future," "make Earth habitable." The language is intentionally grand.
5. **No jargon** -- the descriptions are accessible to anyone. Technical concepts are translated into human language.
6. **No humor** -- the tone is consistently serious, but not stuffy. Earnest is the word.

### The Mission Statement

"We partner with founders who are creating transformative technology, broadening philosophical frontiers, enhancing human performance and building American Dynamism."

This is the core of the Asimov brand voice: earnest belief in building the future, expressed without irony.

---

## 12. The Library -- Intellectual Identity as Design

The Library page ([asimovcollective.com/library](https://www.asimovcollective.com/library)) is one of the most distinctive elements of the Asimov site. It's a curated collection of 16 films, essays, and talks that signal who Asimov Collective is intellectually.

### The Collection

**Films/Videos (Watch):**

| Title | Author/Creator | Significance |
|-------|---------------|-------------|
| *Samsara* | Ron Fricke | 70mm meditation across 25 countries -- pure visual storytelling |
| *Voyager Golden Record* | Carl Sagan | Message from humanity to space -- the ultimate design brief |
| *Macworld 2007* | Steve Jobs | Product launch as theater -- "one more thing" |
| *The Color of Pomegranates* | Sergei Parajanov & Nicholas Jaar | Cinema as high art form |
| *Destino* | Walt Disney & Salvador Dali | 58-year collaborative project between art and entertainment |

**Essays/Readings (Read):**

| Title | Author | Significance |
|-------|--------|-------------|
| *The Last Question* | Isaac Asimov | The studio's namesake. Explores entropy reversal -- the ultimate question |
| *Rise of the Garden Empires* | Wolf Tivy | Ecology and industry synthesis |
| *Tlon, Uqbar, Orbis Tertius* | Jorge Luis Borges | Rethinking maps and reality -- world-building through text |
| *Technology: The Emergence of a Hazardous Concept* | Leo Marx | Critical examination of "technology" as an idea |
| *Confronting Modernism Means Overcoming Humanism* | Charlie Smith | Philosophical exploration of uncertainty |
| *That Mighty Sculptor Time* | Marguerite Yourcenar | Antiquities restoration philosophy |
| *How to Start a Startup* | Paul Graham | YCombinator wisdom -- the practical entrepreneurial angle |
| *The Only Reason to Explore Space* | Marko Jukic | Justification for space exploration |
| *A School of Strength and Character* | Tanner Greer | 19th-century institutional virtues |
| *Citizenship in a Republic* | Theodore Roosevelt | "The Man in the Arena" -- duty and action |

### Why the Library Matters for Our Project

The Library is Asimov's most powerful brand signal. It says: "We are not just designers. We read Borges and Asimov. We think about entropy and space exploration and the philosophy of technology. We partner with people who are building civilization-scale things because we believe in civilization-scale things."

**For Julianna's site**, a similar curated references/influences page would be enormously powerful -- especially one that bridges architecture texts (Pallasmaa, Ando, Kahn) with software/AI thinking. The Library format is perfect for this.

---

## 13. The Playground -- Creative Coding as Brand

[playground.asimovcollective.com](https://playground.asimovcollective.com/) hosts **80 interactive experiments** [verified 2026-03-02] in creative coding. This is a separate subdomain that serves as an R&D lab and creative portfolio.

### Technologies Used

| Technology | Purpose |
|-----------|---------|
| Three.js / R3F | 3D graphics and WebGL rendering |
| Custom GLSL shaders | Visual effects, gradients, noise |
| CSS experiments | Typography, layout, animation |
| Variable fonts | Advanced typographic explorations |
| Video | Media integration experiments |

### Experiment Categories

Experiments include gradient explorations, text animations, noise generators, watercolor effects, geometric patterns, and more. Names like "Extropic Gradient" and "Illium" and "Testudo" suggest these are directly tied to client R&D -- prototypes for visual effects that end up in production sites.

### Why It Matters

The Playground does two things:
1. **Shows technical depth** -- these are not template users. They write shaders and build 3D experiences.
2. **Functions as a creative lab** -- it's where they experiment without client constraints, which feeds the quality of the client work.

**For our project**: We don't need 80 experiments at launch. But having one or two interactive elements (maybe on the homepage or a hidden page) that demonstrate Julianna's technical craft would align with this approach -- especially something that bridges architectural computation with web interaction.

---

## 14. Standout Sites & Elements to Study

### Tier 1: Study These Closely

**1. The Asimov Portfolio Site itself (asimovcollective.com)**
- The minimal navigation (two links total)
- The Library page as intellectual identity
- The case study template and its extreme restraint
- The one-color-per-project system
- The smooth scroll implementation

**2. Hadrian (hadrian.co)**
- The most polished client site in the portfolio
- Dual-font system (sans-serif + monospace) is elegant
- Lottie micro-interactions are the right amount of motion
- Gold accent on navy blue is striking
- Video-first hero with gradient overlays

**3. Reserve (reserve.org)**
- The most detailed brand case study available (Medium article)
- TWK Lausanne + Inter font pairing is sophisticated
- Grid/cell border pattern is distinctive
- The "Yves Klein blue" color philosophy approach

**4. Extropic (extropic.ai)**
- Sanity.io CMS integration worth studying
- Monospace-forward typography creates strong identity
- The playground "Extropic Gradient" experiment connects R&D to production
- Deepest color use (burgundy/brown theme)

### Tier 2: Study Specific Elements

**5. Valar Atomics**
- Most ambitious service scope (3D visualization, industrial design, product design)
- Video-first approach with smooth scroll
- How they present 3D work on a 2D web page

**6. Monumental Labs**
- The "stone renaissance" aesthetic -- how architecture/sculpture is presented on the web
- Cream accent color creating warmth
- MDX content management approach

**7. Prime Intellect**
- Dark theme execution
- "Favorit" font choice and how it creates a distinctive technical identity
- Border-driven design system

**8. The Playground (playground.asimovcollective.com)**
- Shader experiments
- How they bridge creative coding with commercial work
- The naming convention (client-referenced experiment names)

### Tier 3: Reference for Specific Patterns

| Site | What to Study |
|------|--------------|
| Venice AI | Warm color (tan/gold) on white -- how it feels luxurious |
| Midjourney Magazine | Print-to-web editorial design. Inconsolata monospace on a commerce site. |
| Ulysses | Ocean-themed design language. Sanity CMS + intersection animations. |
| Shinkei Systems | Orange as an accent color. Identity design approach. |

---

## 15. What This Means for Our Site

### Design Principles to Adopt

1. **Start with restraint.** The Asimov approach is subtractive. Start with nothing and add only what's necessary. If something doesn't earn its place, remove it.

2. **Typography is the design.** Invest time in selecting fonts. Consider a custom or independent foundry pairing (not Google Fonts). A sans-serif primary + monospace accent system would work well for bridging architecture (precision, drawing) and software (code, systems).

3. **One accent color.** Choose a single color that defines Julianna's brand. Use it sparingly. Let the rest be black, white, and intentional gray.

4. **Content pacing > content density.** Each section should be one thought. Let images breathe. Use generous whitespace. The page should feel like turning pages in a monograph.

5. **Write copy like Asimov.** Mission-forward, present tense, ambitious but accessible. One sentence should do the work of a paragraph.

6. **Build a Library page.** Curate 10-20 references across architecture, software, AI, and philosophy. This becomes the intellectual identity of the site -- the bridge between disciplines made visible through reading/influence.

### Tech Stack Recommendation

Based on Asimov's choices:

| Component | Recommendation | Rationale |
|-----------|---------------|-----------|
| **Framework** | Next.js (App Router) | Asimov's default. Server Components for performance. |
| **Styling** | Tailwind CSS | Asimov's default. Fast iteration, responsive design. |
| **CMS** | BaseHub or MDX | BaseHub for dynamic content. MDX for the Claude skill integration. |
| **Smooth Scroll** | Custom lerp or Lenis | Match the Asimov feel. Lerp ~0.8 (see note below). |
| **Fonts** | Self-hosted OTF/WOFF2 | Via next/font for optimization. |
| **Images** | WebP + blur placeholders | Next.js Image component handles this. |
| **Hosting** | Vercel | Natural for Next.js. Free tier is generous. |
| **Analytics** | Vercel Analytics or Plausible | Privacy-respecting. |

> **Framework note — open decision for ASMV-5:** This document recommends Next.js based on Asimov's own stack choices (11/12 projects use Next.js). However, Doc 02 (Porter Robinson & Interactive Web Research) recommends **Astro** for its islands architecture, which enforces a performance contract: static HTML by default, interactive components hydrated selectively. Both are valid. Next.js is the proven Asimov path with RSC and a mature ecosystem; Astro is architecturally better suited for a content-heavy site with isolated interactive moments (the "play within polish" model). **This is an open decision for ASMV-5 (Tech Stack Selection) to resolve.** See Doc 02's framework section for the Astro case.
>
> An alternative worth considering: **Astro for the framework with React islands for interactive components** — this combines Astro's static-first performance with React Three Fiber for 3D elements, without requiring React for the entire site.

### What to Do Differently

Asimov builds for clients. Julianna is building for herself. This opens up possibilities they don't use:

1. **The Now page has no Asimov precedent.** This is Julianna's innovation. It should feel Asimov in quality but be wholly original in concept.

2. **Interactive/computational elements.** The Asimov client sites are mostly static. But the Playground shows they *can* build interactive experiences. Our site can be more playful than their client work while maintaining the same quality bar.

3. **The bridge between architecture and software.** Asimov's co-founder James Gilliland has architecture training, but this never explicitly surfaces in their client work. For Julianna, the bridge IS the story. The architecture-to-web connection should be visible in the design language itself.

4. **Personal voice.** Asimov's copy is client-facing and third-person. Julianna's site should have a personal, first-person voice that still carries the same earnestness and precision.

5. **The daily update mechanism.** No Asimov site has this. The Claude skill for daily updates is a genuine innovation that, if executed well, becomes the most compelling thing on the site.

---

## Sources

- [Asimov Collective -- Main Site](https://www.asimovcollective.com/)
- [Asimov Collective -- Library](https://www.asimovcollective.com/library)
- [Asimov Collective -- Playground](https://playground.asimovcollective.com/)
- [Asimov Collective -- GitHub](https://github.com/asimov-collective)
- [Asimov Collective -- Twitter/X](https://x.com/asimov_co)
- [Asimov Collective -- Instagram](https://www.instagram.com/asimov_co/)
- [Asimov Collective -- LinkedIn](https://www.linkedin.com/company/asimov-collective)
- [Asimov Collective -- Medium](https://medium.com/@asimovcollective)
- [Connor Rothschild -- Portfolio](https://www.connorrothschild.com/)
- [Connor Rothschild -- GitHub](https://github.com/connorrothschild)
- [Reserve Brand Case Study](https://blog.reserve.org/meet-the-new-reserve-brand-565c59377acd)
- [Asimov Collective Editorial Designer Job Posting](https://www.career.com/job/asimov-collective/editorial-designer/j202406150232427908925)
- [BaseHub CMS](https://basehub.com/)
- [Lenis Smooth Scroll](https://lenis.darkroom.engineering/)
- Individual project sites: [hadrian.co](https://www.hadrian.co/), [rainmaker.com](https://www.rainmaker.com/), [primeintellect.ai](https://primeintellect.ai/), [venice.ai](https://venice.ai/), [extropic.ai](https://www.extropic.ai/), [monumentallabs.co](https://www.monumentallabs.co/), [reserve.org](https://reserve.org/), [valaratomics.com](https://www.valaratomics.com/), [ulysses.inc](https://www.ulysses.inc/), [mag.midjourney.com](https://mag.midjourney.com/)
