#!/usr/bin/env node
/**
 * Deterministic production captures for the Parallax Haus Software post.
 *
 * Run before registering the post in works.json:
 *   node pipeline/parallax-haus-stills.mjs
 */

import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = path.join(ROOT, "public", "lab", "parallax-haus");
const CHROME =
  process.env.PARALLAX_CAPTURE_BROWSER ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const VIEWPORT = { width: 1440, height: 900 };

const PAGE_CAPTURES = [
  ["page-software.png", "https://parallax.haus/work/software"],
  ["page-architecture.png", "https://parallax.haus/work/architecture"],
  ["page-archive.png", "https://parallax.haus/archive"],
  ["page-writing.png", "https://parallax.haus/writing"],
  ["page-about.png", "https://parallax.haus/about"],
];

async function waitForMedia(page, extra = 800) {
  await page.waitForLoadState("domcontentloaded");
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
  await page.waitForTimeout(extra);
}

async function scrollTo(page, y, extra = 900) {
  await page.evaluate((target) => window.scrollTo(0, target), Math.max(0, y));
  await page.waitForTimeout(extra);
}

async function elementTop(page, locator) {
  return locator.evaluate(
    (element) => element.getBoundingClientRect().top + window.scrollY
  );
}

async function centeredTop(page, locator) {
  return locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return rect.top + window.scrollY - (window.innerHeight - rect.height) / 2;
  });
}

async function save(page, filename) {
  const target = path.join(OUTPUT, filename);
  await page.screenshot({
    path: target,
    animations: "allow",
    fullPage: false,
  });
  const stat = await fs.stat(target);
  console.log(`${filename}\t${Math.round(stat.size / 1024)} KB`);
}

await fs.mkdir(OUTPUT, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: CHROME,
});
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 1,
  colorScheme: "light",
  reducedMotion: "no-preference",
});
const page = await context.newPage();
page.setDefaultTimeout(30_000);

try {
  await page.goto("https://parallax.haus/", {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  await waitForMedia(page, 4200);
  await scrollTo(page, 0, 300);
  await save(page, "home-hero.png");

  const software = page.getByText("World 02", { exact: true });
  const softwareSection = software.locator("xpath=ancestor::section[1]");
  await scrollTo(page, await elementTop(page, softwareSection));
  await save(page, "home-software.png");

  const architecture = page.getByText("World 01", { exact: true });
  const mergeContainer = architecture.locator(
    "xpath=ancestor::div[contains(@style, '150vh')][1]"
  );
  const mergeTop = await elementTop(page, mergeContainer);
  await scrollTo(page, mergeTop);
  await save(page, "home-architecture.png");

  const mergeHeight = await mergeContainer.evaluate((element) => element.clientHeight);
  await scrollTo(page, mergeTop + mergeHeight - VIEWPORT.height);
  await save(page, "home-merge.png");

  const clipTracker = page.getByRole("navigation", { name: "Clip tracker" });
  const clipSection = clipTracker.locator("xpath=ancestor::section[1]");
  await scrollTo(page, await elementTop(page, clipSection));
  // Start clip 01, then freeze a representative nonblank frame.
  await page.mouse.click(1080, 450);
  await page.waitForTimeout(1800);
  await page.evaluate(() => {
    document.querySelectorAll("video").forEach((video) => video.pause());
  });
  await save(page, "home-clip-reel.png");

  const manifesto = page.getByText(/taking the time to look into the future/i);
  await scrollTo(page, await centeredTop(page, manifesto));
  await save(page, "home-manifesto.png");

  const studioDesk = page.getByText("the studio desk", { exact: true });
  await scrollTo(page, await centeredTop(page, studioDesk));
  await save(page, "home-studio-desk.png");

  const footer = page.locator("footer");
  await scrollTo(page, await elementTop(page, footer));
  await save(page, "home-footer.png");

  for (const [filename, url] of PAGE_CAPTURES) {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    await waitForMedia(page, filename === "page-archive.png" ? 1800 : 1000);
    await scrollTo(page, 0, 300);
    await save(page, filename);
  }
} finally {
  await context.close();
  await browser.close();
}
