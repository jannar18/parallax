import type { SVGProps } from "react";

/**
 * ArrowUpRight — a north-east arrow as an inline SVG.
 *
 * Replaces the Unicode "↗" (U+2197), whose glyph box sits high and oversized
 * relative to surrounding text and renders inconsistently across fonts —
 * making link labels like "Live ↗" look off-centre and uneven. This SVG has
 * controlled geometry and is sized in `em`, so it scales with the text and
 * stays vertically centred on the label. Decorative: hidden from a11y tree.
 */
export default function ArrowUpRight(props: SVGProps<SVGSVGElement>) {
  const { className = "", ...rest } = props;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`inline-block h-[0.85em] w-[0.85em] align-[-0.06em] ${className}`}
      {...rest}
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}
