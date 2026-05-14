/**
 * Optional post-build check (run: npm run build:verify).
 * Ensures dist/ contains real JS bundles and index.html references them.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const indexPath = path.join(dist, 'index.html');

function fail(msg) {
  console.error('[verify-dist]', msg);
  process.exit(1);
}

function walkJsFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkJsFiles(p, acc);
    else if (ent.isFile() && ent.name.endsWith('.js')) acc.push(p);
  }
  return acc;
}

if (!fs.existsSync(dist)) fail('Missing dist/ — run vite build first.');
if (!fs.existsSync(indexPath)) fail('Missing dist/index.html');

const html = fs.readFileSync(indexPath, 'utf8');
if (html.length < 80) fail(`dist/index.html too small (${html.length} bytes).`);

const jsFiles = walkJsFiles(dist);
if (jsFiles.length === 0) fail('No .js files found under dist/.');

const basenames = jsFiles.map((p) => path.basename(p));
const linked = basenames.some((b) => html.includes(b));
const hasAssetsPath = /["'](\.\/)?assets\/[^"']+\.js/.test(html) || html.includes('/assets/');
if (!linked && !hasAssetsPath) {
  fail('dist/index.html does not appear to reference emitted JS (no basename match, no assets/ path).');
}

console.log('[verify-dist] OK —', html.length, 'bytes index.html,', jsFiles.length, 'JS file(s) under dist/.');
