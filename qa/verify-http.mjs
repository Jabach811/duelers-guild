import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const base=process.env.DG_PREVIEW_URL || 'http://127.0.0.1:4321';
const manifest=JSON.parse(readFileSync('docs/routes.json','utf8'));
let cursor=0;const failures=[];
await Promise.all(Array.from({length:8},async()=>{
  while(cursor<manifest.routes.length){
    const page=manifest.routes[cursor++];
    try{const r=await fetch(base+page.path,{signal:AbortSignal.timeout(20000)});const html=await r.text();if(!r.ok || !/<h1\b/.test(html) || /href="https?:\/\/(?:www\.)?duelersguild\.com/.test(html))failures.push({path:page.path,status:r.status});}
    catch(e){failures.push({path:page.path,error:e.name});}
  }
}));
assert.deepEqual(failures,[],'Generated routes must individually load on the local preview');
console.log(`PASS: individually requested all ${manifest.routes.length} generated routes; HTTP success, page content and no old-store navigation.`);
