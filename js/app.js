// ══════════════════════════════════════════════
//  SPORTY STYLE — Lógica principal
//  Checkout, validación del formulario, confirmación
// ══════════════════════════════════════════════

// ── Inicializar aplicación ───────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  renderProducts();    // Renderiza el catálogo
  updateCartUI();      // Sincroniza el carrito con Session Storage
  await initAuth0();   // Inicializa Auth0
});

// ════════════════════════════════
//  MODAL CHECKOUT
// ════════════════════════════════

function openCheckout() {
  document.getElementById("checkout-modal").classList.remove("hidden");
  document.getElementById("modal-overlay").classList.remove("hidden");
  // Asegurarse de que el formulario esté visible y la confirmación oculta
  document.getElementById("checkout-form-section").classList.remove("hidden");
  document.getElementById("confirmation-section").classList.add("hidden");
}

function closeCheckout() {
  document.getElementById("checkout-modal").classList.add("hidden");
  document.getElementById("modal-overlay").classList.add("hidden");
  clearFormErrors();
}

// ════════════════════════════════
//  VALIDACIÓN DEL FORMULARIO
// ════════════════════════════════

function validateForm() {
  let valid = true;
  clearFormErrors();

  const nombre    = document.getElementById("f-nombre").value.trim();
  const direccion = document.getElementById("f-direccion").value.trim();
  const email     = document.getElementById("f-email").value.trim();
  const telefono  = document.getElementById("f-telefono").value.trim();

  // Nombre: al menos 3 caracteres
  if (nombre.length < 3) {
    setError("err-nombre", "f-nombre", "El nombre debe tener al menos 3 caracteres.");
    valid = false;
  }

  // Dirección: no vacía
  if (direccion.length < 5) {
    setError("err-direccion", "f-direccion", "Ingresa una dirección válida.");
    valid = false;
  }

  // Email: debe contener @ y un dominio válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    setError("err-email", "f-email", "Ingresa un correo válido (ej: usuario@gmail.com).");
    valid = false;
  }

  // Teléfono: solo números, entre 8 y 12 dígitos
  const telRegex = /^\d{8,12}$/;
  if (!telRegex.test(telefono)) {
    setError("err-telefono", "f-telefono", "Ingresa solo dígitos (8-12 números). Ej: 912345678");
    valid = false;
  }

  return valid;
}

function setError(spanId, inputId, msg) {
  document.getElementById(spanId).textContent = msg;
  document.getElementById(inputId).classList.add("invalid");
}

function clearFormErrors() {
  ["err-nombre","err-direccion","err-email","err-telefono"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  });
  ["f-nombre","f-direccion","f-email","f-telefono"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("invalid");
  });
}

// ════════════════════════════════
//  CONFIRMAR COMPRA
// ════════════════════════════════

function submitOrder() {
  if (!validateForm()) return;

  const cart  = getCart();
  const total = getTotal(cart);
  const nombre    = document.getElementById("f-nombre").value.trim();
  const direccion = document.getElementById("f-direccion").value.trim();
  const email     = document.getElementById("f-email").value.trim();

  // Construir resumen del pedido
  let itemsHtml = cart.map(item =>
    `<div>• ${item.nombre} × ${item.qty} — <strong>${formatPrice(item.precio * item.qty)}</strong></div>`
  ).join("");

  const summaryHtml = `
    <div><strong>Cliente:</strong> ${nombre}</div>
    <div><strong>Dirección:</strong> ${direccion}</div>
    <div><strong>Email:</strong> ${email}</div>
    <hr style="border-color:#444;margin:.5rem 0"/>
    ${itemsHtml}
    <hr style="border-color:#444;margin:.5rem 0"/>
    <div><strong>Total:</strong> <strong>${formatPrice(total)}</strong></div>
  `;

  document.getElementById("order-summary").innerHTML = summaryHtml;

  // Mostrar confirmación y ocultar formulario
  document.getElementById("checkout-form-section").classList.add("hidden");
  document.getElementById("confirmation-section").classList.remove("hidden");

  // Limpiar carrito de Session Storage al completar la compra
  clearCart();
  updateCartUI();
}

// ── Cerrar modal y resetear formulario ──────────
function closeAndReset() {
  // Limpiar campos del formulario
  ["f-nombre","f-direccion","f-email","f-telefono"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  clearFormErrors();

  // Ocultar modal
  closeCheckout();
}
