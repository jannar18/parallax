# ASMV-15: Daily Update Content Design — Blueprint

## Context

The daily update ("Now" / "Studio Desk") is the killer feature of parallax.studio. When someone visits and sees today's date with real artifacts from real work — that's the moment no other portfolio site delivers.

The existing implementation on `worktree-agent-a83e7ee9` has a reasonable schema and page, but it treats the daily entry as a **writing exercise** (write prose, maybe attach an image). Julianna's vision is fundamentally different: **the artifacts ARE the entry.** Real work produces real artifacts. If there are no artifacts at the end of a day, we failed. The system's job is to capture those artifacts throughout the day, style them through the brand's visual language, and compose them into an entry that looks like a designer's studio desk.

This blueprint defines the complete content design: what gets captured, how it gets styled, how entries are composed, and what the MDX schema looks like. Implementation tasks will be created separately.

---

## The Three-Layer Pipeline

### Layer 1: Capture (throughout the day)

**Principle:** Work naturally produces artifacts. The capture layer tags them for the daily brief.

**Two capture modes:**

| Mode | Trigger | What it captures |
|------|---------|-----------------|
| **Auto-capture** | Git commits, test results, new file creation, build success/failure | Screenshot or structured data + auto-generated one-line caption ("Created `src/components/ui/GrainOverlay.tsx`", "Tests: 14 passed, 2 failed") |
| **Manual `/snap`** | User says `/snap` or "save this" during a session | Screenshot of current context + auto-caption describing what was happening (which file, what command, what state) |

**Sometimes the user will also create artifacts specifically for the brief** — take a screenshot of current state, write a quick reflection. The system handles both found artifacts and intentionally created ones.

**Capture storage:** Staged in a daily capture directory before assembly:
```
src/content/now/.captures/YYYY-MM-DD/
  001-commit-grain-overlay.png
  001-commit-grain-overlay.caption.txt
  002-snap-failing-tests.png
  002-snap-failing-tests.caption.txt
  ...
```

Each capture is: one image file + one caption text file. Sequential numbering preserves chronological order. Captions are auto-generated at capture time (what file, what command, what was happening).

### Layer 2: Style (at assembly time)

**Principle:** Raw screenshots and artifacts don't go straight to the page. Every visual artifact gets processed through the brand's visual language so it looks like it belongs on the studio desk.

**Style engine: LoRA-trained Stable Diffusion XL**

- **Training set:** ~20-50 images from Julianna's visual references — architectural drawings, renders, mae graphics, pinterest board references, moodboard images in `research/moodboard/`
- **Visual qualities to train on:** stipple/grain textures, warm earth palette (terracotta, amber, ochre, cream), watercolor-wash edge dissolution, paper materiality, hand quality
- **Output:** styled artifact images with transparency support (PNG) for compositing/layering

**Treatment varies by artifact type:**

| Artifact type | Visual treatment |
|---------------|-----------------|
| Architectural sketches, renders, drawings | Physicalized — as if printed on warm textured paper, grain visible, edges dissolve. The hand is present. |
| Code, terminal, UI screenshots | Brand-treated digital — palette shifted to warm tones, stipple texture overlaid, edges softened. Still recognizably digital but clearly belongs on this site. |
| Photos (site visits, models) | Warm color grade, subtle grain overlay, watercolor edge fade. Like a Polaroid on the desk. |
| Text artifacts (quotes, notes, diffs) | Typographic treatment — rendered as an image using brand fonts on textured background. Like a card on the desk. |

**Transparency is first-class.** The collage/layering design language requires elements to composite over each other. All styled outputs are PNG with alpha.

### Layer 3: Assembly (end of day)

**Principle:** User gives a one-liner. The skill gathers the day's captures, runs them through styling, and composes the MDX entry.

**Workflow:**
1. User invokes `/update-site "debugging agent coordination all day"` (or similar)
2. Skill reads captures from `src/content/now/.captures/YYYY-MM-DD/`
3. Each raw capture -> styled through LoRA pipeline -> saved to `public/images/studio-desk-archive/YYYY-MM-DD/`
4. Skill auto-derives: mood (from sentence + artifact types), tags (from topics/files touched)
5. Skill composes MDX file at `src/content/now/YYYY-MM-DD.mdx`
6. User reviews before the entry goes live

---

## MDX Entry Schema

```yaml
---
date: "YYYY-MM-DD"
mood: "building"                    # Single evocative word — auto-derived, user can override
tags: ["software", "agents", "testing"]  # Auto-derived from topics/files, user can edit
summary: "Debugging agent coordination — finally got the handoff working"  # One-liner from user input

# Artifact manifest — ordered list of styled artifacts for the pinboard layout
artifacts:
  - src: "/images/studio-desk-archive/2026-03-04/001-commit-grain-overlay.png"
    alt: "Terminal showing successful grain overlay component creation"
    caption: "Created GrainOverlay.tsx — first texture component"
    size: "large"          # large | medium | small — controls pinboard placement
    type: "code"           # code | architecture | photo | text — affects styling treatment
  - src: "/images/studio-desk-archive/2026-03-04/002-snap-failing-tests.png"
    alt: "Test runner showing 2 failures in overlay compositing"
    caption: "Two compositing tests failing — the blend mode was wrong"
    size: "medium"
    type: "code"
  - src: "/images/studio-desk-archive/2026-03-04/003-snap-green-tests.png"
    alt: "All 14 tests passing after the fix"
    caption: "All green after switching to multiply blend"
    size: "small"
    type: "code"
---

Optional body text here — can be empty, a single sentence, or a full reflection.
The body is supplementary. The artifacts tell the story.
```

