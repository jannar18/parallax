# GPT Image API Prompt Templates -- Mission Asimov

> **Purpose:** Prompt templates for OpenAI's GPT Image API (DALL-E 3 / gpt-image-1) to generate visual assets matching the Mission Asimov design language. Includes full API call structure.
>
> **Key advantages of GPT Image over Midjourney:**
> - Transparent background support (gpt-image-1)
> - Superior text rendering (when text in images is needed)
> - API-driven = automatable in build scripts
> - Precise prompt following (less "artistic interpretation")
>
> **Palette reference:**
> - Terracotta `#C4724E` | Amber `#D4A76A` | Cream `#F5F0E8`
> - Warm gray `#B5AFA6` | Sage `#8B9E7E` | Dusty rose `#C9A5A0`
> - Slate blue-gray `#7A8B9A` | Coral accent `#C95D45`

---

## API Call Structure

All prompts below use this base structure. Replace `PROMPT_TEXT` with the prompt from each template.

### DALL-E 3 (via Chat Completions)

```json
{
  "model": "gpt-4o",
  "messages": [
    {
      "role": "user",
      "content": "PROMPT_TEXT"
    }
  ],
  "tools": [
    {
      "type": "image_generation",
      "image_generation": {
        "size": "1536x1024",
        "quality": "high"
      }
    }
  ]
}
```

### gpt-image-1 (Images API -- supports transparency)

```json
{
  "model": "gpt-image-1",
  "prompt": "PROMPT_TEXT",
  "n": 1,
  "size": "1536x1024",
  "quality": "high",
  "background": "transparent"
}
```

### cURL Example

```bash
curl https://api.openai.com/v1/images/generations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-image-1",
    "prompt": "PROMPT_TEXT",
    "n": 1,
    "size": "1536x1024",
    "quality": "high",
    "background": "transparent"
  }'
```

### Node.js Helper

```javascript
import OpenAI from 'openai';
import { writeFileSync } from 'node:fs';

const openai = new OpenAI();

async function generateAsset(prompt, options = {}) {
  const {
    size = '1536x1024',
    quality = 'high',
    background = 'opaque',
    outputPath = 'output.png',
  } = options;

  const response = await openai.images.generate({
    model: 'gpt-image-1',
    prompt,
    n: 1,
    size,
    quality,
    background,
  });

  // Response contains base64 image data
  const imageData = response.data[0].b64_json;
  const buffer = Buffer.from(imageData, 'base64');
  writeFileSync(outputPath, buffer);
  console.log(`Saved to ${outputPath}`);
}
```

---

## 1. Hero Image -- Warm Atmospheric Landscape

```
A vast, quiet desert landscape seen from a slight elevation. The terrain is
warm terracotta and amber earth with distant mesa formations fading into
atmospheric haze. The sky is a warm cream color, not blue -- everything feels
like a watercolor field sketch on thick cotton paper. The foreground has a
subtle stippled texture quality, like dots of ink suggesting scrubby desert
vegetation. The overall mood is contemplative and still. Generous empty space
in the upper two-thirds. Color palette strictly limited to: terracotta
(#C4724E), amber (#D4A76A), cream (#F5F0E8), warm gray (#B5AFA6). No people,
no structures, no text. The style references European architectural landscape
sketching -- hand-rendered, restrained, atmospheric.
```

**API settings:** `size: "1536x1024"`, `quality: "high"`, `background: "opaque"`

---

## 2. Texture Background -- Handmade Paper

```
A flat, evenly-lit photograph of handmade cotton paper seen from directly
above. The paper color is warm off-white (#F5F0E8), never pure white. The
surface shows subtle visible fiber grain and very slight tonal variation --
some areas are a touch warmer (toward #D4A76A amber), some a touch cooler
(toward #B5AFA6 warm gray). There are occasional tiny foxing spots in
terracotta (#C4724E). The texture is organic and irregular like real handmade
paper, not digital noise. No text, no marks, no writing. This is a pure
material texture scan. Flat, even, macro photography lighting.
```

