# ASMV-82: Transcode arch-voice-mcp .mov clips to web-optimized .mp4

## Problem

The homepage ClipReel plays 16 arch-voice-mcp clips. 11 of them are `.mov` files (QuickTime container) tracked in Git LFS. Even though they contain H.264 video, Chrome/Safari don't reliably paint poster frames, honor `preload="metadata"`, or play them inline when served as `video/quicktime`. This is the root cause behind the band-aid loop of mobile/desktop video fixes on this section. Standardizing on `.mp4` with `+faststart` is the correct fix.

The remaining 5 clips (`clip-02`, `clip-03`, `clip-04`, `clip-15`, `clip-16`) are already real `.mp4` files committed directly — leave them alone.

## Scope (narrow and mechanical)

In scope:
1. Transcode the 11 `.mov` clips to web-optimized `.mp4` (H.264, CRF 23, `-preset fast`, `-pix_fmt yuv420p`, `+faststart`, audio stripped).
2. Update the `CLIPS` string array in `src/components/interactive/ClipReel.tsx` — only the 11 entries that currently end in `.mov`, change the extension to `.mp4`. Nothing else in that file is touched.
3. `git rm` the 11 original `.mov` files.
4. `pnpm lint` + `pnpm build` must pass.
5. Commit, push, open PR, transition ASMV-82 to `review`. Do NOT move to `done`.

Out of scope (explicit guardrails):
- No edits to `DesktopClipReel`, `DesktopClipSlide`, `MobileClipReel`, or the `ClipReel` export body. The parent session is rewriting these on `feature/asmv-90-clipreel-click-gallery`; any collision = merge conflict.
- No changes to `.gitattributes` (LFS `*.mov` pattern is used by unrelated directories).
- No re-encoding of the already-`.mp4` clips (02/03/04/15/16).
- No scaling, fps changes, or filter chains — preserve original resolution/framerate.

## Approach

### ffmpeg invocation (per file)

```
ffmpeg -i public/videos/software/arch-voice-mcp/clip-NN.mov \
  -c:v libx264 -preset fast -crf 23 \
  -pix_fmt yuv420p \
  -movflags +faststart \
  -an \
  public/videos/software/arch-voice-mcp/clip-NN.mp4
```

- `-preset fast`: encode speed priority (user specified: no slower presets).
- `-crf 23`: libx264 visually-lossless-ish default.
- `-pix_fmt yuv420p`: max browser compatibility (Safari rejects yuv444p).
- `-movflags +faststart`: moov atom at head → progressive playback.
- `-an`: drop audio (home page plays `muted`).

Run as a sequential shell loop over the 11 filenames. No parallelism needed at `-preset fast`.

### Files touched

Add (11):
- `public/videos/software/arch-voice-mcp/clip-{01,05,06,07,08,09,10,11,12,13,14}.mp4`

Delete (11, via `git rm`):
- `public/videos/software/arch-voice-mcp/clip-{01,05,06,07,08,09,10,11,12,13,14}.mov`

Modify (1):
- `src/components/interactive/ClipReel.tsx` — 11 string entries in `CLIPS`, extension swap only.

Plus Lattice event files and this plan file.

## Acceptance criteria

- [ ] 11 new `.mp4` files present under `public/videos/software/arch-voice-mcp/`
- [ ] 11 original `.mov` files removed from the tree
- [ ] `CLIPS` array in `ClipReel.tsx` references `.mp4` for all 11 transcoded clips; no other lines in that file changed
- [ ] `pnpm lint` passes
- [ ] `pnpm build` passes
- [ ] PR opened against `main` with the template body
- [ ] ASMV-82 in `review` with the PR URL commented

## Complexity

low — mechanical transcode + one-line-per-entry string edit.
