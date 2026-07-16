# Base de Datos

Motor: MySQL. Base: `tecnostore_db`.

## Ejecutar

```powershell
mysql -u root -p < base-de-datos/schema.sql
mysql -u root -p tecnostore_db < base-de-datos/seed.sql
```

## Tablas

- `users`
- `categories`
- `products`
- `orders`
- `order_items`
- `site_visits`
- `carts`
- `performance_logs`
- `stock_alerts`
- `audit_logs`

## Seguridad

Las contraseñas del seed están cifradas con BCrypt.

```text
admin@gmail.com / Admin@123
usuario@gmail.com / Usuario@123
```

## Reportes

Los reportes de ventas, inventario, productos, rentabilidad, stock bajo, categorías y alertas se calculan desde estas tablas. `audit_logs` registra acciones administrativas importantes como cambios de productos/categorías y exportaciones.
