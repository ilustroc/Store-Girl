// Base de datos de productos
const productos = [
    {
        id: 1,
        nombre: "iPhone 15 Pro",
        precio: 1199,
        descripcion: "El último iPhone con chip A17 Pro y cámara profesional",
        icono: "fas fa-mobile-alt",
        categoria: "smartphone",
        imagen: "images/iphone15.png"
    },
    {
        id: 2,
        nombre: "MacBook Pro M3",
        precio: 2299,
        descripcion: "Laptop profesional con chip M3 de última generación",
        icono: "fas fa-laptop",
        categoria: "laptop",
        imagen: "images/laptop.png"
    },
    {
        id: 3,
        nombre: "iPad Air",
        precio: 699,
        descripcion: "Tablet versátil para trabajo y entretenimiento",
        icono: "fas fa-tablet-alt",
        categoria: "tablet",
        imagen: "images/ipadair.png"
    },
    {
        id: 4,
        nombre: "AirPods Pro",
        precio: 249,
        descripcion: "Auriculares inalámbricos con cancelación de ruido",
        icono: "fas fa-headphones",
        categoria: "audio",
        imagen: "images/airpodspro.png"
    },
    {
        id: 5,
        nombre: "Samsung Galaxy S24",
        precio: 999,
        descripcion: "Smartphone Android con cámara de 200MP",
        icono: "fas fa-mobile-alt",
        categoria: "smartphone",
        imagen: "images/galaxys24.png"
    },
    {
        id: 6,
        nombre: "Dell XPS 13",
        precio: 1299,
        descripcion: "Ultrabook premium con pantalla InfinityEdge",
        icono: "fas fa-laptop",
        categoria: "laptop",
        imagen: "images/dellxps13.png"
    },
    {
        id: 7,
        nombre: "Nintendo Switch",
        precio: 349,
        descripcion: "Consola híbrida para jugar en casa o portátil",
        icono: "fas fa-gamepad",
        categoria: "gaming",
        imagen: "images/nintendoswitch.png"
    },
    {
        id: 8,
        nombre: "Apple Watch Series 9",
        precio: 429,
        descripcion: "Reloj inteligente con GPS y monitoreo de salud",
        icono: "fas fa-clock",
        categoria: "wearable",
        imagen: "images/applewatchseries9.png"
    },
    {
        id: 9,
        nombre: "Sony WH-1000XM5",
        precio: 399,
        descripcion: "Auriculares over-ear con la mejor cancelación de ruido",
        icono: "fas fa-headphones",
        categoria: "audio",
        imagen: "images/sonywh1000xm5.png"
    },
    {
        id: 10,
        nombre: "LG OLED 65\"",
        precio: 1899,
        descripcion: "Smart TV OLED 4K con HDR y Dolby Vision",
        icono: "fas fa-tv",
        categoria: "tv",
        imagen: "images/lgoled65.png"
    },
    {
        id: 11,
        nombre: "Canon EOS R6",
        precio: 2499,
        descripcion: "Cámara mirrorless profesional con 4K",
        icono: "fas fa-camera",
        categoria: "camera",
        imagen: "images/canoneosr6.png"
    },
    {
        id: 12,
        nombre: "Razer DeathAdder V3",
        precio: 89,
        descripcion: "Mouse gaming ergonómico con sensor de 30,000 DPI",
        icono: "fas fa-mouse",
        categoria: "gaming",
        imagen: "images/razerdeathadderv3.png"
    }
];

// Carrito de compras
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Elementos del DOM
const productosGrid = document.getElementById('productos-grid');
const cartSidebar = document.getElementById('cart-sidebar');
const cartToggle = document.getElementById('cart-toggle');
const closeCart = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
    actualizarCarrito();
    configurarEventListeners();
    
    // Asegurarse que auth.js esté cargado
    if (typeof actualizarInterfazUsuario === 'function') {
        actualizarInterfazUsuario();
    }
});

