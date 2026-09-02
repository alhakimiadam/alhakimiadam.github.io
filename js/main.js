// ==========================================
// CONFIGURACIÓN DE TU NEGOCIO
// ==========================================
// Escribe aquí tu número con código de país (sin el signo + ni espacios)
// Ejemplo para Venezuela: "584121234567" | Ejemplo para México: "5215512345678"
const NUMERO_WHATSAPP = "584120000000";

// ==========================================
// ESTADO DEL PEDIDO (CARRITO)
// ==========================================
let pedido = [];

// Elementos del DOM
const floatingCart = document.getElementById('floatingCart');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const whatsappCheckout = document.getElementById('whatsappCheckout');
const filterButtons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.menu-card');

// ==========================================
// FILTRO POR CATEGORÍAS (SIN RECARGAR)
// ==========================================
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Quitar activo a los demás
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const categoriaSeleccionada = btn.getAttribute('data-category');

    cards.forEach(card => {
      const cardCategoria = card.getAttribute('data-category');
      
      if (categoriaSeleccionada === 'todos' || cardCategoria === categoriaSeleccionada) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ==========================================
// AGREGAR AL PEDIDO Y ACTUALIZAR TOTALES
// ==========================================
function agregarAlPedido(nombre, precio) {
  // Buscar si ya existe el producto en el carrito
  const indexExistente = pedido.findIndex(item => item.nombre === nombre);

  if (indexExistente > -1) {
    pedido[indexExistente].cantidad += 1;
  } else {
    pedido.push({
      nombre: nombre,
      precio: precio,
      cantidad: 1
    });
  }

  actualizarInterfazCarrito();
}

function actualizarInterfazCarrito() {
  const totalArticulos = pedido.reduce((acc, item) => acc + item.cantidad, 0);
  const montoTotal = pedido.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  cartCount.textContent = totalArticulos;
  cartTotal.textContent = `$${montoTotal.toFixed(2)}`;

  // Mostrar el botón flotante si hay elementos
  if (totalArticulos > 0) {
    floatingCart.classList.add('visible');
  } else {
    floatingCart.classList.remove('visible');
  }

  // Generar el enlace dinámico a WhatsApp
  armarEnlaceWhatsApp(montoTotal);
}

// ==========================================
// CONSTRUCCIÓN DEL MENSAJE DE WHATSAPP
// ==========================================
function armarEnlaceWhatsApp(montoTotal) {
  let mensaje = "¡Hola, Rhino's Kitchen! 🦏🔥 Quiero hacer este pedido desde el menú web:\n\n";

  pedido.forEach(item => {
    const subtotal = (item.precio * item.cantidad).toFixed(2);
    mensaje += `▪ ${item.cantidad}x ${item.nombre} - $${subtotal}\n`;
  });

  mensaje += `\n💰 *Total Estimado:* $${montoTotal.toFixed(2)}`;
  mensaje += `\n📍 *Dirección o Mesa:* `;

  // Codificar el texto para URL
  const mensajeCodificado = encodeURIComponent(mensaje);
  whatsappCheckout.href = `https://wa.me/${NUMERO_WHATSAPP}?text=${mensajeCodificado}`;
}