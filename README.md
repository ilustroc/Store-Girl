# TecnoStore

TecnoStore es una tienda online de tecnología con frontend Bootstrap, API Spring Boot, MySQL, autenticación JWT, carrito, checkout, pedidos, dashboard administrativo, CRUD de productos/categorías, indicadores de gestión y reportes exportables.

## Arquitectura

```text
STORE/
|-- frontend/
|-- backend/
|-- base-de-datos/
|-- documentacion/
`-- _legacy_original/
```

## Ejecución

1. Crear base y datos:

```powershell
mysql -u root -p < base-de-datos/schema.sql
mysql -u root -p tecnostore_db < base-de-datos/seed.sql
```

2. Levantar backend:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

3. Levantar frontend:

```powershell
cd frontend
node dev-server.js 5501
```

Abrir `http://localhost:5501`.

## Credenciales

```text
Administrador: admin@gmail.com / Admin@123
Usuario:       usuario@gmail.com / Usuario@123
```

## Seguridad

- Login y registro usan `POST /api/auth/login` y `POST /api/auth/register`.
- El backend devuelve JWT y datos mínimos del usuario.
- El frontend envía `Authorization: Bearer <token>`.
- Las contraseñas se guardan con BCrypt.
- Los endpoints administrativos se protegen en backend con Spring Security.

## Endpoints Principales

```text
POST   /api/auth/login
POST   /api/auth/register
GET    /api/products
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
GET    /api/categories
POST   /api/categories
PUT    /api/categories/{id}
DELETE /api/categories/{id}
POST   /api/orders
GET    /api/orders
GET    /api/orders/user/{userId}
GET    /api/admin/dashboard
GET    /api/admin/indicators
GET    /api/reports/{type}
GET    /api/reports/{type}/xlsx
GET    /api/reports/{type}/pdf
POST   /api/uploads/product-image
```

## Reportes

Ruta frontend: `#/admin/reportes`.

Reportes disponibles: ventas, pedidos, inventario, productos, rentabilidad, stock bajo, categorías, alertas de stock y auditoría. Los filtros aplicados en pantalla se usan también al exportar XLSX o PDF.

## Documentación

La documentación está en `documentacion/`. Los diagramas usan PlantUML y se ubican en `documentacion/plantuml/`.
