// ========================================
// PANEL ADMINISTRATIVO
// Archivo: admin.js
// ========================================

class PanelAdministrativo {
    constructor() {
        this.chartVentas = null;
        this.chartProductos = null;
        this.chartCategorias = null;
    }

    // Verificar si el usuario es administrador
    esAdministrador() {
        const sesion = gestorUsuarios.obtenerSesionActiva();
        return sesion && sesion.rol === 'admin';
    }

    // Mostrar panel principal de administración
    mostrarPanelAdmin() {
        if (!this.esAdministrador()) {
            gestorModales.mostrarInfo('Acceso Denegado', 'Solo los administradores pueden acceder a este panel', 'error');
            return;
        }

        gestorModales.modalTitulo.textContent = '👑 Panel de Administración';
        gestorModales.modalContainer.classList.add('modal-ancho');

        gestorModales.modalBody.innerHTML = `
            <div class="admin-tabs">
                <button class="admin-tab active" data-tab="dashboard">
                    <i class="fas fa-chart-line"></i> Dashboard
                </button>
                <button class="admin-tab" data-tab="productos">
                    <i class="fas fa-box"></i> Productos
                </button>
                <button class="admin-tab" data-tab="pedidos">
                    <i class="fas fa-shopping-cart"></i> Pedidos
                </button>
                <button class="admin-tab" data-tab="usuarios">
                    <i class="fas fa-users"></i> Usuarios
                </button>
            </div>

            <div id="admin-content" class="admin-content">
                <!-- El contenido se cargará dinámicamente -->
            </div>
        `;

        gestorModales.modalFooter.innerHTML = `
            <button class="btn-modal btn-modal-secondary" onclick="gestorModales.cerrarModal(); gestorModales.modalContainer.classList.remove('modal-ancho')">
                <i class="fas fa-times"></i> Cerrar
            </button>
        `;

        gestorModales.abrirModal();

        // Configurar eventos de pestañas
        this.configurarTabs();
        
        // Mostrar dashboard por defecto
        this.mostrarDashboard();
    }

