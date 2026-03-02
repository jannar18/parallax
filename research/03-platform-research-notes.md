# AI Image Generation Platform Research — Working Notes

> **Status:** Working notes (in progress)
> **Date:** 2026-03-02
> **Purpose:** Compare AI image generation platforms for producing assets in the Mission Asimov aesthetic. These notes will be folded into the final `research/03-ai-graphics-pipeline.md` deliverable.

---

## Platform 1: OpenAI GPT Image (formerly DALL-E)

### Current State (March 2026)

OpenAI has moved beyond the "DALL-E" branding. **DALL-E 3 is deprecated** (EOL May 12, 2026). The current lineup is the **GPT Image** family — natively multimodal LLMs, not standalone diffusion models.

| Model | Status | Notes |
|-------|--------|-------|
| **gpt-image-1.5** | Current flagship | Superior instruction following, text rendering, 4x faster than gpt-image-1. #1 on LMArena Text-to-Image leaderboard. |
| **gpt-image-1** | Active | Solid quality, slightly slower/pricier at equivalent quality. |
| **gpt-image-1-mini** | Active (budget) | 55-78% cheaper. Lower quality ceiling but viable for volume. |
| **DALL-E 3** | Deprecated | EOL May 12, 2026. |

### API Details

Two API surfaces:
- **Images API** (traditional) — `POST /v1/images/generations`, `/edits`
- **Responses API** (newer, recommended) — image gen as built-in tool in conversational context. Supports multi-turn editing, iterative refinement.

| Parameter | Options |
|-----------|---------|
| `size` | `1024x1024`, `1024x1536`, `1536x1024` |
| `quality` | `low`, `medium`, `high` |
| `output_format` | `png`, `jpeg`, `webp` |
| `background` | `opaque`, `transparent` |

**Pricing (per image):**

| Model | Low | Medium | High |
|-------|-----|--------|------|
| gpt-image-1.5 | ~$0.009 | ~$0.07 | ~$0.20 |
| gpt-image-1 | ~$0.011 | ~$0.07 | ~$0.25 |
| gpt-image-1-mini | ~$0.005 | ~$0.02 | ~$0.052 |

### Strengths

- **Text rendering** — best-in-class. Can render dense typography, labels, headlines, multi-line text reliably. Directly relevant for editorial/typographic assets.
- **Instruction following** — because these are LLMs, complex multi-clause prompts with constraints work well. Can enforce restraint (no clutter, generous whitespace, specific palettes).
- **Transparent backgrounds** — native support via `background: "transparent"`.
- **Multi-turn editing** — iterative refinement via Responses API. Generate → refine → adjust → finalize.
- **API-first** — fully programmatic, no GUI dependency.
- **Inpainting** — supported via Edits endpoint or Responses API.

### Limitations

- **Max resolution 1536x1024** — sufficient for web, may need upscaling for large-format print.
- **Character consistency across generations** — no built-in "style lock" mechanism.
- **Style drift in long editing sessions** — after 10+ edits, re-specify style details.
- **Some art style regression** — gpt-image-1.5 reported to have regressed in specific art styles vs gpt-image-1.

### Relevance to Mission Asimov

**Good fit:**
- Text rendering for typographic compositions
- Precise instruction following enforces restraint
- Transparent backgrounds for layered compositions
- Multi-turn editing for iterative visual identity refinement
- API-first integrates into static site build pipeline

**Caution:**
- Max 1536px may limit architecture portfolio imagery
- Consistency across separate generations needs careful prompting
- Test Art Nouveau/Art Deco specifics early

**Recommendation:** gpt-image-1.5 for this use case. Instruction-following precision suits restrained editorial work.

---

## Platform 2: Midjourney

### Current State (March 2026)

**V7 is the current default model** (released April 2025). Completely rebuilt architecture described as "smartest, most beautiful, most coherent."

**V8 is imminent** — was in final distillation as of mid-February 2026. Promises native 2K (2048x2048), enhanced text rendering, faster generation.

### Access Methods

No longer Discord-only:
- **Web app** (midjourney.com) — full-featured workspace
- **Discord** — still works via `/imagine`
- **Mobile apps** — iOS and Android

All require paid subscription. No free tier.

