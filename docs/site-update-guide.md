# Site Update Guide

A checklist-driven guide for updating parallax.studio. Covers four pipelines: daily studio desk entries, site health checks, portfolio updates, and blog posts.

**Who this is for:** Julianna (human operator) and any Claude agent running `/update-site` or maintaining the site. The universal templates are forkable for other projects; the parallax-specific appendix has the concrete paths and conventions.

---

## Universal Templates

### Pipeline 1: Daily Update

A daily content pipeline that turns the day's work into published entries.

- [ ] **Pre-flight health check** — quick scan for broken images, build errors, empty sections
- [ ] **Review the day** — git log, merged PRs, task tracker, notes
- [ ] **Build a coverage list** — what should be documented today?
- [ ] **Check for new artifacts** — scan the raw artifacts directory for media files
- [ ] **Rename artifacts** — apply naming convention: `YYYY-MM-DD-<kebab-case-name>.<ext>`
- [ ] **Copy to archive** — move renamed files to the site's image directory
- [ ] **Tag artifacts** — view each image, infer content tags
- [ ] **Infer metadata** — mood, project, description per artifact
- [ ] **Write content entries** — one entry per artifact, using frontmatter + body template
- [ ] **Validate** — parse frontmatter, check for broken references
- [ ] **Commit** — stage and commit all new entries + images
- [ ] **Archive raw files** — move processed files from raw to archive
- [ ] **Summary** — print what was done, flag any gaps

### Pipeline 2: Site Health Check

Can run standalone or as the first step of any other pipeline.

- [ ] **Build check** — does the production build pass?
- [ ] **Lint check** — does the linter pass?
- [ ] **Visual scan** — check key pages for:
  - [ ] Broken images
  - [ ] Empty sections / placeholder content
  - [ ] Layout bugs (mobile + desktop)
  - [ ] Missing entries that should exist
- [ ] **Content audit** — are all content entries valid? Missing frontmatter fields?
- [ ] **Report** — list findings as actionable items

### Pipeline 3: Portfolio Update

For adding or updating project case studies.

- [ ] **Image processing** — if new images need treatment (riso, crop, optimize)
- [ ] **Create/update content entry** — with full frontmatter schema
- [ ] **Add images** — to the correct image directory
- [ ] **Tag & metadata** — title, description, date, stack/typology, tags, hero image, order
- [ ] **Validate** — check rendering on listing and detail pages
- [ ] **Commit**

### Pipeline 4: Blog Post

For longer-form writing entries.

- [ ] **Choose topic** — what to write about
- [ ] **Gather artifacts** — screenshots, images, diagrams to accompany the post
- [ ] **Write content entry** — with full frontmatter schema
- [ ] **Process images** — optional treatment, copy to appropriate directory
- [ ] **Validate** — check rendering on listing and detail pages
- [ ] **Commit**

---

## Parallax.studio Implementation

### Pipeline 1: Daily Studio Desk Update

**Skill:** `/update-site` (automated) or `/update-site --blog` (interactive)

#### Paths

| Path | Purpose |
|------|---------|
| `~/Documents/Artifacts/raw/` | Incoming artifacts (screenshots, photos, PDFs) |
| `~/Documents/Artifacts/archive/` | Processed artifacts moved here after commit |
| `src/content/now/` | MDX entries — one per artifact |
| `public/images/studio-desk-archive/YYYY-MM-DD/` | Published images, organized by date |

#### Step-by-step

**1. Pre-flight**

```bash
mkdir -p ~/Documents/Artifacts/{raw,archive}
mkdir -p public/images/studio-desk-archive/$(date +%Y-%m-%d)
```

Quick health check: does the site build? Any broken images on `/now`?

**2. Review the day**

```bash
# Git activity
git log --oneline --since="$(date +%Y-%m-%d) 00:00"

# Merged PRs
gh pr list --state merged --search "merged:$(date +%Y-%m-%d)"

# Open PRs
gh pr list --state open

# Lattice tasks touched today
lattice list --status in_progress --status done
```

Build a mental coverage list: features shipped, design work, explorations, tools built.

**3. Discover artifacts**

```bash
# Auto-scan raw directory
find ~/Documents/Artifacts/raw/ -type f \( \
  -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \
  -o -iname "*.webp" -o -iname "*.heic" -o -iname "*.gif" \
  -o -iname "*.mp4" -o -iname "*.mov" -o -iname "*.pdf" \
  -o -iname "*.svg" \) | sort
```

- Max 10 artifacts per day
- Deduplicate near-identical screenshots
- Prefer variety that tells the story of the day
- View each image to understand what it shows

**4. Fill gaps**

For coverage items with no matching artifact, try in order:

