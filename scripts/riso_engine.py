#!/usr/bin/env python3
"""
Riso Engine — 4-color Risograph image processor for Parallax brand.

Transforms photos into a cohesive Risograph aesthetic using:
- 4 ink colors mapped to luminance bands
- Floyd-Steinberg dithering per channel
- Registration misalignment for authentic Riso feel
- Paper grain texture overlay

Usage:
    python3 scripts/riso_engine.py <input> <output> [--no-grain] [--offset 2,1]

Dependencies:
    pip3 install Pillow numpy
"""

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image, ImageChops, ImageOps
    import numpy as np
except ImportError:
    print("Missing dependencies. Install with: pip3 install Pillow numpy", file=sys.stderr)
    sys.exit(1)


# ── Riso Palette ──────────────────────────────────────────────
PAPER   = (253, 252, 234)  # #FDFCEA — warm cream
SCARLET = (246, 80, 88)    # #f65058 — highlights
OLIVE   = (180, 159, 41)   # #b49f29 — highlight secondary (70% density)
MOSS    = (104, 114, 77)   # #68724d — midtones
SPRUCE  = (74, 99, 93)     # #4a635d — shadows


def load_grayscale(path: str) -> Image.Image:
    """Load image and convert to grayscale using luminance."""
    img = Image.open(path).convert("L")
    return img


def sigmoid_mask(gray: Image.Image, center: float, width: float) -> Image.Image:
    """Create a smooth density mask using sigmoid falloff.

    Args:
        gray: Grayscale image (0-255)
        center: Luminance center point (0-255)
        width: Transition width (higher = smoother)
    """
    arr = np.array(gray, dtype=np.float64)
    mask = 1.0 / (1.0 + np.exp(-(arr - center) / width))
    return Image.fromarray((mask * 255).astype(np.uint8), mode="L")


def build_density_masks(gray: Image.Image) -> dict:
    """Build 4 density masks with smooth sigmoid falloffs.

    Luminance bands:
        Highlights (lum > ~170): Scarlet + Olive (at 70%)
        Midtones  (lum ~85-170): Moss
        Shadows   (lum < ~85):   Spruce
    """
    arr = np.array(gray, dtype=np.float64)

    # Highlight mask: high luminance areas
    highlight = 1.0 / (1.0 + np.exp(-(arr - 170) / 20))

    # Midtone mask: bell curve centered at ~127
    mid_low = 1.0 / (1.0 + np.exp(-(arr - 85) / 15))
    mid_high = 1.0 / (1.0 + np.exp(-(arr - 170) / 15))
    midtone = mid_low * (1.0 - mid_high)

    # Shadow mask: low luminance areas
    shadow = 1.0 - 1.0 / (1.0 + np.exp(-(arr - 85) / 20))

    def to_img(m):
        return Image.fromarray((m * 255).astype(np.uint8), mode="L")

    return {
        "scarlet": to_img(highlight),
        "olive": to_img(highlight * 0.7),  # 70% density
        "moss": to_img(midtone),
        "spruce": to_img(shadow),
    }


def dither_mask(mask: Image.Image) -> Image.Image:
    """Apply Floyd-Steinberg dithering to a density mask."""
    return mask.convert("1").convert("L")


def colorize_layer(dithered: Image.Image, color: tuple) -> Image.Image:
    """Create an RGBA ink layer from a dithered mask and color."""
    r, g, b = color
    w, h = dithered.size

    # Create colored layer
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ink = Image.new("RGBA", (w, h), (r, g, b, 255))

    # Use dithered mask as alpha
    layer = Image.composite(ink, layer, dithered)
    return layer


