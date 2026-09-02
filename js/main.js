// ==========================================================================
// RHINO'S KITCHEN - SISTEMA DE PEDIDOS & INTERACTIVIDAD
// ==========================================================================

// 1. CONFIGURACIÓN DEL RESTAURANTE
// Coloca aquí tu número de WhatsApp real con código de país (sin el + ni espacios)
const NUMERO_WHATSAPP = "584129967079";

// 2. ESTADO DEL CARRITO
let pedido = [];

// 3. REFERENCIAS AL DOM
let floatingCart, cartCount, cartTotal, whatsappCheckout;

// ==========================================================================
// INICIALIZACIÓN Y FILTRO POR CATEGORÍAS
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  floatingCart = document.getElementById("floatingCart");
  cartCount = document.getElementById("cartCount");
  cartTotal = document.getElementById("cartTotal");
  whatsappCheckout = document.getElementById("whatsappCheckout");

  const filterButtons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".menu-card");

  // Lista de categorías que NO deben verse en "Todos" porque están en preparación
  const categoriasProximas = ["alitas", "sushi", "ensaladas", "extras"];

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Si la categoría dice próximamente, muestra aviso y no filtra en blanco
      if (btn.classList.contains("btn-disabled")) {
        mostrarNotificacion("⏳ Esta sección estará disponible muy pronto");
        return;
      }

      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const categoriaSeleccionada = btn.getAttribute("data-category");

      cards.forEach((card) => {
        const cardCategoria = card.getAttribute("data-category");

        if (categoriaSeleccionada === "todos") {
          // En "todos" ocultamos lo que es "Próximamente"
          if (categoriasProximas.includes(cardCategoria)) {
            card.style.display = "none";
          } else {
            card.style.display = "flex";
          }
        } else if (cardCategoria === categoriaSeleccionada) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Ocultar productos de 'próximamente' al cargar la página por primera vez
  const btnTodos = document.querySelector('.filter-btn[data-category="todos"]');
  if (btnTodos) {
    btnTodos.click();
  }
});

// ==========================================================================
// GESTIÓN DEL PEDIDO: AGREGAR, CALCULAR Y VACIAR
// ==========================================================================
function agregarAlPedido(nombre, precio) {
  const indexExistente = pedido.findIndex((item) => item.nombre === nombre);

  if (indexExistente > -1) {
    pedido[indexExistente].cantidad += 1;
  } else {
    pedido.push({
      nombre: nombre,
      precio: Number(precio),
      cantidad: 1,
    });
  }

  actualizarInterfazCarrito();
  darEfectoBoton();
}

// FUNCIÓN DE LA PAPELERA (REINICIA A CERO DE FORMA DIRECTA)
function vaciarPedido() {
  if (pedido.length === 0) return;
  pedido = []; // Vaciamos la orden por completo
  actualizarInterfazCarrito();
}

// ACTUALIZACIÓN DE TOTALES EN PANTALLA (UNA SOLA VEZ DEFINIDA)
function actualizarInterfazCarrito() {
  const cCount = document.getElementById("cartCount");
  const cTotal = document.getElementById("cartTotal");
  const fCart = document.getElementById("floatingCart");

  const totalArticulos = pedido.reduce((acc, item) => acc + item.cantidad, 0);
  const montoTotal = pedido.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  if (cCount) cCount.textContent = totalArticulos;
  if (cTotal) cTotal.textContent = `$${montoTotal.toFixed(2)}`;

  if (fCart) {
    if (totalArticulos > 0) {
      fCart.classList.add("visible");
    } else {
      fCart.classList.remove("visible");
    }
  }

  armarEnlaceWhatsApp(montoTotal);
}

// ==========================================================================
// CONSTRUCCIÓN DEL MENSAJE OFICIAL DE WHATSAPP
// ==========================================================================
function armarEnlaceWhatsApp(montoTotal) {
  const checkoutBtn = document.getElementById("whatsappCheckout");
  if (!checkoutBtn) return;

  let mensaje = "¡Hola, Rhino's Kitchen! 🦏🔥 Quiero hacer este pedido desde el menú web:\n\n";

  pedido.forEach((item) => {
    const subtotal = (item.precio * item.cantidad).toFixed(2);
    mensaje += `▪ ${item.cantidad}x *${item.nombre}* - $${subtotal}\n`;
  });

  mensaje += `\n💰 *Total a pagar:* $${montoTotal.toFixed(2)}`;
  mensaje += `\n🛵 *Tipo de entrega:* (Delivery / Retiro en local)`;
  mensaje += `\n📍 *Dirección o Mesa:* `;

  checkoutBtn.href = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}

function enviarPedidoWhatsApp() {
  if (pedido.length === 0) return;
  const checkoutBtn = document.getElementById("whatsappCheckout");
  if (checkoutBtn && checkoutBtn.href) {
    window.open(checkoutBtn.href, "_blank");
  }
}

// ==========================================================================
// FEEDBACK VISUAL Y NOTIFICACIONES
// ==========================================================================
function darEfectoBoton() {
  const cCount = document.getElementById("cartCount");
  if (cCount) {
    cCount.style.transform = "scale(1.3)";
    setTimeout(() => {
      cCount.style.transform = "scale(1)";
    }, 200);
  }
}

function mostrarNotificacion(texto) {
  let toast = document.getElementById("toastNotification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastNotification";
    toast.className = "toast-notification";
    document.body.appendChild(toast);
  }
  toast.textContent = texto;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
