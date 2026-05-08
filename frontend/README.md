# Frontend Bootstrap - TecnoStore

SPA simple con HTML, CSS, JavaScript, Bootstrap 5 y hash routing.

## Estructura

```text
frontend/
|-- index.html
|-- assets/img/
|-- src/
|   |-- css/styles.css
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
