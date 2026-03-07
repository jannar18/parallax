# /update-site — Artifact-First Daily Pipeline for parallax.studio

You are the daily content pipeline for parallax.studio. You publish "now" entries — daily studio desk artifacts that document the work. **Each artifact becomes its own entry.** You are fully automated by default: review the day, scan for artifacts, fill gaps, write one MDX file per artifact, and commit. No user prompts unless `--blog` is passed.

**One artifact = one entry.** A day with 6 artifacts produces 6 MDX files, each with its own image, description, and body text. They appear as separate posts on the Now page.

**Image treatment is CSS-based, not build-time.** Images are copied as-is. The `.artifact-treatment` class in `globals.css` applies grain, warm tone, and paper texture in the browser. No Python, no riso engine, no image processing dependencies.

## Flags

Parse `$ARGUMENTS` for these flags (combinable):

| Flag | Effect |
|------|--------|
| `--blog` | Enter blog writing mode — user writes longer body text alongside artifacts |
| `--raw` | Skip CSS treatment class on images (use plain `<img>`) |

Anything in `$ARGUMENTS` that is not a flag is treated as a file path to a specific artifact (overrides auto-scan).

## Absolute Paths

```
SITE_REPO="$(git rev-parse --show-toplevel)"
CONTENT_DIR="$SITE_REPO/src/content/now"
IMAGE_DIR="$SITE_REPO/public/images/now"
RAW_DIR="$HOME/Documents/Artifacts/raw"
ARCHIVE_DIR="$HOME/Documents/Artifacts/archive"
TODAY="$(date +%Y-%m-%d)"
```

---

## Step 0: Preflight

Run silently. Only surface failures.

1. **Directories.** Create if missing:
   ```bash
   mkdir -p ~/Documents/Artifacts/{raw,archive}
   mkdir -p "$SITE_REPO/public/images/now/$TODAY"
   ```

---

## Step 1: Review the Day

**Before touching any artifacts, understand what happened today.** This step builds your mental model of what should be documented.

### 1a. Check git activity
```bash
git log --oneline --since="$TODAY 00:00" --until="$TODAY 23:59"
git log --oneline --merges --since="$TODAY 00:00"
```

### 1b. Check PRs
```bash
gh pr list --state merged --search "merged:$TODAY" 2>/dev/null
gh pr list --state open 2>/dev/null
```

### 1c. Check Lattice tasks
```bash
lattice list --status in_progress --status done 2>/dev/null
```

### 1d. Build a coverage list
From the above, produce an internal list of **what should be documented today**. Think about:
- What features were built or shipped?
- What visual/design work happened?
- What tools or skills were created or updated?
- What explorations or experiments ran?
- What was the overall arc of the day?

Each item on this list is a potential artifact. Keep the list in your reasoning — do NOT print it or ask the user about it.

---

## Step 2: Discover Artifacts

**If a file path was passed as an argument**, use that file directly. Skip auto-scan.

**Otherwise, auto-scan** `~/Documents/Artifacts/raw/` for media files (including subdirectories):
```bash
find ~/Documents/Artifacts/raw/ -type f \( \
  -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \
  -o -iname "*.webp" -o -iname "*.heic" -o -iname "*.gif" \
  -o -iname "*.mp4" -o -iname "*.mov" -o -iname "*.pdf" \
  -o -iname "*.svg" \) 2>/dev/null | sort
```

**What counts as media:** terminal screenshots, app screenshots/videos, test screenshots, development progress screenshots, produced drawings (PDF/JPG/PNG), Claude skill screenshots, anything from the day's work.

**View images** (using the Read tool) to understand what each artifact shows. Match each artifact against your coverage list from Step 1.

**If media found**, curate before copying:
- **Max 10 artifacts.** If more than 10 are found, select the best 10.
- **Deduplicate.** Skip near-duplicates (e.g., multiple screenshots of the same view, sequential frames of the same thing). Pick the clearest or most representative one.
- **Variety.** Prefer a mix that tells the story of the day — different views, different stages, different tools.
- List your selections in internal reasoning (do NOT ask the user to confirm).

---

## Step 3: Fill Gaps

Compare your coverage list (Step 1d) against the artifacts found (Step 2). For each item on the coverage list that has **no matching artifact**, fill the gap using this priority — exhaust each level before moving to the next:

### Priority 1: Search for existing visuals
Before producing anything, look for an image that already exists:
- **`raw/` subdirectories** — the user may have filed it in a subfolder
- **`public/images/`** — the repo may already have a relevant screenshot or asset
- **`~/Documents/Artifacts/archive/`** — it may have been archived from a previous session
- **`~/Desktop/` and `~/Downloads/`** — common macOS screenshot landing spots
- **The repo itself** — `research/`, `notes/`, any directory that might hold visual assets

