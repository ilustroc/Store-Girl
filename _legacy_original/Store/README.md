# 🛒 Tecno Store - Ecommerce Completo de Tecnología

Una tienda online **moderna, profesional y completamente funcional** especializada en productos tecnológicos, desarrollada con HTML5, CSS3, JavaScript vanilla y DataTables.

---

## 🎉 Estado del Proyecto

### ✅ **FASES COMPLETADAS**

- ✅ **FASE 1**: Sistema de Modales Profesional
- ✅ **FASE 2**: Autenticación de Usuarios Completa
- ✅ **FASE 3**: Flujo de Compra Mejorado con DataTables

---

## ✨ Características Principales

### 🎨 **Diseño e Interfaz**
- ✅ **Interfaz moderna** con gradientes y animaciones suaves
- ✅ **100% Responsive** - Se adapta a desktop, tablet y móvil
- ✅ **Tipografía moderna** - Google Fonts (Poppins)
- ✅ **Iconos de Font Awesome** para mejor UX
- ✅ **Modales elegantes** - Sin alertas básicas de JavaScript

### 🔐 **Sistema de Autenticación**
- ✅ **Login de usuarios** con validación completa
- ✅ **Registro de nuevos usuarios**
- ✅ **Recuperación de contraseña** con código de 5 dígitos
- ✅ **Gestión de sesiones** con localStorage
- ✅ **Usuario maestro**: admin@gmail.com / admin
- ✅ **Persistencia de sesión** entre recargas

### 🛍️ **Funcionalidades del Ecommerce**
- ✅ **Catálogo de 12 productos** tecnológicos
- ✅ **Carrito de compras** completamente funcional
- ✅ **Búsqueda en tiempo real** de productos
- ✅ **Modificar cantidades** (+/-)
- ✅ **DataTables** para visualización profesional
- ✅ **Modal de confirmación** con tabla detallada
- ✅ **Cálculo automático de envío** (Gratis > S/500)
- ✅ **Historial de pedidos** ("Mis Pedidos")
- ✅ **Números de pedido únicos**
- ✅ **Persistencia con localStorage**

### 📊 **Gestión de Pedidos**
- ✅ **Generación de ID único** por pedido (PED-timestamp-random)
- ✅ **Guardado de historial** completo
- ✅ **Vista "Mis Pedidos"** con DataTable
- ✅ **Estados de pedidos**: Procesando, Enviado, Entregado, Cancelado
- ✅ **Badges de colores** por estado
- ✅ **Filtrado por usuario** - Cada usuario ve solo sus pedidos

---

## 📱 Productos Incluidos

### **Categorías:**
- 📱 **Smartphones**: iPhone 15 Pro, Samsung Galaxy S24
- 💻 **Laptops**: MacBook Pro M3, Dell XPS 13
- 📲 **Tablets**: iPad Air
- 🎧 **Audio**: AirPods Pro, Sony WH-1000XM5
- 🎮 **Gaming**: Nintendo Switch, Razer DeathAdder V3
- ⌚ **Wearables**: Apple Watch Series 9
- 📺 **TV**: LG OLED 65"
- 📷 **Cámaras**: Canon EOS R6

---

## 📁 Estructura del Proyecto

```
Store/
├── index.html              # Página principal
├── README.md               # Documentación completa
│
├── css/
│   └── styles.css          # Estilos completos + modales + tablas
│
├── js/
│   ├── auth.js             # Sistema de autenticación y modales
│   └── script.js           # Funcionalidad tienda y pedidos
│
└── images/                 # Imágenes de productos
    └── ...
```

---

## 🚀 Instalación y Uso

### **Instalación:**
1. **Clona o descarga** el proyecto
2. **Abre** el archivo `index.html` en tu navegador
3. **¡Listo!** Ya puedes usar la tienda completa

### **No requiere:**
- ❌ Servidor web
- ❌ Base de datos
- ❌ Node.js o npm
- ❌ Configuración adicional

