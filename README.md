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
- H2
- Maven

Ejecutar:

```powershell
cd backend
mvn spring-boot:run
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
GET    /api/products
GET    /api/products/{id}
GET    /api/products/category/{categoryId}
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
POST   /api/orders
GET    /api/orders
GET    /api/orders/user/{userId}
```

## Estructura frontend

```text
frontend/
|-- index.html
|-- assets/img/
`-- src/
    |-- css/
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
