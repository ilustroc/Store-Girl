# Tecno Store

Proyecto reorganizado en frontend, backend y base de datos.

```text
Store/
|-- frontend/
|   |-- index.html
|   |-- css/
|   |-- js/
|   `-- assets/img/
|-- backend/
|   |-- src/com/tecnostore/
|   |-- scripts/
|   `-- lib/
|-- base-de-datos/
|   |-- schema.sql
|   |-- seed.sql
|   `-- consultas.sql
|-- documentacion/
`-- _legacy_original/
```

## Como ejecutar

1. Backend:

```powershell
cd backend
.\scripts\run.ps1
```

2. Frontend en otra terminal:

```powershell
cd frontend
node dev-server.js
```

3. Abrir:

```text
http://localhost:5500
```

## Credenciales

```text
Administrador: admin@gmail.com / admin
Usuario demo:   usuario@gmail.com / usuario
```

## Que se implemento

- Frontend con Bootstrap 5.
- Navbar, hero, catalogo, carrito y modales.
- Login/registro de usuario.
- Rol administrador.
- Panel admin con `+ Agregar producto`.
- Productos guardados en base de datos H2.
- API REST en Java 17.
- Pedidos con detalle y actualizacion de estado.
- Scripts SQL y documentacion tecnica para la entrega.

La version original quedo archivada en `_legacy_original`.
