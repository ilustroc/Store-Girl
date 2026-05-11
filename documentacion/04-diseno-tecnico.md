# 04. Diseno tecnico

## Arquitectura

```text
Frontend HTML + CSS + JavaScript + Bootstrap 5
        |
        | HTTP / JSON
        v
Backend Spring Boot
        |
        | JPA
        v
Base de datos MySQL
```

Los diagramas tecnicos del proyecto estan en `documentacion/plantuml/` y usan PlantUML. Se pueden renderizar con la extension PlantUML de VS Code, PlantUML online o cualquier visor compatible.

Diagramas relacionados:

- `plantuml/arquitectura-general.puml`
- `plantuml/mvc.puml`
- `plantuml/repository-pattern.puml`
- `plantuml/dto-pattern.puml`
- `plantuml/flujo-compra.puml`
- `plantuml/flujo-admin-producto.puml`
- `plantuml/clases-principales.puml`
- `plantuml/erd-base-datos.puml`
- `plantuml/dashboard-indicadores.puml`

## Capas del backend

- `controller`: expone endpoints REST.
- `dto`: define datos de entrada y salida.
- `model`: entidades JPA.
- `repository`: acceso a datos.
- `service`: reglas de negocio.
- `exception`: manejo centralizado de errores.

## Endpoints principales

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/products/category/{categoryId}`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`
- `POST /api/uploads/product-image`
- `GET /api/admin/dashboard`
- `GET /api/admin/indicators`
- `POST /api/analytics/visit`
- `POST /api/analytics/performance`
- `POST /api/analytics/cart`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/user/{userId}`
