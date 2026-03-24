# /riso — Spectrolite Risograph Color Separation

You have a Spectrolite MCP server with these tools. Use them directly — no need to ask which tool to use.

## Tools

| Tool | Purpose |
|------|---------|
| `mcp__spectrolite__riso` | Apply Riso color separation to an image |
| `mcp__spectrolite__list_palettes` | List available palette presets |
| `mcp__spectrolite__image_info` | Get image dimensions/format |
| `mcp__spectrolite__open_in_spectrolite` | Open image in Spectrolite GUI |

## `riso` Parameters

| Param | Type | Default | Notes |
|-------|------|---------|-------|
| `image_path` | string | **required** | Absolute path to PNG/JPG |
| `palette` | enum | `brand-full` | See palettes below |
| `effect` | enum | `none` | `none`, `halftone`, `dithering`, `posterize` |
| `lpi` | number | `71` | Halftone coarseness: 71=coarse, 108=medium, 160=fine |
| `halftone_shape` | enum | `circle` | `circle`, `diamond`, `square`, `line` |
| `dither_algorithm` | enum | `floyd-steinberg` | `floyd-steinberg`, `atkinson`, `stucki`, `burkes`, `sierra` |
| `ink_opacity` | object | — | Per-ink opacity 0–1, e.g. `{"scarlet": 0.5}` |
| `cmyk_map` | object | — | Map CMYK channels to ink names (see below) |
| `output_path` | string | — | Custom output path (default: source dir, `-riso` suffix) |

## Palettes

| Key | Inks |
|-----|------|
| `brand-full` | bright olive green + moss + spruce + scarlet |
| `scarlet-spruce` | scarlet + spruce |
| `scarlet-moss` | scarlet + moss |
| `scarlet-olive` | scarlet + bright olive green |
| `scarlet-mono` | scarlet only |
| `spruce-mono` | spruce only |
| `moss-mono` | moss only |
| `olive-mono` | bright olive green only |

## CMYK Mapping

The `cmyk_map` parameter maps CMYK channels to ink names. Common shorthand translations:

| User says | `cmyk_map` value |
|-----------|-----------------|
| "CMY=scarlet, K=spruce" | `{"c": "scarlet", "m": "scarlet", "y": "scarlet", "k": "spruce"}` |
| "C=moss, MYK=scarlet" | `{"c": "moss", "m": "scarlet", "y": "scarlet", "k": "scarlet"}` |
| "CK=spruce, MY=scarlet" | `{"c": "spruce", "m": "scarlet", "y": "scarlet", "k": "spruce"}` |

When the user groups channels (e.g. "CMY=X"), expand each letter to its own key. Valid ink names: `scarlet`, `spruce`, `moss`, `bright olive green`.

## Choosing the Right Palette

Pass whichever palette the user specifies (or implies). All palettes use subsets of the same 4 brand inks.

- If the user names a specific palette, use it directly
- If the user describes inks without naming a palette, pick the matching one (e.g. "scarlet and spruce" → `scarlet-spruce`)
- If the user only specifies a `cmyk_map` without a palette preference, `brand-full` is a safe default
- **Profile fallback is automatic:** The MCP server handles profile compatibility internally — if the selected palette's profile fails precomputation for a given image, it falls back to `brand-full`'s profile (which is universally compatible since all palettes are subsets of it)

## Workflow

1. If the user names a source image, resolve its absolute path. Check common locations: project `public/images/`, `~/Documents/Artifacts/raw/`, `~/Desktop/`, or ask.
2. **Output path convention:** Source images live in `~/Documents/Artifacts/raw/`. Riso outputs go to the **mirror path** under `~/Documents/Artifacts/processed/` (same subdirectory structure). For example: `raw/software/rainbow-crawler/foo.png` → `processed/software/rainbow-crawler/foo-riso.png`. If the source is not under `Artifacts/raw/`, save next to the source with a `-riso` suffix.
3. Translate any shorthand ("CMYK", "CMY=X K=Y", palette nicknames) into tool parameters.
4. Call `mcp__spectrolite__riso` with the resolved parameters, passing the correct `output_path`.
5. After completion, show the user the output path and offer to open it (`open <path>`) or open in Spectrolite for further editing.

## Arguments

`$ARGUMENTS` is the user's free-form input. Parse it for:
- **Image path or name** — resolve to absolute path
- **Palette name** — match to palette key
- **CMYK mapping** — "CMY=ink K=ink" shorthand
- **Effect** — halftone, dithering, posterize
- **Opacity** — "scarlet at 50%" → `ink_opacity: {"scarlet": 0.5}`

If `$ARGUMENTS` is empty, ask the user what image to process.
