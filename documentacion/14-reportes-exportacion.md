# 14. Reportes y Exportación

Ruta frontend: `#/admin/reportes`.

## Reportes

- Ventas.
- Pedidos.
- Inventario.
- Productos.
- Rentabilidad.
- Stock bajo.
- Categorías.
- Alertas de stock.
- Auditoría.

## Endpoints

```text
GET /api/reports/{type}
GET /api/reports/{type}/xlsx
GET /api/reports/{type}/pdf
```

## Filtros

Fecha inicial, fecha final, estado, categoría, producto, cliente, stock mínimo, stock máximo, estado activo/inactivo, precio mínimo y precio máximo.

Los mismos filtros se aplican a pantalla, XLSX y PDF.

## Librerías

- Apache POI para XLSX real.
- OpenPDF para PDF real.

Las exportaciones registran auditoría en `audit_logs`.
