# 📄 SportyStyle — Documentación del Proyecto
**Asignatura:** Taller de Plataformas Web  
**Unidad:** 2 – Programación Segura  
**Actividad:** Práctica Sumativa Semana 6  

---

## 📁 Estructura del Proyecto

```
sportystyle/
├── index.html          ← Estructura principal de la tienda
├── css/
│   └── styles.css      ← Estilos visuales de la tienda
├── js/
│   ├── products.js     ← Catálogo y renderizado de productos
│   ├── cart.js         ← Gestión del carrito con Session Storage
│   ├── auth.js         ← Autenticación con Auth0
│   └── app.js          ← Lógica principal, checkout y validación
└── README.md           ← Este documento
```

---

## 1. 🔐 Flujo de Autenticación con Auth0

### ¿Qué es Auth0?
Auth0 es una plataforma de autenticación como servicio (Authentication-as-a-Service) que permite implementar inicio de sesión seguro sin gestionar contraseñas directamente. Usa el protocolo estándar **OAuth 2.0 / OpenID Connect**.

### Flujo de autenticación paso a paso

```
Usuario              Tienda (SPA)           Auth0
  │                      │                    │
  │── clic "Login" ──►   │                    │
  │                      │── loginWithRedirect►│
  │                      │                    │
  │◄═════════════ redirige a Auth0 ══════════►│
  │                  (el usuario ingresa        │
  │                   email y contraseña)       │
  │                                            │
  │◄═════ Auth0 redirige de vuelta con ?code= ═│
  │                      │                    │
  │                      │── handleRedirectCallback()
  │                      │   (intercambia code por tokens)
  │                      │                    │
  │                      │── getUser() ──────►│
  │◄── "¡Hola, [Nombre]!" │                    │
```

### Implementación en el código (`auth.js`)

```javascript
// 1. Inicialización del cliente
auth0Client = await auth0.createAuth0Client({
  domain: "TU_DOMINIO.auth0.com",
  clientId: "TU_CLIENT_ID",
  authorizationParams: { redirect_uri: window.location.origin }
});

// 2. Login: redirige al formulario de Auth0
await auth0Client.loginWithRedirect();

// 3. Al volver, procesa el callback
await auth0Client.handleRedirectCallback();

// 4. Obtener datos del usuario
const user = await auth0Client.getUser();
// user.name, user.email, user.picture, etc.

// 5. Logout: cierra sesión en Auth0 y limpia Session Storage
await auth0Client.logout({ logoutParams: { returnTo: window.location.origin } });
```

### Gestión de tokens
El SDK de Auth0 SPA (`auth0-spa-js`) gestiona automáticamente:
- La emisión y renovación de tokens JWT.
- El almacenamiento seguro de los tokens en memoria.
- La validación de la firma y expiración del token.

No es necesario decodificar ni validar manualmente el JWT. Auth0 se encarga de todo esto internamente.

---

## 2. 🛒 Proceso de Selección de Productos

### Catálogo de productos (`products.js`)
Los productos están definidos en un array `PRODUCTS` con las propiedades:

| Propiedad    | Descripción                          |
|-------------|--------------------------------------|
| `id`        | Identificador único del producto     |
| `categoria` | `camisetas`, `pantalones`, `accesorios` |
| `nombre`    | Nombre del producto                  |
| `descripcion` | Descripción breve                  |
| `precio`    | Precio en pesos chilenos (número)    |
| `imagen`    | URL de la imagen del producto        |

La función `renderProducts()` genera dinámicamente las tarjetas de producto en el HTML y las inserta en los grids de cada categoría.

### Flujo de selección y carrito

```
Usuario ve tarjeta  →  clic "Agregar al carrito"
        │
        ▼
addToCart(productId)     [cart.js]
   │
   ├─ Busca producto en PRODUCTS[]
   ├─ Llama getCart() → lee sessionStorage
   ├─ Si el producto ya existe → aumenta qty
   ├─ Si no existe → agrega nuevo ítem
   └─ Llama saveCart() → guarda en sessionStorage
        │
        ▼
updateCartUI()   → actualiza badge, lista y total en pantalla
```

