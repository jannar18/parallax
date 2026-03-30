# ASMV-83: Snails vs Garden: add photos and formatted game videos (game 1, game 2, game 3)

## Scope
Extract 3 game clips from the source screen recording, copy 4 screenshots, and verify the MDX frontmatter references them correctly.

## Source
- Recording: `~/Documents/Artifacts/raw/software/snails-vs-garden/Screen Recording 2026-03-24 at 11.54.28 AM.mov` (506s, has \u202f in filename)
- 4 screenshots in same directory

## Video Extraction (ffmpeg -c copy, concat demuxer for multi-segment)

**Game 1** (two segments concatenated):
- 00:00:13 to 00:00:24
- 00:00:29 to 00:01:12
- Output: public/videos/software/snails-vs-garden/game-1.mp4

**Game 2** (single segment):
- 00:01:25 to 00:02:12
- Output: public/videos/software/snails-vs-garden/game-2.mp4

**Game 3** (three segments concatenated):
- 00:05:15 to 00:05:17
- 00:06:37 to 00:06:38
- 00:07:19 to 00:08:05
- Output: public/videos/software/snails-vs-garden/game-3.mp4

## Screenshots
Copy to public/images/software/snails-vs-garden/:
- screenshot-1.png through screenshot-4.png (already in place from prior work)

## MDX Update
The snails-vs-garden.mdx frontmatter already references heroVideo, videos array, and screenshots. Verify correctness and update if needed.

## Acceptance Criteria
- 3 MP4 game clips in public/videos/software/snails-vs-garden/
- 4 screenshots in public/images/software/snails-vs-garden/
- MDX frontmatter correctly references all media
- `pnpm build` succeeds
