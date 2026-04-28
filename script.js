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
// CARRITO
// ==========================
let carrito = [];
let metodoPagoSeleccionado = "Nequi";

// ==========================
// RENDER SABORES
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
        <img src="${prod.img}" alt="${prod.nombre}">
      </div>
      <div class="sabor-info">
        <h3>${prod.nombre}</h3>
      </div>
    `;

    contenedor.appendChild(div);
  });
}

// ==========================
// AGREGAR CAJAS ✅ (LO QUE FALTABA)
// ==========================
function agregarCaja(nombre, precio) {
  const item = carrito.find(p => p.nombre === nombre);

  if (item) {
    item.cantidad++;
  } else {
    carrito.push({
      nombre,
      precio,
      cantidad: 1
    });
  }

  mostrarFeedback(nombre);
  actualizarCarrito();
}

// ==========================
// FEEDBACK
// ==========================
function mostrarFeedback(nombre) {
  const aviso = document.createElement("div");
  aviso.className = "toast";
  aviso.textContent = `✔ ${nombre} agregado`;

  document.body.appendChild(aviso);

  setTimeout(() => {
    aviso.classList.add("show");
  }, 10);

  setTimeout(() => {
    aviso.remove();
  }, 2000);
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
// RESTO IGUAL (NO TOCADO)
// ==========================
function cambiarCantidad(index, cambio) {
  carrito[index].cantidad += cambio;

  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }

  actualizarCarrito();
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

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

function totalDelCarrito() {
  let total = 0;
  carrito.forEach(item => {
    total += item.precio * item.cantidad;
  });
  return total;
}

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
  mensaje += `\nMétodo de pago: ${metodoPagoSeleccionado}`;

  const url = `https://wa.me/573132306545?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

function toggleCarrito() {
  const sidebar = document.getElementById("sidebar-carrito");
  sidebar.classList.toggle("open");
}

function seleccionarPago(btn) {
  document.querySelectorAll(".pago-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  metodoPagoSeleccionado = btn.textContent.trim();
}

document.addEventListener("DOMContentLoaded", () => {
  renderProductos();
  actualizarCarrito();
});
