const API = (() => {
  async function get(path) {
    try {
      const res = await fetch('/api' + path);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return null;
    }
  }

  // Map a raw API product (camelCase or PascalCase, different field names)
  // to the flat shape that all frontend code expects.
  function normalize(p) {
    if (!p) return null;
    // If it already has 'image' and 'stock' it's already a local PRODUCTS entry — return as-is
    if (p.image !== undefined && p.stock !== undefined) return p;
    return {
      id:      p.id      ?? p.Id      ?? 0,
      brand:   p.brand   ?? p.Brand   ?? '',
      name:    p.name    ?? p.Name    ?? '',
      price:   Number(p.price ?? p.Price ?? 0),
      stock:   p.stock   ?? p.stockQuantity ?? p.StockQuantity ?? 0,
      image:   p.image   ?? p.imageUrl ?? p.ImageUrl ?? '',
      desc:    p.desc    ?? p.shortDescription ?? p.ShortDescription ?? '',
      details: p.details ?? p.longDescription  ?? p.LongDescription  ?? '',
      screen:  p.screen  ?? p.Screen  ?? '',
      storage: p.storage ?? p.Storage ?? '',
      camera:  p.camera  ?? p.Camera  ?? '',
      battery: p.battery ?? p.Battery ?? '',
    };
  }

  // When the API is unavailable we fall back to the local PRODUCTS array.
  // getProduct by id must ALWAYS use the same source as listProducts so that
  // clicking "Shiko" on a card opens the correct product.
  let _source = null; // 'api' | 'local' — set on first listProducts call

  return {
    listProducts: async () => {
      const raw = await get('/products');
      if (raw) {
        _source = 'api';
        return raw.map(normalize);
      }
      _source = 'local';
      return PRODUCTS;
    },

    getProduct: async (id) => {
      if (_source === 'local') {
        // Source is local — find by id in the same array, never hit the API
        return PRODUCTS.find(p => p.id === +id) ?? null;
      }
      // Source is API (or unknown — default to API first)
      const raw = await get('/products/' + id);
      if (raw) return normalize(raw);
      // API call for single product failed — fall back to local
      return PRODUCTS.find(p => p.id === +id) ?? null;
    },

    getBrands: async () => (await get('/products/brands')) ?? BRANDS,

    createOrder: (body) => fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); }),
  };
})();
