# TecnoStore

TecnoStore es un proyecto universitario de ecommerce tecnologico. El sistema incluye frontend con rutas dinamicas, backend Spring Boot, base de datos normalizada, carrito, checkout, pedidos, login con roles y CRUD de productos.

No incluye modulo de reportes por ahora.

## Arquitectura

```text
STORE/
|-- frontend/
|-- backend/
|-- base-de-datos/
|-- documentacion/
`-- _legacy_original/
```

## Frontend

Tecnologias:

- HTML
- CSS
- JavaScript
- Bootstrap 5
- Hash routing

Ejecutar:

```powershell
cd frontend
node dev-server.js 5501
```

Abrir:

```text
http://localhost:5501
```

## Backend

Tecnologias:

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- MySQL
- Maven

Configurar MySQL:

```powershell
mysql -u root -p < base-de-datos/schema.sql
mysql -u root -p tecnostore_db < base-de-datos/seed.sql
```

El seed incluye compradores y pedidos de muestra para que el dashboard administrativo tenga actividad desde el primer arranque.

Por defecto el backend usa:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tecnostore_db
spring.datasource.username=root
spring.datasource.password=root
```

Ejecutar:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

API:

```text
http://localhost:8080/api
```

## Credenciales de prueba

```text
Administrador: admin@gmail.com / admin
Usuario:       usuario@gmail.com / usuario
```

## Endpoints principales

```text
POST   /api/auth/login
POST   /api/auth/register
GET    /api/categories
POST   /api/categories
PUT    /api/categories/{id}
GET    /api/admin/dashboard
GET    /api/admin/indicators
GET    /api/products
GET    /api/products/{id}
GET    /api/products/category/{categoryId}
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
POST   /api/uploads/product-image
POST   /api/analytics/visit
POST   /api/analytics/performance
POST   /api/analytics/cart
POST   /api/orders
GET    /api/orders
GET    /api/orders/user/{userId}
```

Las acciones administrativas usan el header `X-User-Role: ADMIN`.

## Carga de imagenes

Desde `#/admin/productos`, el administrador puede seleccionar una imagen en el modal de producto. El frontend la envia a `POST /api/uploads/product-image`; Spring Boot la guarda en `frontend/assets/img/` y devuelve una ruta como `assets/img/producto.png`, que se guarda en la columna `image`.

Si el nombre ya existe, el backend genera automaticamente `producto-1.png`, `producto-2.png`, etc.

## Estructura frontend

```text
frontend/
|-- index.html
|-- assets/img/
`-- src/
    |-- css/
    |   |-- styles.css
    |   |-- base.css
    |   |-- layout.css
    |   |-- components.css
    |   |-- catalog.css
    |   |-- cart.css
    |   |-- auth-admin.css
    |   `-- responsive.css
    |-- js/
    `-- view/
        |-- layout/
        |-- public/
        |-- auth/
        |-- user/
        `-- admin/
```

## Estructura backend

```text
backend/
|-- pom.xml
`-- src/main/
    |-- java/com/tecnostore/
    `-- resources/
```

## Documentacion

La carpeta `documentacion/` contiene contexto, SRS, alternativas, diseno tecnico, BPM, base de datos, UML, prototipo UX/UI, Project Charter y Gantt.

Los diagramas tecnicos estan en `documentacion/plantuml/` y usan PlantUML:

```text
arquitectura-general.puml
mvc.puml
repository-pattern.puml
dto-pattern.puml
flujo-compra.puml
flujo-admin-producto.puml
clases-principales.puml
erd-base-datos.puml
dashboard-indicadores.puml
```

Pueden renderizarse con la extension PlantUML en VS Code, PlantUML online o cualquier visor compatible.

La documentacion de los ocho indicadores de gestion esta en `documentacion/11-indicadores-gestion.md`.
