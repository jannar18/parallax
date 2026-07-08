/**
 * enter-page.mjs
 * --------------
 * Captures the experience of ENTERING a Fractal NYC house page: from the home
 * octahedron hub, click into a house via the navbar and watch that page's
 * staggered FadeIn entrance (framer-motion whileInView, ~0.8s elegant ease)
 * replay on-camera — because client-side (wouter) navigation remounts the
 * page component, so the entrance animations fire while we record. A slow
 * scroll then reveals the below-the-fold FadeIns entering view.
 *
 * The harness loads HOME (`--url https://fractal-nyc.netlify.app/`). The house
 * to enter comes from TARGET_ROUTE (e.g. "/visit"). TARGET_ROUTE="/" instead
 * showcases the octahedron itself.
 *
 * Trim the home-load head with the harness `--trim-start` so the clip opens on
 * a brief glimpse of the octahedron, then the click-in.
 */

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

  // HOUSE PAGES — wait for the home octahedron/navbar to become interactive,
  // then click the house's navbar link so its page mounts on-camera.
  const link = page.locator(`a[href="${route}"]`).first();
  await link.waitFor({ state: "visible", timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(300); // brief glimpse of home before the click

  await link.click({ force: true, timeout: 4000 }).catch(() => {});

  // Confirm we navigated; hard-nav fallback if the click missed.
  await page.waitForTimeout(400);
  if (!page.url().includes(route)) {
    const base = new URL(page.url()).origin;
    await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" }).catch(() => {});
  }

  // Hold at the top while the staggered above-the-fold FadeIns finish (~1.6s).
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
  await page.waitForTimeout(1600);

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
        // Stop where the footer top edge sits at the viewport bottom.
        const max = Math.max(0, Math.min(docMax, footerTop - window.innerHeight));
        // Fixed ~3s scroll regardless of page height, so every clip stays a
        // consistent length. Step size adapts to the distance to the footer.
        const intervalMs = 40;
        const steps = Math.max(1, Math.round(3000 / intervalMs));
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

  await page.waitForTimeout(900);
}
