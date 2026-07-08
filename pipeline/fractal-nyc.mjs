/**
 * fractal-nyc.mjs
 * ---------------
 * Interaction script for the Fractal NYC homepage (react-three-fiber).
 * Instead of scrolling the editorial landing page, this showcases the interactive
 * 3D fractal-octahedron: drag to rotate it, then click the "Campus" node (the green
 * vertex, which routes to /campus) to navigate onto the Campus page.
 *
 * The octahedron renders fine headless. Net rotation from the drags is ~0 (out-and-back)
 * so the Campus node returns to its rest position (~x905,y451 at 1440x900) before the
 * click; a navbar-link fallback guarantees navigation if the node click misses.
 */

export default async function interaction(page) {
  const cx = 720, cy = 470; // roughly the octahedron center at 1440x900
  const campusNode = { x: 905, y: 451 }; // green Campus vertex at rest

  // Let the scene render/settle.
  await page.waitForTimeout(1200);

  // 1) Grab the octahedron and spin it — pure horizontal, NET ZERO so it returns
  //    to rest (Campus node back at its spot). Few steps: raycast-per-move is costly.
  await page.mouse.move(cx, cy, { steps: 2 });
  await page.mouse.down();
  await page.mouse.move(cx + 210, cy, { steps: 3 }); // spin right +210
  await page.mouse.move(cx - 210, cy, { steps: 4 }); // spin left  -420 (net -210)
  await page.mouse.move(cx, cy, { steps: 3 });       // back +210 (net 0 -> rest)
  await page.mouse.up();
  await page.waitForTimeout(700);

  // 2) Move to the Campus (green) node and hover, then click to navigate.
  await page.mouse.move(campusNode.x, campusNode.y, { steps: 3 });
  await page.waitForTimeout(600);
  await page.mouse.click(campusNode.x, campusNode.y);
  await page.waitForTimeout(1300);

  // Fallback: guarantee we land on /campus even if the node click missed.
  if (!page.url().includes('/campus')) {
    await page.click('a[href="/campus"]', { force: true }).catch(() => {});
    await page.waitForTimeout(1400);
  }

  // 3) Show the Campus page — hold, then a gentle scroll to reveal its content.
  await page.waitForTimeout(1100);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'auto' }));
  await page.waitForTimeout(400);
  await page.evaluate(() => new Promise((res) => {
    let y = 0; const t = setInterval(() => { y += 90; window.scrollTo(0, y); if (y > 700) { clearInterval(t); res(); } }, 90);
  }));
  await page.waitForTimeout(900);
}
