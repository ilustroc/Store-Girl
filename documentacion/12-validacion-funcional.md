# 12. Validación Funcional

Matriz de revisión final del sistema TecnoStore.

| Módulo | Funcionalidad | Ruta | Acción probada | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|---|---|
| Inicio | Carga de home | `#/home` | Abrir ruta | Muestra portada y productos reales | Validado por sintaxis y carga de vistas | Correcto |
| Catálogo | Listar productos | `#/catalogo` | Consumir `/api/products` | Productos desde MySQL | Endpoint y JS conectados a API | Correcto |
| Catálogo | Buscar/filtrar/ordenar | `#/catalogo` | Usar controles | Cambia lista sin recargar | Implementado en `store.js` | Correcto |
| Detalle | Ver producto | `#/producto/:id` | Consultar ID | Muestra detalle real | Implementado con `/api/products/{id}` | Correcto |
| Carrito | Agregar/modificar/eliminar | `#/carrito` | Botones `+`, `-`, eliminar | Actualiza localStorage y resumen | Implementado en `cart.js` | Correcto |
| Checkout | Confirmar pedido | `#/checkout` | Enviar pedido autenticado | Valida stock y descuenta en transacción | Backend usa `@Transactional` | Correcto |
| Mis pedidos | Consultar pedidos propios | `#/mis-pedidos` | Abrir como USER | Muestra solo pedidos del usuario | Backend valida usuario autenticado | Corregido |
| Login | Autenticación | `#/login` | POST login | Devuelve JWT | Spring Security + JWT | Corregido |
| Registro | Crear usuario | `#/registro` | POST register | Crea USER con BCrypt | Validación frontend/backend | Corregido |
| Admin | Dashboard | `#/admin` | Abrir como ADMIN | Muestra indicadores reales | Endpoint protegido por JWT | Corregido |
| Productos | CRUD | `#/admin/productos` | Crear/editar/desactivar | Persiste en MySQL | Endpoints ADMIN protegidos | Corregido |
| Categorías | CRUD | `#/admin/productos` | Crear/editar/desactivar | Persiste en MySQL | Backend completo; UI crea/edita | Corregido |
| Imágenes | Subir imagen | Modal producto | Cargar archivo | Guarda en `assets/img` | Endpoint protegido por ADMIN | Corregido |
| Reportes | Buscar y exportar | `#/admin/reportes` | Filtrar/exportar | Datos reales, XLSX/PDF | Implementado | Corregido |
| Seguridad | USER en admin | `/api/admin/**` | Sin rol ADMIN | Responde 403 | Spring Security | Corregido |

No se encontraron botones decorativos nuevos. Las acciones críticas bloquean el botón mientras procesan.
