/**
 * StippleField — SVG-based stipple/particle texture that dissolves at edges.
 *
 * From research/03-graphics-pipeline-final.md §2: "Stipple fields —
 * particle-based noise, variable density, dissolving at edges. The single
 * strongest drawing technique across all references."
 *
 * Renders a deterministic field of dots that fades towards the edges using
 * an SVG radial gradient mask. The dots are generated from a seeded PRNG
 * so the pattern is stable across renders (no layout shift).
 *
 * Pure SVG — no canvas, no runtime JS, no client component needed.
 */

interface StippleFieldProps {
  /** Number of stipple dots. Default: 400 */
  count?: number;
  /** Dot radius in SVG units. Default: 1.2 */
  dotRadius?: number;
  /** Dot color. Default: brand ink color */
  dotColor?: string;
  /** Seed for deterministic randomness. Default: 42 */
  seed?: number;
  /** Override opacity (0-1). Default: 0.12 */
  opacity?: number;
  /** Additional CSS classes (use for sizing/positioning) */
  className?: string;
}

/**
 * Seeded PRNG (mulberry32). Deterministic, fast, good distribution.
 * Produces values in [0, 1).
 */
function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function StippleField({
  count = 400,
  dotRadius = 1.2,
  dotColor = "#2C2824",
  seed = 42,
  opacity = 0.12,
  className = "",
}: StippleFieldProps) {
  const rng = mulberry32(seed);
  const viewBox = "0 0 200 200";
  const maskId = `stipple-fade-${seed}`;

  // Generate dot positions with density falloff toward edges
  const dots: Array<{ cx: number; cy: number; r: number }> = [];
  for (let i = 0; i < count; i++) {
    const x = rng() * 200;
    const y = rng() * 200;
    // Distance from center (0..1), used to thin dots at edges
    const dx = (x - 100) / 100;
    const dy = (y - 100) / 100;
    const distFromCenter = Math.sqrt(dx * dx + dy * dy);
    // Accept dot with probability inversely proportional to distance
    if (rng() > distFromCenter * 0.7) {
      const sizeVariation = 0.6 + rng() * 0.8; // 60-140% of base size
      dots.push({ cx: x, cy: y, r: dotRadius * sizeVariation });
    }
  }

  return (
    <div
      className={`pointer-events-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id={maskId}>
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="60%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id={`${maskId}-mask`}>
            <rect width="200" height="200" fill={`url(#${maskId})`} />
          </mask>
        </defs>
        <g mask={`url(#${maskId}-mask)`}>
          {dots.map((dot, i) => (
            <circle
              key={i}
              cx={dot.cx}
              cy={dot.cy}
              r={dot.r}
              fill={dotColor}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
