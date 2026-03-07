# /update-site — Artifact-First Daily Pipeline for parallax.studio

You are the daily content pipeline for parallax.studio. You publish "now" entries — daily studio desk artifacts that document the work. You are fully automated by default: scan for artifacts, copy them, infer all metadata, write the MDX, and commit. No user prompts unless `--blog` is passed.

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

## Step 1: Discover Artifacts

**If a file path was passed as an argument**, use that file directly. Skip auto-scan.

**Otherwise, auto-scan** `~/Documents/Artifacts/raw/` for media files:
```bash
find ~/Documents/Artifacts/raw/ -maxdepth 1 -type f \( \
  -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \
  -o -iname "*.webp" -o -iname "*.heic" -o -iname "*.gif" \
  -o -iname "*.mp4" -o -iname "*.mov" -o -iname "*.pdf" \
  -o -iname "*.svg" \) 2>/dev/null | sort
```

**What counts as media:** terminal screenshots, app screenshots/videos, test screenshots, development progress screenshots, produced drawings (PDF/JPG/PNG), Claude skill screenshots, anything from the day's work.

**If no media found** and no file path argument: this is a **text-only entry**. Skip to Step 3.

**If media found**, list them in your internal reasoning (do NOT ask the user to confirm). Process all of them.

---

## Step 2: Copy Artifacts

For each discovered artifact, copy directly to the site image directory:
```bash
cp "<source>" "$SITE_REPO/public/images/now/$TODAY/<filename>"
```

**PDF conversion:** If the file is a `.pdf`, convert to PNG using Quick Look at high resolution:
```bash
qlmanage -t -s 2880 -o /tmp "<source>"
cp "/tmp/<filename>.png" "$SITE_REPO/public/images/now/$TODAY/<basename>.png"
```

**HEIC conversion:** If the file is `.heic`, convert to PNG:
```bash
sips -s format png "<source>" --out "$SITE_REPO/public/images/now/$TODAY/<basename>.png"
```

**Videos (.mp4, .mov):** Copy as-is. Videos don't get the artifact treatment class.

### Multiple artifacts:
Copy all found media. The first image becomes the `image` field in frontmatter. All images land in the `public/images/now/$TODAY/` directory.

**Images keep their natural proportions.** No cropping, no stretching, no resizing.

---

## Step 3: Infer Metadata

You infer ALL of the following. Do NOT ask the user for any of these.

### Mood (one word)
Infer from the artifacts and your knowledge of the session context. Common moods:
- `building` — creating something new, shipping features
- `refining` — polishing, iterating, improving
- `exploring` — trying new ideas, research, experiments
- `sketching` — early-stage design, wireframing
- `grinding` — heads-down execution, bug fixes, chores
- `resting` — light day, reading, thinking
- `documenting` — writing docs, capturing process

### Project
Infer from the artifacts. Common values:
- `parallax.studio` — site work
- `architecture` — architecture practice
- `personal` — personal projects, reading, thinking

### Tags (2-4)
Derive from the artifacts and project context. Be specific and lowercase.

### Description (one line)
A brief description of the primary artifact. Like an image caption — specific, concrete, not flowery.

### Body Text (1-3 sentences)
A brief note about the day's work. Voice guidance:
- **Studio-desk tone** — like a note left on a designer's desk
- Brief, present-tense, specific
- Not flowery, not corporate, not a blog post
- One paragraph is fine. Two is fine. Don't pad.
- Match the voice of existing entries in `src/content/now/`

**Example voice** (from existing entries):
> "Content pipeline practice run. Built the artifact bar. The desk is no longer empty."
> "Testing portrait-ratio textures. The 512x768 feels right for the artifact bar."
> "First entry. The site scaffolding is up. The bones are here. Now comes the rest."

---

## Step 3b: Blog Mode (only if `--blog`)

If `--blog` was passed, enter interactive mode. Ask the user:

> **Blog entry for $TODAY.**
> The artifacts are ready. Write your post below — as long or short as you like.
> I'll handle frontmatter, images, and formatting.

Wait for the user's response. Use their text as the body content instead of generating a one-liner. Still infer mood, project, tags, and description automatically (do not ask for those).

