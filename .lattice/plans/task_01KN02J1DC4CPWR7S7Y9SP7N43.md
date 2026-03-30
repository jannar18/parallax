# ASMV-81: Horizontal Scroll Clip Series for Arch Voice Home Section

## Goal

Replace the single auto-playing `MergeVideo` in Section 5 of the home page with a horizontally scrollable series of Arch Voice MCP video clips. Each clip shows a riso-filtered thumbnail at rest; hover reveals and plays the video.

## Clips (from arch-voice-mcp.mdx frontmatter)

Order: c18 (hero), c03, c06, c07, c08, c10, c13, c21
All at `/videos/software/arch-voice-mcp/`

## Approach

### 1. New component: `ClipReel.tsx` (`src/components/interactive/`)

A `"use client"` component that renders a horizontal scroll strip of video clips.

**Layout:**
- Full-width container, `h-screen`, `overflow-x-auto`, `scrollbar-hide`
- Flex row of clip items with `gap-[2vw]`, padding on sides
- Each clip: `h-[80vh]` with auto width (videos are `object-contain` so aspect ratio is preserved)
- Clips hardcoded in the component (same pattern as MergeVideo — no props needed)

**Per-clip interaction (riso cover + hover play):**
- Each clip wraps a `<video>` element with `muted loop playsInline preload="metadata"`
- Over the video, a riso-filter overlay renders the first frame in the brand's riso style
- On `mouseenter`: fade out riso overlay (300ms), play video
- On `mouseleave`: pause video, fade in riso overlay
- On touch: tap toggles play/pause (same as HoverVideo)

**Riso thumbnail approach:**
- Use the video element itself with `preload="metadata"` (browser shows first frame)
- Layer a `pointer-events-none` div over each clip with:
  - Grayscale + contrast + halftone grain via CSS/SVG filter (adapted from `RisoImage.tsx`)
  - Brand ink color tint
  - Opacity transitions on hover
- This avoids needing to generate separate riso PNG thumbnails for each clip

### 2. Update home page (`src/app/page.tsx`)

- Replace `<MergeVideo />` import and usage with `<ClipReel />`
- Section 5 stays `relative h-screen overflow-hidden bg-ink` — the ClipReel fills it

## Acceptance Criteria

- [ ] Section 5 shows a horizontal strip of 8 video clips in the specified order
- [ ] User can scroll horizontally (scroll left → clips enter from right)
- [ ] Each clip at rest shows a riso-filtered thumbnail (grayscale + halftone + ink tint)
- [ ] Hovering a clip fades the riso filter and plays the video
- [ ] Leaving hover pauses video and restores riso filter
- [ ] Touch devices: tap toggles play/pause
- [ ] No layout shift or jank; clips maintain consistent height
- [ ] MergeVideo component is no longer used on the home page (can remain in codebase)

## Files Changed

- `src/components/interactive/ClipReel.tsx` (new)
- `src/app/page.tsx` (swap MergeVideo → ClipReel)
