import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
const sharp = createRequire(import.meta.url)(process.argv[2]);
const capture = JSON.parse(readFileSync('docs/source/public-capture.json','utf8'));
mkdirSync('source-assets/products',{recursive:true});
mkdirSync('dist/assets/products',{recursive:true});
let cursor=0;
const records=[];
const previous=existsSync('docs/product-images.json')?JSON.parse(readFileSync('docs/product-images.json','utf8')):[];
await Promise.all(Array.from({length:3},async()=>{
  while(cursor<capture.products.length) {
    const p=capture.products[cursor++];
    const saved=previous.find(r=>r.id===p.id);if(saved){records.push(saved);continue;}
    try {
      const r=await fetch(p.imageUrl,{signal:AbortSignal.timeout(20000)});
      if(!r.ok) throw new Error(`HTTP ${r.status}`);
      const raw=Buffer.from(await r.arrayBuffer());
      const metadata=await sharp(raw).metadata();
      writeFileSync(`source-assets/products/${p.id}.${metadata.format}`,raw);
      const output=await sharp(raw).resize({width:640,height:640,fit:'inside',withoutEnlargement:true}).webp({quality:85}).toBuffer({resolveWithObject:true});
      writeFileSync(`dist/assets/products/${p.id}.webp`,output.data);
      records.push({id:p.id,path:`/assets/products/${p.id}.webp`,width:output.info.width,height:output.info.height,sourcePage:`${capture.origin}${p.legacyPath}`,sourceImage:p.imageUrl,reuse:'Unconfirmed; private review only.'});
    } catch(e) {records.push({id:p.id,unavailable:e.message});}
  }
}));
writeFileSync('docs/product-images.json',JSON.stringify(records,null,2));
console.log(JSON.stringify({images:records.filter(r=>r.path).length,unavailable:records.filter(r=>!r.path)}));
