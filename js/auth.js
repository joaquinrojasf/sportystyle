// ══════════════════════════════════════════════
//  SPORTY STYLE — Autenticación con Auth0
//
//  ⚠️  PASOS PARA CONFIGURAR AUTH0:
//  1. Ve a https://auth0.com y crea una cuenta gratuita
//  2. Crea una "Application" → tipo "Single Page App"
//  3. En Settings de tu app, copia:
//       - Domain   → reemplaza YOUR_AUTH0_DOMAIN
//       - Client ID → reemplaza YOUR_CLIENT_ID
//  4. En "Allowed Callback URLs" agrega: http://localhost:3000
//     (o el dominio donde alojes tu tienda)
//  5. En "Allowed Logout URLs" agrega lo mismo
//  6. Guarda cambios y ya está listo
// ══════════════════════════════════════════════

// ─── 🔧 REEMPLAZA ESTOS DOS VALORES ──────────────
const AUTH0_DOMAIN    = "dev-faplisotqwyfj7f5.us.auth0.com";   // Ej: dev-abc123.us.auth0.com
const AUTH0_CLIENT_ID = "1ZeGgMcnYcCP7RtdT6k1r4w1fjDHpI4G";            // Ej: GHabcXY123defZW
// ─────────────────────────────────────────────────

let auth0Client = null;

// Inicializa el cliente de Auth0
async function initAuth0() {
  try {
    auth0Client = await auth0.createAuth0Client({
      domain: AUTH0_DOMAIN,
      clientId: AUTH0_CLIENT_ID,
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    });

    // Si Auth0 redirigió de vuelta con un código, procesar el login
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
      await auth0Client.handleRedirectCallback();
      // Limpiar la URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    await updateAuthUI();
  } catch (error) {
    console.error("Error al inicializar Auth0:", error);
    // Si hay error de configuración, mostrar la UI sin autenticación
    showSection("auth-section");
    hideSection("user-section");
  }
}

// Actualiza la UI según el estado de autenticación
async function updateAuthUI() {
  try {
    const isAuthenticated = await auth0Client.isAuthenticated();

    if (isAuthenticated) {
      const user = await auth0Client.getUser();
      showSection("user-section");
      hideSection("auth-section");

      const name = user.name || user.email || "Cliente";
      document.getElementById("welcome-msg").textContent = `¡Hola, ${name}!`;
    } else {
      showSection("auth-section");
      hideSection("user-section");
    }
  } catch (err) {
    console.error("Error al verificar autenticación:", err);
  }
}

// Login: redirige a la página de Auth0
async function loginUser() {
  try {
    await auth0Client.loginWithRedirect();
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    showToast("Error al iniciar sesión. Verifica la configuración de Auth0.");
  }
}

// Logout: cierra sesión y limpia Session Storage
async function logoutUser() {
  try {
    // Limpiar el carrito de Session Storage al cerrar sesión
    clearCart();
    updateCartUI();

    await auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  } catch (err) {
    console.error("Error al cerrar sesión:", err);
  }
}

// Helpers de visibilidad
function showSection(id) { document.getElementById(id).style.display = "flex"; }
function hideSection(id) { document.getElementById(id).style.display = "none"; }