### **Solo necesitas:**
- ✅ Un navegador moderno
- ✅ Conexión a internet (para CDN de DataTables y fuentes)

---

## 🧪 Guía de Prueba Rápida

### **1. Registro de Usuario:**
```
1. Clic en icono de usuario (👤)
2. Selecciona "Registrarse"
3. Completa el formulario
4. ✅ Cuenta creada
```

### **2. Login:**
```
Usuario maestro:
Email: admin@gmail.com
Contraseña: admin

O usa tu cuenta recién creada
```

### **3. Realizar Compra:**
```
1. Agrega productos al carrito (3-5 productos)
2. Clic en carrito → "Finalizar Compra"
3. Revisa modal con DataTable
4. Confirma y paga
5. ✅ Pedido generado
```

### **4. Ver Historial:**
```
1. Icono de usuario → "Mis Pedidos"
2. Ve tu historial completo con DataTable
3. Prueba búsqueda y ordenamiento
```

### **5. Recuperar Contraseña:**
```
1. Login → "¿Olvidaste tu contraseña?"
2. Ingresa tu email
3. Copia el código de 5 dígitos
4. Ingresa código y nueva contraseña
5. ✅ Contraseña actualizada
```

---

## 🛠️ Tecnologías Utilizadas

### **Frontend:**
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos (Flexbox, Grid, Gradientes)
- **JavaScript ES6+** - Programación orientada a objetos
- **jQuery** - Requerido para DataTables
- **DataTables** - Tablas interactivas profesionales

### **Librerías CDN:**
- **Font Awesome 6.0** - Iconos
- **Google Fonts (Poppins)** - Tipografía
- **jQuery 3.7.1** - Framework JavaScript
- **DataTables 1.13.7** - Tablas dinámicas

### **Almacenamiento:**
- **localStorage** - Persistencia de datos en navegador

---

## 🎯 Funcionalidades Detalladas

### **Sistema de Modales:**
- ✅ Modal genérico reutilizable
- ✅ Tipos: info, success, error, warning, confirmación
- ✅ Animaciones suaves de apertura/cierre
- ✅ Cierre: botón X, clic fuera, tecla Escape
- ✅ Overlay con efecto blur
- ✅ Formularios completos integrados

### **Autenticación:**
- ✅ Registro con validaciones completas
- ✅ Login con verificación de credenciales
- ✅ Recuperación con código temporal (15 min)
- ✅ Códigos de 5 dígitos aleatorios
- ✅ Gestión de sesiones persistentes
- ✅ Menú de usuario dinámico

### **Carrito de Compras:**
- ✅ Agregar/eliminar productos
- ✅ Modificar cantidades con botones +/-
- ✅ Cálculo automático de totales
- ✅ Sidebar deslizable
- ✅ Contador visual de productos
- ✅ Persistencia con localStorage

### **Checkout y Pedidos:**
- ✅ Modal de confirmación con DataTable
- ✅ Tabla interactiva de productos
- ✅ Información del cliente automática
- ✅ Cálculo de envío (Gratis > S/500)
- ✅ Resumen detallado de totales
- ✅ Generación de número único
- ✅ Guardado en historial

### **Historial "Mis Pedidos":**
- ✅ Vista con DataTable
- ✅ Búsqueda en tiempo real
- ✅ Ordenamiento por columnas
- ✅ Paginación automática
- ✅ Filtrado por usuario
- ✅ Estados con badges de colores

---

## 🎨 Paleta de Colores

- **Gradiente Principal**: #667eea → #764ba2 (Azul-Púrpura)
- **Secundario**: #ffeb3b (Amarillo)
- **Éxito**: #2ecc71 (Verde)
- **Error**: #ff4757 (Rojo)
- **Fondo**: #f8f9fa (Gris claro)
- **Texto**: #333 (Gris oscuro)

---

## 📊 Datos Almacenados (localStorage)

### **1. usuarios** - Array de usuarios registrados
```javascript
[{
    email: "admin@gmail.com",
    contraseña: "admin",
    nombre: "Administrador",
    rol: "admin",
    fechaRegistro: "2025-11-12T..."
}]
```

