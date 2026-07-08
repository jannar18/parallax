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
  await page.waitForTimeout(400);

  // Paste the long, cluttered URL instantly (like ⌘V) — nobody types these out.
  await input.fill(LONG_URL);
  await page.waitForTimeout(650);

  // Move to "Trim" and click it to shorten the link.
  const trim = page.locator('button[type=submit]');
  const tb = await trim.boundingBox();
  if (tb) {
    await page.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2, { steps: 16 });
    await page.waitForTimeout(300);
    await trim.click();
  }

  // The trimmed short URL appears — hold so it reads.
  await page.waitForTimeout(1100);

  // Copy it (the button flips to "Copied ✓").
  const copy = page.getByRole('button', { name: /copy/i });
  if (await copy.count()) {
    const cb = await copy.first().boundingBox();
    if (cb) {
      await page.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2, { steps: 12 });
      await page.waitForTimeout(250);
      await copy.first().click();
    }
  }

  // Final hold on the trimmed result.
  await page.waitForTimeout(1300);
}
