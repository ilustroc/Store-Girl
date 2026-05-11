# Backend Spring Boot - TecnoStore

API REST para la tienda tecnologica universitaria.

## Tecnologias

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- MySQL
- Maven

## MySQL

Crear la base y cargar datos iniciales:

```powershell
mysql -u root -p < ..\base-de-datos\schema.sql
mysql -u root -p tecnostore_db < ..\base-de-datos\seed.sql
```

El seed agrega compradores y pedidos de muestra para poblar el panel de control administrativo.

Configuracion usada por `application.properties`:

```properties
server.port=8080
server.servlet.context-path=/api
spring.datasource.url=jdbc:mysql://localhost:3306/tecnostore_db?useSSL=false&serverTimezone=America/Lima&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.sql.init.mode=never
```

`schema.sql` y `data.sql` quedan como referencia idempotente, pero no se ejecutan automaticamente para evitar borrar o duplicar datos.

## Ejecutar

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

La API queda en:

```text
http://localhost:8080/api
```

Si ya tienes Maven instalado globalmente, tambien puedes usar `mvn spring-boot:run`.

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

Para crear, editar o eliminar productos, crear o editar categorias, subir imagenes y ver todos los pedidos, enviar el header:

```text
X-User-Role: ADMIN
```

## Carga de imagenes

```text
POST /api/uploads/product-image
Content-Type: multipart/form-data
Campo: file
Respuesta: { "path": "assets/img/nombre-imagen.png" }
```

El archivo se guarda en `frontend/assets/img/`. Si el nombre ya existe, se renombra automaticamente.
