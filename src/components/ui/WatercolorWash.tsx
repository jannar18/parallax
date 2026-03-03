/**
 * WatercolorWash — Organic, soft-edged color wash effect via CSS gradients.
 *
 * Renders a decorative background element that simulates a watercolor wash
 * using layered radial gradients with an SVG feTurbulence displacement filter
 * for organic edge dissolution. No raster images — pure CSS + inline SVG.
 *
 * From research/03-graphics-pipeline-final.md §2: "Watercolor wash — gradient
 * with organic, uneven edges. Not CSS linear-gradient. Think terracotta/amber
 * tones bleeding into warm white."
 *
 * Use as an absolute/relative-positioned background behind content.
 */

type WashColor = "terracotta" | "amber" | "sage" | "dusty-rose" | "slate";

interface WatercolorWashProps {
  /** Primary wash color. Maps to brand palette. */
  color?: WashColor;
  /** Override opacity (0-1). Default: 0.15 */
  opacity?: number;
  /** Position anchor for the radial gradient center */
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  /** Additional CSS classes (use for sizing/positioning) */
  className?: string;
}

const COLOR_MAP: Record<WashColor, string> = {
  terracotta: "196, 114, 78",   // #C4724E
  amber: "212, 167, 106",       // #D4A76A
  sage: "139, 158, 126",        // #8B9E7E
  "dusty-rose": "201, 165, 160", // #C9A5A0
  slate: "122, 139, 154",       // #7A8B9A
};

const POSITION_MAP: Record<string, string> = {
  "top-left": "20% 20%",
  "top-right": "80% 20%",
  "bottom-left": "20% 80%",
  "bottom-right": "80% 80%",
  center: "50% 50%",
};

export default function WatercolorWash({
  color = "terracotta",
  opacity = 0.15,
  position = "center",
  className = "",
}: WatercolorWashProps) {
  const rgb = COLOR_MAP[color];
  const pos = POSITION_MAP[position];
  const filterId = `watercolor-displace-${color}-${position.replace(/[^a-z]/g, "")}`;

  return (
    <div
      className={`pointer-events-none ${className}`}
      style={{ opacity, position: "relative" }}
      aria-hidden="true"
    >
      {/* Inline SVG filter for organic edge displacement */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="0"
        height="0"
        style={{ position: "absolute" }}
      >
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015"
            numOctaves="3"
            seed="2"
            result="warp"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="warp"
            scale="60"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at ${pos}, rgba(${rgb}, 0.6) 0%, rgba(${rgb}, 0.2) 40%, transparent 70%),
            radial-gradient(ellipse at ${pos}, rgba(${rgb}, 0.3) 0%, transparent 50%)
          `,
          filter: `url(#${filterId})`,
        }}
      />
    </div>
  );
}
