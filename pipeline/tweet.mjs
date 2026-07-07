#!/usr/bin/env node
/**
 * tweet.mjs
 * ---------
 * Posts a prototype to X (Twitter) in a console-log style, with its GIF attached.
 * Reads OAuth 1.0a credentials from pipeline/.env (gitignored).
 *
 * Modes:
 *   --check                      Verify credentials only (calls /2/users/me), print handle, exit.
 *   --dry-run                    Compose + print the tweet text, do NOT post (no auth needed).
 *   --draft                      Compose the tweet + stage the GIF, write both to .tmp/ for manual
 *                                posting, do NOT hit the API.
 *   (default)                    Upload the GIF and post the tweet for real.
 *
 * Usage:
 *   node tweet.mjs --check
 *   node tweet.mjs --number 3 --title "Grain Explorer" \
 *     --description "A live WebGL grain field that reacts to your cursor." \
 *     --repo https://github.com/jannar18/grain-explorer \
 *     --gif .tmp/out.gif [--dry-run|--draft] [--pad 3] [--site https://jannar18.github.io/prototypes/]
 *
 * Dependency: twitter-api-v2 (installed in this pipeline package).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TwitterApi } from 'twitter-api-v2';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- tiny arg parser (matches publish.mjs style) ---------------------------
function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const tok = argv[i];
    if (!tok.startsWith('--')) continue;
    const key = tok.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) args[key] = true;
    else { args[key] = next; i++; }
  }
  return args;
}

function fail(msg) {
  console.error(`\n[tweet] ERROR: ${msg}\n`);
  process.exit(1);
}

// --- load pipeline/.env (no external dep) ----------------------------------
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return {};
  const out = {};
  for (const raw of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function requireCreds(env) {
  const need = ['X_API_KEY', 'X_API_SECRET', 'X_ACCESS_TOKEN', 'X_ACCESS_SECRET'];
  const missing = need.filter((k) => !env[k]);
  if (missing.length) {
    fail(
      `Missing credentials in pipeline/.env: ${missing.join(', ')}.\n` +
      `        Copy .env.example to .env and fill them in (see that file for the how-to).`
    );
  }
  return new TwitterApi({
    appKey: env.X_API_KEY,
    appSecret: env.X_API_SECRET,
    accessToken: env.X_ACCESS_TOKEN,
    accessSecret: env.X_ACCESS_SECRET,
  });
}

// --- compose the console-log-style tweet -----------------------------------
// Styles (pad=3 -> "001"):
//   clean (default):            console:                        full:
//   prototype 001 — Title       > prototype[001] Title          prototype 001 — Title
//   description                   ↳ description                  description
//   https://github.com/…          ↳ https://github.com/…         github.com/…
//                                                                jannar18.github.io/prototypes
//                                                                #tag1 #tag2
function composeText({ number, title, description, repo, pad, style, site, tags }) {
  const n = String(number).padStart(Number(pad) || 3, '0');
  const desc = description ? String(description).trim() : '';
  const r = repo ? String(repo).trim() : '';
  const s = site ? String(site).trim() : '';
  const tagList = tags
    ? String(tags).split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  if (style === 'console') {
    const lines = [`> prototype[${n}] ${title}`];
    if (desc) lines.push(`  ↳ ${desc}`);
    if (r) lines.push(`  ↳ ${r}`);
    return lines.join('\n');
  }
  if (style === 'hybrid') {
    // console terminal styling + full's site link & hashtags
    const strip = (u) => u.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const lines = [`> prototype[${n}] ${title}`];
    if (desc) lines.push(`  ↳ ${desc}`);
    if (r) lines.push(`  ↳ ${strip(r)}`);
    if (s) lines.push(`  ↳ ${strip(s)}`);
    if (tagList.length) lines.push(`  ${tagList.map((t) => `#${t.replace(/[^a-z0-9]/gi, '')}`).join(' ')}`);
    return lines.join('\n');
  }
  if (style === 'full') {
    const strip = (u) => u.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const lines = [`prototype ${n} — ${title}`];
    if (desc) lines.push(desc);
    if (r) lines.push(strip(r));
    if (s) lines.push(strip(s));
    if (tagList.length) lines.push(tagList.map((t) => `#${t.replace(/[^a-z0-9]/gi, '')}`).join(' '));
    return lines.join('\n');
  }
  // clean (default)
  const lines = [`prototype ${n} — ${title}`];
  if (desc) lines.push(desc);
  if (r) lines.push(r);
  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const env = loadEnv();

  // --- --check: verify auth only -----------------------------------------
  if (args.check) {
    const client = requireCreds(env);
    try {
      const me = await client.v2.me();
      console.log('\n[tweet] ✅ Auth OK.');
      console.log(`  posting as: @${me.data.username} (${me.data.name})`);
      console.log(`  user id:    ${me.data.id}`);
      console.log('  Ready to post. Try:  node tweet.mjs --number 1 --title "Test" \\');
      console.log('                 --description "hello" --repo <url> --gif .tmp/out.gif --dry-run');
    } catch (e) {
      fail(
        `Auth failed: ${e?.data?.detail || e?.message || e}.\n` +
        `        Double-check the 4 keys, and that the Access Token was generated AFTER\n` +
        `        setting the app to Read+Write permissions.`
      );
    }
    return;
  }

  // --- validate compose inputs -------------------------------------------
  if (!args.number || args.number === true) fail('--number <n> is required.');
  if (!args.title || args.title === true) fail('--title "<Title>" is required.');
  const text = composeText({
    number: args.number,
    title: String(args.title),
    description: args.description && args.description !== true ? String(args.description) : '',
    repo: args.repo && args.repo !== true ? String(args.repo) : '',
    pad: args.pad && args.pad !== true ? args.pad : 3,
    style: args.style && args.style !== true ? String(args.style) : 'hybrid',
    site: args.site && args.site !== true ? String(args.site) : '',
    tags: args.tags && args.tags !== true ? String(args.tags) : '',
  });

  if (text.length > 280) {
    console.warn(`[tweet] ⚠ composed text is ${text.length} chars (>280). It may be rejected.`);
  }

  // --- --dry-run: print and stop -----------------------------------------
  if (args['dry-run']) {
    console.log('\n[tweet] DRY RUN — would post:\n');
    console.log('----------------------------------------');
    console.log(text);
    console.log('----------------------------------------');
    console.log(`  chars: ${text.length}/280`);
    console.log(`  gif:   ${args.gif && args.gif !== true ? path.resolve(String(args.gif)) : '(none)'}`);
    return;
  }

  const gifPath = args.gif && args.gif !== true ? path.resolve(String(args.gif)) : '';
  if (gifPath && !fs.existsSync(gifPath)) fail(`GIF not found: ${gifPath}`);

  // --- --draft: stage for manual posting ---------------------------------
  if (args.draft) {
    const tmp = path.join(__dirname, '.tmp');
    fs.mkdirSync(tmp, { recursive: true });
    const stamp = `draft-prototype-${String(args.number).padStart(Number(args.pad) || 3, '0')}`;
    const txtOut = path.join(tmp, `${stamp}.txt`);
    fs.writeFileSync(txtOut, text + '\n', 'utf8');
    let gifOut = '';
    if (gifPath) {
      gifOut = path.join(tmp, `${stamp}.gif`);
      fs.copyFileSync(gifPath, gifOut);
    }
    console.log('\n[tweet] DRAFT staged (not posted):');
    console.log(`  text: ${txtOut}`);
    if (gifOut) console.log(`  gif:  ${gifOut}`);
    console.log('  → Post it manually on X, attaching that GIF.');
    return;
  }

  // --- real post ----------------------------------------------------------
  const client = requireCreds(env);
  let mediaId;
  if (gifPath) {
    console.log('[tweet] uploading GIF…');
    mediaId = await client.v1.uploadMedia(gifPath, { mimeType: 'image/gif' });
  }
  console.log('[tweet] posting…');
  const res = await client.v2.tweet(text, mediaId ? { media: { media_ids: [mediaId] } } : {});
  const id = res?.data?.id;
  let url = '(posted)';
  try {
    const me = await client.v2.me();
    url = `https://x.com/${me.data.username}/status/${id}`;
  } catch { /* handle unknown; still posted */ }
  console.log('\n[tweet] ✅ Posted.');
  console.log(`  tweet: ${url}`);
}

main().catch((err) => {
  console.error(`\n[tweet] FAILED: ${err?.data?.detail || err?.stack || err?.message || err}\n`);
  process.exit(1);
});
