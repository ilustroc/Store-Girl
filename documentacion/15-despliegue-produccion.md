# 15. Despliegue a Producción

## Perfiles

- `application-dev.properties`: desarrollo local.
- `application-prod.properties`: producción con variables de entorno.

## Variables

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
CORS_ALLOWED_ORIGINS
```

## Reglas

- No subir `.env`.
- No subir credenciales reales.
- No subir `target/`, logs ni temporales.
- No activar H2.
- No mostrar stacktrace al usuario.
- Configurar CORS con dominios reales.
- Usar un `JWT_SECRET` fuerte.
