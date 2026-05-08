# 02. Requerimientos SRS

## Requerimientos funcionales

- RF01: El usuario puede registrarse e iniciar sesion.
- RF02: El sistema maneja roles `ADMIN` y `USER`.
- RF03: El usuario puede ver productos activos.
- RF04: El usuario puede filtrar productos por categoria.
- RF05: El usuario puede ver el detalle de un producto.
- RF06: El usuario puede agregar productos al carrito.
- RF07: El usuario puede confirmar un pedido desde checkout.
- RF08: El sistema valida stock antes de crear el pedido.
- RF09: El sistema descuenta stock al confirmar la compra.
- RF10: El administrador puede crear, editar y desactivar productos.
- RF11: El usuario puede consultar sus pedidos.

## Requerimientos no funcionales

- RNF01: El frontend debe ser responsive.
- RNF02: La API debe estar hecha en Java con Spring Boot.
- RNF03: La base de datos debe estar normalizada.
- RNF04: El proyecto debe ser facil de ejecutar localmente.
- RNF05: La documentacion debe servir para exposicion universitaria.

## Restricciones

- No se implementa modulo de reportes por ahora.
- Las contrasenas se manejan en texto plano solo por ser prototipo academico.
