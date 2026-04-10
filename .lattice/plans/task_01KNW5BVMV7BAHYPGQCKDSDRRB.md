# ASMV-90: Replace ClipReel scroll-jacking with click-driven gallery + side tracker (desktop)

## Problem

The current desktop ClipReel (`src/components/interactive/ClipReel.tsx:32`) is a 1700vh
sticky-scroll wipe — every clip is a stacked layer revealed by scroll position. Videos
all autoplay/loop. This is opaque to first-time visitors, hijacks ~17 viewports of scroll,
and gives no sense of "what each clip is showing."

## Goal

Replace the desktop scroll-driven wipe with a single-viewport, click-driven clip gallery:

- One `100vh` section, no scroll-jacking.
- Left/right chevron buttons cycle clips. Optional keyboard arrow support.
- The cover slot is the only thing static on initial load — the video does **not**
  start when you reach the section (the user lands on the riso cover).
- Once the user navigates to a clip (via tracker, prev/next, or any other means),
  the clip **auto-plays** as soon as it's ready. It plays once and does **not**
  loop. On `ended` it freezes on the last frame. Clicking the stage while playing
  pauses; clicking after end replays from the start.
- The empty left column (currently dead space — videos are `justify-end`) becomes a
  vertical tracker: a column of nodes labeled "Clip 01" … "Clip 16" plus the riso
  cover as "Cover" at the top. Active node highlighted (scarlet). Clicking a node
  jumps directly to that clip.

Mobile (`MobileClipReel`) is **out of scope** and stays as-is. Don't touch it.

## Approach

Rewrite `DesktopClipReel` in place. Keep the file structure (DesktopClipReel +
MobileClipReel + default export with the touch sniff) so the mobile path is untouched.

### State

```ts
const [current, setCurrent] = useState(-1); // -1 = riso cover, 0..15 = clips
const [playing, setPlaying] = useState(false);
const videoRef = useRef<HTMLVideoElement>(null);
```

Single persistent `<video>` element (matches the mobile pattern, which has proven
reliable per the recent commit history). When `current` changes:
- If `current === -1`: hide the video, show the riso cover image.
- Else: set `videoRef.current.src = CLIPS[current]`, `load()`, then **do not play** —
  show the first frame as poster. Reset `playing` to `false`.

To get a static first frame without autoplay we use `preload="metadata"` plus a one-shot
`loadeddata` listener that calls `video.currentTime = 0` (some browsers need this nudge
to render the first frame). No `loop` attribute. Keep `muted` and `playsInline`.

### Click-to-play logic

```ts
function handleVideoClick() {
  const v = videoRef.current;
  if (!v || current === -1) return;
  if (playing) { v.pause(); setPlaying(false); return; }
  if (v.ended || v.currentTime >= v.duration - 0.05) {
    v.currentTime = 0;
  }
  v.play().catch(() => {});
  setPlaying(true);
}

// onEnded handler: setPlaying(false). Do NOT reset currentTime — the
// browser holds the last frame, which is what we want.
```

### Auto-play on clip change

