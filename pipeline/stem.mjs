/**
 * stem.mjs
 * --------
 * Interaction script for the Stem URL-shortener prototype (github.com/jannar18/stem).
 * Framing: the whole hero — heading, tulip video, and the shortener input — fits in
 * a 1440x900 (16:10) frame, so we DO NOT scroll. We simply paste a long URL into the
 * hero's input and hover "Trim", keeping the shot on the main hero screen the whole time.
 *
 * The prototype's Trim button is a no-op (form preventDefault), so the showcase is the
 * paste itself: a long, cluttered URL landing in the elegant input.
 */

const LONG_URL =
  'https://www.example.com/collections/limited-edition/tulip-field-print?utm_source=newsletter&utm_medium=email&utm_campaign=spring2026&ref=hero';

export default async function interaction(page) {
  // Let the hero's tulip video play a beat before we touch anything.
  await page.waitForTimeout(900);

  const input = page.locator('input[type=url]');
  const box = await input.boundingBox();
  if (!box) throw new Error('Stem: could not find the hero URL input');

  // Move the cursor to the input (visible motion) and focus it.
  await page.mouse.move(box.x + 40, box.y + box.height / 2, { steps: 18 });
  await input.click();
  await page.waitForTimeout(300);

  // Paste the long, cluttered URL — typed with a small per-key delay so it reads on video.
  await input.type(LONG_URL, { delay: 22 });
  await page.waitForTimeout(500);

  // Drift to the "Trim" button and hover (subtle scale/colour transition).
  const trim = page.locator('button[type=submit]');
  const tb = await trim.boundingBox();
  if (tb) {
    await page.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2, { steps: 16 });
    await page.waitForTimeout(700);
  }

  // Final hold on the composed hero for a clean resting frame.
  await page.waitForTimeout(700);
}