### **2. sesionActiva** - Sesión del usuario logueado
```javascript
{
    email: "admin@gmail.com",
    nombre: "Administrador",
    rol: "admin",
    fechaInicio: "2025-11-12T..."
}
```

### **3. carrito** - Productos en el carrito
```javascript
[{
    id: 1,
    nombre: "iPhone 15 Pro",
    precio: 1199,
    cantidad: 2,
    icono: "fas fa-mobile-alt"
}]
```

### **4. pedidos** - Historial de pedidos
```javascript
[{
    numeroPedido: "PED-1699876543210-847",
    fecha: "2025-11-12T...",
    cliente: { nombre: "...", email: "..." },
    productos: [...],
    subtotal: 2500,
    envio: 0,
    total: 2500,
    estado: "Procesando"
}]
```

### **5. codigosRecuperacion** - Códigos de recuperación temporales
```javascript
{
    "email@ejemplo.com": {
        codigo: "47892",
        expiracion: 1699876543210
    }
}
```

---

## 🔧 Funciones Principales

### **En auth.js:**

#### Clase `GestorDeUsuarios`:
- `registrarUsuario(datos)` - Registra nuevo usuario
- `iniciarSesion(email, contraseña)` - Inicia sesión
- `cerrarSesion()` - Cierra sesión activa
- `recuperarContraseña(email)` - Genera código de recuperación
- `restablecerContraseña(email, codigo, nueva)` - Cambia contraseña
- `obtenerSesionActiva()` - Obtiene datos de sesión
- `haySesionActiva()` - Verifica si hay sesión

#### Clase `GestorDeModales`:
- `mostrarInfo(titulo, mensaje, tipo)` - Modal informativo
- `mostrarConfirmacion(titulo, mensaje, callback)` - Modal de confirmación
- `mostrarLogin()` - Modal de login
- `mostrarRegistro()` - Modal de registro
- `mostrarRecuperarContraseña()` - Modal paso 1 recuperación
- `mostrarFormularioRestablecer(email)` - Modal paso 2 recuperación
- `mostrarMisPedidos()` - Modal historial de pedidos

### **En script.js:**

#### Gestión de Productos:
- `cargarProductos()` - Renderiza catálogo
- `buscarProductos(e)` - Búsqueda en tiempo real
- `agregarAlCarrito(id)` - Agrega producto al carrito
- `actualizarCarrito()` - Actualiza vista del carrito

#### Gestión de Pedidos:
- `obtenerPedidos()` - Obtiene historial completo
- `guardarPedido(pedido)` - Guarda nuevo pedido
- `generarNumeroPedido()` - Crea ID único
- `mostrarModalConfirmacionCompra()` - Modal checkout con DataTable
- `procesarCompraFinal()` - Procesa y guarda pedido

---

## 📱 Diseño Responsive

### **Desktop** (> 1200px):
- Navegación completa visible
- Modal ancho (900px) para tablas
- Todas las columnas mostradas
- Sidebar de carrito (400px)

### **Tablet** (768px - 1199px):
- Navegación adaptada
- Modal ajustado (90%)
- Tabla con scroll horizontal si necesario

### **Mobile** (< 768px):
- Navegación colapsada
- Modal 95% de ancho
- Carrito full-width
- Botones full-width
- Tabla con scroll horizontal
- DataTable responsive activado

---

## 🎉 Características Destacadas

### **🔥 Todo en Español:**
- Código comentado en español
- Funciones con nombres descriptivos
- DataTables en español
- Mensajes al usuario en español

### **🚀 Sin Backend Necesario:**
- 100% funcional en el navegador
- localStorage para persistencia
- No requiere servidor
- Perfecto para demostración

### **🎨 UX Premium:**
- Modales elegantes (sin alert())
- Animaciones suaves
- Feedback visual inmediato
- Diseño moderno y profesional

