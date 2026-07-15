/**
 * enter-page.mjs
 * --------------
 * Captures ENTERING a Fractal NYC house page from the home octahedron hub — but
 * now the octahedron is the star of the opening beat. Instead of a harsh ~0.4s
 * glimpse then an instant cut, the clip:
 *
 *   1. Holds on the octahedron so it reads as a living, interactive object.
 *   2. Glides the cursor onto THAT house's 3D nav node, which grows (1.8x),
 *      brightens its emissive glow, and pops its color-matched label
 *      (VISIT / EVENTS / CAMPUS / EDUCATION / STORY).
 *   3. Clicks the node to navigate — so the entrance feels earned, not abrupt.
 *   4. Lands on the house page and lets its staggered FadeIn entrance replay
 *      on-camera, then a slow scroll reveals the below-the-fold FadeIns.
 *
 * How the node hover is made reliable
 * -----------------------------------
 * The octahedron auto-rotates (`rotation.y += delta*0.12`), which would move the
 * nodes out from under a fixed pixel. That rotation is gated by the app's
 * `usePrefersReducedMotion()` hook, so we run the capture context under
 * prefers-reduced-motion (harness env `CAPTURE_REDUCED_MOTION=1`). That pins the
 * scene at rotation.y=0 — a deterministic orientation where the node screen
 * coords below hold exactly. Right before navigating we toggle reduced-motion
 * back OFF (`page.emulateMedia`), so the destination page's FadeIn entrance
 * animations (also gated on that hook) play normally on-camera.
 *
 * The harness loads HOME (`--url https://fractal-nyc.netlify.app/`). The house to
 * enter comes from TARGET_ROUTE (e.g. "/visit"). TARGET_ROUTE="/" showcases the
 * octahedron itself. Node coords are for the 1440x900 capture viewport.
 */

// Nav-node screen coordinates at 1440x900, frozen (reduced-motion) orientation.
// Validated by hovering each: the correct label pops and the node grows/glows.
// `from` is a neutral approach point OUTSIDE the octahedron on the node's radial
// axis — gliding node<-from never crosses the center (the Story node lives dead
// center, so a center-origin glide would flash "STORY" first). Publications' node
// sits behind the front faces at rest (occluded): no `from` entry here, so it
// falls through to the softened navbar entrance below.
// `spin` is a pre-select flourish that varies the clip per house: a NET-ZERO
// horizontal OrbitControls drag (damping is off, so the camera — and every node
// — returns to rest exactly on its coord). Azimuth orbit only: vertical orbit
// clamps at the poles and wouldn't return cleanly. Direction (`dir`) and
// amplitude (`amp`) vary per house so no two clips spin alike. `spin: null` =
// the plain glide (Campus, the approved reference clip).
// `spin` = a short pre-select flourish, only on SOME houses (variety). It is a
// NET-ZERO horizontal OrbitControls drag (damping off => the scene returns to
// rest exactly on the node's coord). `spin: null` = go straight to the node
// (glide). Every house — spin or glide — then gets the SAME extended node
// animation (grow / glow / label held) before entering.
// `reveal` = a held azimuth drag (NOT returned) that rotates an occluded node
// into view — only Publications needs it (its node sits at the BACK of the
// octahedron at rest). After the reveal its node lands at x/y and the cursor
// ends on the far side, so we route around the outside to `from` before gliding.
const NODE = {
  "/visit": { x: 716, y: 654, from: { x: 716, y: 796 }, spin: { dir: -1, amp: 150 } },
  "/events": { x: 716, y: 242, from: { x: 716, y: 116 }, spin: null }, // glide
  "/campus": { x: 922, y: 450, from: { x: 1086, y: 450 }, spin: null }, // glide
  "/education": { x: 512, y: 450, from: { x: 348, y: 450 }, spin: { dir: 1, amp: 150 } },
  "/publications": { x: 922, y: 450, from: { x: 1086, y: 450 }, reveal: { dir: -1, amp: 360 } },
};

const SPIN_ANCHOR = { x: 720, y: 385 }; // on the model, clear of every nav node

// A short net-zero horizontal drag-orbit "spin". Anchored clear of every node so
// grab/release never lands on one (no tooltip flash). One quick out-and-back
// azimuth sweep; damping off means the summed-to-zero deltas restore rest.
async function spinGesture(page, { dir, amp }) {
  const { x: ax, y: ay } = SPIN_ANCHOR;
  const dx = dir * amp;
  await page.mouse.move(ax, ay, { steps: 2 });
  await page.mouse.down();
  await page.mouse.move(ax + dx, ay, { steps: 4 });
  await page.mouse.move(ax - dx, ay, { steps: 7 }); // sweep across (net so far: -dx)
  await page.mouse.move(ax, ay, { steps: 4 });      // return (net: 0 => rest)
  await page.mouse.up();
  await page.waitForTimeout(120);
}

// A held azimuth drag that rotates an occluded node into view (Publications).
// Returns the cursor's end point (on the far side of the model).
async function revealGesture(page, { dir, amp }) {
  const { x: ax, y: ay } = SPIN_ANCHOR;
  await page.mouse.move(ax, ay, { steps: 2 });
  await page.mouse.down();
  await page.mouse.move(ax + dir * amp, ay, { steps: 10 }); // rotate and HOLD
  await page.mouse.up();
  await page.waitForTimeout(150);
  return { x: ax + dir * amp, y: ay };
}

