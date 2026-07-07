#!/usr/bin/env node
/**
 * publish.mjs
 * -----------
 * Registers a captured GIF as a new (or updated) work in the parallax portfolio
 * manifest (src/data/works.json), copies the GIF into public/lab/, commits, and
 * pushes (which triggers a Vercel redeploy).
 *
 * Usage:
 *   node publish.mjs --gif <path.gif> --title "<Title>" --description "<one sentence>"
 *      [--repo <url>] [--url <live-url>] [--project-dir <dir>] [--tags "a,b,c"]
 *      [--date YYYY-MM-DD] [--id prototype-NN] [--no-push]
 *
 * Dependencies: Node built-ins only.
 */

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Minimal argument parser (no external deps).
// --flag value  and  --flag (boolean, e.g. --no-push).
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const tok = argv[i];
    if (!tok.startsWith('--')) continue;
    const key = tok.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

function fail(msg) {
  console.error(`\n[publish] ERROR: ${msg}\n`);
  process.exit(1);
}

// Read pipeline/.env (gitignored) as a flat key/value map. Used for X_AUTOPOST.
function loadPipelineEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return {};
  const out = {};
  for (const raw of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[line.slice(0, eq).trim()] = val;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Normalize a git remote URL to https://github.com/owner/name form.
// Handles: git@github.com:owner/name.git  and  https://github.com/owner/name.git
// ---------------------------------------------------------------------------
function normalizeRepoUrl(raw) {
  let url = String(raw).trim();
  if (!url) return '';

  // SSH form: git@host:owner/name(.git)
  const sshMatch = url.match(/^git@([^:]+):(.+?)(?:\.git)?$/);
  if (sshMatch) {
    const host = sshMatch[1];
    const repoPath = sshMatch[2];
    return `https://${host}/${repoPath}`;
  }

  // ssh://git@host/owner/name(.git)
  const sshProto = url.match(/^ssh:\/\/git@([^/]+)\/(.+?)(?:\.git)?$/);
  if (sshProto) {
    return `https://${sshProto[1]}/${sshProto[2]}`;
  }

  // https / http form: strip trailing .git
  url = url.replace(/\.git$/, '');
  return url;
}

// ---------------------------------------------------------------------------
// Derive a repo URL from a project dir's git origin remote.
// Returns '' if it cannot be determined.
// ---------------------------------------------------------------------------
function repoFromProjectDir(dir) {
  try {
    const out = execFileSync('git', ['-C', dir, 'remote', 'get-url', 'origin'], {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    return normalizeRepoUrl(out);
  } catch {
    return '';
  }
}

// ---------------------------------------------------------------------------
// Zero-pad a number to 2 digits.
// ---------------------------------------------------------------------------
function pad2(n) {
  return String(n).padStart(2, '0');
}

// ---------------------------------------------------------------------------
// Main.
// ---------------------------------------------------------------------------
async function main() {
  const args = parseArgs(process.argv.slice(2));

  // --- Validate required options -----------------------------------------
  if (!args.gif || args.gif === true) fail('--gif <path.gif> is required.');
  if (!args.title || args.title === true) fail('--title "<Title>" is required.');
  if (!args.description || args.description === true) {
    fail('--description "<one sentence>" is required.');
  }

  const gifSrc = path.resolve(String(args.gif));
  if (!fs.existsSync(gifSrc)) fail(`GIF not found: ${gifSrc}`);

  // --- Resolve site paths -------------------------------------------------
  // __dirname = parallax/pipeline, so SITE = parallax repo root.
  const SITE = path.resolve(__dirname, '..');
  const manifestPath = path.join(SITE, 'src', 'data', 'works.json');
  const gifsDir = path.join(SITE, 'public', 'lab');

  // --- Load or default the manifest --------------------------------------
  const defaultManifest = { works: [] };
  let manifest = defaultManifest;
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(await fsp.readFile(manifestPath, 'utf8'));
    } catch (e) {
      fail(`Could not parse existing manifest ${manifestPath}: ${e.message}`);
    }
    if (!Array.isArray(manifest.works)) manifest.works = [];
  }

  // --- Resolve repo URL ---------------------------------------------------
  let repo = '';
  if (args.repo && args.repo !== true) {
    repo = normalizeRepoUrl(args.repo);
  } else if (args['project-dir'] && args['project-dir'] !== true) {
    repo = repoFromProjectDir(path.resolve(String(args['project-dir'])));
  }

  // --- Resolve optional live URL -----------------------------------------
  // Explicit --url wins; otherwise leave empty (preserved from existing entry below).
  const urlArg = args.url && args.url !== true ? String(args.url) : '';

  // --- Determine number / id / label (insert vs update) ------------------
  const requestedId = args.id && args.id !== true ? String(args.id) : null;
  let existingIndex = -1;
  if (requestedId) {
    existingIndex = manifest.works.findIndex((p) => p.id === requestedId);
  }

  let number;
  if (existingIndex !== -1) {
    // UPDATE in place: keep the existing number.
    number = manifest.works[existingIndex].number;
  } else {
    // New work: number = max(existing) + 1, starting at 1.
    const maxNum = manifest.works.reduce((m, p) => Math.max(m, p.number || 0), 0);
    number = maxNum + 1;
  }

  const id = `prototype-${pad2(number)}`;
  const label = `Prototype ${pad2(number)}`;

  // If an explicit --id was given but didn't match, warn that we computed our own.
  if (requestedId && existingIndex === -1 && requestedId !== id) {
    console.warn(
      `[publish] Note: --id ${requestedId} not found; creating new project as ${id}.`
    );
  }

  // --- Tags ---------------------------------------------------------------
  const tags =
    args.tags && args.tags !== true
      ? String(args.tags)
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

  // --- Date ---------------------------------------------------------------
  const date =
    args.date && args.date !== true
      ? String(args.date)
      : new Date().toISOString().slice(0, 10);

  // --- Copy the GIF into public/lab/<id>.gif -----------------------------
  await fsp.mkdir(gifsDir, { recursive: true });
  const gifWebPath = `/lab/${id}.gif`;           // web path stored in the manifest
  const gifDest = path.join(gifsDir, `${id}.gif`); // on-disk: parallax/public/lab/<id>.gif
  await fsp.copyFile(gifSrc, gifDest);

  // --- Preserve optional fields from an existing entry -------------------
  const existing = existingIndex !== -1 ? manifest.works[existingIndex] : null;
  // Live URL: explicit --url wins; else keep whatever the entry already had.
  const url = urlArg || (existing && existing.url) || '';
  // Screenshots are managed elsewhere (e.g. manual edits / other agents) — never clobber.
  const screenshots = existing && Array.isArray(existing.screenshots) ? existing.screenshots : [];

  // --- Build the work record ---------------------------------------------
  const work = {
    id,
    number,
    label,
    title: String(args.title),
    description: String(args.description),
    gif: gifWebPath,
    repo,
    url,
    date,
    tags,
    screenshots,
  };

  // --- Insert or replace --------------------------------------------------
  if (existingIndex !== -1) {
    manifest.works[existingIndex] = work;
  } else {
    manifest.works.push(work);
  }

  // Keep array sorted ascending by number (display sorts newest-first).
  manifest.works.sort((a, b) => (a.number || 0) - (b.number || 0));

  // --- Write manifest back (2-space indent + trailing newline) -----------
  await fsp.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  // --- Git: add + commit --------------------------------------------------
  const action = existingIndex !== -1 ? 'update' : 'add';
  const commitMsg = `content: ${action} ${label} — ${work.title}`;
  let committed = false;
  let pushed = false;
  let pushNote = '';

  try {
    execFileSync('git', ['-C', SITE, 'add', '-A'], { stdio: 'inherit' });
    execFileSync('git', ['-C', SITE, 'commit', '-m', commitMsg], { stdio: 'inherit' });
    committed = true;
  } catch (e) {
    // Commit can fail if there is nothing to commit; report and continue.
    console.warn(`[publish] git commit did not complete (nothing to commit?): ${e.message}`);
  }

  // --- Git: push (unless --no-push) --------------------------------------
  const noPush = args['no-push'] === true || args['no-push'] === 'true';
  if (!noPush && committed) {
    try {
      execFileSync('git', ['-C', SITE, 'push'], { stdio: 'inherit' });
      pushed = true;
    } catch (e) {
      pushNote =
        'Commit succeeded but push FAILED (no remote configured yet?). ' +
        'Add a remote / create the GitHub repo, then run `git -C ' +
        SITE +
        ' push` manually.';
      console.warn(`[publish] ${pushNote}`);
    }
  }

  // --- Optionally announce on X (Twitter) --------------------------------
  // A tweet/draft step NEVER fails the publish (the prototype is already live).
  //   Enable per-run:   --tweet
  //   Disable per-run:  --no-tweet    (overrides the default)
  //   Default on:       X_AUTOPOST=true in pipeline/.env
  //   Draft vs post:    DRAFT by default ($0 — stages text + GIF to .tmp/ for manual posting).
  //                     Real posting (~$0.20/post on X's paid API) happens only when
  //                     X_AUTOPOST=true in .env, or --tweet-post is passed for one run.
  //   Style/pad:        --tweet-style clean|console|full|hybrid (default hybrid), --tweet-pad 3
  const SITE_URL = 'https://parallax.haus/work/software';
  const tweetPad = args['tweet-pad'] && args['tweet-pad'] !== true ? String(args['tweet-pad']) : '3';
  const draftStamp = `draft-prototype-${String(number).padStart(Number(tweetPad) || 3, '0')}`;
  let tweeted = false;   // true if a real post went out
  let drafted = false;   // true if a draft was staged
  let tweetNote = '';
  const envForTweet = loadPipelineEnv();
  const autopost = String(envForTweet.X_AUTOPOST || '').toLowerCase() === 'true';
  const wantTweet =
    args['no-tweet'] === true ? false : args.tweet === true ? true : autopost;
  // Real post only when explicitly opted in; otherwise stage a $0 draft.
  const realPost = autopost || args['tweet-post'] === true;

  if (wantTweet && realPost && !pushed) {
    tweetNote = 'real post skipped — publish did not push (nothing live to announce yet).';
    console.warn(`[publish] ${tweetNote}`);
  } else if (wantTweet) {
    const tweetArgs = [
      path.join(__dirname, 'tweet.mjs'),
      '--number', String(number),
      '--title', work.title,
      '--description', work.description,
      '--style', args['tweet-style'] && args['tweet-style'] !== true ? String(args['tweet-style']) : 'hybrid',
      '--pad', tweetPad,
      '--site', SITE_URL,
    ];
    if (work.repo) tweetArgs.push('--repo', work.repo);
    if (gifDest) tweetArgs.push('--gif', gifDest);
    if (tags.length) tweetArgs.push('--tags', tags.join(','));
    if (!realPost) tweetArgs.push('--draft');
    try {
      execFileSync('node', tweetArgs, { stdio: 'inherit' });
      if (realPost) tweeted = true;
      else drafted = true;
    } catch (e) {
      tweetNote = `${realPost ? 'tweet' : 'draft'} step failed (publish is fine): ${e.message}`;
      console.warn(`[publish] ${tweetNote}`);
    }
  }

  // --- Summary ------------------------------------------------------------
  console.log('\n[publish] Done.');
  console.log(`  id:        ${id}`);
  console.log(`  label:     ${label}`);
  console.log(`  title:     ${work.title}`);
  console.log(`  gif:       ${gifWebPath}  ->  ${gifDest}`);
  console.log(`  repo:      ${repo || '(none)'}`);
  console.log(`  url:       ${url || '(none)'}`);
  console.log(`  date:      ${date}`);
  console.log(`  tags:      ${tags.length ? tags.join(', ') : '(none)'}`);
  console.log(`  manifest:  ${manifestPath} (${manifest.works.length} work(s))`);
  console.log(`  committed: ${committed ? 'yes' : 'no'}`);
  console.log(`  pushed:    ${pushed ? 'yes' : noPush ? 'skipped (--no-push)' : 'no'}`);
  const tweetStatus = tweeted
    ? 'posted (real tweet)'
    : drafted
    ? `draft staged -> ${path.join(__dirname, '.tmp', `${draftStamp}.txt`)} (+ .gif) — post it manually`
    : wantTweet
    ? `no (${tweetNote || 'see above'})`
    : 'skipped (not enabled — pass --tweet)';
  console.log(`  tweet:     ${tweetStatus}`);
}

main().catch((err) => {
  console.error(`\n[publish] FAILED: ${err?.stack || err?.message || err}\n`);
  process.exit(1);
});
