# Backend Java - Tecno Store

API REST hecha con Java 17, H2 embebido y `HttpServer` del JDK.

## Ejecutar

Desde `backend`:

```powershell
.\scripts\run.ps1
```

La API queda en:

```text
http://localhost:8080/api
```

El script descarga H2 si falta, compila el codigo Java y arranca el servidor.

## Credenciales demo

```text
Admin:   admin@gmail.com / admin
Usuario: usuario@gmail.com / usuario
```

## Endpoints principales

```text
GET    /api/health
GET    /api/products
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
POST   /api/auth/login
POST   /api/auth/register
GET    /api/users
GET    /api/orders
POST   /api/orders
PATCH  /api/orders/{orderNumber}/status
```

Para acciones administrativas el frontend envia `X-User-Role: admin`.

> Seguridad: las claves estan en texto plano porque es una demo academica. En produccion se debe usar hash de contrasenas, JWT/sesiones reales y HTTPS.
