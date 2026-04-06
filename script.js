// ==========================
// FORMATO PRECIO COLOMBIA
// ==========================
function formatearPrecio(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0
  }).format(valor);
}

// ==========================
// PRODUCTOS (SOLO VISUAL)
// ==========================
const productos = [
  { id: 1, nombre: "Chocolate", categoria: "tradicional", img: "assets/chocolate.png" },
  { id: 2, nombre: "Coco (Beijinho)", categoria: "tradicional", img: "assets/coco.png" },
  { id: 3, nombre: "Fresa", categoria: "tradicional", img: "assets/fresa.png" },
  { id: 4, nombre: "Maní", categoria: "tradicional", img: "assets/mani.png" },
  { id: 5, nombre: "Limón", categoria: "especial", img: "assets/limon.png" },
  { id: 6, nombre: "Café", categoria: "especial", img: "assets/cafe.png" },
  { id: 7, nombre: "Leche Nido", categoria: "especial", img: "assets/lechenido.png" },
  { id: 8, nombre: "Ferrero", categoria: "especial", img: "assets/ferrero.png" },
  { id: 9, nombre: "Chocolate con coco", categoria: "especial", img: "assets/cocochocolate.png" },
  { id: 10, nombre: "Chocolate con Maní", categoria: "especial", img: "assets/chocomani.png" },
];

// ==========================
// CARRITO (SOLO CAJAS)
// ==========================
let carrito = [];

// ==========================
// RENDER SABORES (SIN COMPRA)
// ==========================
function renderProductos() {
  const contenedor = document.getElementById("productos");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  productos.forEach(prod => {
    const div = document.createElement("div");
    div.className = "sabor-card";

    div.innerHTML = `
      <div class="sabor-img-wrap">
        <img src="${prod.img}" alt="${prod.nombre}" onclick="abrirZoom('${prod.img}', '${prod.nombre}')">
      </div>
      <div class="sabor-info">
        <h3>${prod.nombre}</h3>
      </div>
    `;

    contenedor.appendChild(div);
  });
}


// ==========================
// AGREGAR CAJAS AL CARRITO
// ==========================
function agregarCaja(nombre, precio) {
  const item = carrito.find(p => p.nombre === nombre);

  if (item) {
    item.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }

  actualizarCarrito();
}