**API settings:** `size: "1024x1024"`, `quality: "high"`, `background: "opaque"`

---

## 3. Stipple Field -- Transparent Background

This is where GPT Image's transparency support shines. Generate a stipple overlay that can be composited over any background.

```
Thousands of tiny hand-placed ink dots on a completely transparent background.
The dots are warm gray (#B5AFA6) and terracotta (#C4724E) colored. The dot
density varies organically -- dense cloud-like masses in the center and lower
portions, dissolving and thinning toward the edges until individual dots are
scattered with generous space between them. The dots are slightly irregular in
size and shape, like real ink stipple applied with a fine-point pen. Some dots
are darker and more opaque, others are lighter and more transparent, creating
a sense of atmospheric depth. No shapes, no patterns, no symbols -- pure
stipple texture. The overall impression is of architectural site plan shading.
```

**API settings:** `size: "1024x1024"`, `quality: "high"`, `background: "transparent"`

---

## 4. Architectural Portfolio Backdrop

```
A very faint, delicate architectural drawing on cream-colored paper (#F5F0E8).
Light pencil contour lines flow across the surface in topographic patterns,
suggesting terrain and a building footprint without depicting any specific
building. The lines are in warm gray (#B5AFA6) at about 20% opacity. In the
corners, there are areas of very light stipple dot shading in terracotta
(#C4724E) at low opacity. The center of the composition is mostly empty --
generous whitespace for content to be placed over. The drawing style references
ETH Zurich architectural representation: precise, analytical, hand-drawn,
European. No text, no labels, no dimensions. Subtle and atmospheric.
```

**API settings:** `size: "1536x1024"`, `quality: "high"`, `background: "opaque"`

---

## 5. Section Divider -- Organic Line

Transparent background allows direct overlay as a page element.

```
A single, flowing organic line on a transparent background. The line is drawn
in warm gray (#B5AFA6) ink, approximately 1-2 pixels wide with subtle
thickness variation suggesting natural pen pressure. The line flows
horizontally from left to right with gentle, organic undulations -- like a
topographic contour line or a very restrained Art Nouveau whiplash curve. It
is not perfectly smooth; there are subtle irregularities that feel hand-drawn.
The line occupies only the middle horizontal band of the image, with generous
empty space above and below. No other elements, no dots, no text.
```

**API settings:** `size: "1536x256"`, `quality: "high"`, `background: "transparent"`

---

## 6. Material Fragment -- Collage Element

For the layered collage motif. Generate material textures that can be "torn" and composited.

```
A close-up photograph of [MATERIAL] with soft, organic edges that fade to
transparency -- as if the photograph was torn or the edges were dissolved
with water. The material fills the center of the frame and gradually becomes
transparent at the borders, like a watercolor wash edge. Warm natural lighting.
The tones are warm: terracotta, amber, cream. The surface shows honest material
texture -- weathering, grain, patina. No people, no objects placed on the
surface. This is a pure material study, like an architect's sample photograph.
```

**Replace `[MATERIAL]` with:**
- `rammed earth wall showing horizontal sediment layers in terracotta and amber tones`
- `hand-pressed clay brick with rough mortar joints and warm patina`
- `desert sandstone with iron oxide staining and natural erosion patterns`
- `aged lime plaster wall with hairline cracks and warm cream undertone`
- `rough-sawn timber with visible grain in warm honey and gray tones`

**API settings:** `size: "1024x1024"`, `quality: "high"`, `background: "transparent"`

---

## 7. Botanical Element -- Tree Portrait

```
A single [TREE_SPECIES] drawn in fine pen on a transparent background.
The drawing style is architectural: precise but with hand-drawn character. The
canopy is rendered with stipple dot shading -- denser in the center, dissolving
at the edges. Individual branches are visible within the canopy structure. The
trunk and branches are drawn with confident, slightly varied line weight. The
ink color is warm gray (#B5AFA6) for the structure and very faint sage green
(#8B9E7E) in the stipple canopy. No ground plane, no background, no other
elements. The tree is drawn as a botanical/architectural elevation -- a
portrait of a specific species, not a generic symbol.
```

