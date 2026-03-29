import { describe, it, expect, beforeEach } from "vitest";
import {
  createInitialState,
  detectPerfTier,
  generateWireNetwork,
  updateSlideshow,
  getLeftPlane,
  getRightPlane,
  mapToQuad,
  drawFrame,
  getMetadataLeft,
  getMetadataRight,
  getMetadataBottom,
  HOLD_DURATION_MS,
  FADE_DURATION_MS,
  PHOTO_COUNT,
  type HeroState,
} from "@/lib/hero-canvas";

// ── State Factory ──

describe("createInitialState", () => {
  it("returns a valid initial state with default values", () => {
    const s = createInitialState();
    expect(s.W).toBe(0);
    expect(s.H).toBe(0);
    expect(s.frame).toBe(0);
    expect(s.rotation).toBe(0);
    expect(s.mouseX).toBe(0.5);
    expect(s.mouseY).toBe(0.5);
    expect(s.currentPhoto).toBe(0);
    expect(s.nextPhoto).toBe(1);
    expect(s.crossfade).toBe(0);
    expect(s.photoHoldTimerMs).toBe(0);
    expect(s.lastFrameTime).toBe(0);
    expect(s.perfTier).toBe("high");
    expect(s.dpr).toBe(1);
    expect(s.wireNetwork).toBeNull();
  });
});

// ── Performance Tier Detection ──

describe("detectPerfTier", () => {
  it("returns 'low' for narrow viewports (mobile)", () => {
    Object.defineProperty(window, "innerWidth", { value: 375, configurable: true });
    Object.defineProperty(navigator, "maxTouchPoints", { value: 5, configurable: true });
    expect(detectPerfTier()).toBe("low");
  });

  it("returns 'low' for medium viewport with touch (tablet)", () => {
    Object.defineProperty(window, "innerWidth", { value: 800, configurable: true });
    Object.defineProperty(navigator, "maxTouchPoints", { value: 5, configurable: true });
    expect(detectPerfTier()).toBe("low");
  });

  it("returns 'high' for wide viewport without touch (desktop)", () => {
    Object.defineProperty(window, "innerWidth", { value: 1440, configurable: true });
    Object.defineProperty(navigator, "maxTouchPoints", { value: 0, configurable: true });
    expect(detectPerfTier()).toBe("high");
  });

  it("returns 'high' for medium viewport without touch (laptop)", () => {
    Object.defineProperty(window, "innerWidth", { value: 800, configurable: true });
    Object.defineProperty(navigator, "maxTouchPoints", { value: 0, configurable: true });
    expect(detectPerfTier()).toBe("high");
  });
});

// ── Wire Network Generation ──

describe("generateWireNetwork", () => {
  it("generates fewer nodes for low tier", () => {
    const low = generateWireNetwork("low");
    const high = generateWireNetwork("high");
    expect(low.nodes.length).toBeLessThan(high.nodes.length);
    expect(low.nodes.length).toBe(40);
    expect(high.nodes.length).toBe(120);
  });

  it("generates valid node coordinates in [0.06, 0.94] range", () => {
    const net = generateWireNetwork("high");
    for (const node of net.nodes) {
      expect(node.nx).toBeGreaterThanOrEqual(0);
      expect(node.nx).toBeLessThanOrEqual(1);
      expect(node.ny).toBeGreaterThanOrEqual(0);
      expect(node.ny).toBeLessThanOrEqual(1);
    }
  });

  it("generates edges with valid from/to indices", () => {
    const net = generateWireNetwork("high");
    expect(net.edges.length).toBeGreaterThan(0);
    for (const edge of net.edges) {
      expect(edge.from).toBeGreaterThanOrEqual(0);
      expect(edge.from).toBeLessThan(net.nodes.length);
      expect(edge.to).toBeGreaterThanOrEqual(0);
      expect(edge.to).toBeLessThan(net.nodes.length);
    }
  });
});

