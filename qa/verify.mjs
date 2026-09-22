import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const html = readFileSync(resolve(dist, 'index.html'), 'utf8');
const css = readFileSync(resolve(dist, 'styles.css'), 'utf8');
const js = readFileSync(resolve(dist, 'app.js'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML IDs');
assert.equal([...html.matchAll(/<h1\b/g)].length, 1, 'One main heading');
const refs = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(m => m[1]);
for (const ref of refs) {
  if (ref.startsWith('#')) assert(ids.includes(ref.slice(1)), `Unresolved section: ${ref}`);
  else if (!/^(https?:|data:|mailto:|tel:)/.test(ref)) assert(existsSync(resolve(dist, ref.replace(/^\//, '').split('?')[0])), `Missing local file: ${ref}`);
  assert(!/^javascript:/.test(ref), 'No JavaScript navigation URLs');
}
for (const m of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) assert(existsSync(resolve(dist, m[1])), `Missing CSS asset: ${m[1]}`);
for (const image of html.matchAll(/<img\b[^>]*>/g)) {
  assert(/\balt="/.test(image[0]), 'Image needs alternate text');
  assert(/\bwidth="/.test(image[0]) && /\bheight="/.test(image[0]), 'Image needs dimensions');
}
assert(html.includes('action="/search/" method="get"'), 'Search stays on the new storefront');
assert(html.includes('name="q"'), 'Inventory query matches storefront contract');
assert(html.includes('for="inventory-query"'), 'Search has an associated label');
assert(html.includes('tel:2096994106') && html.includes('mailto:support@duelersguild.com'), 'Verified store contact actions');
assert(html.includes('104 W 11th Street') && html.includes('Tracy, CA 95376'), 'Verified address');
assert(!/\b(?:TODO|TBD|coming soon|STORE OWNER|No products found)\b/i.test(html), 'No unfinished content');
assert(!/transition\s*:\s*all/.test(css), 'No broad animation transitions');
assert(css.includes('prefers-reduced-motion:reduce'), 'Reduced motion is supported');
new Function(js);
const hosting = JSON.parse(readFileSync(resolve(root, '.openai/hosting.json'), 'utf8'));
assert.equal(hosting.static.directory, 'dist');
assert.equal(hosting.project_id, 'appgprj_6ab2034ea50c8191a4b4a511f17ae288');
console.log(JSON.stringify({passed:true,ids:ids.length,localAssetsChecked:true,gameCategories:[...html.matchAll(/class="game-entry\b/g)].length,externalDestinations:new Set(refs.filter(r=>r.startsWith('https:'))).size,javascriptSyntax:'valid',staticEntrypoint:'dist/index.html'},null,2));
