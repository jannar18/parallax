/**
 * Record one deliberate, one-way reading of the Parallax Haus homepage.
 * The route is sampled by viewport rather than hard-coded pixels so it remains
 * useful as the page's editorial sections evolve.
 */

async function waitForPageMedia(page) {
  await page.evaluate(async () => {
    await document.fonts?.ready;
    await Promise.all(
      Array.from(document.images)
        .filter((image) => {
          const rect = image.getBoundingClientRect();
          return rect.bottom >= 0 && rect.top <= window.innerHeight * 1.5;
        })
        .map((image) => {
        if (image.complete) return Promise.resolve();
        return new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        });
      })
    );
  });
}

async function scrollTo(page, target, duration = 2450) {
  await page.evaluate(
    ({ y, ms }) =>
      new Promise((resolve) => {
        const start = window.scrollY;
        const distance = y - start;
        const startedAt = performance.now();

        const frame = (now) => {
          const progress = Math.min(1, (now - startedAt) / ms);
          const eased =
            progress < 0.5
              ? 2 * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          window.scrollTo(0, start + distance * eased);
          if (progress < 1) requestAnimationFrame(frame);
          else resolve();
        };

        requestAnimationFrame(frame);
      }),
    { y: target, ms: duration }
  );
}

export default async function captureParallaxHausScroll(page) {
  await waitForPageMedia(page);

  // Let the independent hero entrance finish before the walkthrough begins.
  await page.waitForTimeout(4600);

  const metrics = await page.evaluate(() => {
    const maximum = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    ) - window.innerHeight;
    return { maximum, viewport: window.innerHeight };
  });

  // About one stop per viewport keeps the full-viewport compositions readable,
  // while the final point is exact so the walkthrough resolves on the footer.
  const stops = [];
  for (
    let y = Math.min(metrics.viewport, metrics.maximum);
    y < metrics.maximum;
    y += metrics.viewport
  ) {
    stops.push(y);
  }
  if (stops.at(-1) !== metrics.maximum) stops.push(metrics.maximum);

  for (const stop of stops) {
    await scrollTo(page, stop);
    await page.waitForTimeout(850);
  }

  await page.waitForTimeout(1100);
}