export default async function interaction(page) {
  const route = process.env.TARGET_ROUTE || "/";
  const cx = 720, cy = 470; // octahedron center at 1440x900

  if (route === "/") {
    // HOME — the fractal octahedron hero. Let it settle, then a gentle
    // net-zero spin so it returns to rest, shown as a living object.
    await page.waitForTimeout(1600);
    await page.mouse.move(cx, cy, { steps: 2 });
    await page.mouse.down();
    await page.mouse.move(cx + 180, cy, { steps: 6 });
    await page.mouse.move(cx - 180, cy, { steps: 8 });
    await page.mouse.move(cx, cy, { steps: 6 });
    await page.mouse.up();
    await page.waitForTimeout(1600);
    return;
  }

  const node = NODE[route];

  // 1) A brief hold so the octahedron registers before we act — kept short so
  //    the clip doesn't open on dead static time (the head load is also trimmed
  //    off by the harness --trim-start).
  await page.waitForTimeout(400);

  // 2) Optional flourish (varies per house): a short net-zero spin on some, or —
  //    for the occluded Publications node — a held reveal-rotation that brings it
  //    into view. The rest go straight to their node (glide). Either way, every
  //    house lands on the SAME extended node beat below.
  if (node.spin) {
    await spinGesture(page, node.spin);
  } else if (node.reveal) {
    const end = await revealGesture(page, node.reveal);
    // Cursor ended on the far side; route around the OUTSIDE (down one side,
    // across the bottom below every node, up the other) to the approach point.
    await page.mouse.move(end.x, 800, { steps: 5 });
    await page.mouse.move(node.from.x, 800, { steps: 6 });
    await page.mouse.move(node.from.x, node.from.y, { steps: 4 });
  }

  // 3) Glide from the outside approach point straight to the node and hold — it
  //    grows, glows, and holds its label. The extended dwell is the same for
  //    every house. Approaching from outside never crosses the center Story node.
  await page.mouse.move(node.from.x, node.from.y, { steps: 2 });
  await page.waitForTimeout(250);
  await page.mouse.move(node.x, node.y, { steps: 12 }); // slow, visible glide
  await page.waitForTimeout(1600); // extended node animation (grow/glow/label held)

  // 4) Un-freeze motion so the destination page's FadeIn entrances animate
  //    on-camera. The cursor stays on the node, so its hover state persists.
  await page.emulateMedia({ reducedMotion: "no-preference" }).catch(() => {});
  await page.waitForTimeout(160);

  // 5) Click the node to navigate.
  await page.mouse.click(node.x, node.y);
  await page.waitForTimeout(450);

  // Confirm we navigated; navbar-link then hard-nav fallbacks if the click missed
  // (raycasting a small 3D vertex headless can occasionally miss).
  if (!page.url().includes(route)) {
    const link = page.locator(`a[href="${route}"]`).first();
    await link.waitFor({ state: "visible", timeout: 4000 }).catch(() => {});
    await link.click({ force: true, timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(400);
    if (!page.url().includes(route)) {
      const base = new URL(page.url()).origin;
      await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" }).catch(() => {});
    }
  }

  // Hold at the top while the staggered above-the-fold FadeIns finish.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
  await page.waitForTimeout(1000);

  // Slow, smooth scroll down to trigger the below-the-fold FadeIns. Stop the
  // instant the footer's top edge reaches the bottom of the viewport, so the
  // final frame lands on the content just above the footer — the footer itself
  // never enters frame.
  await page.evaluate(
    () =>
      new Promise((res) => {
        const footer = document.querySelector("[data-site-footer], footer");
        const docMax =
          document.documentElement.scrollHeight - window.innerHeight;
        // Absolute document offset of the footer's top edge.
        const footerTop = footer
          ? footer.getBoundingClientRect().top + window.scrollY
          : docMax + window.innerHeight;
        // Stop where the footer top edge sits at the viewport bottom — but never
        // scroll more than ~1.25 viewports. Some pages (e.g. Publications) leave
        // a tall empty band before the footer; the footer rule alone would sink
        // the final frame into that blank gap. The cap keeps us on real content.
        const footerStop = footerTop - window.innerHeight;
        const cap = Math.round(window.innerHeight * 1.25);
        const max = Math.max(0, Math.min(docMax, footerStop, cap));
        // Fixed ~3s scroll regardless of page height, so every clip stays a
        // consistent length. Step size adapts to the distance to the footer.
        const intervalMs = 40;
        const steps = Math.max(1, Math.round(2000 / intervalMs));
        const perStep = max / steps;
        let i = 0;
        const t = setInterval(() => {
          i += 1;
          if (i >= steps) {
            window.scrollTo(0, max);
            clearInterval(t);
            res();
          } else {
            window.scrollTo(0, Math.round(perStep * i));
          }
        }, intervalMs);
      })
  );

  await page.waitForTimeout(600);
}
