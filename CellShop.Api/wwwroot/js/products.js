(() => {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const isHome     = !document.getElementById('searchInput');
  const searchEl   = document.getElementById('searchInput');
  const brandEl    = document.getElementById('brandSelect');
  const sortEl     = document.getElementById('sortSelect');
  const countEl    = document.getElementById('resultsCount');

  let allProducts = [];

  /* ---------- helpers ---------- */
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

  const fmt = v => new Intl.NumberFormat('sq-AL').format(v);

  function badge(p) {
    if (p.stock <= 0) return '<span class="product-badge out">Pa stok</span>';
    if (p.stock <= 3) return '<span class="product-badge low">Sasi e kufizuar</span>';
    return '';
  }

  /* ---------- render ---------- */
  function render(list) {
    if (countEl) countEl.textContent = `${list.length} produkte`;
    if (!list.length) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><h2>Asnjë produkt i gjetur</h2></div>';
      return;
    }
    grid.innerHTML = list.map(p => `
      <article class="product-card" data-id="${p.id}">
        <div class="product-media">
          ${badge(p)}
          <img src="${p.image}" alt="${esc(p.name)}" loading="lazy"
               onerror="this.onerror=null;this.src='images/placeholder.svg'">
        </div>
        <div class="product-body">
          <span class="product-brand">${esc(p.brand)}</span>
          <h3 class="product-name">${esc(p.name)}</h3>
          <p class="product-desc">${esc(p.desc)}</p>
          <div class="product-price">${fmt(p.price)} <span class="currency">€</span></div>
          <div class="product-actions">
            <button class="btn add" data-id="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>
              ${p.stock > 0 ? 'Shto në karrocë' : 'Pa stok'}
            </button>
            <button class="btn ghost small view" data-id="${p.id}">Shiko</button>
          </div>
        </div>
      </article>`).join('');
  }

  /* ---------- filter / sort ---------- */
  function applyFilters() {
    let list = [...allProducts];
    const q    = (searchEl?.value ?? '').trim().toLowerCase();
    const b    = brandEl?.value ?? '';
    const sort = sortEl?.value ?? 'price-asc';

    if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    if (b) list = list.filter(p => p.brand === b);

    list.sort((a, b) =>
      sort === 'price-desc' ? b.price - a.price :
      sort === 'name'       ? a.name.localeCompare(b.name) :
      a.price - b.price);

    if (isHome) list = list.slice(0, 6);
    render(list);
  }

  /* ---------- events ---------- */
  grid.addEventListener('click', async e => {
    const addBtn  = e.target.closest('.btn.add');
    const viewBtn = e.target.closest('.btn.view');

    if (addBtn) {
      const p = allProducts.find(x => x.id === +addBtn.dataset.id);
      if (!p) return;
      Cart.add({ id: p.id, name: p.name, price: p.price, imageUrl: p.image }, 1);
      addBtn.textContent = 'U shtua ✓';
      addBtn.disabled = true;
      setTimeout(() => { addBtn.textContent = 'Shto në karrocë'; addBtn.disabled = false; }, 1400);
      showToast(`${p.name} u shtua në karrocë`, 'success');
    }

    if (viewBtn) {
      const p = await API.getProduct(+viewBtn.dataset.id);
      if (p) openModal(p);
    }
  });

  searchEl?.addEventListener('input', () => applyFilters());
  brandEl?.addEventListener('change', applyFilters);
  sortEl?.addEventListener('change', applyFilters);

  /* ---------- modal ---------- */
  function openModal(p) {
    const backdrop = document.getElementById('modalBackdrop');
    if (!backdrop) return;
    backdrop.querySelector('.modal').innerHTML = `
      <button class="modal-close" aria-label="Mbyll">×</button>
      <div class="modal-media">
        <img src="${p.image}" alt="${esc(p.name)}"
             style="object-fit:contain;background:#f8f9ff;border-radius:16px;width:100%"
             onerror="this.onerror=null;this.src='images/placeholder.svg'">
      </div>
      <div class="modal-body">
        <span class="product-brand">${esc(p.brand)}</span>
        <h2>${esc(p.name)}</h2>
        <p style="color:var(--text-muted)">${esc(p.details)}</p>
        <ul class="spec-list">
          ${p.screen  ? `<li><span>📺 Ekrani</span><span>${esc(p.screen)}</span></li>`  : ''}
          ${p.storage ? `<li><span>💾 Memoria</span><span>${esc(p.storage)}</span></li>` : ''}
          ${p.camera  ? `<li><span>📷 Kamera</span><span>${esc(p.camera)}</span></li>`  : ''}
          ${p.battery ? `<li><span>🔋 Bateria</span><span>${esc(p.battery)}</span></li>` : ''}
          <li><span>📦 Stoku</span><span>${p.stock > 0 ? p.stock + ' copë' : 'Pa stok'}</span></li>
        </ul>
        <div class="product-price" style="font-size:2rem;padding:16px 0">
          ${fmt(p.price)} <span class="currency">€</span>
        </div>
        <button class="btn" id="modalAdd" style="width:100%" ${p.stock <= 0 ? 'disabled' : ''}>
          ${p.stock > 0 ? '🛒  Shto në karrocë' : 'Pa stok'}
        </button>
      </div>`;
    backdrop.classList.add('show');
    backdrop.querySelector('.modal-close').onclick = () => backdrop.classList.remove('show');
    backdrop.onclick = e => { if (e.target === backdrop) backdrop.classList.remove('show'); };
    backdrop.querySelector('#modalAdd')?.addEventListener('click', () => {
      Cart.add({ id: p.id, name: p.name, price: p.price, imageUrl: p.image }, 1);
      showToast(`${p.name} u shtua në karrocë`, 'success');
      backdrop.classList.remove('show');
    });
  }

  /* ---------- init ---------- */
  async function init() {
    grid.innerHTML = Array.from({ length: isHome ? 3 : 6 }, () => `
      <article class="product-card">
        <div class="product-media skeleton" style="aspect-ratio:1"></div>
        <div class="product-body">
          <div class="skeleton" style="height:14px;width:60px;margin-bottom:8px"></div>
          <div class="skeleton" style="height:20px;width:80%;margin-bottom:8px"></div>
          <div class="skeleton" style="height:14px;width:100%"></div>
        </div>
      </article>`).join('');

    [allProducts] = await Promise.all([API.listProducts()]);
    const brands  = await API.getBrands();

    if (brandEl) {
      brandEl.innerHTML = '<option value="">Të gjitha markat</option>' +
        brands.map(b => `<option value="${b}">${b}</option>`).join('');
    }
    applyFilters();
  }

  init();
})();