// Cargar productos en la página
function cargarProductos() {
    const productosActuales = obtenerProductos();
    productosGrid.innerHTML = '';
    productosActuales.forEach(producto => {
        const productoCard = document.createElement('div');
        productoCard.className = 'producto-card';
        
        // Usar imagen si existe, sino mostrar icono
        const imagenHTML = producto.imagen 
            ? `<img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img">`
            : `<i class="${producto.icono}"></i>`;
        
        productoCard.innerHTML = `
            <div class="producto-imagen">
                ${imagenHTML}
            </div>
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <div class="producto-precio">S/${producto.precio.toLocaleString()}</div>
                <button class="add-to-cart" onclick="agregarAlCarrito(${producto.id})">
                    <i class="fas fa-cart-plus"></i> Agregar al Carrito
                </button>
            </div>
        `;
        productosGrid.appendChild(productoCard);
    });
}

// Configurar event listeners
function configurarEventListeners() {
    // Toggle del carrito
    cartToggle.addEventListener('click', toggleCarrito);
    closeCart.addEventListener('click', cerrarCarrito);
    overlay.addEventListener('click', cerrarCarrito);
    
    // CTA Button
    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('click', function() {
        document.getElementById('productos').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });
    
    // Búsqueda
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
        searchInput.addEventListener('input', buscarProductos);
    }
    
    // Navegación suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Función para buscar productos
function buscarProductos(e) {
    const termino = e.target.value.toLowerCase();
    const productosActuales = obtenerProductos();
    const productosFiltrados = productosActuales.filter(producto => 
        producto.nombre.toLowerCase().includes(termino) ||
        producto.descripcion.toLowerCase().includes(termino) ||
        producto.categoria.toLowerCase().includes(termino)
    );
    
    productosGrid.innerHTML = '';
    
    if (productosFiltrados.length === 0) {
        productosGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">No se encontraron productos</p>';
        return;
    }
    
    productosFiltrados.forEach(producto => {
        const productoCard = document.createElement('div');
        productoCard.className = 'producto-card';
        
        // Usar imagen si existe, sino mostrar icono
        const imagenHTML = producto.imagen 
            ? `<img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img">`
            : `<i class="${producto.icono}"></i>`;
        
        productoCard.innerHTML = `
            <div class="producto-imagen">
                ${imagenHTML}
            </div>
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <div class="producto-precio">S/${producto.precio.toLocaleString()}</div>
                <button class="add-to-cart" onclick="agregarAlCarrito(${producto.id})">
                    <i class="fas fa-cart-plus"></i> Agregar al Carrito
                </button>
            </div>
        `;
        productosGrid.appendChild(productoCard);
    });
}

// Agregar producto al carrito
function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p.id === productoId);
    const itemExistente = carrito.find(item => item.id === productoId);
    
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }
    
    guardarCarrito();
    actualizarCarrito();
    mostrarNotificacion('Producto agregado al carrito');
    
    // Animación del botón
    const button = event.target;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

// Actualizar visualización del carrito
function actualizarCarrito() {
    // Actualizar contador
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    cartCount.textContent = totalItems;
    
    // Actualizar items del carrito
    cartItems.innerHTML = '';
    
    if (carrito.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; margin: 2rem 0;">Tu carrito está vacío</p>';
    } else {
        carrito.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <i class="${item.icono}"></i>
                </div>
                <div class="cart-item-info">
                    <h4>${item.nombre}</h4>
                    <div class="cart-item-price">S/${item.precio.toLocaleString()}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                        <span class="quantity">${item.cantidad}</span>
                        <button class="quantity-btn" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="eliminarDelCarrito(${item.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    // Actualizar total
    const total = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    cartTotal.textContent = "S/" + total.toLocaleString();
}

// Cambiar cantidad de un producto
function cambiarCantidad(productoId, cambio) {
    const item = carrito.find(item => item.id === productoId);
    if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) {
            eliminarDelCarrito(productoId);
        } else {
            guardarCarrito();
            actualizarCarrito();
        }
    }
}

// Eliminar producto del carrito
function eliminarDelCarrito(productoId) {
    carrito = carrito.filter(item => item.id !== productoId);
    guardarCarrito();
    actualizarCarrito();
    mostrarNotificacion('Producto eliminado del carrito');
}

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Toggle del carrito
function toggleCarrito() {
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : 'auto';
}

