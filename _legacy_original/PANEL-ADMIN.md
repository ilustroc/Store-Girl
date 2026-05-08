# 👑 PANEL ADMINISTRATIVO - GUÍA COMPLETA

## 🎉 Sistema Implementado Exitosamente

Se ha implementado un **Panel de Administración completo** con reportes gráficos, gestión de productos, pedidos y usuarios.

---

## 🔐 Acceso al Panel Administrativo

### **Credenciales de Administrador:**

```
Email: admin@gmail.com
Contraseña: admin
```

### **Pasos para Acceder:**

1. **Iniciar Sesión** con las credenciales de administrador
2. Hacer clic en el **icono de usuario** (👤) en la esquina superior derecha
3. Aparecerá el botón **"👑 Panel Admin"** (solo visible para administradores)
4. Hacer clic en **"Panel Admin"** para abrir el panel

> ⚠️ **Importante**: El botón de Panel Admin **SOLO** es visible para usuarios con rol "admin". Los usuarios normales no verán esta opción.

---

## 📊 Funcionalidades del Panel Admin

### **1. Dashboard - Reportes Gráficos** 📈

El dashboard muestra una vista general completa de las ventas y estadísticas:

#### **Tarjetas de Estadísticas:**
- 💰 **Total Ventas**: Suma total de todas las ventas realizadas
- 🛒 **Total Pedidos**: Cantidad de pedidos registrados
- 👥 **Total Usuarios**: Usuarios registrados (sin contar admin)
- 📊 **Promedio por Venta**: Promedio del valor de cada venta

#### **Gráficos Interactivos (Chart.js):**

1. **Ventas por Mes** (Gráfico de Línea)
   - Muestra la evolución de las ventas mensuales
   - Formato: S/ con separadores de miles
   - Interactivo con tooltip al pasar el mouse

2. **Productos Más Vendidos** (Gráfico de Barras)
   - Top 5 productos más vendidos
   - Cantidad de unidades vendidas por producto
   - Colores diferenciados por producto

3. **Ventas por Categoría** (Gráfico de Dona)
   - Distribución de ventas por categoría de productos
   - Porcentaje y monto en S/
   - Leyenda con todas las categorías

4. **Estado de Pedidos** (Gráfico Circular)
   - Cantidad de pedidos por estado
   - Estados: Procesando, Enviado, Entregado, Cancelado
   - Colores distintivos por estado

#### **Tabla de Últimos Pedidos:**
- Muestra los 5 pedidos más recientes
- Información: N° Pedido, Cliente, Fecha, Total, Estado
- Acceso rápido a detalles

---

### **2. Gestión de Productos** 📦

Permite administrar el catálogo completo de productos:

#### **Funcionalidades:**
- ✅ **Ver todos los productos** en tabla interactiva (DataTable)
- ✅ **Buscar y filtrar** productos en tiempo real
- ✅ **Ordenar** por cualquier columna (ID, Nombre, Categoría, Precio)
- ✅ **Paginación** automática (10 productos por página)

#### **Acciones Disponibles:**

**➕ Agregar Nuevo Producto:**
1. Clic en botón **"Nuevo Producto"**
2. Completar formulario:
   - Nombre del producto
   - Precio (S/)
   - Categoría (dropdown con opciones)
   - Descripción
   - Icono Font Awesome (ej: `fas fa-mobile-alt`)
3. Clic en **"Guardar"**
4. El producto se agrega al catálogo y aparece en la tienda

**✏️ Editar Producto:**
1. Clic en botón **"Editar"** (icono lápiz) del producto
2. Modificar los campos necesarios
3. Clic en **"Guardar"**
4. Los cambios se reflejan inmediatamente

**🗑️ Eliminar Producto:**
1. Clic en botón **"Eliminar"** (icono basura) del producto
2. Confirmar la eliminación en el modal
3. El producto se elimina permanentemente

> 💾 **Nota**: Todos los cambios se guardan en `localStorage` y son permanentes hasta que se borren manualmente los datos del navegador.

---

### **3. Gestión de Pedidos** 🛍️

Visualiza y administra todos los pedidos del sistema:

#### **Funcionalidades:**
- ✅ **Ver todos los pedidos** de todos los usuarios
- ✅ **Tabla interactiva** con DataTables
- ✅ **Buscar** por número de pedido, cliente, email
- ✅ **Ordenar** por fecha (más recientes primero)
- ✅ **Filtrar** por múltiples criterios

