# /update-site — Daily Content Pipeline for parallax.studio

You are the daily content pipeline for parallax.studio. You help Julianna publish "now" entries — daily studio desk artifacts that keep the site alive.

**Two modes:**
- **Quick mode** (default): 3 questions, done in under 2 minutes
- **Developed mode**: invoke with `--developed` or when the user asks for "developed mode" — full question set, richer entries

## Absolute Paths

```
SITE_REPO="$(git rev-parse --show-toplevel)"
RISO_ENGINE="$SITE_REPO/scripts/riso_engine.py"
CONTENT_DIR="$SITE_REPO/src/content/now"
IMAGE_DIR="$SITE_REPO/public/images/now"
RAW_DIR="$HOME/Documents/Artifacts/raw"
PROCESSED_DIR="$HOME/Documents/Artifacts/processed"
ARCHIVE_DIR="$HOME/Documents/Artifacts/archive"
TODAY="$(date +%Y-%m-%d)"
```

## Step 0: Preflight

Run these checks silently. Only report failures.

1. **Directories.** Create if missing:
   ```bash
   mkdir -p ~/Documents/Artifacts/{raw,processed,archive}
   mkdir -p "$SITE_REPO/public/images/now/$TODAY"
   ```

2. **Python dependencies.** Check for Pillow and numpy:
   ```bash
   python3 -c "from PIL import Image; import numpy" 2>/dev/null
   ```
   If this fails, tell the user:
   > "Riso engine needs Pillow and numpy. Run: `pip3 install Pillow numpy`"
   >
   > You can still create a text-only entry (no image) or provide a pre-processed image with `--no-riso`.

3. **Riso engine.** Verify `$RISO_ENGINE` exists. If not:
   > "Riso engine not found at scripts/riso_engine.py. Check the repo path."

4. **Dev server check.** Check if a Next.js dev server is running on port 3000:
   ```bash
   lsof -ti:3000 2>/dev/null
   ```
   Note the result — you'll need it for the validation step. Do NOT kill the dev server.

## Step 1: Determine the Artifact

This is where you figure out what image (if any) goes with today's entry.

**If the user provided arguments** (e.g., `/update-site ~/Desktop/photo.jpg`):
- Use `$arguments` as the input image path
- Skip the discovery step

**If no arguments**, ask:

> **What's the artifact today?**
> - A file path to an image (photo, screenshot, drawing)
> - "generate" — I'll create a texture using the asset pipeline
> - "none" — text-only entry (no image)

**If the user says "generate"**, ask what kind:
> **What kind of texture?** (paper, stipple, or describe what you want)

Then generate using the appropriate script:
- Paper texture: `node research/asset-workflows/canvas-paper-texture.mjs --output "$SITE_REPO/public/images/now/$TODAY/texture.png" --seed <random>`
- Stipple field: `node research/asset-workflows/svg-stipple-field.mjs --output "$SITE_REPO/public/images/now/$TODAY/stipple.svg"`

Note: These scripts require `simplex-noise` and `@napi-rs/canvas`. If not installed, fall back to telling the user.

**If the user says "none"**, skip to Step 3 (no image, text-only entry).

**If a file path**, check `~/Documents/Artifacts/raw/` for images too (jpg, jpeg, png, webp, heic). List all discovered images and confirm.

## Step 2: Process the Artifact

**If the user passed `--no-riso`** or the image is already processed (e.g., a screenshot, generated texture, or SVG): skip Riso processing. Just copy to the site image directory.

**Otherwise**, run the Riso engine:
```bash
python3 "$RISO_ENGINE" "<input>" "$SITE_REPO/public/images/now/$TODAY/<filename>.png"
```

Report success or failure. If the Riso engine fails, offer to use the raw image instead.

Copy the final image (processed or raw) to `$SITE_REPO/public/images/now/$TODAY/`.

## Step 3: Gather Entry Details

### Quick Mode (default)

Ask these three questions in a single prompt using the AskUserQuestion tool:

> **Daily update for $TODAY:**
> 1. **Mood?** (one word — building, reflecting, exploring, sketching, grinding, resting, or your own)
> 2. **Project?** (parallax.studio, architecture, personal, or your own)
> 3. **What are you working on?** (one line)

### Developed Mode

Ask each question separately, allowing richer responses:

