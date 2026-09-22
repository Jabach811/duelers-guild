import {readFileSync,writeFileSync} from 'node:fs';
const capture=JSON.parse(readFileSync('docs/source/public-capture.json','utf8'));
const r=await fetch(capture.origin+'/',{signal:AbortSignal.timeout(25000)});
if(!r.ok)throw new Error(`Public navigation unavailable: HTTP ${r.status}`);
const html=await r.text();
const clean=s=>(s||'').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const records=new Map(capture.products.map(p=>[p.id,p]));
for(const match of html.matchAll(/<li\b[^>]*class="product\b[^>]*>([\s\S]*?)<\/li>/g)){
  const block=match[1];const heading=block.match(/<h[34][^>]*class="item-name"[^>]*>([\s\S]*?)<\/h[34]>/)?.[1];
  const path=heading?.match(/href="([^"]+)"/)?.[1];if(!path?.startsWith('/catalog/'))continue;
  const id=path.split('/').at(-1);if(records.has(id))continue;
  const priceText=clean(block.match(/<span[^>]*class="item-price"[^>]*>([\s\S]*?)<\/span>/)?.[1]);
  records.set(id,{id,name:clean(heading),legacyPath:path,category:clean(block.match(/<span class="category">([\s\S]*?)<\/span>/)?.[1]),imageUrl:block.match(/<img[^>]*src="([^"]+)"/)?.[1],price:Number(priceText.match(/\$([\d,]+\.\d{2})/)?.[1]?.replaceAll(',',''))||null,sourcePaths:['/']});
}
capture.products=[...records.values()];
capture.observedLinks=[...new Set([...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1]).filter(p=>p.startsWith('/') && !p.startsWith('//') && !p.startsWith('/files/')))];
capture.buylistProducts=capture.observedLinks.filter(p=>/^\/buylist\/[^/]+\/[^/]+\/\d+$/.test(p)).map(path=>{
  const escaped=path.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const label=html.match(new RegExp(`<h[345][^>]*>[\\s\\S]*?<a href="${escaped}"[^>]*>([^<]+)</a>`))?.[1];
  return {path,name:clean(label)||path.split('/').at(-2).replaceAll('__',' - ').replaceAll('_',' '),id:path.split('/').at(-1)};
});
writeFileSync('docs/source/public-capture.json',JSON.stringify(capture,null,2));
console.log(JSON.stringify({navigationLinks:capture.observedLinks.length,buylistProductPages:capture.buylistProducts.length}));
