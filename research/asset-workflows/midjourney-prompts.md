# Midjourney Prompt Templates -- Mission Asimov

> **Purpose:** Carefully crafted prompt templates for generating visual assets that match the Mission Asimov design language -- warm, earthen, restrained, hand-quality, atmospheric.
>
> **How to use:** Copy a template, fill in the `[bracketed]` placeholders, and paste into Midjourney. Adjust `--stylize` (0-1000) to control how much Midjourney imposes its own aesthetic vs. following your prompt literally. Lower values = more literal; higher = more "artistic."
>
> **Palette reference:**
> - Terracotta `#C4724E` | Amber `#D4A76A` | Cream `#F5F0E8`
> - Warm gray `#B5AFA6` | Sage `#8B9E7E` | Dusty rose `#C9A5A0`
> - Slate blue-gray `#7A8B9A` | Coral accent `#C95D45`

---

## 1. Hero Image -- Atmospheric Landscape

For the main landing section. Evokes the "landscape as co-author" quality from the Pinterest board.

```
architectural landscape, vast desert terrain with distant mesa formations,
warm terracotta and amber earth tones, atmospheric haze, soft golden hour light,
hand-rendered quality like a watercolor field sketch, stippled texture in the
foreground, generous negative space in the sky, muted warm palette,
cream and ochre tones, no people, quiet and contemplative,
European architectural drawing tradition --ar 21:9 --stylize 350 --v 6.1
```

**Variants:**
- Replace "desert terrain" with "rolling prairie hills" or "coastal cliff edge"
- Add `--chaos 15` for more unexpected compositions
- Use `--sref [URL of a reference image]` to lock the style if you find a generation you love

---

## 2. Texture Background -- Paper/Parchment

For site backgrounds and section textures. Meant to be tiled or used as a large-format background.

```
seamless paper texture, aged handmade cotton paper, warm off-white base color
hex F5F0E8, subtle visible fiber grain, very slight warm tonal variation,
occasional tiny amber and terracotta flecks like aged foxing spots,
no text no writing no marks, flat even lighting, macro photography,
high resolution texture scan --ar 1:1 --stylize 100 --tile --v 6.1
```

**Variants:**
- Remove `--tile` for a non-repeating hero-scale texture
- Add "watercolor wash edges, paint bleeding into wet paper" for a more active texture
- Try `--stylize 50` for maximum photorealism

---

## 3. Architectural Portfolio Backdrop

For project pages. Creates atmospheric context behind portfolio imagery.

```
abstract architectural drawing, faint pencil contour lines on cream paper,
topographic-style flowing lines suggesting terrain and building footprint,
very light terracotta and warm gray tones, stipple dot shading in corners,
generous whitespace, European architectural representation style,
hand-drawn quality, no text, minimal, atmospheric,
ETH Zurich drawing tradition --ar 3:2 --stylize 250 --v 6.1
```

**Variants:**
- "section drawing" instead of "contour lines" for a vertical slice quality
- Add "collage fragments of stone wall texture" for the collage-layering motif
- Adjust `--ar 16:9` for full-width section backgrounds

---

## 4. Decorative Element -- Stipple Field

For section dividers and decorative zones. The "thousands of tiny marks" quality.

```
abstract stipple dot field, thousands of tiny hand-placed ink dots,
variable density creating organic cloud-like masses, dissolving at edges
into white space, warm gray and terracotta ink on cream paper,
resembling architectural site plan stipple shading, no shapes no symbols,
pure texture, macro view, analog printing quality,
risograph aesthetic --ar 3:1 --stylize 200 --v 6.1 --no text letters symbols
```

**Variants:**
- `--ar 1:3` for a vertical divider
- Add "sage green and slate blue-gray tones" for color variation
- Try `--chaos 25` for more organic, unpredictable density patterns

---

## 5. Section Divider -- Organic Line

For horizontal breaks between content sections. References the Art Nouveau "whiplash curves" and topographic line quality.