#### **Columnas de Información:**
- N° Pedido (único)
- Cliente (nombre)
- Email del cliente
- Fecha del pedido
- Cantidad de productos
- Total (S/)
- Estado (con badge de color)

#### **Acciones Disponibles:**

**👁️ Ver Detalle del Pedido:**
1. Clic en botón **"Ver"** (icono ojo)
2. Se abre modal con información completa:
   - Información del pedido (N°, Fecha, Estado)
   - Datos del cliente (Nombre, Email)
   - Tabla de productos (Producto, Precio, Cantidad, Subtotal)
   - Resumen de totales (Subtotal, Envío, Total)

**✏️ Cambiar Estado del Pedido:**
1. Clic en botón **"Editar"** (icono lápiz)
2. Seleccionar nuevo estado:
   - 🟡 **Procesando**: Pedido recibido
   - 🔵 **Enviado**: Pedido en camino
   - 🟢 **Entregado**: Pedido completado
   - 🔴 **Cancelado**: Pedido cancelado
3. Clic en **"Actualizar"**
4. El estado se actualiza inmediatamente

> 📧 **Nota**: En un sistema real, al cambiar el estado se enviaría un email automático al cliente notificando el cambio.

---

### **4. Gestión de Usuarios** 👥

Visualiza información de todos los usuarios registrados:

#### **Funcionalidades:**
- ✅ **Lista completa** de usuarios (incluye administradores)
- ✅ **Búsqueda** por nombre, email, teléfono
- ✅ **Ordenar** por fecha de registro
- ✅ **Ver cantidad de pedidos** por usuario

#### **Columnas de Información:**
- Nombre completo
- Email (único)
- Teléfono
- Rol (Administrador o Usuario)
- Fecha de registro
- Cantidad de pedidos realizados

#### **Badges de Rol:**
- 👑 **Administrador**: Badge morado (admin@gmail.com)
- 👤 **Usuario**: Badge azul (usuarios normales)

> 🔒 **Nota**: En esta versión no se pueden eliminar usuarios. Solo se visualiza la información.

---

## 🎨 Características Técnicas

### **Tecnologías Utilizadas:**

1. **Chart.js 4.4.0**
   - Librería para gráficos interactivos
   - 4 tipos de gráficos implementados
   - Responsive y animados

2. **DataTables 1.13.7**
   - Tablas interactivas con búsqueda
   - Paginación automática
   - Ordenamiento por columnas
   - 100% en español

3. **Font Awesome 6.0**
   - Iconos en toda la interfaz
   - Consistencia visual

4. **LocalStorage**
   - Persistencia de datos
   - Sin necesidad de backend
   - Acceso rápido

### **Sistema de Roles:**

```javascript
// Usuario Administrador
{
    email: "admin@gmail.com",
    contraseña: "admin",
    nombre: "Administrador",
    rol: "admin"  // ← ROL CLAVE
}

// Usuario Normal
{
    email: "usuario@ejemplo.com",
    contraseña: "123456",
    nombre: "Juan Pérez",
    rol: "usuario"  // ← ROL NORMAL
}
```

**Validaciones de Rol:**
- ✅ Solo usuarios con `rol: "admin"` pueden ver el botón de Panel Admin
- ✅ Solo administradores pueden acceder al panel
- ✅ Verificación en cada función crítica
- ✅ Usuarios normales no tienen acceso a funciones administrativas

---

## 📂 Estructura de Datos

### **Productos (localStorage):**
```javascript
[
    {
        id: 1,
        nombre: "iPhone 15 Pro",
        precio: 1199,
        descripcion: "El último iPhone...",
        icono: "fas fa-mobile-alt",
        categoria: "smartphone",
        imagen: "images/iphone15.png",
        stock: "Disponible"
    }
]
```

### **Pedidos (localStorage):**
```javascript
[
    {
        numeroPedido: "PED-1732654321123-847",
        fecha: "2025-11-26T10:30:00.000Z",
        cliente: {
            nombre: "Juan Pérez",
            email: "juan@ejemplo.com"
        },
        productos: [
            {
                id: 1,
                nombre: "iPhone 15 Pro",
                precio: 1199,
                cantidad: 2,
                icono: "fas fa-mobile-alt"
            }
        ],
        subtotal: 2398,
        envio: 0,  // Gratis si > S/500
        total: 2398,
        estado: "Procesando"
    }
]
```

---

## 🧪 Guía de Pruebas

