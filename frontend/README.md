# Frontend Bootstrap - TecnoStore

SPA con HTML, CSS, JavaScript, Bootstrap 5 y hash routing.

## Ejecutar

```powershell
cd frontend
node dev-server.js 5501
```

Abrir `http://localhost:5501`.

## API

`src/js/api.js` usa:

```javascript
const API_BASE_URL = localStorage.getItem("tecnostore.apiUrl") || "http://localhost:8080/api";
```

Después del login, el JWT se guarda en `localStorage` junto con datos mínimos del usuario y se envía como `Authorization: Bearer <token>`.

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
#/admin/reportes
```

## Validaciones

- Contraseña: mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.
- Teléfono peruano: 9 dígitos y empieza con 9.

## Administrador

El panel permite gestionar productos, categorías, imágenes, indicadores y reportes exportables.