// Cerrar carrito
function cerrarCarrito() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-weight: 500;
    `;
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    // Animar entrada
    setTimeout(() => {
        notificacion.style.transform = 'translateX(0)';
    }, 100);
    
    // Animar salida y eliminar
    setTimeout(() => {
        notificacion.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

// Funciones adicionales para mejorar la experiencia

// ==========================================
// GESTIÓN DE PEDIDOS
// ==========================================

// Obtener historial de pedidos
function obtenerPedidos() {
    return JSON.parse(localStorage.getItem('pedidos')) || [];
}

// Guardar pedido
function guardarPedido(pedido) {
    const pedidos = obtenerPedidos();
    pedidos.push(pedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

// Generar número de pedido único
function generarNumeroPedido() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `PED-${timestamp}-${random}`;
}

// ==========================================
// MODAL DE CONFIRMACIÓN DE COMPRA MEJORADO
// ==========================================

function mostrarModalConfirmacionCompra() {
    if (carrito.length === 0) {
        if (typeof gestorModales !== 'undefined') {
            gestorModales.mostrarInfo('Carrito Vacío', 'Tu carrito está vacío. Agrega productos antes de finalizar la compra', 'warning');
        }
        return;
    }

    // Verificar sesión activa
    const sesion = gestorUsuarios.obtenerSesionActiva();
    if (!sesion) {
        gestorModales.mostrarInfo(
            'Inicia Sesión', 
            'Debes iniciar sesión para finalizar tu compra', 
            'info'
        );
        setTimeout(() => {
            gestorModales.mostrarLogin();
        }, 1500);
        return;
    }

    // Calcular totales
    const subtotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    const cantidadItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    const envio = subtotal > 500 ? 0 : 20; // Envío gratis para compras mayores a S/500
    const total = subtotal + envio;

    // Construir tabla HTML con los productos
    let tablaHTML = `
        <div class="info-usuario-compra">
            <h4><i class="fas fa-user"></i> Información del Cliente</h4>
            <p><i class="fas fa-user-circle"></i> <strong>${sesion.nombre}</strong></p>
            <p><i class="fas fa-envelope"></i> ${sesion.email}</p>
            <p><i class="fas fa-calendar"></i> ${new Date().toLocaleDateString('es-PE', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}</p>
        </div>

        <div class="tabla-resumen-compra">
            <table id="tabla-detalle-compra" class="display" style="width:100%">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio Unit.</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
    `;

    carrito.forEach(item => {
        const subtotalItem = item.precio * item.cantidad;
        tablaHTML += `
            <tr>
                <td class="producto-nombre">
                    <i class="${item.icono}" style="color: #667eea; margin-right: 8px;"></i>
                    ${item.nombre}
                </td>
                <td class="producto-precio">S/${item.precio.toLocaleString()}</td>
                <td style="text-align: center;">${item.cantidad}</td>
                <td class="producto-subtotal">S/${subtotalItem.toLocaleString()}</td>
            </tr>
        `;
    });

    tablaHTML += `
                </tbody>
            </table>
        </div>

        <div class="resumen-totales">
            <div class="fila-total">
                <span>Subtotal (${cantidadItems} ${cantidadItems === 1 ? 'producto' : 'productos'}):</span>
                <span>S/${subtotal.toLocaleString()}</span>
            </div>
            <div class="fila-total">
                <span>Envío:</span>
                <span>${envio === 0 ? '<strong style="color: #2ecc71;">¡GRATIS!</strong>' : 'S/' + envio}</span>
            </div>
            ${envio === 0 ? '<small style="color: #2ecc71;">🎉 Has alcanzado el envío gratuito</small>' : 
              '<small style="color: #666;">Envío gratis en compras mayores a S/500</small>'}
            <div class="fila-total total-final">
                <span>TOTAL A PAGAR:</span>
                <span>S/${total.toLocaleString()}</span>
            </div>
        </div>
    `;

    // Configurar modal
    gestorModales.modalTitulo.textContent = '🛒 Confirmar Pedido';
    gestorModales.modalContainer.classList.add('modal-ancho');
    gestorModales.modalBody.innerHTML = tablaHTML;
    gestorModales.modalFooter.innerHTML = `
        <button class="btn-modal btn-modal-secondary" onclick="gestorModales.cerrarModal(); gestorModales.modalContainer.classList.remove('modal-ancho')">
            <i class="fas fa-times"></i> Cancelar
        </button>
        <button class="btn-modal btn-modal-success" onclick="mostrarFormularioPago(${total})">
            <i class="fas fa-credit-card"></i> Pagar
        </button>
    `;

    gestorModales.abrirModal();

    // Inicializar DataTable después de que el modal esté visible
    setTimeout(() => {
        if ($.fn.DataTable.isDataTable('#tabla-detalle-compra')) {
            $('#tabla-detalle-compra').DataTable().destroy();
        }
        
        $('#tabla-detalle-compra').DataTable({
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
            },
            pageLength: 5,
            lengthMenu: [[5, 10, 25, -1], [5, 10, 25, "Todos"]],
            order: [[0, 'asc']],
            responsive: true
        });
    }, 100);
}

// ---------- Formulario y procesamiento de pago (simulado) ----------
function mostrarFormularioPago(total) {
    const sesion = gestorUsuarios.obtenerSesionActiva();
    if (!sesion) {
        gestorModales.mostrarInfo('Inicia Sesión', 'Debes iniciar sesión para realizar el pago', 'info');
        return;
    }

    const formHTML = `
        <div class="form-pago">
            <p style="margin-bottom: 0.5rem;"><strong>Total a pagar:</strong> <span style="color:#2ecc71; font-weight:600;">S/${total.toLocaleString()}</span></p>
            <div style="margin-top: 0.5rem;">
                <label for="card-name">Nombre en la tarjeta</label>
                <input id="card-name" type="text" placeholder="Nombre como aparece en la tarjeta" />
            </div>
            <div style="margin-top: 0.5rem;">
                <label for="card-number">Número de tarjeta</label>
                <input id="card-number" type="text" inputmode="numeric" placeholder="1234 5678 9012 3456" maxlength="19" />
            </div>
            <div style="display:flex; gap:8px; margin-top: 0.5rem;">
                <div style="flex:1;">
                    <label for="card-expiry">Expiración (MM/AA)</label>
                    <input id="card-expiry" type="text" placeholder="MM/AA" maxlength="5" />
                </div>
                <div style="width:120px;">
                    <label for="card-cvv">CVV</label>
                    <input id="card-cvv" type="password" inputmode="numeric" maxlength="4" placeholder="123" />
                </div>
            </div>
            <small style="color:#666; display:block; margin-top:8px;">Simulación: no se procesarán cargos reales.</small>
        </div>
    `;

    gestorModales.modalTitulo.textContent = '💳 Pago con Tarjeta';
    gestorModales.modalBody.innerHTML = formHTML;
    gestorModales.modalFooter.innerHTML = `
        <button class="btn-modal btn-modal-secondary" onclick="gestorModales.cerrarModal(); gestorModales.modalContainer.classList.remove('modal-ancho')">
            <i class="fas fa-times"></i> Cancelar
        </button>
        <button class="btn-modal btn-modal-success" onclick="validarYProcesarPago(${total})">
            <i class="fas fa-credit-card"></i> Pagar ahora
        </button>
    `;

    gestorModales.abrirModal();
}

function validarYProcesarPago(total) {
    const nombre = document.getElementById('card-name')?.value.trim() || '';
    const numeroRaw = document.getElementById('card-number')?.value.replace(/\s+/g, '') || '';
    const expiracion = document.getElementById('card-expiry')?.value.trim() || '';
    const cvv = document.getElementById('card-cvv')?.value.trim() || '';

    if (!nombre) return gestorModales.mostrarInfo('Datos incompletos', 'Ingresa el nombre en la tarjeta', 'error');
    if (!/^[0-9]{13,19}$/.test(numeroRaw)) return gestorModales.mostrarInfo('Número inválido', 'Número de tarjeta inválido (13-19 dígitos)', 'error');
    if (!/^(0[1-9]|1[0-2])\/(?:\d{2})$/.test(expiracion)) return gestorModales.mostrarInfo('Fecha inválida', 'Expiración inválida (MM/AA)', 'error');
    if (!/^[0-9]{3,4}$/.test(cvv)) return gestorModales.mostrarInfo('CVV inválido', 'CVV inválido (3-4 dígitos)', 'error');

    const [mesStr, anioStr] = expiracion.split('/');
    const mes = parseInt(mesStr, 10);
    const anio = 2000 + parseInt(anioStr, 10);
    const ahora = new Date();
    const expiracionDate = new Date(anio, mes);
    if (expiracionDate <= ahora) return gestorModales.mostrarInfo('Tarjeta vencida', 'La tarjeta ingresada está vencida', 'error');

    gestorModales.modalBody.innerHTML = '<p style="text-align:center; padding:1.5rem;"><i class="fas fa-spinner fa-spin" style="margin-right:8px;"></i>Procesando pago...</p>';
    gestorModales.modalFooter.innerHTML = '';

    setTimeout(() => {
        const paymentInfo = { metodo: 'tarjeta', last4: numeroRaw.slice(-4), titular: nombre };
        procesarCompraConPago(paymentInfo, total);
    }, 1000);
}

function procesarCompraConPago(paymentInfo, total) {
    const sesion = gestorUsuarios.obtenerSesionActiva();
    const pedido = {
        numeroPedido: generarNumeroPedido(),
        fecha: new Date().toISOString(),
        cliente: { nombre: sesion.nombre, email: sesion.email },
        productos: carrito.map(item => ({ id: item.id, nombre: item.nombre, precio: item.precio, cantidad: item.cantidad, subtotal: item.precio * item.cantidad })),
        subtotal: carrito.reduce((t, i) => t + i.precio * i.cantidad, 0),
        envio: (carrito.reduce((t, i) => t + i.precio * i.cantidad, 0) > 500) ? 0 : 20,
        total: total,
        estado: 'Procesando',
        pago: paymentInfo
    };

    guardarPedido(pedido);
    carrito = [];
    guardarCarrito();
    actualizarCarrito();

    gestorModales.cerrarModal();
    gestorModales.modalContainer.classList.remove('modal-ancho');
    cerrarCarrito();

    setTimeout(() => {
        gestorModales.mostrarInfo('🎉 ¡Pago Exitoso!', `<strong>Pedido #${pedido.numeroPedido}</strong><br>Pago con tarjeta terminada en <strong>${paymentInfo.last4}</strong>.<br>Total: S/${total.toLocaleString()}`, 'success');
    }, 400);
}