### **Test 1: Acceso al Panel Admin**
1. Login como `admin@gmail.com` / `admin`
2. Clic en icono de usuario
3. ✅ Debe aparecer botón **"👑 Panel Admin"**
4. Clic en "Panel Admin"
5. ✅ Debe abrir el panel con 4 pestañas

### **Test 2: Ver Dashboard**
1. En Panel Admin, pestaña **"Dashboard"** debe estar activa
2. ✅ Ver 4 tarjetas de estadísticas con números reales
3. ✅ Ver 4 gráficos interactivos
4. ✅ Ver tabla de últimos 5 pedidos
5. Pasar mouse sobre gráficos
6. ✅ Ver tooltips con información detallada

### **Test 3: Agregar Producto**
1. Pestaña **"Productos"**
2. Clic en **"Nuevo Producto"**
3. Completar:
   - Nombre: "PlayStation 5"
   - Precio: 499
   - Categoría: gaming
   - Descripción: "Consola de nueva generación"
   - Icono: fas fa-gamepad
4. Clic en **"Guardar"**
5. ✅ Producto debe aparecer en la tabla
6. Ir a la página principal (scroll a productos)
7. ✅ Producto debe aparecer en el catálogo

### **Test 4: Editar Producto**
1. En tabla de productos, buscar "PlayStation 5"
2. Clic en botón **"Editar"**
3. Cambiar precio a: 549
4. Clic en **"Guardar"**
5. ✅ Precio actualizado en la tabla
6. ✅ Precio actualizado en el catálogo

### **Test 5: Eliminar Producto**
1. Buscar "PlayStation 5"
2. Clic en botón **"Eliminar"**
3. Confirmar eliminación
4. ✅ Producto desaparece de la tabla
5. ✅ Producto desaparece del catálogo

### **Test 6: Ver Detalles de Pedido**
1. Pestaña **"Pedidos"**
2. Clic en botón **"Ver"** de cualquier pedido
3. ✅ Modal con información completa
4. ✅ Datos del cliente correctos
5. ✅ Tabla de productos correcta
6. ✅ Totales calculados correctamente

### **Test 7: Cambiar Estado de Pedido**
1. Clic en **"Editar"** de un pedido
2. Cambiar estado a "Enviado"
3. Clic en **"Actualizar"**
4. ✅ Estado cambia a badge azul "Enviado"
5. Cerrar panel admin
6. Login como el cliente del pedido
7. Ir a "Mis Pedidos"
8. ✅ Estado actualizado visible para el cliente

### **Test 8: Gestión de Usuarios**
1. Pestaña **"Usuarios"**
2. ✅ Ver lista completa de usuarios
3. Buscar un email específico
4. ✅ Búsqueda funciona correctamente
5. ✅ Ver cantidad de pedidos por usuario

### **Test 9: Responsive del Panel**
1. Abrir panel admin
2. Redimensionar ventana a móvil (< 768px)
3. ✅ Tabs se ajustan en 2 columnas
4. ✅ Gráficos se apilan verticalmente
5. ✅ Tablas tienen scroll horizontal
6. ✅ Todo funcional en móvil

### **Test 10: Usuario Normal NO ve Panel**
1. Cerrar sesión del admin
2. Registrar nuevo usuario normal
3. Login con usuario normal
4. Clic en icono de usuario
5. ✅ NO debe aparecer botón "Panel Admin"
6. ✅ Solo debe ver "Mis Pedidos" y "Cerrar Sesión"

---

## 🎯 Casos de Uso Reales

### **Caso 1: Administrador Revisa Ventas del Mes**
1. Login como admin
2. Abrir Panel Admin → Dashboard
3. Revisar gráfico "Ventas por Mes"
4. Identificar mes con mayores ventas
5. Revisar tarjeta "Total Ventas"
6. Analizar productos más vendidos
7. Tomar decisiones de inventario

### **Caso 2: Administrador Agrega Producto Nuevo**
1. Panel Admin → Productos
2. Clic "Nuevo Producto"
3. Agregar "Apple Vision Pro"
4. Precio: S/3499
5. Categoría: wearable
6. Guardar
7. Producto disponible para clientes

### **Caso 3: Cliente Hace Pedido → Admin Procesa**
1. Cliente agrega productos al carrito
2. Finaliza compra
3. Admin recibe notificación (simulado)
4. Admin va a Panel → Pedidos
5. Ve pedido nuevo con estado "Procesando"
6. Cambia estado a "Enviado"
7. Cliente ve actualización en "Mis Pedidos"

