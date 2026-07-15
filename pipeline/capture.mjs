#!/usr/bin/env node
/**
 * capture.mjs
 * ------------
 * Records a short video of a running web project with Playwright (chromium)
 * and converts it into an optimized, looping GIF via ffmpeg (two-pass palette).
 *
 * Usage:
 *   node capture.mjs --out <path.gif> [--url <url>] [--serve <dir>] [--file <path.html>]
 *      [--start "<cmd>"] [--port <n>] [--cwd <dir>] [--script <interaction.mjs>]
 *      [--view-width 1280] [--width 1000] [--fps 24] [--duration 6] [--wait 1500]
 *
 * --view-width is the browser viewport we render & record at (full desktop
 * width, so the whole app layout is visible). --width is the GIF's output
 * pixel width, downscaled from the recording to keep file size reasonable.
 *
 * Exactly one source must be provided among: --url, --serve, --file, or --start(+--port).
 *
 * Dependencies: playwright + Node built-ins only. ffmpeg is invoked as an external binary.
 */

import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import net from 'node:net';
import { spawn, execFileSync, spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

// ---------------------------------------------------------------------------
// Minimal argument parser (no external deps).
// Supports: --flag value  and  --flag (boolean).
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const tok = argv[i];
    if (!tok.startsWith('--')) continue;
    const key = tok.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      args[key] = true; // boolean flag
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

function fail(msg) {
  console.error(`\n[capture] ERROR: ${msg}\n`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Locate ffmpeg: prefer the known Homebrew path, else fall back to PATH.
// ---------------------------------------------------------------------------
function resolveFfmpeg() {
  const preferred = '/opt/homebrew/bin/ffmpeg';
  if (fs.existsSync(preferred)) return preferred;
  // Verify a PATH ffmpeg actually exists / runs.
  const probe = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
  if (probe.status === 0) return 'ffmpeg';
  fail('ffmpeg not found at /opt/homebrew/bin/ffmpeg or on PATH.');
}

// ---------------------------------------------------------------------------
// Content-type guessing for the tiny static server.
// ---------------------------------------------------------------------------
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

function contentType(filePath) {
  return MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

// ---------------------------------------------------------------------------
// Start a tiny static file server rooted at `rootDir`.
// Serves files, guesses content-type, defaults to index.html for "/".
// Listens on port 0 (a free port) and resolves with { server, port }.
// ---------------------------------------------------------------------------
function startStaticServer(rootDir) {
  const root = path.resolve(rootDir);
  const server = http.createServer(async (req, res) => {
    try {
      // Strip query string and decode.
      let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      if (urlPath === '/' || urlPath === '') urlPath = '/index.html';

      // Resolve within root; prevent path traversal outside root.
      const resolved = path.normalize(path.join(root, urlPath));
      if (!resolved.startsWith(root)) {
        res.writeHead(403).end('Forbidden');
        return;
      }

      let target = resolved;
      const stat = await fsp.stat(target).catch(() => null);
      if (stat && stat.isDirectory()) {
        target = path.join(target, 'index.html');
      }

      const data = await fsp.readFile(target).catch(() => null);
      if (data === null) {
        res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType(target) }).end(data);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' }).end('Server error');
    }
  });

  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

// ---------------------------------------------------------------------------
// Wait until a TCP port accepts connections (used for --start).
// Polls up to `timeoutMs`.
// ---------------------------------------------------------------------------
function waitForPort(port, host = '127.0.0.1', timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      const socket = net.connect(port, host);
      socket.once('connect', () => {
        socket.destroy();
        resolve();
      });
      socket.once('error', () => {
        socket.destroy();
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Timed out waiting for ${host}:${port} after ${timeoutMs}ms`));
        } else {
          setTimeout(tryOnce, 300);
        }
      });
    };
    tryOnce();
  });
}

// ---------------------------------------------------------------------------
// Default showcase: smooth scroll from top to bottom and back over ~duration.
// Uses small stepped wheel scrolls so the whole page is displayed.
// ---------------------------------------------------------------------------
async function defaultShowcase(page, durationSec) {
  const totalHeight = await page.evaluate(
    () => Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      window.innerHeight
    )
  );
  const viewport = page.viewportSize()?.height || 600;
  const scrollable = Math.max(0, totalHeight - viewport);

  // If nothing to scroll, just idle for the duration (still record something).
  if (scrollable <= 0) {
    await page.waitForTimeout(durationSec * 1000);
    return;
  }

  // We spend ~half the time scrolling down, ~half scrolling back up.
  const steps = 40; // total steps across the whole round trip
  const halfSteps = Math.floor(steps / 2);
  const stepDelay = Math.max(30, Math.round((durationSec * 1000) / steps));
  const perStep = Math.ceil(scrollable / halfSteps);

  // Scroll down.
  for (let i = 0; i < halfSteps; i++) {
    await page.mouse.wheel(0, perStep);
    await page.waitForTimeout(stepDelay);
  }
  // Scroll back up.
  for (let i = 0; i < halfSteps; i++) {
    await page.mouse.wheel(0, -perStep);
    await page.waitForTimeout(stepDelay);
  }
}

// ---------------------------------------------------------------------------
// Find the most-recently-created .webm in a directory.
// ---------------------------------------------------------------------------
async function findWebm(dir) {
  const entries = await fsp.readdir(dir).catch(() => []);
  const webms = entries.filter((f) => f.toLowerCase().endsWith('.webm'));
  if (webms.length === 0) return null;
  // Pick newest by mtime.
  let best = null;
  let bestMtime = -Infinity;
  for (const f of webms) {
    const full = path.join(dir, f);
    const st = await fsp.stat(full);
    if (st.mtimeMs > bestMtime) {
      bestMtime = st.mtimeMs;
      best = full;
    }
  }
  return best;
}

// ---------------------------------------------------------------------------
// Convert webm -> gif using a two-pass palette for quality.
// ---------------------------------------------------------------------------
function webmToGif(ffmpeg, webmPath, gifPath, { fps, width, tmpDir, trimStart = 0 }) {
  const palette = path.join(tmpDir, 'palette.png');
  // Input seek (before -i) to skip the pre-first-paint blank frames the browser
  // records while the page loads. Applied to both passes so they stay in sync.
  const seek = trimStart > 0 ? ['-ss', String(trimStart)] : [];

  // Pass 1: generate an optimized palette.
  execFileSync(
    ffmpeg,
    [
      '-y',
      ...seek,
      '-i', webmPath,
      '-vf', `fps=${fps},scale=${width}:-1:flags=lanczos,palettegen=stats_mode=diff`,
      palette,
    ],
    { stdio: 'inherit' }
  );

  // Pass 2: apply the palette and produce the looping gif.
  execFileSync(
    ffmpeg,
    [
      '-y',
      ...seek,
      '-i', webmPath,
      '-i', palette,
      '-lavfi',
      `fps=${fps},scale=${width}:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle`,
      '-loop', '0',
      gifPath,
    ],
    { stdio: 'inherit' }
  );
}

// ---------------------------------------------------------------------------
// Convert webm -> mp4 (H.264). Far smaller than GIF for dense motion / WebGL,
// so we can keep full width AND a tiny file. Web-safe yuv420p + faststart.
// ---------------------------------------------------------------------------
function webmToMp4(ffmpeg, webmPath, mp4Path, { fps, width, trimStart = 0 }) {
  const seek = trimStart > 0 ? ['-ss', String(trimStart)] : [];
  execFileSync(
    ffmpeg,
    [
      '-y',
      ...seek,
      '-i', webmPath,
      '-vf', `fps=${fps},scale=${width}:-2:flags=lanczos,format=yuv420p`,
      '-c:v', 'libx264',
      '-crf', '24',
      '-preset', 'slow',
      '-an',
      '-movflags', '+faststart',
      mp4Path,
    ],
    { stdio: 'inherit' }
  );
}

// ---------------------------------------------------------------------------
// Kill a spawned child process tree (best effort, cross-platform-ish).
// ---------------------------------------------------------------------------
function killTree(child) {
  if (!child || child.killed || child.exitCode !== null) return;
  try {
    // Negative PID kills the process group when spawned with detached: true.
    process.kill(-child.pid, 'SIGTERM');
  } catch {
    try {
      child.kill('SIGTERM');
    } catch {
      /* ignore */
    }
  }
}

// ---------------------------------------------------------------------------
// Main.
// ---------------------------------------------------------------------------
async function main() {
  const args = parseArgs(process.argv.slice(2));

  // --- Validate required + source options ---------------------------------
  if (!args.out || args.out === true) {
    fail('--out <path.gif> is required.');
  }
  const outPath = path.resolve(String(args.out));

  const sources = ['url', 'serve', 'file'].filter((k) => args[k] && args[k] !== true);
  const hasStart = args.start && args.start !== true;
  const totalSources = sources.length + (hasStart ? 1 : 0);
  if (totalSources !== 1) {
    fail(
      'Provide exactly one source: --url, --serve <dir>, --file <path.html>, or --start "<cmd>" --port <n>.'
    );
  }
  if (hasStart && (!args.port || args.port === true)) {
    fail('--start requires --port <n>.');
  }

  // --- Numeric options with defaults --------------------------------------
  // viewWidth: the browser viewport we render & record at — a full desktop
  //   width so the whole app layout is captured (not a cramped, narrow slice).
  // outWidth: the GIF's output pixel width — downscaled from the recording to
  //   keep file size reasonable. Never larger than the viewport we recorded.
  const viewWidth = Math.max(64, parseInt(args['view-width'], 10) || 1280);
  const viewHeight = Math.round(viewWidth * 0.625); // 16:10
  const outWidth = Math.min(viewWidth, Math.max(64, parseInt(args.width, 10) || 1000));
  // Default 24 fps for smooth motion. Playwright records the source .webm at
  // ~25 fps, so 24 samples almost every recorded frame; going higher than ~25
  // only duplicates frames (bigger file, no smoother). Clamp to 30 as a guard.
  const fps = Math.min(30, Math.max(1, parseInt(args.fps, 10) || 24));
  // Seconds to trim off the front of the recording, dropping the blank frames
  // captured before the page's first paint. --trim-start 0 keeps everything.
  const trimStart = Math.max(0, Number.isFinite(parseFloat(args['trim-start'])) ? parseFloat(args['trim-start']) : 0.5);
  const duration = Math.max(1, parseFloat(args.duration) || 6);
  const waitMs = Number.isFinite(parseInt(args.wait, 10)) ? parseInt(args.wait, 10) : 1500;
  // How long to wait for the network to go idle before starting the showcase.
  // Some sites (e.g. Framer, anything with analytics beacons or streaming media)
  // never reach networkidle, so the default 60s timeout is burned as dead footage
  // at the head of the recording. Pass a smaller value (or 0 to skip entirely).
  const netIdleMs = Number.isFinite(parseInt(args['net-idle'], 10)) ? parseInt(args['net-idle'], 10) : 60000;
  // The page.goto() wait condition. Defaults to 'load', but a heavy hero video or
  // other large resource can make the 'load' event take many seconds — recorded as
  // dead footage. Pass --goto-wait domcontentloaded to start as soon as the DOM is ready.
  const gotoWaitRaw = typeof args['goto-wait'] === 'string' ? args['goto-wait'] : 'load';
  const gotoWait = ['load', 'domcontentloaded', 'networkidle', 'commit'].includes(gotoWaitRaw) ? gotoWaitRaw : 'load';

  const ffmpeg = resolveFfmpeg();

  // Resources to clean up in `finally`.
  let staticServer = null;
  let startChild = null;
  let browser = null;
  let context = null;
  let videoTmpDir = null;
  let workTmpDir = null;

  try {
    // --- Resolve the target URL & (optionally) spin up a server/process ---
    let targetUrl;

    if (sources.includes('url')) {
      targetUrl = String(args.url);
    } else if (sources.includes('serve')) {
      const dir = path.resolve(String(args.serve));
      const { server, port } = await startStaticServer(dir);
      staticServer = server;
      targetUrl = `http://127.0.0.1:${port}/`;
      console.log(`[capture] Serving ${dir} at ${targetUrl}`);
    } else if (sources.includes('file')) {
      const filePath = path.resolve(String(args.file));
      const dir = path.dirname(filePath);
      const base = path.basename(filePath);
      const { server, port } = await startStaticServer(dir);
      staticServer = server;
      targetUrl = `http://127.0.0.1:${port}/${encodeURIComponent(base)}`;
      console.log(`[capture] Serving ${dir} at http://127.0.0.1:${port}/ (opening ${base})`);
    } else if (hasStart) {
      const port = parseInt(args.port, 10);
      const cwd = args.cwd && args.cwd !== true ? path.resolve(String(args.cwd)) : process.cwd();
      console.log(`[capture] Starting: ${args.start}  (cwd=${cwd})`);
      // Spawn via shell so the full command string works; detached for group kill.
      startChild = spawn(String(args.start), {
        cwd,
        shell: true,
        detached: true,
        stdio: 'inherit',
      });
      startChild.on('error', (e) => console.error(`[capture] start command error: ${e.message}`));
      await waitForPort(port);
      targetUrl = `http://localhost:${port}`;
      console.log(`[capture] Server responded on ${targetUrl}`);
    }

    // --- Prepare temp dirs --------------------------------------------------
    videoTmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'capture-vid-'));
    workTmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'capture-work-'));

    // --- Launch Playwright + record video ----------------------------------
    console.log(`[capture] Launching chromium (viewport ${viewWidth}x${viewHeight}, dsf 2, gif width ${outWidth})...`);
    // Headful (real GPU) is required for some WebGL apps that stall under the
    // headless SwiftShader software renderer (e.g. draco-compressed three.js scenes).
    browser = await chromium.launch({ headless: !args.headful });
    context = await browser.newContext({
      viewport: { width: viewWidth, height: viewHeight },
      deviceScaleFactor: 2,
      recordVideo: { dir: videoTmpDir, size: { width: viewWidth, height: viewHeight } },
      // Opt-in: start the context under prefers-reduced-motion. The Fractal NYC
      // octahedron gates its auto-rotation on this (rotation.y stays 0), which
      // freezes the scene at a deterministic orientation so an interaction
      // script can hover a 3D nav node by exact pixel coordinate. The script is
      // free to toggle it back off mid-run (page.emulateMedia) before it wants
      // motion again. No effect on any capture that doesn't set the env.
      ...(process.env.CAPTURE_REDUCED_MOTION ? { reducedMotion: 'reduce' } : {}),
    });
    const page = await context.newPage();

    console.log(`[capture] Navigating to ${targetUrl}`);
    await page.goto(targetUrl, { waitUntil: gotoWait, timeout: 60000 });
    if (netIdleMs > 0) {
      await page.waitForLoadState('networkidle', { timeout: netIdleMs }).catch(() => {
        console.warn(`[capture] networkidle not reached in ${netIdleMs}ms; continuing.`);
      });
    }
    await page.waitForTimeout(waitMs);

    // --- Drive the showcase (custom script or default) ---------------------
    if (args.script && args.script !== true) {
      const scriptPath = path.resolve(String(args.script));
      console.log(`[capture] Running interaction script: ${scriptPath}`);
      const mod = await import(pathToFileURL(scriptPath).href);
      const fn = mod.default;
      if (typeof fn !== 'function') {
        throw new Error(`Interaction script ${scriptPath} must export a default async function.`);
      }
      await fn(page);
    } else {
      console.log(`[capture] Running default showcase (~${duration}s scroll)...`);
      await defaultShowcase(page, duration);
    }

    // --- Flush the video: close page + context -----------------------------
    console.log('[capture] Finalizing video...');
    await page.close();
    await context.close();
    context = null;
    await browser.close();
    browser = null;

    // --- Locate the produced .webm -----------------------------------------
    const webmPath = await findWebm(videoTmpDir);
    if (!webmPath) throw new Error(`No .webm produced in ${videoTmpDir}`);

    // --- Convert to gif or mp4 ---------------------------------------------
    // mp4 when --out ends in .mp4 (or --format mp4): best for dense motion/WebGL.
    const wantMp4 = /\.mp4$/i.test(outPath) || String(args.format || '').toLowerCase() === 'mp4';
    await fsp.mkdir(path.dirname(outPath), { recursive: true });
    if (wantMp4) {
      console.log(`[capture] Converting to MP4 via ffmpeg (fps=${fps}, width=${outWidth}, trim ${trimStart}s)...`);
      webmToMp4(ffmpeg, webmPath, outPath, { fps, width: outWidth, trimStart });
    } else {
      console.log(`[capture] Converting to GIF via ffmpeg (fps=${fps}, width=${outWidth}, trim ${trimStart}s)...`);
      webmToGif(ffmpeg, webmPath, outPath, { fps, width: outWidth, tmpDir: workTmpDir, trimStart });
    }

    // --- Report -------------------------------------------------------------
    const st = await fsp.stat(outPath);
    const kb = st.size / 1024;
    console.log(`\n[capture] Wrote ${outPath}`);
    console.log(`[capture] Size: ${kb.toFixed(1)} KB`);
    if (!wantMp4 && st.size > 5 * 1024 * 1024) {
      console.warn(
        '[capture] WARNING: GIF exceeds ~5 MB. Consider --mp4 (via .mp4 out), or lower --fps/--width/--duration.'
      );
    }
  } finally {
    // --- Robust cleanup: always run ----------------------------------------
    try {
      if (context) await context.close();
    } catch { /* ignore */ }
    try {
      if (browser) await browser.close();
    } catch { /* ignore */ }
    if (staticServer) {
      try {
        staticServer.close();
      } catch { /* ignore */ }
    }
    if (startChild) killTree(startChild);
    // Remove temp dirs (best effort).
    for (const d of [videoTmpDir, workTmpDir]) {
      if (d) {
        await fsp.rm(d, { recursive: true, force: true }).catch(() => {});
      }
    }
  }
}

main().catch((err) => {
  console.error(`\n[capture] FAILED: ${err?.stack || err?.message || err}\n`);
  process.exit(1);
});
