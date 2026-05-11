# 06. Base de datos

## Tablas

- `users`: compradores y administradores.
- `categories`: clasificacion del catalogo.
- `products`: productos activos o desactivados, precio, stock e imagen.
- `orders`: pedidos confirmados por usuario.
- `order_items`: detalle de cada pedido.
- `site_visits`: visitas anonimas o autenticadas usadas para conversion.
- `carts`: estado del carrito para medir abandono.
- `performance_logs`: mediciones de carga del catalogo.
- `stock_alerts`: alertas de stock minimo y seguimiento de atencion.

## Relaciones principales

```text
users.id             -> orders.user_id
categories.id        -> products.category_id
orders.id            -> order_items.order_id
products.id          -> order_items.product_id
users.id             -> carts.user_id
products.id          -> stock_alerts.product_id
```

## Diagrama ERD

El diagrama entidad-relacion esta en PlantUML:

- `plantuml/erd-base-datos.puml`

Puede renderizarse con la extension PlantUML en VS Code, PlantUML online o cualquier visor compatible.

## Consideraciones

- La base activa es MySQL: `tecnostore_db`.
- `products.active` permite desactivar productos sin eliminarlos fisicamente.
- `products.image` guarda rutas relativas como `assets/img/iphone15.png`.
- `products.cost_price` permite calcular rentabilidad por producto.
- Las tablas `site_visits`, `carts`, `performance_logs` y `stock_alerts` alimentan el dashboard de indicadores de gestion.
- Los scripts de base de datos estan en `base-de-datos/schema.sql` y `base-de-datos/seed.sql`.