The `useEffect` that swaps `src` also kicks off playback as soon as the new clip
reports `canplay`. Videos are `muted` (Chrome's autoplay policy is satisfied) and
`playsInline`. If autoplay is blocked for any reason, we silently fall back to the
click-to-play state (the play overlay is visible) — no error toast needed.

### Layout (desktop only)

The video keeps its current sizing — `h-full w-auto object-contain` aligned with
`justify-end` — so it dominates the viewport at full height and its natural width.
The tracker is **not** a grid column; it lives in the leftover space on the left
of the viewport, positioned absolutely.

```
┌─ section h-screen ─────────────────────────────────────────┐
│                                                            │
│   ● Cover            ┌──────────────────────────────────┐  │
│   ● Clip 01          │                                  │  │
│   ● Clip 02   ←      │                                  │  │
│   ● Clip 03          │      <video>  h-full w-auto      │  │
│   ...                │      object-contain              │  │
│   ● Clip 16          │      justify-end                 │  │
│                      │                                  │  │
│                      └──────────────────────────────────┘  │
│   ◀ prev                                          next ▶   │
└────────────────────────────────────────────────────────────┘
```

- Outer: `<section className="relative h-screen bg-paper overflow-hidden">`
- Video stage: same pattern as today — `flex items-center justify-end` wrapper,
  `<video className="h-full w-auto object-contain">`. Single persistent element.
  Riso cover (`<img>`) layered in the same stage container, shown when `current === -1`.
- Tracker: absolutely positioned on the left edge.
  `absolute left-[5vw] top-1/2 -translate-y-1/2`. Vertical flex column, tight
  spacing — small enough to fit comfortably in the negative space without ever
  competing with the video. Each row is a button: small circular node (~8px) +
  font-mono "Clip 0N" label at `clamp(0.7rem, 0.9vw, 0.825rem)`.
  Active row gets `text-scarlet` + filled scarlet node; inactive rows get
  `text-ink-lighter` + hollow node. Hover bumps inactive rows to `text-ink`.
- Prev/next chevrons: absolutely positioned at the section's left/right edges,
  vertically centered. Same SVG arrows as the mobile version, slightly larger.
  Disabled state (40% opacity, no pointer) when at boundary.
- Riso cover stays slot 0 (`current === -1`). Tracker first row is "Cover".

If the tracker ever visually collides with a particularly wide clip, the fallback
is to drop the tracker's `left` offset closer to the viewport edge. Not pre-emptively
solving for it — verify in dev with the actual clip aspect ratios.

### Removing scroll height

Today the section is `TOTAL_SLIDES * 100dvh` tall. Removing this collapses the home
page by ~1600vh. Verify the surrounding sections in `src/app/page.tsx` still flow
sensibly — particularly the spacer at `page.tsx:90-93` (already only 25vh) and
the studio-desk section that follows.

## Files touched

- `src/components/interactive/ClipReel.tsx` — rewrite `DesktopClipReel`. Leave
  `MobileClipReel` and the `default export` selector untouched.

That's it. No new files, no changes to `page.tsx`, no shared state.

## Acceptance criteria

1. Desktop home page: ClipReel section is exactly `100vh`. No scroll-jacking.
2. On first load: riso cover visible, tracker shows "Cover" highlighted, no video
   playing.
3. Clicking "Clip 01" in the tracker (or the right chevron) advances to clip 01 and
   the clip auto-plays once it's ready.
4. When a clip ends, the last frame is held (no loop). Clicking the stage replays
   from start. Clicking mid-play pauses (toggle).
5. Navigating prev/next or jumping via the tracker auto-plays the destination clip.
6. Tracker's active row updates as `current` changes. Clicking any row jumps directly.
7. Prev chevron disabled at "Cover", next chevron disabled at "Clip 16".
8. Prev/next chevrons render in scarlet (visibility fix from review feedback).
9. A play indicator overlay appears on the video stage when paused/ended and fades
   out during playback.
10. Mobile path (touch-detected) is byte-identical to today's behavior — diff should
    show no changes inside `MobileClipReel`.
11. `pnpm lint` and `pnpm build` both pass.
12. No console errors when cycling through all 17 slides (assets permitting — see
    open risks).
13. Orphan re-edited clip files (`c03.mp4`, `c10.mp4`, `c13.mp4`) are removed from
    `public/videos/software/arch-voice-mcp/`.

## Out of scope

- Mobile redesign (separate concern, working today).
- Keyboard navigation polish beyond basic ←/→ (nice to have if trivial; skip if not).
- Animated transitions between clips (hard cut is fine for v1).
- Prefetching adjacent clips (clips are local files, transient flicker is acceptable).
- Updating the labels beyond "Clip 01"…"Clip 16" — the user explicitly chose minimal
  labels for now.
- Touching `page.tsx` unless removing scroll height surfaces a layout regression.

## Open risks

- **LFS-pointer .mov clips (out of scope here, tracked under ASMV-82)**: 11 of the
  16 clips (`clip-01.mov`, `clip-05.mov` … `clip-14.mov`) are Git LFS pointers, not
  actual video files, in this dev environment. They've never loaded for any version
  of `ClipReel` here. Confirmed root cause of ASMV-82's "mobile fixes don't stick"
  symptom. ASMV-82 owns the transcode-to-mp4 fix; this task is intentionally not
  installing git-lfs / ffmpeg. The 5 working .mp4 clips (02, 03, 04, 15, 16) are
  enough to validate the click-driven gallery UX.
- **First-frame poster on `<video>`**: with auto-play on clip change this is mostly
  a non-issue (the video starts playing immediately so frame 0 doesn't have to be
  painted as a static poster). Still relevant for the moment between `src` swap
  and `canplay`. Acceptable.
- **Hard cuts between clips**: switching `src` causes a brief blank frame. Acceptable
  for v1; can crossfade later if it bothers the user.