// Procesar compra final
function procesarCompraFinal() {
    const sesion = gestorUsuarios.obtenerSesionActiva();
    
    // Calcular totales
    const subtotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    const envio = subtotal > 500 ? 0 : 20;
    const total = subtotal + envio;

    // Crear objeto de pedido
    const pedido = {
        numeroPedido: generarNumeroPedido(),
        fecha: new Date().toISOString(),
        cliente: {
            nombre: sesion.nombre,
            email: sesion.email
        },
        productos: carrito.map(item => ({
            id: item.id,
            nombre: item.nombre,
            precio: item.precio,
            cantidad: item.cantidad,
            subtotal: item.precio * item.cantidad
        })),
        subtotal: subtotal,
        envio: envio,
        total: total,
        estado: 'Procesando'
    };

    // Guardar pedido
    guardarPedido(pedido);

    // Limpiar carrito
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
    
    // Cerrar modal y carrito
    gestorModales.cerrarModal();
    gestorModales.modalContainer.classList.remove('modal-ancho');
    cerrarCarrito();

    // Mostrar confirmación
    setTimeout(() => {
        gestorModales.mostrarInfo(
            '🎉 ¡Compra Exitosa!',
            `<strong>Pedido #${pedido.numeroPedido}</strong><br><br>
            ¡Gracias por tu compra, ${sesion.nombre}!<br>
            Total pagado: <strong style="color: #2ecc71; font-size: 1.2em;">S/${total.toLocaleString()}</strong><br><br>
            <small>Recibirás un correo de confirmación en ${sesion.email}</small>`,
            'success'
        );
    }, 400);
}

