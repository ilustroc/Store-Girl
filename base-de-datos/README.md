# Base de datos

El proyecto usa H2 embebido en modo archivo. Al iniciar el backend se crea automaticamente:

```text
base-de-datos/data/tecnostore.mv.db
```

## Archivos

- `schema.sql`: diseno fisico de tablas.
- `seed.sql`: usuarios y productos iniciales.
- `consultas.sql`: consultas utiles para reportes.

## Entidades principales

- `users`: usuarios normales y administrador.
- `products`: catalogo administrable desde `+ Agregar producto`.
- `sales_orders`: cabecera de pedidos.
- `order_items`: detalle de productos por pedido.

## Nota de seguridad

Las contrasenas estan en texto plano por ser demo academica. En una entrega productiva se debe usar hash seguro, por ejemplo bcrypt, y sesiones/token del lado servidor.
