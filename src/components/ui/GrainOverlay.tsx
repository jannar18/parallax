/**
 * GrainOverlay — Subtle paper texture using inline SVG feTurbulence filter.
 *
 * Renders a fixed, full-viewport overlay that adds grain/noise to the page.
 * Pointer events pass through. Uses soft-light blend mode for warmth.
 *
 * Variants:
 * - "fine" (default): tight grain for body backgrounds
 * - "coarse": larger-scale noise for hero sections / cards
 * - "paper": layered noise simulating paper fiber texture
 *
 * Based on the grain technique from research/03-graphics-pipeline-final.md
 * and the CSS-Tricks grainy gradient approach.
 */

type GrainVariant = "fine" | "coarse" | "paper";

interface GrainOverlayProps {
  /** Grain texture variant */
  variant?: GrainVariant;
  /** Override opacity (0-1). Defaults per variant. */
  opacity?: number;
  /** Additional CSS classes */
  className?: string;
}

const VARIANT_CONFIG: Record<
  GrainVariant,
  { baseFrequency: string; numOctaves: number; defaultOpacity: number }
> = {
  fine: { baseFrequency: "0.65", numOctaves: 3, defaultOpacity: 0.04 },
  coarse: { baseFrequency: "0.3", numOctaves: 2, defaultOpacity: 0.06 },
  paper: { baseFrequency: "0.45 0.55", numOctaves: 4, defaultOpacity: 0.05 },
};

export default function GrainOverlay({
  variant = "fine",
  opacity,
  className = "",
}: GrainOverlayProps) {
  const config = VARIANT_CONFIG[variant];
  const resolvedOpacity = opacity ?? config.defaultOpacity;
  const filterId = `grain-${variant}`;

  return (
    <div
      className={`grain-overlay ${className}`}
      style={{ opacity: resolvedOpacity }}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={config.baseFrequency}
            numOctaves={config.numOctaves}
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            type="saturate"
            values="0"
            in="noise"
            result="mono"
          />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter={`url(#${filterId})`}
        />
      </svg>
    </div>
  );
}