// ==========================
// ACTUALIZAR CARRITO
// ==========================
function actualizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalEl = document.getElementById("total");
  const contador = document.getElementById("cantidad-carrito");

  if (!lista) return;

  lista.innerHTML = "";

  let total = 0;
  let cantidadTotal = 0;

  carrito.forEach((item, index) => {
    total += item.precio * item.cantidad;
    cantidadTotal += item.cantidad;

    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${item.nombre}</strong><br>
      Cantidad: ${item.cantidad}<br>
      ${formatearPrecio(item.precio * item.cantidad)}<br>
      <button onclick="cambiarCantidad(${index}, 1)">+</button>
      <button onclick="cambiarCantidad(${index}, -1)">-</button>
      <button onclick="eliminarProducto(${index})">❌</button>
    `;

    lista.appendChild(li);
  });

  totalEl.textContent = formatearPrecio(total);
  contador.textContent = cantidadTotal;
}

// ==========================
// CAMBIAR CANTIDAD
// ==========================
function cambiarCantidad(index, cambio) {
  carrito[index].cantidad += cambio;

  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }

  actualizarCarrito();
}

// ==========================
// ELIMINAR PRODUCTO
// ==========================
function eliminarProducto(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

// ==========================
// VACIAR CARRITO
// ==========================
function vaciarCarrito() {
  if (carrito.length === 0) {
    alert("El carrito ya está vacío");
    return;
  }

  if (confirm("¿Vaciar carrito? 🧼")) {
    carrito = [];
    actualizarCarrito();
  }
}

// ==========================
// TOTAL
// ==========================
function totalDelCarrito() {
  let total = 0;
  carrito.forEach(item => {
    total += item.precio * item.cantidad;
  });
  return total;
}

// ==========================
// WHATSAPP COMPRA
// ==========================
function finalizarCompra() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  let mensaje = "Hola! Quiero pedir:\n\n";

  carrito.forEach(item => {
    mensaje += `- ${item.nombre} x${item.cantidad}\n`;
  });

  mensaje += `\nTotal: ${formatearPrecio(totalDelCarrito())}`;

  const url = `https://wa.me/573132306545?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

// ==========================
// PEDIR CAJAS DIRECTO
// ==========================
function pedirCaja(cantidad) {
  const mensaje = `Hola! Quiero una caja de ${cantidad} brigadeiros`;

  const url = `https://wa.me/573132306545?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

// ==========================
// INICIALIZACIÓN
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  renderProductos();
  actualizarCarrito();
  renderDuelo();
});

// ==========================
// SISTEMA ELO
// ==========================
let elo = {};

// Inicializar ELO
productos.forEach(p => {
  elo[p.id] = 1000;
});

// Obtener 2 productos aleatorios
function obtenerDuelo() {
  const copia = [...productos];
  copia.sort(() => 0.5 - Math.random());
  return [copia[0], copia[1]];
}

// Render duelo
function renderDuelo() {
  const contenedor = document.getElementById("duelo");
  if (!contenedor) return;

  const [p1, p2] = obtenerDuelo();

  contenedor.innerHTML = `
    <div class="duelo-card" onclick="votar(${p1.id}, ${p2.id})">
      <img src="${p1.img}">
      <h3>${p1.nombre}</h3>
    </div>

    <span class="vs">VS</span>

    <div class="duelo-card" onclick="votar(${p2.id}, ${p1.id})">
      <img src="${p2.img}">
      <h3>${p2.nombre}</h3>
    </div>
  `;
}

// ==========================
// VER RANKING
// ==========================
function verRanking() {
  const contenedor = document.getElementById("resultado-elo");

  const ordenados = [...productos].sort((a, b) => elo[b.id] - elo[a.id]);

  let html = `
    <div class="ranking-box">
      <h2 class="ranking-title">🏆 Top de Sabores</h2>
      <p class="ranking-sub">Los favoritos de nuestros clientes</p>
  `;

  ordenados.slice(0, 5).forEach((p, i) => {
    html += `
      <div class="ranking-item">
        <span class="ranking-pos">${i + 1}</span>
        <img src="${p.img}" class="ranking-img">
        <span class="ranking-nombre">${p.nombre}</span>
      </div>
    `;
  });

  html += `</div>`;

  contenedor.innerHTML = html;
}

// ==========================
// RECOMENDADOS
// ==========================
function verRecomendados() {
  const contenedor = document.getElementById("resultado-elo");

  const ordenados = [...productos].sort((a, b) => elo[b.id] - elo[a.id]);

  let html = `
    <div class="ranking-box">
      <h2 class="ranking-title">✨ Recomendados para ti</h2>
      <p class="ranking-sub">Basado en lo que más gusta</p>
  `;

  ordenados.slice(0, 3).forEach(p => {
    html += `
      <div class="ranking-item">
        <img src="${p.img}" class="ranking-img">
        <span class="ranking-nombre">${p.nombre}</span>
      </div>
    `;
  });

  html += `
      <p class="ranking-extra">💛 Estos sabores están enamorando a todos</p>
    </div>
  `;

  contenedor.innerHTML = html;
}

// Función ELO
function calcularElo(ganador, perdedor) {
  const k = 32;

  const probGanador = 1 / (1 + Math.pow(10, (elo[perdedor] - elo[ganador]) / 400));
  const probPerdedor = 1 / (1 + Math.pow(10, (elo[ganador] - elo[perdedor]) / 400));

  elo[ganador] = Math.round(elo[ganador] + k * (1 - probGanador));
  elo[perdedor] = Math.round(elo[perdedor] + k * (0 - probPerdedor));
}

// Votar
function votar(ganadorId, perdedorId) {
  calcularElo(ganadorId, perdedorId);
  renderDuelo();
}