1. **Search existing visuals** — `raw/` subdirs, `public/images/`, archive, `~/Desktop/`, `~/Downloads/`
2. **Screenshot the running app** — if dev server is up on `:3000`
3. **Render a file as visual** — styled HTML screenshot of code/config via `qlmanage`
4. **Text-only placeholder** — last resort, flag at end of summary

**5. Rename & copy**

Apply naming convention: `YYYY-MM-DD-<kebab-case-name>.<ext>`

```bash
# Standard image
cp "raw/Screenshot 2026-03-06.png" "public/images/studio-desk-archive/2026-03-06/riso-color-grid.png"

# PDF → PNG conversion
qlmanage -t -s 2880 -o /tmp "raw/drawing.pdf"
cp "/tmp/drawing.pdf.png" "public/images/studio-desk-archive/2026-03-06/section-drawing.png"

# HEIC → PNG conversion
sips -s format png "raw/IMG_4155.HEIC" --out "public/images/studio-desk-archive/2026-03-06/wordmark.png"
```

**6. Infer metadata**

Per-artifact:

| Field | Description |
|-------|-------------|
| `date` | `YYYY-MM-DD` (shared) |
| `time` | `HH:MM` 24-hour — from file metadata or filename timestamp |
| `mood` | One of: `building`, `refining`, `exploring`, `sketching`, `grinding`, `resting`, `documenting` |
| `project` | One of: `parallax.studio`, `architecture`, `personal` |
| `tags` | 2-3 tags specific to the artifact content |
| `description` | One-line caption — specific, concrete, not flowery |
| `image` | `/images/studio-desk-archive/YYYY-MM-DD/<short-name>.<ext>` |

**Voice:** Studio-desk tone — like a note left on a designer's desk. Brief, present-tense, specific. Not flowery, not corporate.

> "Content pipeline practice run. Built the artifact bar. The desk is no longer empty."
> "Testing portrait-ratio textures. The 512x768 feels right for the artifact bar."

**7. Write MDX entries**

One file per artifact: `src/content/now/YYYY-MM-DD-<short-name>.mdx`

```mdx
---
date: "2026-03-06"
time: "14:00"
mood: "building"
tags: ["homepage", "hero"]
image: "/images/studio-desk-archive/2026-03-06/hero-full.png"
project: "parallax.studio"
description: "Full homepage hero — brick wall photo cycling behind the wire network"
---

Hero section with the photo slideshow running. Brick wall, window, wire nodes overlaid. The nav sits quiet at the top left.
```

Text-only entries omit `image` and `description`.

**8. Validate**

```bash
# Parse check (don't run pnpm build — it clobbers the dev server)
node -e "
const fs = require('fs');
const matter = require('gray-matter');
const file = fs.readFileSync('src/content/now/2026-03-06-hero-full.mdx', 'utf8');
const { data } = matter(file);
console.log('OK:', JSON.stringify(data, null, 2));
"

# Check dev server
lsof -ti:3000 && echo "Dev server up — check http://localhost:3000/now"
```

**9. Commit**

```bash
git add src/content/now/YYYY-MM-DD*.mdx
git add public/images/studio-desk-archive/YYYY-MM-DD/
git commit -m "now: YYYY-MM-DD — <mood> (<N> artifacts)"
```

**10. Archive raw files**

```bash
mv ~/Documents/Artifacts/raw/<processed-file> ~/Documents/Artifacts/archive/
```

**11. Summary output**

```
Daily update complete.
  Entries:  N files in src/content/now/
  Images:   public/images/studio-desk-archive/YYYY-MM-DD/ (N files)
  Mood:     <mood>
  Project:  <project>
  Commit:   <short hash>

  Artifacts:
    - YYYY-MM-DD-<name>.mdx — "<description>"
    ...
```

#### Error recovery

| Problem | Action |
|---------|--------|
| No raw media found | Review day, produce artifacts via screenshot, or text-only |
| PDF conversion fails | Copy raw PDF, continue |
| MDX parse error | Fix frontmatter, retry |
| Existing entries for today | Overwrite (default) or ask (`--blog` mode) |
| Git commit fails | Show error, don't retry |

---

### Pipeline 2: Site Health Check

Run as a standalone check or as the first step of any update pipeline.

#### Pages to check

| Page | URL | What to look for |
|------|-----|------------------|
| Home | `/` | Hero rendering, artifact bar, overall layout |
| Now / Studio Desk | `/now` | Entry rendering, image loading, date ordering |
| Work overview | `/work` | Both disciplines listed, no empty states |
| Architecture portfolio | `/work/architecture` | Project cards, hero images |
| Software portfolio | `/work/software` | Project cards, stack tags |
| Writing | `/writing` | Post listing, featured post |
| About | `/about` | Content present, no placeholders |

#### Commands

