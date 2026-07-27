/**
 * Hold the production homepage at its initial position long enough to record
 * the complete autonomous hero sequence: pause, fold, and settled ending.
 */
export default async function captureParallaxHausHero(page) {
  await page.waitForTimeout(6200);
}
