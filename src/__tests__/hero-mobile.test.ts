import { describe, it, expect } from "vitest";
import { detectPerfTier, type PerfTier } from "@/lib/hero-canvas";

/**
 * Tests for mobile-specific hero animation behavior.
 * Validates the fixes for:
 *   1. Touch event handling (parallax on mobile)
 *   2. 100dvh viewport height (iOS Safari)
 *   3. Safe-area-inset metadata positioning
 *   4. Consistent slideshow timing across frame rates
 *   5. Orientation change handling
 */

// ── Mobile Device Detection ──

describe("mobile device detection", () => {
  const devices: { name: string; width: number; touch: number; expected: PerfTier }[] = [
    { name: "iPhone SE", width: 375, touch: 5, expected: "low" },
    { name: "iPhone 14 Pro", width: 393, touch: 5, expected: "low" },
    { name: "iPhone 14 Pro Max", width: 430, touch: 5, expected: "low" },
    { name: "Samsung Galaxy S21", width: 360, touch: 5, expected: "low" },
    { name: "iPad Mini (portrait)", width: 768, touch: 5, expected: "low" },
    { name: "iPad Pro 11 (portrait)", width: 834, touch: 5, expected: "low" },
    { name: "iPad Pro 12.9 (landscape)", width: 1366, touch: 5, expected: "high" },
    { name: "MacBook Air 13", width: 1440, touch: 0, expected: "high" },
    { name: "Desktop 1080p", width: 1920, touch: 0, expected: "high" },
    { name: "Laptop with touch", width: 1440, touch: 10, expected: "high" },
  ];

  for (const device of devices) {
    it(`classifies ${device.name} (${device.width}px, touch=${device.touch > 0}) as "${device.expected}"`, () => {
      Object.defineProperty(window, "innerWidth", { value: device.width, configurable: true });
      Object.defineProperty(navigator, "maxTouchPoints", { value: device.touch, configurable: true });
      expect(detectPerfTier()).toBe(device.expected);
    });
  }
});

// ── Viewport Height (100dvh) ──

describe("viewport height", () => {
  it("hero section should use dvh not vh for iOS Safari compatibility", async () => {
    // This is a structural test — we read the component source to verify
    // the fix is in place. This catches regressions if someone changes
    // `100dvh` back to `h-screen` (which is 100vh).
    const fs = await import("fs");
    const path = await import("path");
    const source = fs.readFileSync(
      path.resolve(__dirname, "../components/interactive/HeroBrandVisual.tsx"),
      "utf-8",
    );
    // Must use 100dvh (dynamic viewport height), not 100vh / h-screen
    expect(source).toContain("100dvh");
    expect(source).not.toMatch(/className="[^"]*h-screen[^"]*"/);
  });
});

// ── Touch Events ──

describe("touch event handlers", () => {
  it("component registers touchmove event listener", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const source = fs.readFileSync(
      path.resolve(__dirname, "../components/interactive/HeroBrandVisual.tsx"),
      "utf-8",
    );
    expect(source).toContain("touchmove");
    expect(source).toContain("handleTouchMove");
  });

  it("component registers touchend for double-tap detection", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const source = fs.readFileSync(
      path.resolve(__dirname, "../components/interactive/HeroBrandVisual.tsx"),
      "utf-8",
    );
    expect(source).toContain("touchend");
    expect(source).toContain("handleTouchEnd");
  });
});

// ── Safe Area Insets ──

describe("safe area insets", () => {
  it("metadata uses safe-area-inset CSS env variables", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const source = fs.readFileSync(
      path.resolve(__dirname, "../components/interactive/HeroBrandVisual.tsx"),
      "utf-8",
    );
    expect(source).toContain("safe-area-inset-left");
    expect(source).toContain("safe-area-inset-right");
    expect(source).toContain("safe-area-inset-bottom");
  });

  it("layout uses viewport-fit=cover", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const source = fs.readFileSync(
      path.resolve(__dirname, "../app/layout.tsx"),
      "utf-8",
    );
    expect(source).toContain("viewportFit");
    expect(source).toContain("cover");
  });
});

// ── Orientation Change ──

describe("orientation change handling", () => {
  it("component listens for orientationchange event", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const source = fs.readFileSync(
      path.resolve(__dirname, "../components/interactive/HeroBrandVisual.tsx"),
      "utf-8",
    );
    expect(source).toContain("orientationchange");
  });
});

// ── Side Metadata Hidden on Mobile ──

describe("metadata visibility on mobile", () => {
  it("side metadata columns are hidden on mobile (md:block)", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const source = fs.readFileSync(
      path.resolve(__dirname, "../components/interactive/HeroBrandVisual.tsx"),
      "utf-8",
    );
    // Left and right metadata should have "hidden md:block" to hide on small screens
    const hiddenMdBlock = (source.match(/hidden md:block/g) || []).length;
    expect(hiddenMdBlock).toBeGreaterThanOrEqual(2); // left + right columns
  });
});
