# Backend Spring Boot - TecnoStore

API REST para la tienda tecnologica universitaria.

## Tecnologias

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- H2
- Maven

## Ejecutar

```powershell
cd backend
mvn spring-boot:run
```

La API queda en:

```text
http://localhost:8080/api
```

## Credenciales

```text
Administrador: admin@gmail.com / admin
Usuario:       usuario@gmail.com / usuario
```

## Endpoints

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

Para crear, editar o eliminar productos, enviar el header:

```text
X-User-Role: ADMIN
```

## H2 Console

```text
http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:tecnostore
User: sa
Password:
```