    // Configurar eventos de pestañas
    configurarTabs() {
        const tabs = document.querySelectorAll('.admin-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remover clase active de todas
                tabs.forEach(t => t.classList.remove('active'));
                // Agregar clase active a la clickeada
                tab.classList.add('active');
                
                // Mostrar contenido correspondiente
                const tabName = tab.getAttribute('data-tab');
                this.mostrarContenidoTab(tabName);
            });
        });
    }

    // Mostrar contenido según tab seleccionado
    mostrarContenidoTab(tabName) {
        switch(tabName) {
            case 'dashboard':
                this.mostrarDashboard();
                break;
            case 'productos':
                this.mostrarGestionProductos();
                break;
            case 'pedidos':
                this.mostrarGestionPedidos();
                break;
            case 'usuarios':
                this.mostrarGestionUsuarios();
                break;
        }
    }

    // ==========================================
    // DASHBOARD - REPORTES GRÁFICOS
    // ==========================================

    mostrarDashboard() {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        const usuarios = gestorUsuarios.obtenerUsuarios().filter(u => u.rol !== 'admin');
        
        // Calcular estadísticas
        const totalVentas = pedidos.reduce((sum, p) => sum + p.total, 0);
        const totalPedidos = pedidos.length;
        const totalUsuarios = usuarios.length;
        const promedioVenta = totalPedidos > 0 ? (totalVentas / totalPedidos) : 0;

        // Pedidos por estado
        const pedidosPorEstado = {
            'Procesando': pedidos.filter(p => p.estado === 'Procesando').length,
            'Enviado': pedidos.filter(p => p.estado === 'Enviado').length,
            'Entregado': pedidos.filter(p => p.estado === 'Entregado').length,
            'Cancelado': pedidos.filter(p => p.estado === 'Cancelado').length
        };

        const adminContent = document.getElementById('admin-content');
        adminContent.innerHTML = `
            <div class="dashboard-header">
                <h3><i class="fas fa-chart-bar"></i> Dashboard de Reportes</h3>
                <p>Vista general de las ventas y estadísticas</p>
            </div>

            <!-- Tarjetas de estadísticas -->
            <div class="stats-cards">
                <div class="stat-card stat-ventas">
                    <div class="stat-icon">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div class="stat-info">
                        <h4>Total Ventas</h4>
                        <p class="stat-value">S/${totalVentas.toLocaleString()}</p>
                    </div>
                </div>

                <div class="stat-card stat-pedidos">
                    <div class="stat-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <div class="stat-info">
                        <h4>Total Pedidos</h4>
                        <p class="stat-value">${totalPedidos}</p>
                    </div>
                </div>

                <div class="stat-card stat-usuarios">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-info">
                        <h4>Total Usuarios</h4>
                        <p class="stat-value">${totalUsuarios}</p>
                    </div>
                </div>

                <div class="stat-card stat-promedio">
                    <div class="stat-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-info">
                        <h4>Promedio por Venta</h4>
                        <p class="stat-value">S/${promedioVenta.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <!-- Gráficos -->
            <div class="charts-container">
                <div class="chart-box">
                    <h4><i class="fas fa-calendar-alt"></i> Ventas por Mes</h4>
                    <canvas id="chartVentasMensuales"></canvas>
                </div>

                <div class="chart-box">
                    <h4><i class="fas fa-tag"></i> Productos Más Vendidos</h4>
                    <canvas id="chartProductosVendidos"></canvas>
                </div>
            </div>

            <div class="charts-container">
                <div class="chart-box">
                    <h4><i class="fas fa-layer-group"></i> Ventas por Categoría</h4>
                    <canvas id="chartCategorias"></canvas>
                </div>

                <div class="chart-box">
                    <h4><i class="fas fa-tasks"></i> Estado de Pedidos</h4>
                    <canvas id="chartEstadoPedidos"></canvas>
                </div>
            </div>

            <!-- Últimos pedidos -->
            <div class="recent-orders">
                <h4><i class="fas fa-clock"></i> Últimos 5 Pedidos</h4>
                <div class="tabla-resumen-compra">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>N° Pedido</th>
                                <th>Cliente</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.generarFilasUltimosPedidos(pedidos)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Inicializar gráficos
        setTimeout(() => {
            this.inicializarGraficos(pedidos);
        }, 100);
    }

    // Generar filas de últimos pedidos
    generarFilasUltimosPedidos(pedidos) {
        if (pedidos.length === 0) {
            return '<tr><td colspan="5" style="text-align: center;">No hay pedidos registrados</td></tr>';
        }

        const ultimosPedidos = pedidos.slice(-5).reverse();
        return ultimosPedidos.map(pedido => {
            const fecha = new Date(pedido.fecha).toLocaleDateString('es-PE');
            return `
                <tr>
                    <td><strong>${pedido.numeroPedido}</strong></td>
                    <td>${pedido.cliente.nombre}</td>
                    <td>${fecha}</td>
                    <td class="producto-subtotal">S/${pedido.total.toLocaleString()}</td>
                    <td><span class="badge-estado-${pedido.estado.toLowerCase()}">${pedido.estado}</span></td>
                </tr>
            `;
        }).join('');
    }

    // Inicializar todos los gráficos
    inicializarGraficos(pedidos) {
        this.crearGraficoVentasMensuales(pedidos);
        this.crearGraficoProductosVendidos(pedidos);
        this.crearGraficoCategorias(pedidos);
        this.crearGraficoEstadoPedidos(pedidos);
    }

    // Gráfico de ventas mensuales
    crearGraficoVentasMensuales(pedidos) {
        const ctx = document.getElementById('chartVentasMensuales');
        if (!ctx) return;

        // Agrupar ventas por mes
        const ventasPorMes = {};
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        
        pedidos.forEach(pedido => {
            const fecha = new Date(pedido.fecha);
            const mesAno = `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
            ventasPorMes[mesAno] = (ventasPorMes[mesAno] || 0) + pedido.total;
        });

        // Si no hay datos, generar meses recientes vacíos
        if (Object.keys(ventasPorMes).length === 0) {
            const hoy = new Date();
            for (let i = 5; i >= 0; i--) {
                const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
                const mesAno = `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
                ventasPorMes[mesAno] = 0;
            }
        }

        const labels = Object.keys(ventasPorMes);
        const data = Object.values(ventasPorMes);

        if (this.chartVentas) {
            this.chartVentas.destroy();
        }

        this.chartVentas = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Ventas (S/)',
                    data: data,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'S/' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // Gráfico de productos más vendidos
    crearGraficoProductosVendidos(pedidos) {
        const ctx = document.getElementById('chartProductosVendidos');
        if (!ctx) return;

        // Contar productos vendidos
        const productosVendidos = {};
        pedidos.forEach(pedido => {
            pedido.productos.forEach(prod => {
                productosVendidos[prod.nombre] = (productosVendidos[prod.nombre] || 0) + prod.cantidad;
            });
        });

        // Ordenar y tomar top 5
        const productosOrdenados = Object.entries(productosVendidos)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const labels = productosOrdenados.map(p => p[0]);
        const data = productosOrdenados.map(p => p[1]);

        if (this.chartProductos) {
            this.chartProductos.destroy();
        }

        this.chartProductos = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels.length > 0 ? labels : ['Sin datos'],
                datasets: [{
                    label: 'Cantidad Vendida',
                    data: data.length > 0 ? data : [0],
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(255, 235, 59, 0.8)',
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(231, 76, 60, 0.8)'
                    ],
                    borderColor: [
                        '#667eea',
                        '#764ba2',
                        '#ffeb3b',
                        '#2ecc71',
                        '#e74c3c'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    // Gráfico de ventas por categoría
    crearGraficoCategorias(pedidos) {
        const ctx = document.getElementById('chartCategorias');
        if (!ctx) return;

        // Obtener productos para mapear categorías
        const productosDB = obtenerProductos();
        const ventasPorCategoria = {};

        pedidos.forEach(pedido => {
            pedido.productos.forEach(prod => {
                const producto = productosDB.find(p => p.id === prod.id);
                if (producto) {
                    const categoria = producto.categoria;
                    ventasPorCategoria[categoria] = (ventasPorCategoria[categoria] || 0) + (prod.precio * prod.cantidad);
                }
            });
        });

        const labels = Object.keys(ventasPorCategoria);
        const data = Object.values(ventasPorCategoria);

        if (this.chartCategorias) {
            this.chartCategorias.destroy();
        }

        this.chartCategorias = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels.length > 0 ? labels : ['Sin datos'],
                datasets: [{
                    data: data.length > 0 ? data : [1],
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(255, 235, 59, 0.8)',
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(231, 76, 60, 0.8)',
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(241, 196, 15, 0.8)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': S/' + context.parsed.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // Gráfico de estado de pedidos
    crearGraficoEstadoPedidos(pedidos) {
        const ctx = document.getElementById('chartEstadoPedidos');
        if (!ctx) return;

        const estados = {
            'Procesando': 0,
            'Enviado': 0,
            'Entregado': 0,
            'Cancelado': 0
        };

        pedidos.forEach(pedido => {
            if (estados.hasOwnProperty(pedido.estado)) {
                estados[pedido.estado]++;
            }
        });

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(estados),
                datasets: [{
                    data: Object.values(estados),
                    backgroundColor: [
                        'rgba(255, 193, 7, 0.8)',
                        'rgba(33, 150, 243, 0.8)',
                        'rgba(76, 175, 80, 0.8)',
                        'rgba(244, 67, 54, 0.8)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // ==========================================
    // GESTIÓN DE PRODUCTOS
    // ==========================================

    mostrarGestionProductos() {
        const productos = obtenerProductos();
        const adminContent = document.getElementById('admin-content');

        adminContent.innerHTML = `
            <div class="dashboard-header">
                <h3><i class="fas fa-box"></i> Gestión de Productos</h3>
                <button class="btn-admin-primary" onclick="panelAdmin.mostrarFormularioProducto()">
                    <i class="fas fa-plus"></i> Nuevo Producto
                </button>
            </div>

            <div class="tabla-resumen-compra">
                <table id="tabla-productos-admin" class="display" style="width:100%">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productos.map(p => `
                            <tr>
                                <td>${p.id}</td>
                                <td><i class="${p.icono}"></i> ${p.nombre}</td>
                                <td>${p.categoria}</td>
                                <td class="producto-subtotal">S/${p.precio.toLocaleString()}</td>
                                <td><span class="badge-stock">${p.stock || 'Disponible'}</span></td>
                                <td>
                                    <button class="btn-action btn-edit" onclick="panelAdmin.editarProducto(${p.id})" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-action btn-delete" onclick="panelAdmin.eliminarProducto(${p.id})" title="Eliminar">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Inicializar DataTable
        setTimeout(() => {
            if ($.fn.DataTable.isDataTable('#tabla-productos-admin')) {
                $('#tabla-productos-admin').DataTable().destroy();
            }
            
            $('#tabla-productos-admin').DataTable({
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
                },
                pageLength: 10,
                order: [[0, 'asc']],
                responsive: true
            });
        }, 100);
    }

    // Mostrar formulario para nuevo/editar producto
    mostrarFormularioProducto(productoId = null) {
        const producto = productoId ? obtenerProductos().find(p => p.id === productoId) : null;
        const esEdicion = producto !== null;

        const modalSecundario = this.crearModalSecundario();
        modalSecundario.querySelector('.modal-titulo-secundario').textContent = 
            esEdicion ? 'Editar Producto' : 'Nuevo Producto';

        modalSecundario.querySelector('.modal-body-secundario').innerHTML = `
            <form id="form-producto">
                <div class="form-group">
                    <label>Nombre del Producto</label>
                    <input type="text" id="prod-nombre" value="${producto?.nombre || ''}" required>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Precio (S/)</label>
                        <input type="number" id="prod-precio" value="${producto?.precio || ''}" min="0" step="0.01" required>
                    </div>

                    <div class="form-group">
                        <label>Categoría</label>
                        <select id="prod-categoria" required>
                            <option value="">Seleccionar</option>
                            <option value="smartphone" ${producto?.categoria === 'smartphone' ? 'selected' : ''}>Smartphone</option>
                            <option value="laptop" ${producto?.categoria === 'laptop' ? 'selected' : ''}>Laptop</option>
                            <option value="tablet" ${producto?.categoria === 'tablet' ? 'selected' : ''}>Tablet</option>
                            <option value="audio" ${producto?.categoria === 'audio' ? 'selected' : ''}>Audio</option>
                            <option value="gaming" ${producto?.categoria === 'gaming' ? 'selected' : ''}>Gaming</option>
                            <option value="wearable" ${producto?.categoria === 'wearable' ? 'selected' : ''}>Wearable</option>
                            <option value="tv" ${producto?.categoria === 'tv' ? 'selected' : ''}>TV</option>
                            <option value="camera" ${producto?.categoria === 'camera' ? 'selected' : ''}>Cámara</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>Descripción</label>
                    <textarea id="prod-descripcion" rows="3" required>${producto?.descripcion || ''}</textarea>
                </div>

                <div class="form-group">
                    <label>Imagen del Producto</label>
                    <input type="file" id="prod-imagen-file" accept="image/png,image/jpeg,image/jpg">
                    <small style="display: block; margin-top: 5px;">⚠️ Importante: Después de seleccionar, copia el archivo a la carpeta "images" con el mismo nombre</small>
                    ${producto?.imagen ? `<div style="margin-top: 10px;"><strong>Imagen actual:</strong> ${producto.imagen}</div>` : ''}
                    <input type="hidden" id="prod-imagen" value="${producto?.imagen || ''}">
                </div>

                <div class="form-group">
                    <label>Icono Font Awesome (alternativo)</label>
                    <input type="text" id="prod-icono" value="${producto?.icono || 'fas fa-box'}" 
                           placeholder="fas fa-mobile-alt">
                    <small>Se usa si no hay imagen. Ejemplo: fas fa-mobile-alt, fas fa-laptop, etc.</small>
                </div>

                <input type="hidden" id="prod-id" value="${producto?.id || ''}">
            </form>
        `;

        modalSecundario.querySelector('.modal-footer-secundario').innerHTML = `
            <button class="btn-modal btn-modal-secondary" onclick="panelAdmin.cerrarModalSecundario()">
                Cancelar
            </button>
            <button class="btn-modal btn-modal-success" onclick="panelAdmin.guardarProducto()">
                <i class="fas fa-save"></i> Guardar
            </button>
        `;

        modalSecundario.style.display = 'flex';
    }

    // Guardar producto (nuevo o edición)
    guardarProducto() {
        const id = document.getElementById('prod-id').value;
        const nombre = document.getElementById('prod-nombre').value.trim();
        const precio = parseFloat(document.getElementById('prod-precio').value);
        const categoria = document.getElementById('prod-categoria').value;
        const descripcion = document.getElementById('prod-descripcion').value.trim();
        const icono = document.getElementById('prod-icono').value.trim();
        const imagenFile = document.getElementById('prod-imagen-file').files[0];
        const imagenActual = document.getElementById('prod-imagen').value;

        if (!nombre || !precio || !categoria || !descripcion) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }

        // Si se seleccionó un archivo, usar su nombre
        let rutaImagen = imagenActual;
        if (imagenFile) {
            rutaImagen = 'images/' + imagenFile.name;
        }

        const datosProducto = {
            nombre, 
            precio, 
            categoria, 
            descripcion, 
            icono,
            imagen: rutaImagen || undefined
        };

        if (id) {
            // Editar producto existente
            editarProducto(parseInt(id), datosProducto);
        } else {
            // Crear nuevo producto
            agregarProducto(datosProducto);
        }

        this.cerrarModalSecundario();
        this.mostrarGestionProductos();
        
        if (imagenFile) {
            gestorModales.mostrarInfo('Éxito', `Producto guardado. Ahora copia "${imagenFile.name}" a la carpeta "images"`, 'success');
        } else {
            gestorModales.mostrarInfo('Éxito', 'Producto guardado correctamente', 'success');
        }
    }

    // Editar producto
    editarProducto(id) {
        this.mostrarFormularioProducto(id);
    }

    // Eliminar producto
    eliminarProducto(id) {
        gestorModales.mostrarConfirmacion(
            '¿Eliminar Producto?',
            '¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.',
            () => {
                eliminarProductoDB(id);
                this.mostrarGestionProductos();
                gestorModales.mostrarInfo('Eliminado', 'Producto eliminado correctamente', 'success');
            }
        );
    }

    // ==========================================
    // GESTIÓN DE PEDIDOS
    // ==========================================

    mostrarGestionPedidos() {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        const adminContent = document.getElementById('admin-content');

        adminContent.innerHTML = `
            <div class="dashboard-header">
                <h3><i class="fas fa-shopping-cart"></i> Gestión de Pedidos</h3>
                <p>Total de pedidos: <strong>${pedidos.length}</strong></p>
            </div>

            <div class="tabla-resumen-compra">
                <table id="tabla-pedidos-admin" class="display" style="width:100%">
                    <thead>
                        <tr>
                            <th>N° Pedido</th>
                            <th>Cliente</th>
                            <th>Email</th>
                            <th>Fecha</th>
                            <th>Productos</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pedidos.map(pedido => {
                            const fecha = new Date(pedido.fecha).toLocaleDateString('es-PE');
                            const cantProds = pedido.productos.reduce((sum, p) => sum + p.cantidad, 0);
                            return `
                                <tr>
                                    <td><strong>${pedido.numeroPedido}</strong></td>
                                    <td>${pedido.cliente.nombre}</td>
                                    <td>${pedido.cliente.email}</td>
                                    <td>${fecha}</td>
                                    <td style="text-align: center;">${cantProds}</td>
                                    <td class="producto-subtotal">S/${pedido.total.toLocaleString()}</td>
                                    <td><span class="badge-estado-${pedido.estado.toLowerCase()}">${pedido.estado}</span></td>
                                    <td>
                                        <button class="btn-action btn-view" onclick="panelAdmin.verDetallePedido('${pedido.numeroPedido}')" title="Ver detalle">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn-action btn-edit" onclick="panelAdmin.cambiarEstadoPedido('${pedido.numeroPedido}')" title="Cambiar estado">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Inicializar DataTable
        setTimeout(() => {
            if ($.fn.DataTable.isDataTable('#tabla-pedidos-admin')) {
                $('#tabla-pedidos-admin').DataTable().destroy();
            }
            
            $('#tabla-pedidos-admin').DataTable({
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
                },
                pageLength: 10,
                order: [[3, 'desc']],
                responsive: true
            });
        }, 100);
    }

    // Ver detalle de pedido
    verDetallePedido(numeroPedido) {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        const pedido = pedidos.find(p => p.numeroPedido === numeroPedido);
        
        if (!pedido) return;

        const modalSecundario = this.crearModalSecundario();
        modalSecundario.querySelector('.modal-titulo-secundario').textContent = 'Detalle del Pedido';

        modalSecundario.querySelector('.modal-body-secundario').innerHTML = `
            <div class="detalle-pedido">
                <div class="info-pedido">
                    <h4>Información del Pedido</h4>
                    <p><strong>N° Pedido:</strong> ${pedido.numeroPedido}</p>
                    <p><strong>Fecha:</strong> ${new Date(pedido.fecha).toLocaleString('es-PE')}</p>
                    <p><strong>Estado:</strong> <span class="badge-estado-${pedido.estado.toLowerCase()}">${pedido.estado}</span></p>
                </div>

                <div class="info-cliente">
                    <h4>Cliente</h4>
                    <p><strong>Nombre:</strong> ${pedido.cliente.nombre}</p>
                    <p><strong>Email:</strong> ${pedido.cliente.email}</p>
                </div>

                <div class="productos-pedido">
                    <h4>Productos</h4>
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pedido.productos.map(p => `
                                <tr>
                                    <td><i class="${p.icono}"></i> ${p.nombre}</td>
                                    <td>S/${p.precio.toLocaleString()}</td>
                                    <td>${p.cantidad}</td>
                                    <td class="producto-subtotal">S/${(p.precio * p.cantidad).toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="totales-pedido">
                    <p><strong>Subtotal:</strong> S/${pedido.subtotal.toLocaleString()}</p>
                    <p><strong>Envío:</strong> ${pedido.envio === 0 ? '<span style="color: #2ecc71;">GRATIS</span>' : 'S/' + pedido.envio}</p>
                    <p class="total-final"><strong>TOTAL:</strong> S/${pedido.total.toLocaleString()}</p>
                </div>
            </div>
        `;

        modalSecundario.querySelector('.modal-footer-secundario').innerHTML = `
            <button class="btn-modal btn-modal-primary" onclick="panelAdmin.cerrarModalSecundario()">
                Cerrar
            </button>
        `;

        modalSecundario.style.display = 'flex';
    }

    // Cambiar estado de pedido
    cambiarEstadoPedido(numeroPedido) {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        const pedido = pedidos.find(p => p.numeroPedido === numeroPedido);
        
        if (!pedido) return;

        const modalSecundario = this.crearModalSecundario();
        modalSecundario.querySelector('.modal-titulo-secundario').textContent = 'Cambiar Estado del Pedido';

        modalSecundario.querySelector('.modal-body-secundario').innerHTML = `
            <p><strong>Pedido:</strong> ${numeroPedido}</p>
            <p><strong>Estado actual:</strong> <span class="badge-estado-${pedido.estado.toLowerCase()}">${pedido.estado}</span></p>

            <div class="form-group">
                <label>Nuevo Estado:</label>
                <select id="nuevo-estado" class="form-control">
                    <option value="Procesando" ${pedido.estado === 'Procesando' ? 'selected' : ''}>Procesando</option>
                    <option value="Enviado" ${pedido.estado === 'Enviado' ? 'selected' : ''}>Enviado</option>
                    <option value="Entregado" ${pedido.estado === 'Entregado' ? 'selected' : ''}>Entregado</option>
                    <option value="Cancelado" ${pedido.estado === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                </select>
            </div>
        `;

        modalSecundario.querySelector('.modal-footer-secundario').innerHTML = `
            <button class="btn-modal btn-modal-secondary" onclick="panelAdmin.cerrarModalSecundario()">
                Cancelar
            </button>
            <button class="btn-modal btn-modal-success" onclick="panelAdmin.actualizarEstadoPedido('${numeroPedido}')">
                <i class="fas fa-save"></i> Actualizar
            </button>
        `;

        modalSecundario.style.display = 'flex';
    }

    // Actualizar estado del pedido
    actualizarEstadoPedido(numeroPedido) {
        const nuevoEstado = document.getElementById('nuevo-estado').value;
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        const pedido = pedidos.find(p => p.numeroPedido === numeroPedido);

        if (pedido) {
            pedido.estado = nuevoEstado;
            localStorage.setItem('pedidos', JSON.stringify(pedidos));
            
            this.cerrarModalSecundario();
            this.mostrarGestionPedidos();
            gestorModales.mostrarInfo('Estado Actualizado', `El pedido ahora está en estado: ${nuevoEstado}`, 'success');
        }
    }

    // ==========================================
    // GESTIÓN DE USUARIOS
    // ==========================================

    mostrarGestionUsuarios() {
        const usuarios = gestorUsuarios.obtenerUsuarios();
        const adminContent = document.getElementById('admin-content');

        adminContent.innerHTML = `
            <div class="dashboard-header">
                <h3><i class="fas fa-users"></i> Gestión de Usuarios</h3>
                <p>Total de usuarios: <strong>${usuarios.length}</strong></p>
            </div>

            <div class="tabla-resumen-compra">
                <table id="tabla-usuarios-admin" class="display" style="width:100%">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Rol</th>
                            <th>Fecha Registro</th>
                            <th>Pedidos</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${usuarios.map(usuario => {
                            const fecha = new Date(usuario.fechaRegistro).toLocaleDateString('es-PE');
                            const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
                            const pedidosUsuario = pedidos.filter(p => p.cliente.email === usuario.email).length;
                            
                            return `
                                <tr>
                                    <td>${usuario.nombre}</td>
                                    <td>${usuario.email}</td>
                                    <td>${usuario.telefono || 'N/A'}</td>
                                    <td><span class="badge-rol-${usuario.rol}">${usuario.rol === 'admin' ? 'Administrador' : 'Usuario'}</span></td>
                                    <td>${fecha}</td>
                                    <td style="text-align: center;">${pedidosUsuario}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Inicializar DataTable
        setTimeout(() => {
            if ($.fn.DataTable.isDataTable('#tabla-usuarios-admin')) {
                $('#tabla-usuarios-admin').DataTable().destroy();
            }
            
            $('#tabla-usuarios-admin').DataTable({
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
                },
                pageLength: 10,
                order: [[4, 'desc']],
                responsive: true
            });
        }, 100);
    }

    // ==========================================
    // UTILIDADES
    // ==========================================

    // Crear modal secundario para formularios
    crearModalSecundario() {
        let modal = document.getElementById('modal-secundario');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modal-secundario';
            modal.className = 'modal-overlay-secundario';
            modal.innerHTML = `
                <div class="modal-container-secundario">
                    <div class="modal-header-secundario">
                        <h3 class="modal-titulo-secundario">Título</h3>
                        <button class="modal-close-secundario" onclick="panelAdmin.cerrarModalSecundario()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body-secundario"></div>
                    <div class="modal-footer-secundario"></div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        return modal;
    }

    // Cerrar modal secundario
    cerrarModalSecundario() {
        const modal = document.getElementById('modal-secundario');
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

// Instancia global
const panelAdmin = new PanelAdministrativo();
