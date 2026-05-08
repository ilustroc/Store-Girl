# Base de datos

La base esta normalizada para un ecommerce tecnologico:

- `users`: usuarios con rol `ADMIN` o `USER`.
- `categories`: categorias comerciales.
- `products`: catalogo con stock, precio e imagen.
- `orders`: pedidos confirmados por usuario.
- `order_items`: detalle de productos por pedido.

El backend Spring Boot usa H2 en memoria para ejecucion local y carga `schema.sql` + `data.sql` automaticamente.

## Estados de pedido

```text
PENDING
CONFIRMED
CANCELLED
```

En el prototipo, al confirmar checkout se crea el pedido con estado `CONFIRMED` y se descuenta stock.

## Migracion a MySQL

La estructura SQL usa tipos compatibles con MySQL. Para migrar, crear una base `tecnostore`, ejecutar `schema.sql`, `seed.sql` y cambiar la configuracion en `backend/src/main/resources/application.properties`.
