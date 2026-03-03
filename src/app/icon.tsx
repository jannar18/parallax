import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Dynamic favicon — "P" lettermark.
 * Terracotta (#C4724E) on Cream (#F5F0E8) with subtle rounded corners.
 *
 * Next.js generates this at build time as a static PNG favicon.
 * See: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
 */
export default function Icon() {
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
          borderRadius: "4px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: "#C4724E",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            marginTop: "-1px",
          }}
        >
          P
        </span>
      </div>
    ),
    { ...size }
  );
}
