import { createRequire } from 'node:module';
import { readdirSync, mkdirSync, copyFileSync } from 'node:fs';
import { resolve, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

// Mechanical optimization only. Preserve each untouched source image separately.
const [inputDirectory, sharpModule] = process.argv.slice(2);
if (!inputDirectory || !sharpModule) throw new Error('Provide the image directory and installed sharp module path.');
const sharp = createRequire(import.meta.url)(sharpModule);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const originals = resolve(root, 'source-assets/games');
const output = resolve(root, 'dist/assets/games');
mkdirSync(originals, { recursive: true });
mkdirSync(output, { recursive: true });
const allowed = new Set(['magic','pokemon','lorcana','onepiece','yugioh','riftbound','gundam','starwars','union','digimon','palworld','supplies','miniatures','paints']);
const results = [];
const overview = [];
const selected = new Map();
for (const filename of readdirSync(inputDirectory).sort()) {
  const slug = basename(filename, extname(filename));
  if (allowed.has(slug) && /\.(png|jpe?g|webp)$/i.test(filename)) selected.set(slug, filename);
}
for (const [slug, filename] of selected) {
  const source = resolve(inputDirectory, filename);
  const metadata = await sharp(source).metadata();
  if (!metadata.width || !metadata.height) throw new Error(`Invalid source image: ${slug}`);
  copyFileSync(source, resolve(originals, filename));
  const destination = resolve(output, `${slug}.webp`);
  const info = await sharp(source).rotate().resize(640, 640, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 85, effort: 6 }).toFile(destination);
  results.push({ slug, sourceWidth:metadata.width, sourceHeight:metadata.height, width:info.width, height:info.height, bytes:info.size });
  overview.push({ input:await sharp(destination).resize(320,240,{fit:'contain',background:'#ffffff'}).toBuffer(),left:(overview.length % 4)*320,top:Math.floor(overview.length / 4)*240 });
}
if (overview.length) await sharp({create:{width:1280,height:Math.ceil(overview.length / 4)*240,channels:3,background:'#edf1f7'}}).composite(overview).jpeg({quality:90}).toFile(resolve(inputDirectory,'overview.jpg'));
console.log(JSON.stringify({ images:results, overviewOrder:results.map(r=>r.slug), overviewPath:resolve(inputDirectory,'overview.jpg') }, null, 2));
