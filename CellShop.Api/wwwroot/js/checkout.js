/**
 * checkout.js — handles the checkout form, posts to /api/orders.
 */
(function () {
  const form = document.getElementById('checkoutForm');
  if (!form) return;

  function renderSummary() {
    const orderItemsEl = document.getElementById('orderItems');
    const orderTotalEl = document.getElementById('orderTotal');
    const submitBtn    = document.getElementById('submitOrderBtn');
    if (!orderItemsEl || !orderTotalEl) return;

    const items = Cart.read();
    if (!items.length) {
      orderItemsEl.innerHTML = '<p style="color:var(--text-muted)">Karroca është bosh.</p>';
      if (submitBtn) submitBtn.disabled = true;
      return;
    }
    if (submitBtn) submitBtn.disabled = false;

    orderItemsEl.innerHTML = items.map(i => `
      <div class="order-summary-item">
        <span>${escapeHtml(i.name)} × ${i.quantity}</span>
        <span>${formatPrice(i.price * i.quantity)} €</span>
      </div>
    `).join('');

    const subtotal = Cart.total();
    const shipping = subtotal >= 500 ? 0 : 10;
    const total    = subtotal + shipping;
    orderTotalEl.innerHTML = `
      <div class="order-summary-item"><span>Nëntotali</span><span>${formatPrice(subtotal)} €</span></div>
      <div class="order-summary-item"><span>Transporti</span><span>${shipping === 0 ? 'Falas' : formatPrice(shipping) + ' €'}</span></div>
      <div class="order-summary-item" style="font-size:1.1rem;font-weight:700;color:var(--primary)">
        <span>Totali</span><span>${formatPrice(total)} €</span>
      </div>`;
  }

  function validate() {
    let ok = true;
    form.querySelectorAll('.form-group').forEach(g => g.classList.remove('invalid'));

    const fields = [
      { id: 'customerName',    test: v => v.trim().length >= 2,                           msg: 'Emri është i shkurtër.' },
      { id: 'customerEmail',   test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),          msg: 'Email-i nuk është i vlefshëm.' },
      { id: 'customerPhone',   test: v => v.trim() === '' || /^[+\d\s\-()]{6,}$/.test(v), msg: 'Numri i telefonit nuk është i vlefshëm.' },
      { id: 'shippingAddress', test: v => v.trim().length >= 5,                           msg: 'Adresa është shumë e shkurtër.' },
    ];

    for (const f of fields) {
      const input = document.getElementById(f.id);
      if (!input) continue;
      if (!f.test(input.value)) {
        const group = input.closest('.form-group');
        if (group) {
          group.classList.add('invalid');
          const err = group.querySelector('.form-error');
          if (err) err.textContent = f.msg;
        }
        ok = false;
      }
    }
    return ok;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Ju lutem korrigjoni gabimet në formë.', 'error');
      return;
    }
    if (Cart.count() === 0) {
      showToast('Karroca është bosh.', 'error');
      return;
    }

    const submitBtn = document.getElementById('submitOrderBtn');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Duke dërguar...'; }

    const payload = {
      customerName:    document.getElementById('customerName').value.trim(),
      customerEmail:   document.getElementById('customerEmail').value.trim(),
      customerPhone:   document.getElementById('customerPhone').value.trim(),
      shippingAddress: document.getElementById('shippingAddress').value.trim(),
      items: Cart.read().map(i => ({ productId: i.id, quantity: i.quantity })),
    };

    try {
      const order = await API.createOrder(payload);
      Cart.clear();
      sessionStorage.setItem('lastOrderId', order.id);
      window.location.href = `success.html?id=${order.id}`;
    } catch (err) {
      showToast('Gabim gjatë dërgimit të porosisë. Provoni përsëri.', 'error');
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Konfirmo porosinë →'; }
    }
  });

  window.addEventListener('cart:changed', renderSummary);

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  renderSummary();
})();

/**
 * success.js — pulls order details for the confirmation page.
 */
(function () {
  const card = document.getElementById('successCard');
  if (!card) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || sessionStorage.getItem('lastOrderId');
  const orderIdEl      = card.querySelector('#orderId');
  const orderDetailsEl = card.querySelector('#orderDetails');

  if (!id) {
    if (orderIdEl) orderIdEl.textContent = '—';
    if (orderDetailsEl) orderDetailsEl.innerHTML = '<p>ID-ja e porosisë mungon.</p>';
    return;
  }

  if (orderIdEl) orderIdEl.textContent = `#${id}`;
  API.getOrder?.(id).then(order => {
    if (!orderDetailsEl) return;
    orderDetailsEl.innerHTML = `
      <p style="color:var(--text-muted)">Faleminderit, <strong>${escapeHtml(order.customerName)}</strong>!
      Porosia juaj u regjistrua. Do t'ju kontaktojmë në <strong>${escapeHtml(order.customerEmail)}</strong>.</p>
      <div style="margin:24px 0;padding:16px;background:var(--surface-alt);border-radius:var(--radius);text-align:left">
        ${order.items.map(i => `
          <div class="order-summary-item">
            <span>${escapeHtml(i.productName)} × ${i.quantity}</span>
            <span>${formatPrice(i.subtotal)} €</span>
          </div>`).join('')}
        <div class="order-summary-item" style="border-top:1px solid var(--border);margin-top:8px;padding-top:8px;font-weight:700">
          <span>Totali</span><span style="color:var(--primary)">${formatPrice(order.totalAmount)} €</span>
        </div>
      </div>`;
  }).catch(() => {
    if (orderDetailsEl) orderDetailsEl.innerHTML = '<p>Porosia u dërgua me sukses!</p>';
  });

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
})();
