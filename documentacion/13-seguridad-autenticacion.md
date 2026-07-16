# 13. Seguridad y Autenticación

TecnoStore usa Spring Security con JWT.

## Flujo

1. Usuario envía correo y contraseña a `POST /api/auth/login`.
2. Backend valida BCrypt.
3. Backend devuelve JWT y datos mínimos: `id`, `fullName`, `email`, `role`, `phone`.
4. Frontend guarda la sesión en `localStorage`.
5. API envía `Authorization: Bearer <token>`.
6. Logout elimina la sesión local.

## Validaciones

- Contraseña: mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.
- Teléfono: `^9\d{8}$`.
- Registro siempre crea rol `USER`.

## Roles

- `ADMIN`: dashboard, productos, categorías, pedidos generales, indicadores, reportes e imágenes.
- `USER`: catálogo, carrito, checkout y sus pedidos.

## Errores

- 401: no autenticado.
- 403: sin permiso.
- 400: validación incorrecta.
- 409: duplicados.