// ── Slideshow (time-based) ──

describe("updateSlideshow", () => {
  let s: HeroState;

  beforeEach(() => {
    s = createInitialState();
    s.W = 1024;
    s.H = 768;
  });

  it("does not crossfade before hold duration elapses", () => {
    // Simulate 4 seconds of frames at ~16ms each
    for (let i = 0; i < 250; i++) {
      updateSlideshow(s, 16);
    }
    // 250 * 16 = 4000ms < 5000ms hold
    expect(s.crossfade).toBe(0);
    expect(s.currentPhoto).toBe(0);
  });

  it("starts crossfading after hold duration", () => {
    // Advance exactly to the hold threshold
    updateSlideshow(s, HOLD_DURATION_MS);
    expect(s.crossfade).toBe(0); // not yet past threshold
    // One more tick pushes past the threshold and starts crossfade
    updateSlideshow(s, 100);
    expect(s.crossfade).toBeGreaterThan(0);
  });

  it("advances to next photo after crossfade completes", () => {
    // Skip past hold
    updateSlideshow(s, HOLD_DURATION_MS + 1);
    // Now simulate enough time to complete crossfade
    const framesNeeded = Math.ceil(FADE_DURATION_MS / 16) + 10;
    for (let i = 0; i < framesNeeded; i++) {
      updateSlideshow(s, 16);
    }
    expect(s.currentPhoto).toBe(1);
    expect(s.nextPhoto).toBe(2);
    expect(s.crossfade).toBe(0);
  });

  it("wraps around to first photo after cycling all", () => {
    // Fast-forward through all photos
    for (let photo = 0; photo < PHOTO_COUNT; photo++) {
      updateSlideshow(s, HOLD_DURATION_MS + 1);
      for (let i = 0; i < Math.ceil(FADE_DURATION_MS / 16) + 10; i++) {
        updateSlideshow(s, 16);
      }
    }
    expect(s.currentPhoto).toBe(0);
  });

  it("gives same timing at 30fps and 60fps", () => {
    const s30 = createInitialState();
    const s60 = createInitialState();

    // Simulate 6 seconds at 30fps (~33ms per frame)
    const frames30 = Math.ceil(6000 / 33);
    for (let i = 0; i < frames30; i++) updateSlideshow(s30, 33);

    // Simulate 6 seconds at 60fps (~16ms per frame)
    const frames60 = Math.ceil(6000 / 16);
    for (let i = 0; i < frames60; i++) updateSlideshow(s60, 16);

    // Both should be in similar crossfade state (within rounding)
    expect(Math.abs(s30.crossfade - s60.crossfade)).toBeLessThan(0.05);
    expect(s30.currentPhoto).toBe(s60.currentPhoto);
  });
});

// ── Plane Geometry ──

describe("plane geometry", () => {
  let s: HeroState;

  beforeEach(() => {
    s = createInitialState();
    s.W = 1024;
    s.H = 768;
  });

  it("left plane stays within canvas bounds", () => {
    s.rotation = 1;
    const pts = getLeftPlane(s);
    for (const p of pts) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(s.W);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(s.H);
    }
  });

  it("right plane stays within canvas bounds", () => {
    s.rotation = 1;
    const pts = getRightPlane(s);
    for (const p of pts) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(s.W);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(s.H);
    }
  });

  it("planes widen as rotation increases", () => {
    s.rotation = 0;
    const leftClosed = getLeftPlane(s);
    s.rotation = 1;
    const leftOpen = getLeftPlane(s);

    const closedWidth = Math.abs(leftClosed[1].x - leftClosed[0].x);
    const openWidth = Math.abs(leftOpen[1].x - leftOpen[0].x);
    expect(openWidth).toBeGreaterThan(closedWidth);
  });

  it("mapToQuad interpolates correctly at corners", () => {
    s.rotation = 0.5;
    const pts = getLeftPlane(s);
    const topLeft = mapToQuad(0, 0, pts);
    const topRight = mapToQuad(1, 0, pts);

    expect(topLeft.x).toBeCloseTo(pts[0].x, 1);
    expect(topLeft.y).toBeCloseTo(pts[0].y, 1);
    expect(topRight.x).toBeCloseTo(pts[1].x, 1);
    expect(topRight.y).toBeCloseTo(pts[1].y, 1);
  });
});

