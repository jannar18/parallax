/**
 * CollageEdge — Torn/rough edge effect for collage-style content boundaries.
 *
 * From research/03-graphics-pipeline-final.md §2: "Collage edges — slightly
 * rough, not pixel-perfect. Torn paper feel. Photo fragments embedded within
 * drawn contexts."
 *
 * Renders a CSS mask with an SVG feTurbulence-generated rough edge along
 * the specified side(s). Apply as a wrapper around images or content blocks
 * to give them the organic, hand-torn boundary quality.
 *
 * Pure CSS + inline SVG — no canvas, no client JS needed.
 */

type EdgeSide = "top" | "bottom" | "left" | "right";

interface CollageEdgeProps {
  /** Which side(s) get the torn effect. Default: ["bottom"] */
  sides?: EdgeSide[];
  /** Roughness of the tear (feTurbulence baseFrequency). Default: 0.04 */
  roughness?: number;
  /** Depth of the tear in pixels. Default: 20 */
  depth?: number;
  /** Content to wrap */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export default function CollageEdge({
  sides = ["bottom"],
  roughness = 0.04,
  depth = 20,
  children,
  className = "",
}: CollageEdgeProps) {
  // Build a unique filter ID from props for multiple instances
  const filterId = `collage-edge-${sides.join("-")}-${roughness}`;

  // Generate mask gradient stops based on which sides are torn.
  // Non-torn sides get a clean (white) mask; torn sides use the
  // feTurbulence-displaced edge.
  const maskPadding = `${sides.includes("top") ? depth : 0}px ${sides.includes("right") ? depth : 0}px ${sides.includes("bottom") ? depth : 0}px ${sides.includes("left") ? depth : 0}px`;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
    >
      {/* Hidden SVG filter definition */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="0"
        height="0"
        style={{ position: "absolute" }}
        aria-hidden="true"
      >
        <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={roughness}
            numOctaves="4"
            seed="7"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale={depth}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <div
        style={{
          filter: `url(#${filterId})`,
          padding: maskPadding,
          margin: `-${sides.includes("top") ? depth : 0}px -${sides.includes("right") ? depth : 0}px -${sides.includes("bottom") ? depth : 0}px -${sides.includes("left") ? depth : 0}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
