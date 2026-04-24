// ══════════════════════════════════════════════
//  SPORTY STYLE — Catálogo de productos
//  Imágenes: Unsplash (libres de derechos, sin API key)
// ══════════════════════════════════════════════

const PRODUCTS = [
  // ── CAMISETAS ──
  {
    id: 1,
    categoria: "camisetas",
    nombre: "Camiseta ProDry X1",
    descripcion: "Tecnología de secado rápido. Ideal para entrenamientos de alta intensidad.",
    precio: 19990,
    imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80"
  },
  {
    id: 2,
    categoria: "camisetas",
    nombre: "Camiseta AeroFit Negra",
    descripcion: "Corte ajustado con tela transpirable de cuatro vías. Máxima libertad de movimiento.",
    precio: 22990,
    imagen: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80"
  },
  {
    id: 3,
    categoria: "camisetas",
    nombre: "Camiseta Urban Sport",
    descripcion: "Estilo casual deportivo. Perfecta para el gym y el día a día.",
    precio: 17990,
    imagen: "https://images.pexels.com/photos/5698854/pexels-photo-5698854.jpeg?w=400"
  },

  // ── PANTALONES ──
  {
    id: 4,
    categoria: "pantalones",
    nombre: "Pantalón FlexRun Pro",
    descripcion: "Cintura ajustable y bolsillos con cierre. Para correr sin límites.",
    precio: 34990,
    imagen: "https://i.imgur.com/8mKxNvJ.jpeg"
  },
  {
    id: 5,
    categoria: "pantalones",
    nombre: "Legging PowerFit",
    descripcion: "Compresión media. Tejido anti-transparencia de alta durabilidad.",
    precio: 28990,
    imagen: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80"
  },
  {
    id: 6,
    categoria: "pantalones",
    nombre: "Pantalón TrailBlaze",
    descripcion: "Pantalón de trail running con forro interior. Tejido ligero y transpirable, ideal para largas distancias.",
    precio: 24990,
    imagen: "https://images.pexels.com/photos/3621185/pexels-photo-3621185.jpeg?w=400"
  },

  // ── ACCESORIOS ──
  {
    id: 7,
    categoria: "accesorios",
    nombre: "Gorro SportMesh",
    descripcion: "Gorro con panel de malla trasera. Ajuste perfecto con cierre velcro.",
    precio: 12990,
    imagen: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=80"
  },
  {
    id: 8,
    categoria: "accesorios",
    nombre: "Banda de Resistencia Pro",
    descripcion: "Set de bandas elásticas para entrenamiento. Resistencia progresiva, ideales para gym y casa.",
    precio: 15990,
    imagen: "https://images.pexels.com/photos/4162487/pexels-photo-4162487.jpeg?w=400"
  },
  {
    id: 9,
    categoria: "accesorios",
    nombre: "Botella HydraFlow 750ml",
    descripcion: "Botella de tritán sin BPA con marcas de medición. Tapa a presión.",
    precio: 9990,
    imagen: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80"
  }
];

// Formatea precios en pesos chilenos
function formatPrice(num) {
  return "$" + num.toLocaleString("es-CL");
}

// Renderiza las cards de productos en los grids del HTML
function renderProducts() {
  const categorias = {
    camisetas: document.getElementById("grid-camisetas"),
    pantalones: document.getElementById("grid-pantalones"),
    accesorios: document.getElementById("grid-accesorios")
  };

  PRODUCTS.forEach(p => {
    const grid = categorias[p.categoria];
    if (!grid) return;

    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" />
      <div class="product-info">
        <div class="product-name">${p.nombre}</div>
        <div class="product-desc">${p.descripcion}</div>
        <div class="product-price">${formatPrice(p.precio)}</div>
        <button class="add-btn" onclick="addToCart(${p.id})">
          + Agregar al carrito
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}
