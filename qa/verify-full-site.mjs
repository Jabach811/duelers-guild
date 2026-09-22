import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';
const dist = resolve('dist');
function walk(dir) { return readdirSync(dir,{withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(join(dir,e.name)) : [join(dir,e.name)]); }
const pages = walk(dist).filter(p => p.endsWith('.html'));
// Catches the actual regression: rendered destinations still leave the new store.
for (const file of pages) {
  const html = readFileSync(file,'utf8');
  for (const m of html.matchAll(/\b(?:href|action)="([^"]+)"/g)) assert(!/^https?:\/\/(?:www\.)?duelersguild\.com(?:\/|$)/i.test(m[1]), `Old-store handoff in ${file}: ${m[1]}`);
}
const expected = ['/shop/','/events/','/play/','/sell/','/deckbuilder/','/buylist/','/about/','/visit/','/contact/','/gallery/','/news/','/condition-guide/','/policies/','/terms/','/privacy/','/search/','/advanced-search/','/cart/','/checkout/','/account/','/account/register/','/account/reset-password/','/account/orders/','/wishlist/','/sitemap/'];
for (const path of expected) assert(existsSync(join(dist,path,'index.html')), `Missing complete-site destination: ${path}`);
const cache = new Map(pages.map(p=>[p,readFileSync(p,'utf8')]));
let checkedLinks = 0;
for (const [file,html] of cache) {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,`Duplicate IDs: ${file}`);
  assert.equal([...html.matchAll(/<h1\b/g)].length,1,`Missing or duplicate primary heading: ${file}`);
  const motionControls=[...html.matchAll(/<button\b[^>]*\bdata-motion-control\b[^>]*>/g)];
  assert.equal(motionControls.length,1,`Every generated page needs one motion control: ${file}`);
  assert(/\baria-label="[^"]+"/.test(motionControls[0][0]),`Motion control needs an accessible name: ${file}`);
  for (const m of html.matchAll(/\b(?:href|src|action)="([^"]+)"/g)) {
    if (/^(https?:|data:|tel:|mailto:)/.test(m[1])) continue;
    const url = new URL(m[1],'http://local/'+file.slice(dist.length+1).replaceAll('\\','/'));
    let target=join(dist,decodeURIComponent(url.pathname));
    if(!target.includes('.') || url.pathname.endsWith('/'))target=join(target,'index.html');
    assert(existsSync(target),`Unresolved destination from ${file}: ${m[1]}`);
    if(url.hash){const targetHtml=cache.get(target)||readFileSync(target,'utf8');assert(targetHtml.includes(`id="${url.hash.slice(1)}"`),`Unresolved anchor: ${m[1]}`);}
    checkedLinks++;
  }
  for(const image of html.matchAll(/<img\b[^>]*>/g)) assert(/\balt="/.test(image[0]) && /\bwidth="\d+"/.test(image[0]) && /\bheight="\d+"/.test(image[0]),`Image metadata: ${file}`);
}
const capture=JSON.parse(readFileSync('docs/source/public-capture.json','utf8'));
for(const c of capture.categories) assert(cache.has(join(dist,c.path,'index.html')),`Captured set missing: ${c.path}`);
for(const p of capture.products) assert(cache.has(join(dist,p.legacyPath,'index.html')) && cache.has(join(dist,'products',p.id,'index.html')),`Captured product missing: ${p.id}`);
for(const ref of capture.observedLinks || []){const path=decodeURIComponent(new URL(ref,'http://local').pathname);assert(existsSync(join(dist,path,'index.html')),`Observed original-store navigation missing locally: ${path}`);}
console.log(`PASS: ${pages.length} pages; ${checkedLinks} local references; all ${capture.categories.length} captured categories and ${capture.products.length} product records; no old-store handoffs.`);
