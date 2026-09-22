(function (root) {
  const api = {
    parseList(text) {
      return String(text).split(/\r?\n/).map(s => s.trim()).filter(Boolean).map(line => {
        const match = line.match(/^(-?\d+)\s*x?\s+(.+)$/i);
        const quantity = match ? Number(match[1]) : 1;
        return { quantity, name: match ? match[2].trim() : line, error: !Number.isInteger(quantity) || quantity < 1 || quantity > 999 };
      });
    },
    searchProducts(products, filters = {}) {
      const q = String(filters.q || '').trim().toLocaleLowerCase();
      const min = filters.min === '' || filters.min == null ? -Infinity : Number(filters.min);
      const max = filters.max === '' || filters.max == null ? Infinity : Number(filters.max);
      const result = products.filter(p => (!q || `${p.name} ${p.category}`.toLocaleLowerCase().includes(q)) && (p.price ?? -1) >= min && (p.price ?? Infinity) <= max && (!filters.category || String(p.categoryId) === String(filters.category)));
      if (filters.sort === 'price-asc') result.sort((a,b)=>(a.price ?? Infinity)-(b.price ?? Infinity));
      else if (filters.sort === 'price-desc') result.sort((a,b)=>(b.price ?? -1)-(a.price ?? -1));
      else result.sort((a,b)=>a.name.localeCompare(b.name));
      return result;
    },
    normalizeCart(lines, products) {
      const known = new Set(products.map(p=>String(p.id)));
      const sums = new Map();
      for (const line of Array.isArray(lines) ? lines : []) {
        if (!line || !known.has(String(line.id)) || !Number.isInteger(line.quantity) || line.quantity < 1) continue;
        sums.set(String(line.id), Math.min(99, (sums.get(String(line.id)) || 0) + line.quantity));
      }
      return [...sums].map(([id,quantity])=>({id,quantity}));
    },
    cartTotal(lines, products) { return Math.round(api.normalizeCart(lines,products).reduce((sum,l)=>sum+(products.find(p=>String(p.id)===l.id)?.price || 0)*l.quantity,0)*100)/100; },
    descends(id, ancestor, categories) {
      const seen = new Set();
      while (id != null && !seen.has(id)) {
        if (String(id) === String(ancestor)) return true;
        seen.add(id);
        id = categories.find(c=>String(c.id)===String(id))?.parent;
      }
      return false;
    }
  };
  if (typeof module !== 'undefined') module.exports = api;
  else root.GuildStore = api;
})(typeof window !== 'undefined' ? window : globalThis);
