# 04. Diseno tecnico

## Arquitectura

```text
Frontend Bootstrap 5
        |
        | HTTP / JSON
        v
Backend Spring Boot
        |
        | JPA
        v
Base de datos H2
```

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
- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/products/category/{categoryId}`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/user/{userId}`