### Priority 2: Screenshot the running app
If the work is a UI change, component, or visual feature — and a dev server is running:
```bash
lsof -ti:3000 2>/dev/null
```
If the dev server is up, capture the relevant page or element:
- `qlmanage -t -s 1800 -o /tmp http://localhost:3000/<path>` (basic page capture)
- Claude-in-Chrome MCP if available
- Any other screenshot tool

### Priority 3: Render the relevant file as visual
If the work is a code file, config, skill definition, or other text artifact — render it as a screenshot:
```bash
cat > /tmp/artifact-render.html << 'EOF'
<!-- Styled HTML with file content, dark terminal theme, syntax-highlighted -->
EOF
qlmanage -t -s 1800 -o /tmp /tmp/artifact-render.html
cp /tmp/artifact-render.html.png "$SITE_REPO/public/images/now/$TODAY/<short-name>.png"
```

### Priority 4: Text-only placeholder (absolute last resort)
Only if you cannot find a visual anywhere AND cannot produce one. Create a text-only entry and **flag it** — after all other entries are written, print a notice:

```
Missing artifact: <topic>
  I would have liked to include <what>. Consider adding to raw/ next time.
```

The text-only MDX body should be honest about the gap. Example:
```
Refactored the content loader to support multiple entries per day. No screenshot captured — the change lives in the code.
```

**Do NOT ask the user during this step.** Fill gaps silently, flag missing ones at the end (Step 10).

---

## Step 4: Copy Artifacts

For each selected artifact (from raw/ and self-generated), copy directly to the site image directory. Give each file a short, descriptive kebab-case name:
```bash
cp "<source>" "$SITE_REPO/public/images/now/$TODAY/<short-name>.<ext>"
```

**Naming:** Replace the original filename with a short descriptive name. Examples:
- `Screenshot 2026-03-06 at 4.06.35 PM.png` → `riso-color-grid.png`
- `IMG_4155.HEIC` → `wordmark-exploration.png`
- `Screen Recording 2026-03-05 at 8.30.08 PM.mov` → `scroll-interaction.mov`

**PDF conversion:** If the file is a `.pdf`, convert to PNG using Quick Look at high resolution:
```bash
qlmanage -t -s 2880 -o /tmp "<source>"
cp "/tmp/<filename>.png" "$SITE_REPO/public/images/now/$TODAY/<short-name>.png"
```

**HEIC conversion:** If the file is `.heic`, convert to PNG:
```bash
sips -s format png "<source>" --out "$SITE_REPO/public/images/now/$TODAY/<short-name>.png"
```

**Videos (.mp4, .mov):** Copy as-is. Videos don't get the artifact treatment class.

**Images keep their natural proportions.** No cropping, no stretching, no resizing.

---

## Step 5: Infer Metadata (per artifact)

**Each artifact gets its own metadata.** Infer ALL of the following for EACH artifact. Do NOT ask the user for any of these.

### Shared across all entries for the day:
- **Mood** (one word) — infer once, apply to all entries
- **Project** — infer once, apply to all entries

### Per-artifact:
- **Short name** — kebab-case identifier, used in both the image filename and the MDX filename (e.g., `riso-color-grid`, `wordmark-exploration`, `hero-closeup`)
- **Description** (one line) — brief caption for this specific artifact. Specific, concrete, not flowery.
- **Tags** (2-3) — specific to this artifact's content
- **Body text** (1-2 sentences) — a brief note about this specific artifact. Studio-desk tone.

### Mood values:
- `building` — creating something new, shipping features
- `refining` — polishing, iterating, improving
- `exploring` — trying new ideas, research, experiments
- `sketching` — early-stage design, wireframing
- `grinding` — heads-down execution, bug fixes, chores
- `resting` — light day, reading, thinking
- `documenting` — writing docs, capturing process

### Project values:
- `parallax.studio` — site work
- `architecture` — architecture practice
- `personal` — personal projects, reading, thinking

### Voice guidance:
- **Studio-desk tone** — like a note left on a designer's desk
- Brief, present-tense, specific
- Not flowery, not corporate, not a blog post
- Match the voice of existing entries in `src/content/now/`

**Example voice:**
> "Content pipeline practice run. Built the artifact bar. The desk is no longer empty."
> "Testing portrait-ratio textures. The 512x768 feels right for the artifact bar."

---

## Step 5b: Blog Mode (only if `--blog`)

If `--blog` was passed, enter interactive mode. Ask the user:

> **Blog entry for $TODAY.**
> The artifacts are ready. Write your post below — as long or short as you like.
> I'll handle frontmatter, images, and formatting.

Wait for the user's response. In blog mode, create ONE entry with the user's text as the body. The first artifact's image becomes the entry's image. Remaining artifacts are NOT given separate entries — they can be referenced in the blog text if desired. Still infer mood, project, tags, and description automatically.

---

## Step 6: Write MDX Entries

### One MDX file per artifact

Each artifact becomes its own file: `$CONTENT_DIR/$TODAY-<short-name>.mdx`