def apply_paper_grain(canvas: Image.Image, intensity: float = 0.05) -> Image.Image:
    """Add subtle paper 'tooth' texture to the canvas.

    Uses random noise colorized to warm cream tones, blended
    with soft_light for a natural paper-tooth simulation.
    """
    width, height = canvas.size
    noise = np.random.randint(0, 255, (height, width, 3), dtype="uint8")
    noise_img = Image.fromarray(noise).convert("L")
    grain_overlay = ImageOps.colorize(noise_img, (240, 240, 230), (255, 255, 255))
    grain_overlay = grain_overlay.convert("RGB")

    # Blend: soft_light
    canvas_rgb = canvas.convert("RGB")
    blended = ImageChops.soft_light(canvas_rgb, grain_overlay)

    # Mix original and blended by intensity
    result = Image.blend(canvas_rgb, blended, intensity)
    return result.convert("RGBA")


def process_image(
    input_path: str,
    output_path: str,
    no_grain: bool = False,
    offset: tuple = (2, 1),
) -> None:
    """Full Riso processing pipeline.

    Steps:
        1. Load image → convert to grayscale
        2. Build 4 density masks with sigmoid falloffs
        3. Floyd-Steinberg dither each mask
        4. Composite ink layers onto paper using multiply blend
        5. Shift spruce layer for registration misalignment
        6. Overlay paper grain (unless --no-grain)
        7. Save as PNG
    """
    # 1. Load and convert to grayscale
    gray = load_grayscale(input_path)
    w, h = gray.size

    # 2. Build density masks
    masks = build_density_masks(gray)

    # 3. Dither each mask
    dithered = {name: dither_mask(mask) for name, mask in masks.items()}

    # 4. Start with paper background
    canvas = Image.new("RGB", (w, h), PAPER)

    # 5. Composite each ink layer using multiply blend
    ink_layers = [
        ("scarlet", SCARLET, (0, 0)),
        ("olive", OLIVE, (0, 0)),
        ("moss", MOSS, (0, 0)),
        ("spruce", SPRUCE, offset),  # Registration misalignment
    ]

    for name, color, layer_offset in ink_layers:
        mask = dithered[name]

        # Create ink layer (solid color where mask is white)
        ink_rgb = Image.new("RGB", (w, h), color)
        paper_rgb = Image.new("RGB", (w, h), (255, 255, 255))

        # Multiply: where mask is black (ink present), apply color
        # Invert mask so ink appears in dark areas of the dithered output
        inv_mask = ImageOps.invert(mask)
        ink_layer = Image.composite(ink_rgb, paper_rgb, inv_mask)

        # Apply offset for registration misalignment
        if layer_offset != (0, 0):
            shifted = Image.new("RGB", (w, h), (255, 255, 255))
            shifted.paste(ink_layer, layer_offset)
            ink_layer = shifted

        # Multiply blend with canvas
        canvas = ImageChops.multiply(canvas, ink_layer)

    # 6. Apply paper grain
    if not no_grain:
        canvas = apply_paper_grain(canvas)
        if canvas.mode == "RGBA":
            canvas = canvas.convert("RGB")

    # 7. Save
    canvas.save(output_path, "PNG")
    print(f"✓ Riso processed: {input_path} → {output_path}")


def main():
    parser = argparse.ArgumentParser(
        description="Riso Engine — 4-color Risograph image processor"
    )
    parser.add_argument("input", help="Input image path")
    parser.add_argument("output", help="Output PNG path")
    parser.add_argument(
        "--no-grain",
        action="store_true",
        help="Skip paper grain overlay",
    )
    parser.add_argument(
        "--offset",
        default="2,1",
        help="Spruce layer offset as x,y pixels (default: 2,1)",
    )

    args = parser.parse_args()

    # Parse offset
    try:
        ox, oy = args.offset.split(",")
        offset = (int(ox), int(oy))
    except ValueError:
        print(f"Invalid offset format: {args.offset}. Use x,y (e.g., 2,1)", file=sys.stderr)
        sys.exit(1)

    # Validate input
    if not Path(args.input).exists():
        print(f"Input file not found: {args.input}", file=sys.stderr)
        sys.exit(1)

    # Ensure output directory exists
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)

    process_image(args.input, args.output, args.no_grain, offset)


if __name__ == "__main__":
    main()