**Replace `[TREE_SPECIES]` with:**
- `mature olive tree with gnarled trunk and silver-green canopy`
- `desert willow with graceful drooping branches`
- `Italian stone pine with characteristic umbrella canopy`
- `single mature oak with broad spreading crown`

**API settings:** `size: "1024x1536"` (portrait), `quality: "high"`, `background: "transparent"`

---

## 8. Typography Texture -- Letterform with Grain

GPT Image's text rendering capability makes this possible where Midjourney struggles.

```
The lowercase letter "[LETTER]" rendered very large, filling most of the
frame, on a transparent background. The letterform is a refined serif typeface
(like Garamond or Baskerville). Instead of solid fill, the letter is filled
with a warm paper texture -- visible fiber grain, subtle terracotta (#C4724E)
and cream (#F5F0E8) tonal variation, like the letter was cut from handmade
paper. The edges of the letter have a very slight organic irregularity, as if
printed with a letterpress on textured stock -- not pixel-perfect but refined.
The texture gives the letter material presence and warmth.
```

**Replace `[LETTER]` with** any letterform needed (initials, section markers, etc.)

**API settings:** `size: "1024x1024"`, `quality: "high"`, `background: "transparent"`

---

## Batch Generation Script

For generating a full set of assets in one pass:

```javascript
import OpenAI from 'openai';
import { writeFileSync, mkdirSync } from 'node:fs';

const openai = new OpenAI();

const ASSETS = [
  {
    name: 'hero-landscape',
    prompt: '...', // Paste prompt #1
    size: '1536x1024',
    background: 'opaque',
  },
  {
    name: 'paper-texture',
    prompt: '...', // Paste prompt #2
    size: '1024x1024',
    background: 'opaque',
  },
  {
    name: 'stipple-overlay',
    prompt: '...', // Paste prompt #3
    size: '1024x1024',
    background: 'transparent',
  },
  // ... add more
];

async function generateAll() {
  mkdirSync('generated-assets', { recursive: true });

  for (const asset of ASSETS) {
    console.log(`Generating: ${asset.name}...`);
    try {
      const response = await openai.images.generate({
        model: 'gpt-image-1',
        prompt: asset.prompt,
        n: 1,
        size: asset.size,
        quality: 'high',
        background: asset.background,
      });

      const imageData = response.data[0].b64_json;
      const buffer = Buffer.from(imageData, 'base64');
      const ext = asset.background === 'transparent' ? 'png' : 'webp';
      writeFileSync(`generated-assets/${asset.name}.${ext}`, buffer);
      console.log(`  Saved: generated-assets/${asset.name}.${ext}`);
    } catch (err) {
      console.error(`  Failed: ${asset.name}`, err.message);
    }
  }
}

generateAll();
```

---

## Tips for Mission Asimov Aesthetic

1. **Always specify the palette by hex code.** GPT Image responds well to explicit color references.

2. **Use "transparent background"** for any element that will be composited -- stipple overlays, dividers, botanical elements, material fragments.

3. **Describe what you do NOT want.** "No people, no text, no sharp digital edges" helps steer away from stock-photo territory.

4. **Reference the tradition.** Phrases like "European architectural drawing," "ETH Zurich style," "architectural representation" anchor the aesthetic.

5. **Describe materials honestly.** "Handmade cotton paper," "fine-point pen stipple," "watercolor pigment diffusion" -- the language of materials matters.

6. **Generate at the largest size** (`1536x1024` or `1024x1536`) and downscale. Quality is better than upscaling.

7. **Post-process with Sharp** for production optimization:
   ```bash
   npx sharp-cli -i generated-assets/hero.png -o public/hero.webp --format webp --quality 82
   ```
