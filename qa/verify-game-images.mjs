import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const sharp = createRequire(import.meta.url)(process.argv[2]);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const images = JSON.parse(readFileSync(resolve(root, 'docs/game-images.json'), 'utf8'));
const html = readFileSync(resolve(root, 'dist/index.html'), 'utf8');
assert.equal(images.length, 14, 'All 14 categories have provenance records');
let bytes = 0;
for (const image of images) {
  const web = await sharp(resolve(root, image.web_path)).metadata();
  const tag = html.match(new RegExp(`<img[^>]+src="assets/games/${image.slug}\\.webp"[^>]*>`))?.[0];
  assert(tag, `Directory photo missing: ${image.slug}`);
  assert(Math.abs(web.width / web.height - image.width / image.height) < 0.02, `Photo proportions changed: ${image.slug}`);
  assert.equal(Number(tag.match(/width="(\d+)"/)?.[1]), web.width, `Image width does not match file: ${image.slug}`);
  assert.equal(Number(tag.match(/height="(\d+)"/)?.[1]), web.height, `Image height does not match file: ${image.slug}`);
  assert(tag.includes('loading="lazy"'), `Below-fold photo needs lazy loading: ${image.slug}`);
  assert(image.source_page_url.startsWith('https://') && image.image_url.startsWith('https://'), `Missing provenance: ${image.slug}`);
  bytes += readFileSync(resolve(root, image.web_path)).byteLength;
}
console.log(JSON.stringify({ passed:true, verifiedPhotos:images.length, proportionsPreserved:true, dimensionsMatch:true, webBytes:bytes }, null, 2));
