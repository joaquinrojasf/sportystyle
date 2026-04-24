// ══════════════════════════════════════════════
//  SPORTY STYLE — Gestión del carrito con Session Storage
// ══════════════════════════════════════════════

const CART_KEY = "sportystyle_cart";

// ── Leer carrito desde Session Storage ──────────
function getCart() {
  try {
    const data = sessionStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// ── Guardar carrito en Session Storage ──────────
function saveCart(cart) {
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ── Agregar producto al carrito ──────────────────
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      qty: 1
    });
  }

  saveCart(cart);
  updateCartUI();
  showToast(`✓ ${product.nombre} agregado al carrito`);
}

// ── Cambiar cantidad de un ítem ──────────────────
function changeQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    const idx = cart.indexOf(item);
    cart.splice(idx, 1);
  }

  saveCart(cart);
  updateCartUI();
}

// ── Vaciar carrito ───────────────────────────────
function clearCart() {
  sessionStorage.removeItem(CART_KEY);
  updateCartUI();
}

// ── Calcular total ───────────────────────────────
function getTotal(cart) {
  return cart.reduce((sum, item) => sum + item.precio * item.qty, 0);
}

// ── Contar ítems ─────────────────────────────────
function getItemCount(cart) {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

// ── Actualizar la UI del carrito ─────────────────
function updateCartUI() {
  const cart = getCart();
  const total = getTotal(cart);
  const count = getItemCount(cart);

  // Badge del botón
  document.getElementById("cart-count").textContent = count;

  // Total
  document.getElementById("cart-total").textContent = formatPrice(total);

  // Lista de ítems
  const container = document.getElementById("cart-items");
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `<p class="empty-cart">Tu carrito está vacío 🛒</p>`;
    return;
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.nombre}</div>
        <div class="cart-item-price">${formatPrice(item.precio)}</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, +1)">+</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// ── Toggle panel carrito ─────────────────────────
function toggleCart() {
  const panel = document.getElementById("cart-panel");
  const overlay = document.getElementById("cart-overlay");
  panel.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
}

// ── Ir a checkout ────────────────────────────────
function goToCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast("⚠️ Agrega productos primero");
    return;
  }
  // Cerrar carrito y abrir modal
  document.getElementById("cart-panel").classList.add("hidden");
  document.getElementById("cart-overlay").classList.add("hidden");
  openCheckout();
}

// ── Toast ────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 2500);
}