// Checkout (simulado)
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            mostrarModalConfirmacionCompra();
        });
    }
});

// Filtros por categoría (función adicional)
function filtrarPorCategoria(categoria) {
    const productosFiltrados = categoria === 'todos' 
        ? productos 
        : productos.filter(producto => producto.categoria === categoria);
    
    productosGrid.innerHTML = '';
    
    productosFiltrados.forEach(producto => {
        const productoCard = document.createElement('div');
        productoCard.className = 'producto-card';
        
        // Usar imagen si existe, sino mostrar icono
        const imagenHTML = producto.imagen 
            ? `<img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img">`
            : `<i class="${producto.icono}"></i>`;
        
        productoCard.innerHTML = `
            <div class="producto-imagen">
                ${imagenHTML}
            </div>
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <div class="producto-precio">S/${producto.precio.toLocaleString()}</div>
                <button class="add-to-cart" onclick="agregarAlCarrito(${producto.id})">
                    <i class="fas fa-cart-plus"></i> Agregar al Carrito
                </button>
            </div>
        `;
        productosGrid.appendChild(productoCard);
    });
}

// Animaciones al hacer scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        header.style.backdropFilter = 'none';
    }
});

// Lazy loading de productos (simulado)
function cargarMasProductos() {
    // Esta función se puede expandir para cargar más productos dinámicamente
    console.log('Cargando más productos...');
}

