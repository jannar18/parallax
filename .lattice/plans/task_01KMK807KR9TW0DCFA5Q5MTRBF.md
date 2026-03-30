# ASMV-83: Snails vs Garden — Add Photos and Game Videos

## Scope
Add screenshots and three gameplay videos (extracted from a single screen recording) to the Snails vs Garden software portfolio entry.

## Approach

### 1. Copy screenshots to public/images/software/snails-vs-garden/
Copy the 4 source screenshots, renaming to clean filenames:
- `Screenshot 2026-03-24 at 11.48.52 AM.png` -> `screenshot-1.png`
- `Screenshot 2026-03-24 at 11.49.13 AM.png` -> `screenshot-2.png`
- `Screenshot 2026-03-24 at 12.47.25 PM.png` -> `screenshot-3.png`
- `snails vs garden gameplay .png` -> `screenshot-4.png`

### 2. Extract game videos using ffmpeg -c copy (fast, no re-encode)
Source: `Screen Recording 2026-03-24 at 11.54.28 AM.mov`

**Game 1** (2 segments, concat):
- 00:00:13–00:00:24
- 00:00:29–00:01:12

**Game 2** (1 segment):
- 00:01:25–00:02:12

**Game 3** (3 segments, concat):
- 00:05:15–00:05:17
- 00:06:37–00:06:38
- 00:07:19–00:08:05

Output to `public/videos/software/snails-vs-garden/game-{1,2,3}.mp4`

### 3. Update snails-vs-garden.mdx frontmatter
Add `heroVideo`, `videos` array, and `screenshots` array following the established pattern (see arch-voice-mcp.mdx).

### 4. Verify with pnpm build

## Key Files
- `src/content/work-software/snails-vs-garden.mdx`
- `public/videos/software/snails-vs-garden/` (new)
- `public/images/software/snails-vs-garden/` (existing — add screenshots)

## Acceptance Criteria
- 3 MP4 game videos in public/videos/software/snails-vs-garden/
- 4 screenshots in public/images/software/snails-vs-garden/
- MDX frontmatter references all media
- `pnpm build` passes
