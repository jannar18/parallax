import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple Touch Icon — "P" lettermark at 180x180.
 * Terracotta (#C4724E) on Cream (#F5F0E8).
 *
 * Next.js generates this at build time as a static PNG.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F5F0E8",
          borderRadius: "24px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <span
          style={{
            fontSize: 120,
            fontWeight: 500,
            color: "#C4724E",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            marginTop: "-6px",
          }}
        >
          P
        </span>
      </div>
    ),
    { ...size }
  );
}