// Validación y mejoras de accesibilidad
document.addEventListener('keydown', function(e) {
    // Cerrar carrito con Escape
    if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
        cerrarCarrito();
    }
});

// Optimización de rendimiento
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Aplicar debounce a la búsqueda
const buscarProductosDebounced = debounce(buscarProductos, 300);

// ==========================================
// FUNCIONES DE GESTIÓN DE PRODUCTOS (ADMIN)
// ==========================================

// Obtener productos desde localStorage o usar los predefinidos
function obtenerProductos() {
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
        return JSON.parse(productosGuardados);
    }
    // Si no hay productos guardados, guardar los predefinidos
    localStorage.setItem('productos', JSON.stringify(productos));
    return productos;
}

// Guardar productos en localStorage
function guardarProductos(productosActualizados) {
    localStorage.setItem('productos', JSON.stringify(productosActualizados));
    // Actualizar array global
    productos.splice(0, productos.length, ...productosActualizados);
    // Recargar productos en la página
    cargarProductos();
}

// Agregar nuevo producto
function agregarProducto(datosProducto) {
    const productosActuales = obtenerProductos();
    const nuevoId = Math.max(...productosActuales.map(p => p.id), 0) + 1;
    
    const nuevoProducto = {
        id: nuevoId,
        nombre: datosProducto.nombre,
        precio: datosProducto.precio,
        descripcion: datosProducto.descripcion,
        icono: datosProducto.icono,
        categoria: datosProducto.categoria,
        imagen: datosProducto.imagen || undefined,
        stock: 'Disponible'
    };
    
    productosActuales.push(nuevoProducto);
    guardarProductos(productosActuales);
    return nuevoProducto;
}

// Editar producto existente
function editarProducto(id, nuevosDatos) {
    const productosActuales = obtenerProductos();
    const index = productosActuales.findIndex(p => p.id === id);
    
    if (index !== -1) {
        productosActuales[index] = {
            ...productosActuales[index],
            nombre: nuevosDatos.nombre,
            precio: nuevosDatos.precio,
            descripcion: nuevosDatos.descripcion,
            icono: nuevosDatos.icono,
            categoria: nuevosDatos.categoria,
            imagen: nuevosDatos.imagen !== undefined ? nuevosDatos.imagen : productosActuales[index].imagen
        };
        guardarProductos(productosActuales);
        return true;
    }
    return false;
}

// Eliminar producto
function eliminarProductoDB(id) {
    const productosActuales = obtenerProductos();
    const productosFiltrados = productosActuales.filter(p => p.id !== id);
    guardarProductos(productosFiltrados);
}