### **Caso 4: Administrador Analiza Categorías**
1. Panel Admin → Dashboard
2. Ver gráfico "Ventas por Categoría"
3. Identificar categoría más rentable
4. Ver gráfico "Productos Más Vendidos"
5. Decidir qué productos destacar
6. Ir a Productos → Editar precios si necesario

---

## 🔧 Configuración Técnica

### **Archivos Creados/Modificados:**

```
Store/
├── js/
│   ├── admin.js          ✅ NUEVO - Panel administrativo completo
│   ├── auth.js           ✅ MODIFICADO - Botón panel admin
│   └── script.js         ✅ MODIFICADO - Funciones CRUD productos
│
├── css/
│   └── styles.css        ✅ MODIFICADO - Estilos panel admin
│
└── index.html            ✅ MODIFICADO - Chart.js CDN, admin.js
```

### **CDN Agregados:**

```html
<!-- Chart.js para gráficos -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

<!-- Script admin -->
<script src="js/admin.js"></script>
```

### **Funciones Principales (admin.js):**

```javascript
// Clase principal
class PanelAdministrativo {
    mostrarPanelAdmin()          // Abre el panel
    mostrarDashboard()           // Pestaña Dashboard
    mostrarGestionProductos()    // Pestaña Productos
    mostrarGestionPedidos()      // Pestaña Pedidos
    mostrarGestionUsuarios()     // Pestaña Usuarios
    
    // Gráficos
    crearGraficoVentasMensuales()
    crearGraficoProductosVendidos()
    crearGraficoCategorias()
    crearGraficoEstadoPedidos()
    
    // CRUD Productos
    mostrarFormularioProducto()
    guardarProducto()
    editarProducto()
    eliminarProducto()
    
    // Gestión Pedidos
    verDetallePedido()
    cambiarEstadoPedido()
    actualizarEstadoPedido()
}
```

### **Funciones Principales (script.js):**

```javascript
// Gestión de productos
obtenerProductos()           // Obtiene productos de localStorage
guardarProductos()           // Guarda en localStorage
agregarProducto()            // Agrega nuevo producto
editarProducto()             // Edita producto existente
eliminarProductoDB()         // Elimina producto
```

---

## 🚀 Mejoras Futuras Sugeridas

### **Corto Plazo:**
- [ ] Exportar reportes a PDF
- [ ] Exportar datos a Excel
- [ ] Notificaciones en tiempo real
- [ ] Subir imágenes reales de productos
- [ ] Búsqueda avanzada con filtros múltiples

### **Mediano Plazo:**
- [ ] Backend real con API REST
- [ ] Base de datos MySQL/MongoDB
- [ ] Autenticación JWT
- [ ] Envío de emails automáticos
- [ ] Sistema de inventario con stock real

### **Largo Plazo:**
- [ ] Multi-tienda / Multi-admin
- [ ] Integración con pasarelas de pago
- [ ] App móvil nativa
- [ ] Panel de analytics avanzado
- [ ] Machine Learning para predicciones

---

## 📞 Soporte

### **Problemas Comunes:**

**❓ "No veo el botón de Panel Admin"**
- Verifica que estés logueado como `admin@gmail.com`
- Verifica que el rol sea `"admin"` en localStorage
- Recarga la página (F5)

**❓ "Los gráficos no se muestran"**
- Verifica que Chart.js esté cargado (F12 → Console)
- Verifica que haya datos de pedidos en localStorage
- Recarga la página

**❓ "Los cambios en productos no se reflejan"**
- Los cambios son instantáneos en localStorage
- Recarga la página si no se ven
- Verifica que no haya errores en consola (F12)

**❓ "Quiero borrar todos los datos"**
```javascript
// En consola del navegador (F12):
localStorage.clear();
location.reload();
```

---

## ✅ **Sistema Completamente Funcional**

- ✅ Panel administrativo completo
- ✅ 4 pestañas funcionales
- ✅ Reportes gráficos con Chart.js
- ✅ CRUD de productos
- ✅ Gestión de pedidos
- ✅ Gestión de usuarios
- ✅ Sistema de roles
- ✅ 100% responsive
- ✅ DataTables integrado
- ✅ LocalStorage persistente

---

**🎊 ¡Panel Administrativo Listo para Usar!** 👑

**Versión**: 4.0.0  
**Última actualización**: Noviembre 2025  
**Estado**: ✅ Producción (Demo)
