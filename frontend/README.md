# Frontend Bootstrap - TecnoStore

SPA simple con HTML, CSS, JavaScript, Bootstrap 5 y hash routing.

## Estructura

```text
frontend/
|-- index.html
|-- assets/img/
|-- src/
|   |-- css/
|   |   |-- styles.css
|   |   |-- base.css
|   |   |-- layout.css
|   |   |-- components.css
|   |   |-- catalog.css
|   |   |-- cart.css
|   |   |-- auth-admin.css
|   |   `-- responsive.css
|   |-- js/
|   |   |-- app.js
|   |   |-- router.js
|   |   |-- api.js
|   |   |-- auth.js
|   |   |-- cart.js
|   |   |-- store.js
|   |   |-- admin.js
|   |   |-- components.js
|   |   `-- utils.js
|   `-- view/
|       |-- layout/
|       |-- public/
|       |-- auth/
|       |-- user/
|       `-- admin/
`-- dev-server.js
```

## Ejecutar

```powershell
cd frontend
node dev-server.js 5501
```

Abrir:

```text
http://localhost:5501
```

El backend debe estar activo en `http://localhost:8080/api`.

La URL del API esta en `src/js/api.js`:

```javascript
const baseUrl = localStorage.getItem("tecnostore.apiUrl") || "http://localhost:8080/api";
```

## Rutas

```text
#/home
#/catalogo
#/producto/:id
#/carrito
#/checkout
#/login
#/registro
#/mis-pedidos
#/admin
#/admin/productos
```

## Administrador

Credenciales:

```text
admin@gmail.com / admin
```

En `#/admin/productos` se puede:

- Crear, editar y desactivar productos.
- Cargar imagen del producto desde un input file con preview.
- Guardar la ruta devuelta por el backend en la columna `image`.
- Crear y editar categorias sin recargar la pagina.

La carga de imagenes usa `POST /api/uploads/product-image`; el backend guarda el archivo en `frontend/assets/img/` y devuelve una ruta relativa como `assets/img/producto.png`.

En `#/admin` se muestra el panel de control con resumen de productos, categorias, pedidos, productos activos, bajo stock, ultimos pedidos y accesos rapidos de administracion.

El dashboard administrador tambien incluye ocho indicadores de gestion con tarjetas, tablas y graficos: rotacion de inventario, ventas diarias, rentabilidad, efectividad de stock minimo, conversion, abandono de carrito, tiempo de carga y pedidos confirmados.
