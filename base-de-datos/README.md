# Base de datos

La base esta normalizada para un ecommerce tecnologico:

- `users`: usuarios con rol `ADMIN` o `USER`.
- `categories`: categorias comerciales.
- `products`: catalogo con stock, precio e imagen.
- `orders`: pedidos confirmados por usuario.
- `order_items`: detalle de productos por pedido.
- `site_visits`: visitas registradas para conversion.
- `carts`: seguimiento de carritos activos, completados y abandonados.
- `performance_logs`: tiempos de carga del catalogo.
- `stock_alerts`: alertas de stock minimo.

El backend Spring Boot usa MySQL con la base `tecnostore_db`.

## Estados de pedido

```text
PENDING
CONFIRMED
CANCELLED
```

En el prototipo, al confirmar checkout se crea el pedido con estado `CONFIRMED` y se descuenta stock.

## Configuracion MySQL

Ejecutar desde la raiz del proyecto:

```powershell
mysql -u root -p < base-de-datos/schema.sql
mysql -u root -p tecnostore_db < base-de-datos/seed.sql
```

`schema.sql` crea la base y tablas con `CREATE TABLE IF NOT EXISTS`.

`seed.sql` carga usuarios, categorias, 12 productos tecnologicos, costos de producto, visitas, carritos, mediciones de rendimiento, alertas de stock y una muestra de compras para alimentar el panel administrativo sin duplicar datos:

```text
Administrador: admin@gmail.com / admin
Usuario:       usuario@gmail.com / usuario
```

Tambien agrega compradores de ejemplo:

```text
ana.torres@gmail.com
carlos.ramirez@gmail.com
valeria.soto@gmail.com
diego.chavez@gmail.com
mariana.vega@gmail.com
```

Las compras de muestra usan pedidos con IDs `101` a `105` y detalles con IDs `1001` a `1009`, por lo que el script puede ejecutarse varias veces sin repetir esos registros.

El backend tiene `spring.sql.init.mode=never`, por lo que no ejecuta estos scripts automaticamente al iniciar. Esto evita borrar informacion o repetir inserts en cada arranque.

## Relaciones

```text
products.category_id -> categories.id
orders.user_id -> users.id
order_items.order_id -> orders.id
order_items.product_id -> products.id
```

Las imagenes de productos se guardan como ruta relativa en `products.image`, por ejemplo `assets/img/iphone15.png`.
