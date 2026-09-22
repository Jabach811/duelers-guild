import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {join,resolve} from 'node:path';
import assert from 'node:assert/strict';
const original=resolve('../Duelers Guild');
const read=p=>readFileSync(p,'utf8');
if(existsSync(original)){
  const before=JSON.parse(read(join(original,'docs/routes.json'))).routes.map(x=>x.path).sort();
  const after=JSON.parse(read('docs/routes.json')).routes.map(x=>x.path).sort();
  assert.deepEqual(after,before,'The redesign must retain every original route');
  for(const file of ['store-core.js','store.js','app.js','motion.js','catalog-data.json']) assert.equal(read('dist/'+file),read(join(original,'dist',file)),`Preserve existing behavior/data: ${file}`);
}
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);
const htmlFiles=walk('dist').filter(p=>p.endsWith('.html'));
for(const file of htmlFiles){
  const html=read(file);
  assert.equal((html.match(/href="\/brand\.css\?v=/g)||[]).length,1,`One brand stylesheet: ${file}`);
  assert.equal((html.match(/src="\/assets\/guild-mark\.png"/g)||[]).length,2,`Header and footer use new mark: ${file}`);
  assert(!html.includes('src="/assets/logo.png"'),`No old logo: ${file}`);
  assert(html.includes('aria-label="Player navigation"'),`Player shortcuts available: ${file}`);
  assert(html.includes('Product samples, not live stock. No orders or payments.'),`Preview scope stays accurate: ${file}`);
  assert(html.indexOf('/brand.css')>html.indexOf('/store.css'),`New skin loads after legacy layout: ${file}`);
}
const css=read('dist/brand.css');
for(const ref of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g))assert(existsSync(join('dist',ref[1])),`Missing font or CSS asset: ${ref[1]}`);
assert(css.includes('prefers-reduced-motion:reduce'));
assert(!/transition\s*:\s*all/.test(css));
console.log(`PASS: ${htmlFiles.length} pages carry the new identity; original routes, catalog data and functional scripts preserved.`);