```bash
# Build check
pnpm build

# Lint check
pnpm lint

# Type check
npx tsc --noEmit

# Content audit — check for MDX files missing required frontmatter
node -e "
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const collections = ['now', 'writing', 'work-architecture', 'work-software'];
const required = {
  now: ['date'],
  writing: ['title', 'date'],
  'work-architecture': ['title', 'date'],
  'work-software': ['title', 'date'],
};

collections.forEach(col => {
  const dir = path.join('src/content', col);
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).filter(f => f.endsWith('.mdx')).forEach(f => {
    const { data } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
    const missing = required[col].filter(k => !data[k]);
    if (missing.length) console.log(col + '/' + f + ' missing: ' + missing.join(', '));
  });
});
console.log('Content audit complete.');
"
```

---

### Pipeline 3: Portfolio Update (Software)

For adding or updating a software project on the listing page at `/work/software`.

**Artifacts source:** `~/Documents/Artifacts/raw/software/<project>/final/`
**Images destination:** `public/images/software/<project>/`
**Content:** `src/content/work-software/<project>.mdx`

#### Step-by-step

**1. Audit the MDX**

Check if `src/content/work-software/<project>.mdx` exists. If it does, note what's missing. If it doesn't, create one.

**2. Check for artifacts**

Look in `~/Documents/Artifacts/raw/software/<project>/final/` for images and recordings.

```bash
ls ~/Documents/Artifacts/raw/software/<project>/final/
```

If `final/` has images, continue to step 3. If empty, skip to step 5 (update frontmatter without thumbImage) and flag that images are needed.

**3. Copy images from `final/` to the site**

```bash
mkdir -p public/images/software/<project>/
cp ~/Documents/Artifacts/raw/software/<project>/final/<file> public/images/software/<project>/<project>.<type>.<number>.<ext>
```

**Naming convention:** `<project>.<type>.<number>.<ext>`

| Type | When to use | Example |
|------|-------------|---------|
| `raw` | Unprocessed screenshot or photo | `schelling-points.raw.1.png` |
| `riso` | After riso color separation | `schelling-points.riso.1.png` |
| `recording` | Screen recording or video | `schelling-points.recording.1.mov` |

Number sequentially within each type: `.1`, `.2`, `.3`, etc.

The other `final/` images get copied as raw — they're content for the individual project detail page (layout TBD).

**4. Riso the thumbnail**

Pick the image for the listing grid thumbnail and run it through `/riso`:

```bash
riso public/images/software/<project>/<project>.raw.1.png <palette>
```

This produces a riso output (e.g., `<project>.riso.1.png`).

Available palettes: `brand-full`, `scarlet-spruce`, `scarlet-moss`, `scarlet-olive`, `scarlet-mono`, `spruce-mono`, `moss-mono`, `olive-mono`

**5. Update the frontmatter**

Update all fields that are missing or placeholder:

- `title` — project name
- `description` — one sentence blurb (formula: what it IS + one distinguishing detail, plain language)
- `thumbImage` — set to the riso output from step 4
- `stack` — technologies used
- `tags` — 2-3 content tags
- `order` — position in listing
- `date` — when the project was made/shipped
- `url` — live URL, if deployed
- `repo` — GitHub URL, if public

**Description examples:**
- "A dungeon crawler with procedural level generation, built as a solo project with PixiJS."
- "A multiplayer tic-tac-toe variant with pixel art, real-time chat, and lobby system."
- "An MCP server that gives AI agents access to architectural knowledge and vocabulary."

**6. Validate**

Check that all required frontmatter fields are present: `title`, `description`, `thumbImage`, `stack`, `tags`, `order`, `date`. Check the listing page at `/work/software` — does the card show the image, title, description, and stack?

**7. Commit**

```bash
git add src/content/work-software/<project>.mdx
git add public/images/software/<project>/
git commit -m "portfolio: update <project> listing"
```

> **Note:** The project detail page (`/work/software/<project>`) layout and content is TBD. This checklist covers getting the project onto the listing grid only.

---

### Pipeline 4: Blog / Writing Update

**Content:** `src/content/writing/<slug>.mdx`

```mdx
---
title: "Post Title"
date: "2026-03-15"
description: "A first post — on building a home on the internet."
tags: ["meta", "beginnings"]
featured: false
---

Post body in MDX. Supports React components.
```

**Automated via:** `/update-site --blog` — scans artifacts first, then prompts for body text. Creates one entry with the first artifact as the hero image.

**Manual flow:**
1. Write the MDX file with frontmatter
2. Add any images to an appropriate directory under `public/images/`
3. Validate by checking `/writing` and `/writing/<slug>` pages
4. Commit

**Voice guidance:** Studio-desk tone for daily entries. For longer writing, Julianna's natural voice — reflective, architectural, bridging disciplines. Not academic, not corporate. Think "architect's notebook made public."

---

## Reference

### Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Daily artifact images | `YYYY-MM-DD-<kebab-case-name>.<ext>` | `2026-03-06-riso-color-grid.png` |
| Daily MDX entries | `YYYY-MM-DD-<short-name>.mdx` | `2026-03-06-hero-full.mdx` |
| Studio desk image dirs | `public/images/studio-desk-archive/YYYY-MM-DD/` | `public/images/studio-desk-archive/2026-03-06/` |
| Architecture project slugs | `<kebab-case-project-name>` | `timber-pavilion` |
| Software project slugs | `<kebab-case-project-name>` | `rainbow-crawler` |
| Writing slugs | `<kebab-case-title>` | `hello-world` |

### Metadata Schemas

#### NowEntry (daily studio desk)

```typescript
interface NowEntry {
  slug: string;        // auto from filename — DO NOT include in frontmatter
  date: string;        // YYYY-MM-DD (required)
  time?: string;       // HH:MM 24-hour — controls within-day ordering
  mood?: string;       // building | refining | exploring | sketching | grinding | resting | documenting
  tags?: string[];     // 2-3 content tags
  image?: string;      // /images/studio-desk-archive/YYYY-MM-DD/<name>.<ext>
  project?: string;    // parallax.studio | architecture | personal
  description?: string; // one-line artifact caption
  content: string;     // MDX body — DO NOT include in frontmatter
}
```

#### WritingPost

```typescript
interface WritingPost {
  slug: string;        // auto from filename
  title: string;       // (required)
  date: string;        // YYYY-MM-DD (required)
  description?: string;
  tags?: string[];
  featured?: boolean;
  content: string;
}
```

#### ArchitectureProject

```typescript
interface ArchitectureProject {
  slug: string;        // auto from filename
  title: string;       // (required)
  description?: string;
  date: string;        // YYYY-MM-DD (required)
  location?: string;
  typology?: string;   // Residential, Cultural, Commercial, etc.
  heroImage?: string;
  tags?: string[];
  order?: number;      // controls listing order
  featured?: boolean;
  content: string;
}
```

#### SoftwareProject

```typescript
interface SoftwareProject {
  slug: string;        // auto from filename
  title: string;       // (required)
  description?: string;
  date: string;        // YYYY-MM-DD (required)
  stack?: string[];
  url?: string;
  repo?: string;
  thumbImage?: string;
  heroImage?: string;
  tags?: string[];
  order?: number;      // controls listing order
  featured?: boolean;
  content: string;
}
```

### Tag Vocabulary

#### Mood tags (NowEntry only)

| Mood | When to use |
|------|-------------|
| `building` | Creating something new, shipping features |
| `refining` | Polishing, iterating, improving |
| `exploring` | Trying new ideas, research, experiments |
| `sketching` | Early-stage design, wireframing |
| `grinding` | Heads-down execution, bug fixes, chores |
| `resting` | Light day, reading, thinking |
| `documenting` | Writing docs, capturing process |

#### Project tags (NowEntry only)

| Project | Scope |
|---------|-------|
| `parallax.studio` | Site work |
| `architecture` | Architecture practice |
| `personal` | Personal projects, reading, thinking |

#### Content tags (all collections)

Use short, lowercase, specific tags. Common ones that have appeared in existing content:

`homepage`, `hero`, `tooling`, `pipeline`, `automation`, `agentic`, `meta`, `beginnings`, `design`, `typography`, `wireframe`, `texture`, `riso`, `brand`, `scroll`, `animation`, `threshold`, `collage`, `sketch`, `placeholder`

No strict vocabulary — tags should be descriptive of the artifact's actual content.

### Riso Palettes & Effects

**Brand colors** (from `tokens.css`):

| Token | Hex | Role |
|-------|-----|------|
| `--color-paper` | `#FDFCEA` | Warm cream background |
| `--color-oxblood` | `#471f20` | Text / black |
| `--color-scarlet` | `#f65058` | Accent 1 |
| `--color-olive` | `#b49f29` | Accent 2 |
| `--color-moss` | `#68724d` | Midtone accent |
| `--color-spruce` | `#4a635d` | Shadow accent |

**Spectrolite palettes:** `brand-full`, `scarlet-spruce`, `scarlet-moss`, `scarlet-olive`, `scarlet-mono`, `spruce-mono`, `moss-mono`, `olive-mono`

**Effects:** `none` (flat color), `halftone` (circle/diamond/square/line), `dithering` (floyd-steinberg/atkinson/stucki/burkes/sierra), `posterize`

**CSS-based treatment:** Images on the Now page get `.artifact-treatment` in `globals.css` — applies grain, warm tone, and paper texture in the browser. No build-time processing needed for daily entries.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-03-24 | Initial version — all four pipelines documented |
| 2026-03-24 | Fixed `/update-site` skill image path bug (`images/now/` → `images/studio-desk-archive/`) |