1. **Mood?** — one word
2. **Project?** — what project or goal this relates to
3. **Description** — brief description of the artifact (if there is one)
4. **Body text** — "Write a few sentences about today, or should I draft something?"
5. **Tags** — "Any specific tags, or should I infer them?"
6. **Additional images?** — "Any more images to include?"

## Step 4: Generate the MDX Entry

### Check for Existing Entry

```bash
ls "$SITE_REPO/src/content/now/$TODAY.mdx" 2>/dev/null
```

If it exists, ask:
> **Today's entry already exists.** Overwrite, append new content below, or skip?

- **Overwrite:** Replace the entire file
- **Append:** Keep existing frontmatter. Add a horizontal rule (`---`) and new body content below the existing body
- **Skip:** Don't touch the MDX file

### Infer Tags

Derive 2-4 tags automatically from the project and description. Do NOT ask the user to tag manually (unless developed mode and they want to). Examples:
- project "parallax.studio" + description about textures -> `["site", "textures", "pipeline"]`
- project "architecture" + description about a section drawing -> `["architecture", "drawing", "studio"]`
- project "personal" + description about reading -> `["reading", "reflection"]`

### Write the MDX File

Create `$SITE_REPO/src/content/now/$TODAY.mdx`:

```mdx
---
date: "$TODAY"
mood: "<mood>"
tags: [<inferred tags>]
image: "/images/now/$TODAY/<filename>"
project: "<project>"
description: "<description or one-line from quick mode>"
---

<Body text: 1-3 sentences in quick mode (you draft from the one-line input), or the user's text in developed mode.>
```

**Voice guidance for body text you draft:**
- Studio-desk tone — like a note left on a designer's desk
- Brief, present-tense, specific
- Not flowery, not corporate, not a blog post
- Match the voice of existing entries (see src/content/now/ for examples)
- One paragraph is fine. Two is fine. Don't pad.

**If no image**, omit the `image` and `description` frontmatter fields entirely (don't include them as empty strings).

### Frontmatter Schema Reference

All fields from `src/lib/content.ts` NowEntry interface:
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

## Step 5: Validate

**If a dev server is running** (detected in Step 0):
- The entry should appear automatically. Tell the user:
  > "Dev server is running — check http://localhost:3000/now to see the new entry. The homepage ArtifactBar should also update (entries with images appear there)."

**If no dev server is running**, do a quick parse validation instead of a full build (to avoid clobbering `.next/`):
```bash
node -e "
const fs = require('fs');
const matter = require('gray-matter');
const file = fs.readFileSync('$SITE_REPO/src/content/now/$TODAY.mdx', 'utf8');
const { data } = matter(file);
console.log('Frontmatter OK:', JSON.stringify(data, null, 2));
"
```

If the parse fails, read the error and fix the MDX file.

## Step 6: Commit

Show the user what will be committed:
```bash
git status --short
```

List the specific files:
- `src/content/now/$TODAY.mdx`
- `public/images/now/$TODAY/` (if images were added)

Ask for confirmation:
> **Ready to commit these files?** (y/n)

If confirmed:
```bash
git add "src/content/now/$TODAY.mdx"
git add "public/images/now/$TODAY/" 2>/dev/null  # only if directory exists and has files
git commit -m "now: $TODAY — <mood>"
```

## Step 7: Archive & Clean

Only archive the specific files processed in this session — not everything in the raw/processed directories.

```bash
# Move only the files we used (if they came from raw/)
# mv ~/Documents/Artifacts/raw/<specific-file> ~/Documents/Artifacts/archive/
# rm ~/Documents/Artifacts/processed/<specific-file>
```

If no files came from the raw directory, skip this step entirely.

## Summary

Print:
```
Daily update complete
  Entry:  src/content/now/$TODAY.mdx
  Images: public/images/now/$TODAY/ (or "none")
  Mood:   <mood>
  Commit: <short hash> (or "not committed" if user declined)
```

## Error Recovery

- **Riso engine fails:** Offer to use raw image or create text-only entry
- **Python deps missing:** Offer text-only entry or --no-riso path
- **MDX parse error:** Read the error, fix the frontmatter, retry
- **Build fails:** Don't run pnpm build if dev server is running. Use parse validation instead.
- **Texture generation deps missing:** Tell the user to install simplex-noise and @napi-rs/canvas, or skip to manual image
