/**
 * secret-garden.mjs
 * -----------------
 * Interaction script for the Secret Garden WebGL prototype (three.js flower field).
 * Showcases the parametric tool: drag the "Flower Field" GUI's Singles "%" density
 * slider down (fewer flowers) then up (lots of flowers) so the meadow visibly
 * rebuilds. Must be captured HEADFUL (--headful) — the draco garden won't render
 * under the headless SwiftShader renderer.
 *
 * lil-gui structure: a `.lil-controller.lil-number.lil-has-slider` whose `.lil-name`
 * is "%"; the first one is Singles density. Its `.lil-slider` is the drag target.
 * onChange is debounced ~300ms (scheduleRebuild), so we pause at each step to let
 * the flower field rebuild.
 */

export default async function interaction(page) {
  // Wait for the scene to finish loading, then hide the "click to explore" overlay
  // (clicking it would grab pointer-lock) and locate the Singles "%" slider.
  await page.waitForFunction(
    () => document.getElementById('loading-screen')?.classList.contains('hidden'),
    { timeout: 30000 }
  ).catch(() => {});

  // Immediately hide the overlay and pin the camera to a medium framing of the
  // flower arrangement, held every frame (the app otherwise buries us inside it).
  await page.evaluate(() => {
    const ov = document.getElementById('overlay');
    if (ov) ov.style.display = 'none';
    if (window.__cam) {
      const hold = () => {
        window.__cam.position.set(0, 8, 22);
        window.__cam.lookAt(0, 2.5, 0);
        window.__camRAF = requestAnimationFrame(hold);
      };
      hold();
    }
  });
  await page.waitForTimeout(1200);

  const box = await page.evaluate(() => {
    const ctrls = [...document.querySelectorAll('.lil-controller.lil-number.lil-has-slider')];
    const total = ctrls.find((c) => c.querySelector('.lil-name')?.textContent.trim() === 'Total Flowers');
    const s = total?.querySelector('.lil-slider');
    if (!s) return null;
    const r = s.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  if (!box) throw new Error('Secret Garden: "Total Flowers" slider not found');

  const cy = box.y + box.h / 2;
  // flowerCount range is 0..210000; the slider fill is proportional to that.
  const xAtCount = (count) => box.x + Math.max(0.01, Math.min(0.99, count / 210000)) * box.w;

  // Settle on the full meadow a beat (default ~180k flowers).
  await page.waitForTimeout(900);

  // Grab the "Total Flowers" slider near its current value.
  await page.mouse.move(xAtCount(180000), cy, { steps: 6 });
  await page.mouse.down();
  await page.waitForTimeout(300);

  // Sweep DOWN — thin it out to just a few flowers.
  for (const count of [110000, 55000, 20000, 3000]) {
    await page.mouse.move(xAtCount(count), cy, { steps: 4 });
    await page.waitForTimeout(750);
  }
  await page.waitForTimeout(500);

  // Sweep UP — pack in a lot of flowers.
  for (const count of [60000, 140000, 210000]) {
    await page.mouse.move(xAtCount(count), cy, { steps: 4 });
    await page.waitForTimeout(800);
  }
  await page.mouse.up();

  // Hold on the full meadow.
  await page.waitForTimeout(1200);
}