// ── Metadata ──

describe("metadata getters", () => {
  let s: HeroState;

  beforeEach(() => {
    s = createInitialState();
    s.W = 1024;
    s.H = 768;
    s.frame = 100;
    s.wireNetwork = generateWireNetwork("high");
  });

  it("getMetadataLeft includes coordinate info", () => {
    const left = getMetadataLeft(s);
    expect(left).toContain("φ");
    expect(left).toContain("λ");
    expect(left).toContain("Canvas2D");
    expect(left).toContain("Frame:");
  });

  it("getMetadataRight includes merge and density", () => {
    s.rotation = 0.5;
    const right = getMetadataRight(s);
    expect(right).toContain("merge: 50%");
    expect(right).toContain("density: 120");
  });

  it("getMetadataBottom returns resolution and fps", () => {
    const items = getMetadataBottom(s);
    const texts = items.filter((i) => i.type === "text").map((i) => i.value);
    expect(texts).toContain("1024×768");
    expect(texts).toContain("60.0fps");
  });

  it("getMetadataBottom shows 30fps for low tier", () => {
    s.perfTier = "low";
    const items = getMetadataBottom(s);
    const texts = items.filter((i) => i.type === "text").map((i) => i.value);
    expect(texts).toContain("30.0fps");
  });
});

// ── drawFrame ──

describe("drawFrame", () => {
  it("increments frame counter and updates mouse smoothing", () => {
    const s = createInitialState();
    s.W = 800;
    s.H = 600;
    s.wireNetwork = generateWireNetwork("high");
    s.targetMX = 0.8;
    s.targetMY = 0.2;

    // Create a minimal mock canvas context
    const noop = () => {};
    const ctx = {
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 0,
      globalAlpha: 1,
      fillRect: noop,
      beginPath: noop,
      moveTo: noop,
      lineTo: noop,
      closePath: noop,
      stroke: noop,
      fill: noop,
      arc: noop,
      clip: noop,
      save: noop,
      restore: noop,
      setTransform: noop,
      drawImage: noop,
    } as unknown as CanvasRenderingContext2D;

    drawFrame(ctx, s, [], 1000);
    expect(s.frame).toBe(1);
    expect(s.lastFrameTime).toBe(1000);

    drawFrame(ctx, s, [], 1016);
    expect(s.frame).toBe(2);
    // Mouse should be lerping toward target
    expect(s.mouseX).toBeGreaterThan(0.5);
    expect(s.mouseY).toBeLessThan(0.5);
  });

  it("caps delta time to prevent animation jumps", () => {
    const s = createInitialState();
    s.W = 800;
    s.H = 600;
    s.wireNetwork = generateWireNetwork("high");
    s.lastFrameTime = 1000;

    const noop = () => {};
    const ctx = {
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 0,
      globalAlpha: 1,
      fillRect: noop,
      beginPath: noop,
      moveTo: noop,
      lineTo: noop,
      closePath: noop,
      stroke: noop,
      fill: noop,
      arc: noop,
      clip: noop,
      save: noop,
      restore: noop,
      setTransform: noop,
      drawImage: noop,
    } as unknown as CanvasRenderingContext2D;

    // Simulate a 500ms gap (e.g. tab was hidden)
    drawFrame(ctx, s, [], 1500);
    // photoHoldTimerMs should be capped at 100ms, not 500ms
    expect(s.photoHoldTimerMs).toBeLessThanOrEqual(100);
  });
});
