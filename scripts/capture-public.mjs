import { writeFileSync, mkdirSync } from 'node:fs';
const origin = 'https://www.duelersguild.com';
const clean = s => (s || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const fetched = [];
async function get(path) {
  try {
    const response = await fetch(origin + path, { signal: AbortSignal.timeout(25000) });
    const html = await response.text();
    fetched.push({ path, status: response.status, capturedAt: new Date().toISOString() });
    return response.ok ? html : '';
  } catch (e) { fetched.push({ path, status: 'unavailable', error: e.name }); return ''; }
}
const root = await get('/');
const tree = JSON.parse(root.match(/<div id="async-category-tree-json"[^>]*>\s*([\s\S]*?)<\/div>/)?.[1] || '[]');
const categories = [];
function flatten(nodes) { for (const node of nodes) { categories.push({ id: node.id, parent: node.parent_id, name: clean(node.name), path: node.path }); flatten(node.children || []); } }
flatten(tree);
const products = new Map();
function collect(html, sourcePath) {
  for (const match of html.matchAll(/<li\b[^>]*class="product\b[^>]*>([\s\S]*?)<\/li>/g)) {
    const block = match[1];
    const nameBlock = block.match(/<h[34][^>]*itemprop="name"[^>]*>([\s\S]*?)<\/h[34]>/)?.[1] || block.match(/<h[34][^>]*class="item-name"[^>]*>([\s\S]*?)<\/h[34]>/)?.[1];
    const path = nameBlock?.match(/href="([^"]+)"/)?.[1];
    const name = clean(nameBlock);
    if (!path?.startsWith('/catalog/') || !name) continue;
    const id = path.split('/').at(-1);
    const category = clean(block.match(/<span class="category">([\s\S]*?)<\/span>/)?.[1]);
    const imageUrl = block.match(/<img[^>]*src="([^"]+)"/)?.[1];
    const priceText = clean(block.match(/<span[^>]*class="item-price"[^>]*>([\s\S]*?)<\/span>/)?.[1]);
    const price = Number(priceText.match(/\$([\d,]+\.\d{2})/)?.[1]?.replaceAll(',', '')) || null;
    const record = products.get(id) || { id, name, legacyPath: path, category, imageUrl, price, sourcePaths: [] };
    if (!record.sourcePaths.includes(sourcePath)) record.sourcePaths.push(sourcePath);
    products.set(id, record);
  }
}
collect(root, '/');
const corePaths = ['/about','/contact_us','/card_condition_guide','/store_policies','/terms_and_conditions','/photo_gallery','/news/list','/advanced_search','/user/login','/user/signup','/user/forgot_password','/checkout/cart','/checkout/proceed_to_checkout','/products/multi_search','/buylist/multi_search','/buy_orders/show','/catalog/t/tcg-promotion-page'];
const content = {};
const queue = [...corePaths, ...tree.map(c => c.path)];
let cursor = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < queue.length) {
    const path = queue[cursor++];
    const html = await get(path);
    if (corePaths.includes(path)) {
      const start = html.search(/<h1\b[^>]*>(?:Store Policies|Terms and Conditions|Card Condition Guide|Photo Gallery|Contact Us|About Us|Latest News)/i);
      content[path] = { links: [...new Set([...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]).filter(p => p.startsWith('/') && !p.startsWith('/files/')))], text: clean(start >= 0 ? html.slice(start, html.indexOf('<footer', start) > start ? html.indexOf('<footer', start) : start + 18000) : '').slice(0,16000) };
    }
    collect(html, path);
  }
}));
mkdirSync('docs/source', { recursive: true });
const capture = { origin, capturedAt: new Date().toISOString(), completeness: 'Complete public category tree; first-page product examples only, not a full inventory export or live availability.', categories, products: [...products.values()], core: content, fetched };
writeFileSync('docs/source/public-capture.json', JSON.stringify(capture, null, 2));
console.log(JSON.stringify({ categories: categories.length, roots: tree.length, products: products.size, reads: fetched.length, unavailable: fetched.filter(x => x.status !== 200) }));
