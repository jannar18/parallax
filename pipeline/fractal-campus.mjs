/**
 * fractal-campus.mjs
 * ------------------
 * Interaction script for the Fractal Campus Framer landing page.
 * Signature: a warm light follows the cursor across neoclassical reliefs as you
 * scroll. So we keep the cursor in continuous, deliberate motion (sweeping arcs)
 * while progressively scrolling the page, so the light stays alive on the reliefs.
 *
 * NOTE: this page runs a heavy cursor-following light effect, so every synthetic
 * input event is expensive (~130ms per mouse-move step, ~475ms per wheel tick).
 * Wall-clock == recorded video length, so the motion budget below is kept tight
 * (~10s total). Prefer few, long sweeps over many small steps.
 */

export default async function interaction(page) {
  const vw = page.viewportSize()?.width || 1440;
  const vh = page.viewportSize()?.height || 900;

  const sweep = async (fromX, fromY, toX, toY, steps) => {
    await page.mouse.move(fromX, fromY, { steps: 2 });
    await page.mouse.move(toX, toY, { steps });
  };

  // Brief settle so the hero's intro animation plays.
  await page.waitForTimeout(500);

  // 1) Hero: glide the warm light left -> right across the reliefs, drifting down.
  await sweep(vw * 0.14, vh * 0.42, vw * 0.86, vh * 0.58, 20);
  await page.waitForTimeout(250);

  // 3) Scroll down ~1.5 viewports (few, large wheel ticks — each is costly).
  for (let t = 0; t < 4; t++) {
    await page.mouse.wheel(0, vh * 0.42);
    await page.waitForTimeout(60);
  }

  // 4) Sweep the light across the freshly revealed section.
  await sweep(vw * 0.22, vh * 0.45, vw * 0.80, vh * 0.5, 16);
  await page.waitForTimeout(250);

  // 5) A touch more scroll + a short return sweep for a calm closing frame.
  for (let t = 0; t < 2; t++) {
    await page.mouse.wheel(0, vh * 0.4);
    await page.waitForTimeout(60);
  }
  await sweep(vw * 0.78, vh * 0.5, vw * 0.5, vh * 0.44, 12);
  await page.waitForTimeout(500);
}