### Pricing

| Plan | Monthly | Key Features |
|------|---------|--------------|
| Basic | $10/mo | ~3.3 GPU hrs |
| Standard | $30/mo | Relax Mode (unlimited slow) |
| Pro | $60/mo | + Stealth Mode (private) |
| Mega | $120/mo | + max concurrency |

### Strengths

- **Aesthetic quality is best-in-class.** Painterly, cinematic, rich textures. Excels at images that "look like art."
- **Art Nouveau / Art Deco handling** — handles these styles natively and well.
- **Style reference system (`--sref`)** — pass an image URL, Midjourney applies its aesthetic. Can build reusable style codes.
- **Style Creator tool** — web-based tool for building custom `--sref` codes by picking from image grids.
- **Character reference (`--cref`)** — maintain character consistency across generations.
- **Personalization system** — learns your aesthetic preferences over time.
- **Draft mode** — half cost, 10x speed for rapid iteration.

### Limitations

- **Text rendering remains weak** — only 15% improvement over V6. Achilles heel.
- **Prompt adherence is loose** — "sacrifices precision for vibe." Unreliable for specific counts, exact spatial arrangements.
- **No public API** — cannot be automated without violating ToS. Enterprise API exists but requires applying for access.
- **Aggressive content moderation** — legitimate prompts sometimes blocked.

### Style Control (Key for Our Use Case)

- **`--sref <url>`** — style reference from image. Could use Asimov Collective screenshots.
- **`--sw 0-1000`** — style weight controlling reference influence.
- **`--cref <url>`** — character consistency across generations.
- **Style Creator** — build reusable "Mission Asimov" style code.
- **Personalization** — platform learns preferences over time.

### Relevance to Mission Asimov

**Best for:** Curated hero assets, portfolio imagery, establishing visual language via `--sref` codes. Aesthetic quality aligns naturally with editorial restraint target.

**Not viable for:** Automated pipelines (`/update-site` skill). No API access.

**Recommendation:** Use Midjourney (Pro plan, $60/mo for Stealth Mode) for curated asset creation. Build a reusable style code via Style Creator. Use GPT Image API for any automated generation.

---

## Platform 3: Google Gemini / Imagen

**Status:** Research incomplete — to be added. Gemini API has image generation capabilities via Imagen 3. Needs investigation of current API, pricing, and quality for editorial aesthetics.

---

## Platform 4: Computational / Generative Code Art

**Status:** Full research complete — see `research/03-computational-graphics-pipeline.md`

This is the most immediately actionable platform. No API keys needed. Covers SVG generation (Paper.js, SVG.js), noise textures (simplex-noise), shaders (OGL, Three.js + TSL, LYGIA), Canvas API, and CSS-based effects. Recommended stack totals under 100kb.

---

## Platform Comparison Summary

| Dimension | GPT Image 1.5 | Midjourney V7 | Gemini/Imagen | Generative Code |
|-----------|---------------|---------------|---------------|-----------------|
| **Aesthetic quality** | Good, literal | Best, painterly | TBD | Depends on skill |
| **Prompt precision** | High | Loose (vibe) | TBD | N/A (code) |
| **Text rendering** | Excellent | Weak | TBD | Perfect (SVG) |
| **API access** | Full | None (public) | Yes | N/A |
| **Automation** | Fully scriptable | Manual only | Scriptable | Fully scriptable |
| **Style control** | Prompt-only | Best (`--sref`) | TBD | Total (code) |
| **Cost per image** | $0.009–$0.25 | $10-120/mo sub | TBD | Free (compute) |
| **Best for** | Automated assets, typography | Curated hero images | TBD | Textures, patterns, interactive |

## Recommended Hybrid Pipeline

1. **Midjourney** (manual) — hero images, portfolio backgrounds, moodboard exploration. Build reusable `--sref` style code.
2. **GPT Image API** (automated) — daily content generation via `/update-site` skill. Typographic compositions, transparent overlays.
3. **Generative code** (automated) — textures, backgrounds, decorative elements, interactive visuals. Noise, stipple, contour lines, watercolor-wash effects.
4. **Gemini** (TBD) — evaluate when API keys available. May complement or replace GPT Image for specific use cases.
