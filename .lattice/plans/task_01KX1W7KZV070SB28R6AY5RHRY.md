# ASMV-107: Re-thumbnail Secret Garden (flowers) + generate Schelling Points landscape demo

## Scope
Two lab-gallery thumbnail fixes in `src/data/works.json` (no component changes — the `gif` field IS the card thumbnail).

1. **Secret Garden** — swap the card thumbnail (`gif`) to the flower-editor animation currently shown in the popover (`/lab/shots/secret-garden-flowers.mp4`). Move the old clean cottage clip (`/lab/secret-garden.mp4`) into `screenshots` so it stays in the popover carousel (no duplication).
2. **Schelling Points** — the current thumbnail is a portrait mobile recording (424×958) that gets ugly-cropped in the 16:10 card. Generate a new 16:10 (1000×626) landscape demo matching the other thumbnails: real phone screen centered with rounded corners + soft shadow over a blurred, color-matched wash pulled from the app's own footage. Trimmed to an 18s interaction arc (rounds → typing → confetti "Mind Meld" climax). New asset: `public/images/software/schelling-points/schelling-points.demo.1.mp4`. Point `gif` at it; original portrait recording moves into `screenshots`.

## Approach
- ffmpeg composite: blurred fill bg (blur at low-res then upscale for speed) + `alphamerge` rounded-corner phone screen + PIL-generated shadow/border PNGs. Bound looped image inputs with `-t` + `-shortest`.
- Assets generated in scratchpad, copied into `public/`.

## Acceptance criteria
- Both cards render at 16:10 with no awkward cropping.
- Schelling thumbnail shows the actual app + interactions, beautiful and cohesive with the gallery.
- Popover carousels still contain all prior media (nothing dropped).
- `pnpm build` succeeds; `pnpm lint` clean.
