/**
 * Fail CI / Vercel build if Vite did not produce a real production bundle.
 * Prevents deploying an empty or broken index.html.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const indexPath = path.join(dist, 'index.html');
const assetsDir = path.join(dist, 'assets');

function fail(msg) {
  console.error('[verify-dist]', msg);
  process.exit(1);
}

if (!fs.existsSync(dist)) fail('Missing dist/ — did vite build run?');
if (!fs.existsSync(indexPath)) fail('Missing dist/index.html');

const html = fs.readFileSync(indexPath, 'utf8');
if (html.length < 300) fail(`dist/index.html too small (${html.length} bytes) — build likely failed silently.`);

const hasBundle =
  /\/assets\/[^"'\s>]+\.(js|mjs)/i.test(html) ||
  (/assets\/[^"'\s>]+\.(js|mjs)/i.test(html) && (html.includes('type="module"') || html.includes("type='module'") || html.includes('type=module')));
if (!hasBundle) {
  fail('dist/index.html does not reference built JS under assets/ — vite build output invalid.');
}

if (!fs.existsSync(assetsDir)) fail('Missing dist/assets/ directory.');

const files = fs.readdirSync(assetsDir);
const js = files.filter((f) => f.endsWith('.js'));
const css = files.filter((f) => f.endsWith('.css'));
if (js.length === 0) fail('No .js files in dist/assets/ — JavaScript bundle missing.');
if (css.length === 0) console.warn('[verify-dist] warning: no .css in dist/assets (CSS may be inlined).');

console.log('[verify-dist] OK —', html.length, 'bytes index.html,', js.length, 'JS chunk(s),', css.length, 'CSS file(s).');
