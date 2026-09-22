// Isolated local QA fixture: exercises the real motion script's media-query contract.
// Never packaged into dist, never changes operating-system/browser preferences.
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Reduced motion QA</title><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/motion.css"></head><body>
<header class="site-header"><div class="header-inner wrap"><h1 style="font-size:28px">Motion QA</h1><button class="motion-toggle" data-motion-control type="button" aria-label="Pause motion" hidden><span>Pause motion</span></button></div></header>
<main><div class="wrap" style="padding:24px 0"><p>Local QA only. This simulates the device preference for the real Guild motion script, without changing your actual device settings.</p><label><input type="checkbox" id="device-motion" checked> Use device reduced motion</label></div>
<section class="hero" style="min-height:280px;height:280px"><div class="hero-copy wrap" style="min-height:280px;padding:24px"><p class="location-line">Content stays readable</p></div><div class="hero-visual"><div class="hero-image-frame"><img class="hero-image" src="/assets/tabletop.webp" alt="Guild tabletop illustration" width="1536" height="1024"></div></div></section>
<div class="game-ribbon"><div class="wrap"><span>Magic: The Gathering</span><span>Pokémon</span><span>Disney Lorcana</span><span>One Piece</span><span>Tabletop</span></div></div><div class="wrap page-heading"><h2>Visible with motion off</h2></div></main>
<script>
const originalMedia = window.matchMedia.bind(window);
const input = document.querySelector('#device-motion');
const listeners = new Set();
const preference = {get matches(){return input.checked;},media:'(prefers-reduced-motion: reduce)',onchange:null,addEventListener(type,fn){if(type==='change')listeners.add(fn);},removeEventListener(type,fn){if(type==='change')listeners.delete(fn);},addListener(fn){listeners.add(fn);},removeListener(fn){listeners.delete(fn);}};
window.matchMedia = query => query.includes('prefers-reduced-motion') ? preference : originalMedia(query);
input.addEventListener('change',()=>listeners.forEach(fn=>fn({matches:input.checked,media:preference.media})));
</script><script src="/motion.js" defer></script></body></html>`;
const allowed = new Set(['/motion.js','/motion.css','/styles.css','/assets/tabletop.webp','/assets/fonts/barlow-600.ttf','/assets/fonts/barlow-700.ttf','/assets/fonts/dm-400.ttf','/assets/fonts/dm-500.ttf','/assets/fonts/dm-600.ttf']);
createServer((request,response)=>{
  const path = new URL(request.url,'http://127.0.0.1:4318').pathname;
  if(path === '/') {response.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});response.end(page);return;}
  if(!allowed.has(path)){response.writeHead(404);response.end();return;}
  const type = path.endsWith('.js') ? 'application/javascript' : path.endsWith('.css') ? 'text/css' : path.endsWith('.webp') ? 'image/webp' : 'font/ttf';
  response.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'});response.end(readFileSync('dist'+path));
}).listen(4318,'127.0.0.1',()=>console.log('Reduced motion QA: http://127.0.0.1:4318/'));