### **💡 Código Limpio:**
- Programación orientada a objetos
- Separación de responsabilidades
- Comentarios descriptivos
- Fácil de mantener y extender

---

## 🔒 Seguridad (Modo Demo)

⚠️ **IMPORTANTE**: Este es un proyecto de demostración educativo.

**Características de seguridad implementadas:**
- ✅ Validación de formularios
- ✅ Códigos temporales con expiración
- ✅ Verificación de sesión
- ✅ Filtrado de datos por usuario

**Para producción se requeriría:**
- 🔐 Backend real con API
- 🔐 Base de datos segura
- 🔐 Hash de contraseñas (bcrypt)
- 🔐 JWT para autenticación
- 🔐 HTTPS obligatorio
- 🔐 Rate limiting
- 🔐 Validaciones server-side

---

## 🎯 Casos de Uso

### **Usuario Nuevo:**
1. Registrarse → Iniciar sesión → Navegar productos → Agregar al carrito → Finalizar compra → Ver pedidos

### **Usuario Recurrente:**
1. Iniciar sesión → Agregar productos → Finalizar compra → Ver historial

### **Usuario Olvidó Contraseña:**
1. Recuperar contraseña → Código de 5 dígitos → Nueva contraseña → Iniciar sesión

### **Administrador:**
1. Login (admin@gmail.com) → Realizar compras → Ver pedidos → Gestionar sesión

---

## 🚀 Personalización

### **Agregar Nuevos Productos:**

Edita el array `productos` en `js/script.js`:

```javascript
{
    id: 13,
    nombre: "Nuevo Producto",
    precio: 999,
    descripcion: "Descripción completa",
    icono: "fas fa-gamepad",
    categoria: "gaming"
}
```

### **Modificar Estilos:**

Los estilos están organizados en `css/styles.css`:
- Reset y variables
- Header y navegación
- Modales
- Productos
- Carrito
- Tablas y DataTables
- Responsive

### **Cambiar Colores:**

Busca y reemplaza en `styles.css`:
- `#667eea` y `#764ba2` (gradiente principal)
- `#ffeb3b` (color secundario)

---

## 📈 Próximas Mejoras Sugeridas

- [ ] Panel de administración completo
- [ ] Gestión de inventario
- [ ] Reportes y estadísticas
- [ ] Categorías con filtros avanzados
- [ ] Sistema de reviews y calificaciones
- [ ] Wishlist de productos favoritos
- [ ] Comparador de productos
- [ ] Integración con pasarelas de pago reales
- [ ] Backend con Node.js + MongoDB
- [ ] Envío de emails reales
- [ ] Multi-idioma
- [ ] Tema oscuro/claro

---

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

Desarrollado como proyecto educativo para demostrar las funcionalidades completas de un ecommerce moderno usando tecnologías web estándar.

---

## 🙏 Agradecimientos

- **Font Awesome** - Iconos
- **Google Fonts** - Tipografía Poppins
- **DataTables** - Tablas interactivas
- **jQuery** - Framework JavaScript

---

## 📞 Contacto (Ficticio)

- **Email**: info@tecnostore.com
- **Teléfono**: +51 999 888 777
- **Ubicación**: Lima, Perú

---

## ⭐ Características Técnicas

| Característica | Implementación |
|---------------|----------------|
| Responsive | ✅ 100% |
| Modales | ✅ Sistema completo |
| Autenticación | ✅ Login/Registro/Recuperación |
| Carrito | ✅ CRUD completo |
| Pedidos | ✅ Historial con DataTable |
| Búsqueda | ✅ Tiempo real |
| Persistencia | ✅ localStorage |
| Validaciones | ✅ Completas |
| UX/UI | ✅ Profesional |
| Código | ✅ Limpio y documentado |

---

## 🎊 **¡Gracias por visitar Tecno Store!**

**Proyecto completamente funcional y listo para usar** 🚀✨

---

**Versión**: 3.0.0 (Todas las fases completadas)  
**Última actualización**: Noviembre 2025  
**Estado**: ✅ Producción (Demo)