---

## 3. 🛡️ Protección de la Sesión con Session Storage

### ¿Qué es Session Storage?
`sessionStorage` es un mecanismo de almacenamiento del navegador que persiste los datos **solo durante la pestaña o ventana activa**. Al cerrar la pestaña o el navegador, los datos se eliminan automáticamente.

### Cómo se usa en el proyecto

#### Guardar productos en el carrito:
```javascript
function saveCart(cart) {
  sessionStorage.setItem("sportystyle_cart", JSON.stringify(cart));
}
```

#### Leer el carrito:
```javascript
function getCart() {
  const data = sessionStorage.getItem("sportystyle_cart");
  return data ? JSON.parse(data) : [];
}
```

#### Eliminar el carrito al cerrar sesión:
```javascript
// En auth.js, dentro de logoutUser():
clearCart();  // → sessionStorage.removeItem("sportystyle_cart")
await auth0Client.logout(...);
```

#### Eliminar el carrito al completar la compra:
```javascript
// En app.js, dentro de submitOrder():
clearCart();  // limpia Session Storage al confirmar la compra
updateCartUI();
```

### Ciclo de vida de los datos

```
Abrir tienda
     │
     ▼
Iniciar sesión con Auth0 ──────────────────────┐
     │                                          │
     ▼                                          │
Agregar productos → datos en sessionStorage     │
     │                                          │
     ▼                                          │
Navegar entre secciones → datos persisten       │
     │                                          │
     ├─ Completar compra → clearCart()          │
     │                                          │
     └─ Cerrar sesión → clearCart() + logout ◄─┘
     │
     ▼
Cerrar pestaña → sessionStorage se elimina automáticamente
```

### Ventaja de Session Storage vs Local Storage

| Característica        | Session Storage          | Local Storage            |
|-----------------------|--------------------------|--------------------------|
| Duración              | Solo la pestaña activa   | Permanente               |
| Alcance               | Una sola pestaña         | Todas las pestañas       |
| Seguridad para carrito | ✅ Ideal                 | ⚠️ Datos persisten       |
| Tamaño máximo         | ~5 MB                    | ~5-10 MB                 |

`Session Storage` es más apropiado para un carrito de compras porque garantiza que al cerrar la sesión o el navegador, los datos del usuario no queden expuestos en el dispositivo.

---

## ⚙️ Configuración de Auth0

Para que el login funcione, sigue estos pasos:

1. Crea una cuenta en [https://auth0.com](https://auth0.com) (plan gratuito disponible).
2. Ve a **Applications → Create Application → Single Page Application**.
3. Copia tu **Domain** y **Client ID** desde la pestaña *Settings*.
4. En *Allowed Callback URLs* y *Allowed Logout URLs*, agrega la URL donde abres tu proyecto (ej: `http://localhost:5500` o `http://127.0.0.1:5500` si usas Live Server en VS Code).
5. Abre `js/auth.js` y reemplaza:
   ```javascript
   const AUTH0_DOMAIN    = "TU_DOMINIO.auth0.com";
   const AUTH0_CLIENT_ID = "TU_CLIENT_ID";
   ```

---

## 🚀 Cómo ejecutar el proyecto

1. Abre la carpeta del proyecto en **VS Code**.
2. Instala la extensión **Live Server**.
3. Haz clic derecho en `index.html` → **Open with Live Server**.
4. El proyecto se abrirá en `http://127.0.0.1:5500`.

> ⚠️ No abras `index.html` directamente con doble clic (protocolo `file://`) porque Auth0 requiere un servidor HTTP real para las redirecciones.

---

*Proyecto desarrollado para la asignatura Taller de Plataformas Web – AIEP.*
