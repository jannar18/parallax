# /update-site Skill — Manual Process Spec

Documented from the 2026-03-06 content pipeline practice run. Each step below is a manual action taken during the first real content addition. The `/update-site` skill (ASMV-18) should automate steps 2-5 and prompt the user for steps that require human judgment.

---

## The Full Sequence

### Step 1: Choose/generate the artifact (HUMAN)
**Requires human judgment.** The user either:
- Provides an image file (photo, screenshot, drawing)
- Asks the agent to generate one (texture, diagram, visualization)
- Points to an existing file to use

**What the skill should ask:** "What's the artifact? (file path, or should I generate something?)"

### Step 2: Process the artifact image (AUTOMATED)
1. Create directory: `public/images/studio-desk-archive/YYYY-MM-DD/`
2. Copy or generate the image into that directory
3. For v1: no image treatment (grain/monochrome deferred to later iteration)
4. For future: apply grain overlay + desaturation via Sharp or CSS filter

**Input needed:** Source image path or generation parameters
**Output:** `/images/studio-desk-archive/YYYY-MM-DD/<filename>.png`

### Step 3: Write the MDX entry (SEMI-AUTOMATED)
1. Create `src/content/now/YYYY-MM-DD.mdx`
2. Frontmatter fields:
   - `date`: today's date (auto-derived)
   - `mood`: **ask the user** — one word
   - `tags`: **ask the user** or infer from context
   - `image`: path from Step 2 (auto-derived)
   - `project`: **ask the user** — what project/goal this relates to
   - `description`: **ask the user** — short description of the artifact
3. Body text: **ask the user** for a brief note, or offer to draft one

**What the skill should ask:**
- "Mood? (one word — e.g., building, exploring, refining)"
- "Project? (e.g., parallax.studio, thesis)"
- "Brief description of the artifact?"
- "Any body text, or should I draft something?"

### Step 4: Verify the entry renders (AUTOMATED)
1. Run `pnpm build` or check dev server
2. Confirm the entry appears on the Now page
3. Confirm the artifact appears in the homepage ArtifactBar

### Step 5: Commit (AUTOMATED with human approval)
1. Stage the new files: MDX entry, artifact image
2. Draft commit message: "Add daily entry YYYY-MM-DD: <mood>"
3. **Ask user** before committing

---

## Quick Mode vs Developed Mode (from PRD §7)

### Quick mode (target: <2 minutes)
The skill asks 3 questions:
1. "What's the artifact?" (file or generate)
2. "Mood?" (one word)
3. "Project + brief description?"

Then auto-generates everything else, including a one-sentence body text.

### Developed mode
The skill asks all questions from Step 3, allows the user to write longer body text, and supports multiple images per entry.

---

## What Was Automated vs Manual (Practice Run)

| Action | Automated? | Notes |
|--------|-----------|-------|
| Extend NowEntry schema | One-time setup | Already done — schema now has image, project, description |
| Build ArtifactBar component | One-time setup | Already done — renders on homepage |
| Generate texture image | Automated | `node canvas-paper-texture.mjs --output ... --seed 42` |
| Create image directory | Automated | `mkdir -p public/images/studio-desk-archive/YYYY-MM-DD/` |
| Copy/process artifact | Automated | `cp` or Sharp processing |
| Write MDX frontmatter | Semi-auto | Date auto-derived; mood, project, description need user input |
| Write MDX body | Manual | User writes or approves draft |
| Verify rendering | Automated | `pnpm build` |
| Commit | Auto + approval | Agent drafts, user confirms |

---

## Dependencies

- `simplex-noise` + `@napi-rs/canvas` — for texture generation (installed as devDeps)
- `next/image` — for rendering artifacts (already in Next.js)
- Future: `sharp` — for image treatment (grain, monochrome, risograph)

---

## Schema Reference

```typescript
interface NowEntry {
  slug: string;       // auto from filename
  date: string;       // YYYY-MM-DD
  mood?: string;      // one word
  tags?: string[];    // categorization
  image?: string;     // artifact image path (public/)
  project?: string;   // related project/goal
  description?: string; // artifact description
  content: string;    // MDX body
}
```

## File Conventions

- MDX entries: `src/content/now/YYYY-MM-DD.mdx`
- Artifact images: `public/images/studio-desk-archive/YYYY-MM-DD/<name>.<ext>`
- Generated textures: `public/textures/<name>.<ext>` (site-wide, not per-entry)
