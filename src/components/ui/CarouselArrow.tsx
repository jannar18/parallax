import type { SVGProps } from "react";

/**
 * CarouselArrow — a horizontal prev/next arrow as an inline SVG.
 *
 * Replaces the Unicode "←"/"→" glyphs, which don't share a common vertical
 * centre: inside the round nav buttons the "→" rode high while the "←" sat
 * low, so the two arrows looked uneven and off-centre. This SVG is drawn on a
 * symmetric 24×24 box, so flex-centring the button lands the arrow dead-centre,
 * and left/right are mirror images that sit at exactly the same height.
 */
export default function CarouselArrow({
  direction,
  className = "",
  ...rest
}: { direction: "left" | "right" } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`h-6 w-6 ${className}`}
      style={direction === "left" ? { transform: "scaleX(-1)" } : undefined}
      {...rest}
    >
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}
