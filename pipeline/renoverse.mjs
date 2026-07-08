/**
 * renoverse.mjs
 * -------------
 * Interaction script for the Renoverse AI marketing site (static HTML, served locally
 * so the hero.mp4 background — which 404s on the GitHub Pages deploy — is present).
 *
 * The hero alone reads as near-empty (heavy scrim over the video), so this showcase
 * opens on the hero, then smooth-scrolls through the real product story: the
 * "One workspace" UI mockup and the feature-card grid. Eased, unhurried scrolling.
 */

export default async function interaction(page) {
  // Eased smooth-scroll to an absolute Y over `dur` ms (captured in real time).
  const scrollTo = (y, dur) =>
    page.evaluate(
      ({ y, dur }) =>
        new Promise((res) => {
          const start = window.scrollY;
          const dist = y - start;
          const t0 = performance.now();
          const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
          const step = (now) => {
            const p = Math.min(1, (now - t0) / dur);
            window.scrollTo(0, start + dist * ease(p));
            p < 1 ? requestAnimationFrame(step) : res();
          };
          requestAnimationFrame(step);
        }),
      { y, dur }
    );

  // Find a section's absolute top by a text fragment in its heading.
  const yOf = (frag, offset = 0) =>
    page.evaluate(
      ({ frag, offset }) => {
        const el = [...document.querySelectorAll('h1,h2,h3')].find((e) =>
          e.textContent.toLowerCase().includes(frag.toLowerCase())
        );
        if (!el) return null;
        return Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset);
      },
      { frag, offset }
    );

  // Make sure the hero video is playing behind the scrim.
  await page.evaluate(() => {
    const v = document.querySelector('.hero video, video');
    if (v) { v.muted = true; v.play?.().catch(() => {}); }
  });

  // 1) Open on the hero.
  await page.waitForTimeout(1800);

  // 2) Down to the "One workspace" product mockup, framed with headroom.
  const yWorkspace = (await yOf('one workspace', 120)) ?? 1000;
  await scrollTo(yWorkspace, 1600);
  await page.waitForTimeout(1900);

  // 3) Down to the feature-card grid.
  const yFeatures = (await yOf('built for firms', 90)) ?? 3300;
  await scrollTo(yFeatures, 1900);
  await page.waitForTimeout(2000);

  // 4) A last beat on the testimonial, then settle.
  const yQuote = (await yOf('built by a team', 140)) ?? yFeatures + 1000;
  await scrollTo(yQuote, 1500);
  await page.waitForTimeout(1200);
}
