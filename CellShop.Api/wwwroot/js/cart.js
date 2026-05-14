/**
 * cart.js — shared cart state (localStorage) + UI utilities used on every page.
 * NOTE: the cart lives client-side; the server only knows about ORDERS (after checkout).
 * Trade-off: simpler (no auth), works offline. Downside: cart doesn't sync across devices.
 */
const Cart = (() => {
  const KEY = 'cellshop.cart.v1';

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  }
  function write(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    updateBadge();
    window.dispatchEvent(new CustomEvent('cart:changed'));
  }

  function add(product, quantity = 1) {
    const items = read();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        imageUrl: product.imageUrl,
        quantity,
      });
    }
    write(items);
  }

  function updateQuantity(id, quantity) {
    const items = read();
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (quantity <= 0) {
      const idx = items.indexOf(item);
      items.splice(idx, 1);
    } else {
      item.quantity = quantity;
    }
    write(items);
  }

  function remove(id) {
    write(read().filter(i => i.id !== id));
  }

  function clear() { write([]); }

  function total() {
    return read().reduce((s, i) => s + i.price * i.quantity, 0);
  }

  function count() {
    return read().reduce((s, i) => s + i.quantity, 0);
  }

  function updateBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const c = count();
    badges.forEach(b => {
      b.textContent = c;
      b.classList.toggle('hidden', c === 0);
    });
  }

  return { read, add, updateQuantity, remove, clear, total, count, updateBadge };
})();

/* ============== Toast ============== */
function showToast(message, type = 'success') {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span><span>${message}</span>`;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

/* ============== Mobile menu toggle ============== */
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
  const btn = document.querySelector('.menu-btn');
  const links = document.querySelector('.nav-links');
  if (btn && links) {
    btn.addEventListener('click', () => links.classList.toggle('show'));
  }
});

/* ============== Helpers ============== */
function formatPrice(value) {
  return new Intl.NumberFormat('sq-AL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function imgFallback(imgEl, brand = '') {
  // Fallback to a local SVG if the remote image fails
  imgEl.onerror = null;
  const map = {
    Apple: '/images/iphone-15.jpg',
    Samsung: '/images/samsung-galaxy-s22.jpg',
    Xiaomi: '/images/xiaomi-13.jpg',
  };
  imgEl.src = map[brand] || '/images/redmi-13c.jpg';
}
