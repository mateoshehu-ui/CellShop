/**
 * cart-page.js — handles the dedicated /cart.html page.
 */
(function () {
  const list = document.getElementById('cartList');
  if (!list) return;

  const summary = document.getElementById('cartSummary');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const clearBtn = document.getElementById('clearCartBtn');

  function render() {
    const items = Cart.read();
    if (!items.length) {
      list.innerHTML = `
        <div class="empty-state">
          <h2>Karroca jote është bosh</h2>
          <p>Shfletoni dyqanin për të zgjedhur telefonin tuaj.</p>
          <a class="btn" href="products.html">Shiko produktet</a>
        </div>`;
      summary.style.display = 'none';
      return;
    }
    summary.style.display = '';

    list.innerHTML = items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${escapeAttr(item.imageUrl)}" alt="${escapeHtml(item.name)}"
             onerror="imgFallback(this)">
        <div class="cart-item-info">
          <h4>${escapeHtml(item.name)}</h4>
          <p>${formatPrice(item.price)} € / copë</p>
        </div>
        <div class="qty-control" role="group" aria-label="Sasia">
          <button class="qty-dec" aria-label="Pakëso">−</button>
          <span>${item.quantity}</span>
          <button class="qty-inc" aria-label="Shto">+</button>
        </div>
        <div class="cart-item-subtotal">${formatPrice(item.price * item.quantity)} €</div>
        <button class="remove-btn" aria-label="Fshi" title="Fshi">🗑️</button>
      </div>
    `).join('');

    // Summary
    const subtotal = Cart.total();
    const shipping = subtotal > 0 ? (subtotal >= 500 ? 0 : 10) : 0;
    const total = subtotal + shipping;
    summary.querySelector('#subtotal').textContent = `${formatPrice(subtotal)} €`;
    summary.querySelector('#shipping').textContent = shipping === 0 ? 'Falas' : `${formatPrice(shipping)} €`;
    summary.querySelector('#total').textContent = `${formatPrice(total)} €`;
  }

  list.addEventListener('click', (e) => {
    const row = e.target.closest('.cart-item');
    if (!row) return;
    const id = Number(row.dataset.id);
    const item = Cart.read().find(i => i.id === id);
    if (!item) return;

    if (e.target.closest('.qty-inc')) Cart.updateQuantity(id, item.quantity + 1);
    else if (e.target.closest('.qty-dec')) Cart.updateQuantity(id, item.quantity - 1);
    else if (e.target.closest('.remove-btn')) {
      Cart.remove(id);
      showToast(`${item.name} u hoq nga karroca`);
    }
  });

  clearBtn?.addEventListener('click', () => {
    if (Cart.count() === 0) return;
    if (confirm('Të fshijmë të gjitha produktet nga karroca?')) {
      Cart.clear();
      showToast('Karroca u zbraz');
    }
  });

  checkoutBtn?.addEventListener('click', () => {
    if (Cart.count() === 0) {
      showToast('Karroca është bosh', 'error');
      return;
    }
    window.location.href = 'checkout.html';
  });

  window.addEventListener('cart:changed', render);

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function escapeAttr(s) { return escapeHtml(s); }

  render();
})();
