# Backend Spring Boot - TecnoStore

API REST con Java 17, Spring Boot 3.3.5, Spring Data JPA, MySQL, Spring Security, JWT, BCrypt, Apache POI y OpenPDF.

## Configuración

El backend usa `server.servlet.context-path=/api`, por eso los controllers declaran rutas internas como `/products`, `/auth`, `/orders`, `/admin` y `/reports`.

Variables recomendadas:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
CORS_ALLOWED_ORIGINS
```

Para desarrollo local se mantienen valores por defecto en `application.properties`.

## Ejecutar

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

## Seguridad

- Login: `POST /api/auth/login`.
- Registro: `POST /api/auth/register`.
- Respuesta de login: `id`, `fullName`, `email`, `role`, `phone`, `token`.
- Enviar token: `Authorization: Bearer <jwt>`.
- ADMIN protege productos, categorías, indicadores, reportes, pedidos generales e imágenes.
- USER puede comprar y consultar sus propios pedidos.

Credenciales de prueba:

```text
admin@gmail.com / Admin@123
usuario@gmail.com / Usuario@123
```

## Reportes

```text
GET /api/reports/sales
GET /api/reports/inventory
GET /api/reports/products
GET /api/reports/profitability
GET /api/reports/{type}/xlsx
GET /api/reports/{type}/pdf
```

Las exportaciones generan archivos reales XLSX y PDF con filtros, encabezados, datos y resumen.