```
single flowing organic line drawn in warm gray ink on cream paper,
resembling a topographic contour line or Art Nouveau whiplash curve,
very thin line with slight thickness variation suggesting pen pressure,
generous white space above and below, minimal, quiet,
hand-drawn quality --ar 8:1 --stylize 150 --v 6.1 --no text
```

**Variants:**
- "two parallel lines with slight divergence" for a contour-pair motif
- Add "faint stipple dots scattered along the line" for texture
- `--ar 12:1` for an ultra-wide, very subtle divider

---

## 6. Collage Element -- Material Fragment

For the "collage as primary method" motif. Photo-fragments that can be layered over drawn/generated contexts.

```
close-up photograph of [rammed earth wall / aged stone surface / handmade
brick texture / weathered wood grain], warm terracotta and amber tones,
soft diffused natural light, shallow depth of field at edges creating
organic blur, the surface shows material honesty and weathering,
architecture material study, no people --ar 4:5 --stylize 200 --v 6.1
```

**Fill `[material]` with:**
- `rammed earth wall with visible sediment layers`
- `hand-pressed terracotta brick with mortar joints`
- `desert sandstone with iron oxide staining`
- `aged plaster wall with hairline cracks and warm patina`

---

## 7. Botanical Element -- Hand-Drawn Tree

For the "hand-drawn tree as character" motif from the Pinterest board. Trees rendered with architectural drawing precision.

```
single tree elevation drawing, [desert willow / olive tree / palo verde],
hand-drawn with fine pen on cream paper, stipple dot shading for canopy
density, visible individual branches, botanical specificity not generic,
architectural representation style, no background, no ground plane,
the tree is a portrait --ar 3:4 --stylize 200 --v 6.1 --no ground grass
landscape background
```

**Variants:**
- "row of three trees at different scales" for a tree-line elevation
- Add "with root system visible below a thin ground line" for the infrastructure-section quality
- Use `--sref` with an ETH Zurich vegetation drawing as reference

---

## 8. Abstract Pattern -- Watercolor Wash

For section backgrounds where a more active texture is needed. The "watercolor-wash edge dissolution" quality.

```
abstract watercolor wash on thick cotton paper, warm terracotta and amber
pigment bleeding outward from center, soft irregular edges dissolving into
the white of the paper, no hard boundaries, the paint pools and bleeds
organically, very muted and atmospheric, cream undertone, seen from directly
above flat on a table, no brush strokes visible just pure pigment diffusion
--ar 16:9 --stylize 300 --v 6.1 --no brush strokes text writing
```

**Variants:**
- "dusty rose and sage green pigments" for cooler section backgrounds
- "two separate wash pools with negative space between them" for a more dynamic composition
- Add "faint pencil lines visible beneath the wash" for the drawing-under-color quality

---

## Style Reference Strategy

Midjourney's `--sref` (style reference) parameter is powerful for maintaining consistency across generations. Recommended approach:

1. Generate a batch of textures/elements using the prompts above
2. Identify 2-3 outputs that best match the Mission Asimov aesthetic
3. Save those image URLs as style references
4. Use `--sref [URL1] [URL2]` on all subsequent generations to maintain visual consistency
5. Adjust `--sw` (style weight, 0-1000, default 100) to control how strongly the reference influences output

**Recommended `--sref` workflow:**
```
/imagine [your prompt] --sref https://example.com/best-texture.png --sw 150
```

---

## Parameter Quick Reference

| Parameter | Range | Recommended | Purpose |
|-----------|-------|-------------|---------|
| `--stylize` / `--s` | 0-1000 | 150-350 | Aesthetic intensity. Lower = more literal to prompt |
| `--chaos` | 0-100 | 0-25 | Variation between outputs. Higher = more surprises |
| `--ar` | Any ratio | See per-prompt | Aspect ratio |
| `--tile` | Flag | For textures | Makes output seamlessly tileable |
| `--sref` | URL(s) | After initial batch | Style reference for consistency |
| `--sw` | 0-1000 | 100-200 | Style weight (how strongly --sref influences) |
| `--v` | 5, 5.2, 6, 6.1 | 6.1 | Model version |
| `--no` | Terms | See per-prompt | Negative prompt (things to exclude) |
