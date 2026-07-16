# 11. Indicadores de Gestión

El panel `#/admin` muestra ocho indicadores calculados desde MySQL mediante `GET /api/admin/indicators`. El endpoint requiere JWT con rol `ADMIN`.

## Indicadores

1. Índice de rotación de inventario por categoría.
2. Densidad de ventas diarias.
3. Ranking de rentabilidad por producto.
4. Tasa de efectividad de stock mínimo.
5. Tasa de conversión de ventas.
6. Tasa de abandono del carrito.
7. Tiempo promedio de carga del catálogo.
8. Porcentaje de pedidos confirmados correctamente.

Cada indicador muestra descripción, fórmula, frecuencia, meta, valor, estado visual y datos o mensaje “No hay datos suficientes”.

## Datos Utilizados

- `categories`
- `products`
- `orders`
- `order_items`
- `site_visits`
- `carts`
- `performance_logs`
- `stock_alerts`

## Gestión de Errores

Cuando no existe información suficiente, el backend retorna `0`, listas vacías o mensajes controlados. El frontend no divide entre cero ni rompe gráficos vacíos.

## Diagrama

Ver `documentacion/plantuml/dashboard-indicadores.puml`.