**Key schema decisions:**
- `artifacts` array in frontmatter — structured data for the pinboard layout engine
- Each artifact has `size` hint for layout (large = hero/dominant, medium = supporting, small = detail)
- Each artifact has `type` for styling pipeline routing
- Body text is optional — the entry is valid with just frontmatter + artifacts
- Mood and tags are auto-derived but editable

---

## Content Types That Can Appear

Every real day of work produces at least one of these:

| Day type | Likely artifacts | Minimum viable entry |
|----------|-----------------|---------------------|
| **Software — building** | Terminal screenshots, diffs, UI screenshots, test results | One screenshot of the thing you built + one sentence |
| **Software — debugging** | Failing test output, error messages, the fix diff, green tests | Screenshot of the error wall + "finally found it" |
| **Software — agent/AI work** | CLAUDE.md diffs, skill files, conversation screenshots, config changes | Screenshot of the new skill or config + one sentence |
| **Architecture — drawing** | Rhino viewport, render in progress, sketch scan/photo | One render or drawing + what you were exploring |
| **Architecture — site visit** | Phone photos, annotated plans, material samples | One photo + one sentence |
| **Reading / research** | Quote screenshot, book photo, notes .md excerpt | A quote rendered as typographic card + what you're thinking |
| **Thinking / stuck** | The problem statement, a diagram, notes, a whiteboard photo | Screenshot of where you're stuck + honest status |

**The minimum bar:** One artifact + one sentence. If neither exists, the day needs a deliberate capture moment before it ends.

---

## Page Layout: Studio Desk / Pinboard

The Now page displays entries as a **timeline of studio desks** — each day is a composed arrangement of artifacts.

**Layout principles:**
- Artifacts arranged like objects pinned to a board or placed on a desk
- Varied sizes based on `size` hints (large artifacts anchor, small ones cluster)
- Slight overlap and rotation for organic feel (CSS transforms, not random — intentional composition)
- Today's entry visually distinct: subtle terracotta accent (border or background tint)
- Sparse days (1 artifact, 1 sentence) look as intentional as rich days (5 artifacts, full reflection)
- Older entries scroll down, forming a timeline — entries never disappear
- No timestamps — dates only
- Mobile: artifacts stack vertically, pinboard feel maintained through varied widths and subtle rotation

**The test:** A day with one styled screenshot and "debugging all day" should look as good as a day with five artifacts and a paragraph. The typography and whitespace do the work.

---

## LoRA Training Spec

**Separate implementation task**, but the design spec is:

- **Base model:** Stable Diffusion XL (or Flux, depending on availability)
- **Training images:** 20-50 from Julianna's references:
  - Architectural drawings and renders from portfolio
  - Mae graphics visual identity work
  - Pinterest board selections (already in `research/moodboard/`)
  - Brand guide color/texture reference images
- **Training target:** The six texture vocabulary items from the graphics pipeline research:
  1. Stipple fields (particle-based noise, dissolving edges)
  2. Paper grain (subtle fiber texture)
  3. Watercolor wash (organic gradient edges in terracotta/amber)
  4. Contour/topographic lines
  5. Collage edges (slightly rough, torn paper feel)
  6. Monoprint/rubbing texture
- **Output format:** PNG with alpha (transparency required)
- **Inference:** Local or cloud API — the `/update-site` skill calls it during assembly

---

## Implementation Task Breakdown

This blueprint spawns the following implementation tasks (to be created in Lattice):

1. **Capture pipeline (`/snap` skill + auto-capture hooks)** — the system that saves artifacts throughout the day
2. **LoRA training** — curate training set, train the model, test style transfer on sample artifacts
3. **Style pipeline** — the code that takes raw captures + LoRA model and produces styled PNGs
4. **Assembly skill (`/update-site`)** — gathers captures, runs styling, composes MDX, presents for review
5. **Pinboard layout component** — the React component that renders the artifact grid with desk/pinboard aesthetics
6. **Updated Now page** — integrates the pinboard component, timeline, today-highlighting
7. **MDX schema + content helpers** — updated `NowEntry` interface, frontmatter parsing for artifacts array

---

## Verification

Once all implementation tasks are complete:
1. Run `/snap` during a real work session — verify captures land in `.captures/YYYY-MM-DD/`
2. Run `/update-site "test entry"` — verify it gathers captures, styles them, produces valid MDX
3. `pnpm build` — verify the Now page renders with styled artifacts in pinboard layout
4. Visual check: a 1-artifact entry and a 5-artifact entry both look intentional
5. Visual check: styled artifacts match the brand's visual language (warm tones, texture, edges)

---

## What This Replaces

The existing implementation on `worktree-agent-a83e7ee9` has:
- A simpler schema (mood, tags, summary, image, developed flag)
- A prose-first model (body text is primary, image is optional)
- No capture pipeline, no styling pipeline, no artifact manifest

This blueprint supersedes that approach. The branch's content helpers (`getRecentNowEntries`, `getNowEntrySummary`) and typography config can be reused; the schema and page component need redesign.

## Reset 2026-03-05 by agent:claude-opus-4-planner
