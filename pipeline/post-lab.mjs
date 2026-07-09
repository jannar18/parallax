#!/usr/bin/env node
/**
 * post-lab.mjs
 * ------------
 * Batch-compose console-log tweets for portfolio works straight from the manifest
 * (src/data/works.json), so text / repo / tags always match the live site. Delegates
 * the actual composing + posting to tweet.mjs (auto-fits to 280, attaches the GIF).
 *
 * Which works: by default, the "prototype-NN" entries (id starts with "prototype-").
 *   --number 1,3        only these numbers
 *   --all               every work in the manifest
 *
 * What it does with them (mirrors tweet.mjs modes):
 *   --dry-run           print composed text only (default; no GIF/auth needed)
 *   --draft             stage text + GIF to pipeline/.tmp/ (no API)
 *   --post              REAL-post to X (needs the 4 keys in pipeline/.env; ~$0.20/post)
 *
 * GIFs: resolved as <gifdir>/<id>.gif. Default --gifdir is ../public/lab, but those are
 * MP4 on this site — point --gifdir at your prototypes GIF folder, e.g.:
 *   node post-lab.mjs --number 1 --post --gifdir ~/Dev/prototypes/gifs
 *   node post-lab.mjs --all --draft --gifdir ~/Dev/prototypes/gifs
 *
 * Site link + style match publish.mjs: --site https://parallax.haus/work/software, --style hybrid.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(__dirname, '..');
const MANIFEST = path.join(SITE, 'src', 'data', 'works.json');
const SITE_URL = 'https://parallax.haus/work/software';

function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (!t.startsWith('--')) continue;
    const k = t.slice(2), n = argv[i + 1];
    if (n === undefined || n.startsWith('--')) a[k] = true;
    else { a[k] = n; i++; }
  }
  return a;
}

function fail(m) { console.error(`\n[post-lab] ERROR: ${m}\n`); process.exit(1); }

const args = parseArgs(process.argv.slice(2));
if (!fs.existsSync(MANIFEST)) fail(`manifest not found: ${MANIFEST}`);
const works = (JSON.parse(fs.readFileSync(MANIFEST, 'utf8')).works || []).sort((a, b) => a.number - b.number);

// --- select works ----------------------------------------------------------
let selected;
if (args.all) {
  selected = works;
} else if (args.number && args.number !== true) {
  const want = new Set(String(args.number).split(',').map((s) => Number(s.trim())));
  selected = works.filter((w) => want.has(w.number));
} else {
  selected = works.filter((w) => String(w.id).startsWith('prototype-'));
}
if (!selected.length) fail('no matching works. Use --all or --number <n[,n...]>.');

// --- mode -------------------------------------------------------------------
const mode = args.post ? 'post' : args.draft ? 'draft' : 'dry-run';
const gifdir = args.gifdir && args.gifdir !== true
  ? path.resolve(String(args.gifdir))
  : path.join(SITE, 'public', 'lab');

console.log(`[post-lab] ${selected.length} work(s) · mode=${mode} · gifdir=${gifdir}\n`);

for (const w of selected) {
  const gif = path.join(gifdir, `${w.id}.gif`);
  const tweetArgs = [
    path.join(__dirname, 'tweet.mjs'),
    '--number', String(w.number),
    '--title', w.title,
    '--description', w.description || '',
    '--style', 'hybrid',
    '--pad', '3',
    '--site', SITE_URL,
  ];
  if (w.repo) tweetArgs.push('--repo', w.repo);
  if ((w.tags || []).length) tweetArgs.push('--tags', w.tags.join(','));
  if (fs.existsSync(gif)) tweetArgs.push('--gif', gif);
  else console.warn(`[post-lab] ⚠ no GIF at ${gif} — ${w.label} will post text-only.`);
  if (mode === 'draft') tweetArgs.push('--draft');
  else if (mode === 'dry-run') tweetArgs.push('--dry-run');

  console.log(`========== ${w.label} — ${w.title} ==========`);
  try {
    execFileSync('node', tweetArgs, { stdio: 'inherit' });
  } catch (e) {
    console.error(`[post-lab] ${w.label} failed: ${e.message} (continuing)`);
  }
  console.log();
}
