/**
 * fractal-campus.mjs
 * ------------------
 * Interaction script for the Fractal Campus Framer landing page.
 * Signature: a warm light follows the cursor across neoclassical reliefs.
 *
 * IMPORTANT — keep it on the HERO. Scrolling a Framer site fires its lazy-load and
 * scroll-reveal entrance animations, which look glitchy/half-loaded when captured
 * mid-scroll. The hero + its cursor-light effect is the strongest, most stable shot,
 * so we stay put and just glide the warm light across the reliefs. No scrolling.
 *
 * The page runs a heavy cursor-following light shader, so every synthetic mouse-move
 * step is expensive (~130-250ms). Keep the sweeps short; wall-clock == video length.
 */

export default async function interaction(page) {
  const vw = page.viewportSize()?.width || 1440;
  const vh = page.viewportSize()?.height || 900;

  const sweep = async (fromX, fromY, toX, toY, steps) => {
    await page.mouse.move(fromX, fromY, { steps: 2 });
    await page.mouse.move(toX, toY, { steps });
  };

  // The capture harness already waited for the page to settle; a short extra beat.
  await page.waitForTimeout(400);

  // 1) Glide the warm light left -> right across the reliefs (upper band).
  await sweep(vw * 0.55, vh * 0.42, vw * 0.9, vh * 0.5, 16);
  await page.waitForTimeout(250);

  // 2) Sweep back across and down over the seated figures, lighting them.
  await sweep(vw * 0.9, vh * 0.5, vw * 0.5, vh * 0.7, 18);
  await page.waitForTimeout(250);

  // 3) A slow circular drift so the light lingers and pools on the relief.
  await sweep(vw * 0.5, vh * 0.7, vw * 0.72, vh * 0.55, 12);
  await sweep(vw * 0.72, vh * 0.55, vw * 0.82, vh * 0.72, 12);
  await page.waitForTimeout(300);

  // 4) Ease the light back toward center for a calm resting frame.
  await sweep(vw * 0.82, vh * 0.72, vw * 0.62, vh * 0.52, 14);
  await page.waitForTimeout(600);
}