**Example:** 3 artifacts on 2026-03-07 produce:
```
src/content/now/2026-03-07-riso-color-grid.mdx
src/content/now/2026-03-07-hero-closeup.mdx
src/content/now/2026-03-07-wordmark-exploration.mdx
```

### Check for Existing Entries
```bash
ls "$CONTENT_DIR/$TODAY"*.mdx 2>/dev/null
```

If entries exist for today:
- **Default flow (no `--blog`):** Overwrite silently.
- **`--blog` mode:** Ask: "Today's entries exist. Overwrite or append?"

### MDX Template (per artifact)

```mdx
---
date: "$TODAY"
mood: "<shared mood>"
tags: [<artifact-specific tags>]
image: "/images/now/$TODAY/<short-name>.<ext>"
project: "<shared project>"
description: "<artifact-specific description>"
---

<Artifact-specific body text: 1-2 sentences>
```

**Text-only entry** (no image): Use `$TODAY-<short-name>.mdx` as filename, omit `image` and `description` fields.

**Video entries:** Use the video path in the `image` field. The Now page component handles video rendering differently from images.

### Frontmatter Schema Reference

```typescript
interface NowEntry {
  slug: string;       // auto from filename — DO NOT include in frontmatter
  date: string;       // YYYY-MM-DD (required)
  mood?: string;      // one word
  tags?: string[];    // 2-3 tags
  image?: string;     // /images/now/YYYY-MM-DD/<short-name>.<ext>
  project?: string;   // project name
  description?: string; // artifact description
  content: string;    // MDX body — DO NOT include in frontmatter
}
```

---

## Step 7: Validate

Quick parse validation for ALL entries — do NOT run `pnpm build` (it can clobber a running dev server):
```bash
node -e "
const fs = require('fs');
const matter = require('gray-matter');
const glob = require('glob');
const files = glob.sync('src/content/now/$TODAY*.mdx');
files.forEach(f => {
  const { data } = matter(fs.readFileSync(f, 'utf8'));
  console.log(f + ' OK:', JSON.stringify(data));
});
"
```

If glob is not available, validate each file individually:
```bash
node -e "
const fs = require('fs');
const matter = require('gray-matter');
const file = fs.readFileSync('<path>', 'utf8');
const { data } = matter(file);
console.log('OK:', JSON.stringify(data, null, 2));
"
```

If any parse fails, fix the MDX file and retry.

Check if a dev server is running:
```bash
lsof -ti:3000 2>/dev/null
```

If running, note: "Dev server detected — entries visible at http://localhost:3000/now"

---

## Step 8: Commit

Stage and commit all entries in a single commit:
```bash
git add "src/content/now/$TODAY"*.mdx
git add "public/images/now/$TODAY/" 2>/dev/null
git commit -m "now: $TODAY — <mood> (<N> artifacts)"
```

Do NOT ask for confirmation. This is the automated pipeline.

---

## Step 9: Archive Raw Files

Move only the specific files processed in this session from `raw/` to `archive/`:
```bash
mv ~/Documents/Artifacts/raw/<specific-file> ~/Documents/Artifacts/archive/
```

If no files came from `raw/`, skip this step.

---

## Step 10: Summary

Print:
```
Daily update complete.
  Entries:  N files in src/content/now/
  Images:   public/images/now/$TODAY/ (N files) | none
  Mood:     <mood>
  Project:  <project>
  Commit:   <short hash>

  Artifacts:
    - $TODAY-<name-1>.mdx — "<description>"
    - $TODAY-<name-2>.mdx — "<description>"
    ...
```

**If any gaps were filled with text-only placeholders (Step 3, Priority 3)**, print a final notice:

```
Missing artifacts (could not produce screenshots):
  - <topic>: I would have liked to include <what>. Consider adding to raw/ next time.
```

---

## Error Recovery

| Problem | Action |
|---------|--------|
| No raw media found | Review day, produce artifacts via screenshot, or text-only |
| PDF conversion fails | Copy raw PDF, continue |
| MDX parse error | Fix frontmatter, retry |
| Existing entries | Overwrite (default) or ask (blog mode) |
| Git commit fails | Show error, don't retry |
| Image copy fails | Skip that artifact entirely, continue with others |
| qlmanage screenshot fails | Try alternative, or fall back to text-only |

---

## Flow Summary

### Default (zero prompts):
```
review day -> scan raw/ -> fill gaps -> curate -> copy images -> infer metadata per artifact -> write N MDX files -> validate -> commit -> archive -> summary
```

### With `--blog` (one prompt):
```
review day -> scan raw/ -> fill gaps -> curate -> copy images -> infer metadata -> ASK user for body text -> write 1 MDX file -> validate -> commit -> archive -> summary
```

### With explicit file path:
```
use provided file -> copy -> infer metadata -> write 1 MDX file -> validate -> commit -> archive -> summary
```