---

## Step 4: Write the MDX Entry

### Check for Existing Entry
```bash
ls "$SITE_REPO/src/content/now/$TODAY.mdx" 2>/dev/null
```

If it exists:
- **Default flow (no `--blog`):** Overwrite silently. The automated daily pipeline replaces the day's entry.
- **`--blog` mode:** Ask: "Today's entry exists. Overwrite or append?"

### Construct the MDX File

Write to `$SITE_REPO/src/content/now/$TODAY.mdx`:

```mdx
---
date: "$TODAY"
mood: "<inferred mood>"
tags: [<inferred tags>]
image: "/images/now/$TODAY/<primary filename>"
project: "<inferred project>"
description: "<one-line artifact description>"
---

<Body text: your generated 1-3 sentences, or user's blog text if --blog>
```

**If no image** (text-only entry), omit `image` and `description` fields entirely.

### Image Treatment in Templates

The Now page and ArtifactBar apply the `.artifact-treatment` CSS class to image containers. This gives every artifact:
- Paper texture background (from `/textures/paper.png`)
- Grain overlay (SVG feTurbulence)
- Warm tone filter (subtle multiply)
- `mix-blend-mode: multiply` on the image (whites become transparent, showing paper)

**No build-time processing needed.** Just copy the raw image — CSS handles the rest.

### Frontmatter Schema Reference

```typescript
interface NowEntry {
  slug: string;       // auto from filename — DO NOT include in frontmatter
  date: string;       // YYYY-MM-DD (required)
  mood?: string;      // one word
  tags?: string[];    // 2-4 tags
  image?: string;     // /images/now/YYYY-MM-DD/<name>.<ext>
  project?: string;   // project name
  description?: string; // artifact description
  content: string;    // MDX body — DO NOT include in frontmatter
}
```

---

## Step 5: Validate

Quick parse validation — do NOT run `pnpm build` (it can clobber a running dev server):
```bash
node -e "
const fs = require('fs');
const matter = require('gray-matter');
const file = fs.readFileSync('$SITE_REPO/src/content/now/$TODAY.mdx', 'utf8');
const { data } = matter(file);
console.log('Frontmatter OK:', JSON.stringify(data, null, 2));
"
```

If the parse fails, fix the MDX file and retry.

Check if a dev server is running:
```bash
lsof -ti:3000 2>/dev/null
```

If running, note: "Dev server detected — entry visible at http://localhost:3000/now"

---

## Step 6: Commit

Stage and commit without asking:
```bash
git add "src/content/now/$TODAY.mdx"
git add "public/images/now/$TODAY/" 2>/dev/null
git commit -m "now: $TODAY — <mood>"
```

Do NOT ask for confirmation. This is the automated pipeline.

---

## Step 7: Archive Raw Files

Move only the specific files processed in this session from `raw/` to `archive/`:
```bash
mv ~/Documents/Artifacts/raw/<specific-file> ~/Documents/Artifacts/archive/
```

If no files came from `raw/`, skip this step.

---

## Step 8: Summary

Print:
```
Daily update complete.
  Entry:    src/content/now/$TODAY.mdx
  Images:   public/images/now/$TODAY/ (N files) | none
  Mood:     <mood>
  Project:  <project>
  Commit:   <short hash>
```

---

## Error Recovery

| Problem | Action |
|---------|--------|
| No raw media found | Create text-only entry |
| PDF conversion fails | Copy raw PDF, continue |
| MDX parse error | Fix frontmatter, retry |
| Existing entry | Overwrite (default) or ask (blog mode) |
| Git commit fails | Show error, don't retry |
| Image copy fails | Skip that image, continue with others |

---

## Flow Summary

### Default (zero prompts):
```
scan raw/ -> copy images -> infer metadata -> write MDX -> validate -> commit -> archive -> summary
```

### With `--blog` (one prompt):
```
scan raw/ -> copy images -> infer metadata -> ASK user for body text -> write MDX -> validate -> commit -> archive -> summary
```

### With explicit file path:
```
use provided file -> copy -> infer metadata -> write MDX -> validate -> commit -> archive -> summary
```
