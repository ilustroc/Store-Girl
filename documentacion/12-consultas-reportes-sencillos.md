# Ideas de consultas para reportes sencillos

Este documento propone consultas SQL simples para generar reportes basicos desde MySQL. Se pueden ejecutar sobre la base `tecnostore_db` y adaptar luego a una pantalla de reportes, exportacion CSV o panel administrativo.

## 1. Reporte de productos activos

Muestra los productos visibles para el cliente, con categoria, precio de venta y stock.

```sql
SELECT
    p.id,
    p.name AS producto,
    c.name AS categoria,
    p.price AS precio_venta,
    p.stock,
    p.active AS activo
FROM products p
JOIN categories c ON c.id = p.category_id
WHERE p.active = TRUE
ORDER BY c.name, p.name;
```

## 2. Reporte de productos con stock bajo

Ayuda al administrador a identificar productos que necesitan reposicion.

```sql
SELECT
    p.id,
    p.name AS producto,
    c.name AS categoria,
    p.stock,
    p.price AS precio_venta
FROM products p
JOIN categories c ON c.id = p.category_id
WHERE p.active = TRUE
  AND p.stock <= 5
ORDER BY p.stock ASC, p.name;
```

## 3. Reporte de ventas por dia

Resume el total vendido por fecha usando solo pedidos confirmados.

```sql
SELECT
    DATE(o.created_at) AS fecha,
    COUNT(o.id) AS pedidos_confirmados,
    SUM(o.total) AS total_vendido
FROM orders o
WHERE o.status = 'CONFIRMED'
GROUP BY DATE(o.created_at)
ORDER BY fecha DESC;
```

## 4. Reporte de ventas por producto

Muestra que productos se vendieron mas y cuanto ingreso generaron.

```sql
SELECT
    p.name AS producto,
    c.name AS categoria,
    SUM(oi.quantity) AS unidades_vendidas,
    SUM(oi.subtotal) AS total_vendido
FROM order_items oi
JOIN products p ON p.id = oi.product_id
JOIN categories c ON c.id = p.category_id
JOIN orders o ON o.id = oi.order_id
WHERE o.status = 'CONFIRMED'
GROUP BY p.id, p.name, c.name
ORDER BY unidades_vendidas DESC, total_vendido DESC;
```

## 5. Reporte de rentabilidad simple

Compara el precio de venta con el costo interno para estimar margen por producto.

```sql
SELECT
    p.name AS producto,
    p.price AS precio_venta,
    p.cost_price AS costo_interno,
    COALESCE(SUM(oi.quantity), 0) AS unidades_vendidas,
    ROUND((p.price - p.cost_price) * COALESCE(SUM(oi.quantity), 0), 2) AS margen_estimado
FROM products p
LEFT JOIN order_items oi ON oi.product_id = p.id
LEFT JOIN orders o ON o.id = oi.order_id AND o.status = 'CONFIRMED'
WHERE p.active = TRUE
GROUP BY p.id, p.name, p.price, p.cost_price
ORDER BY margen_estimado DESC;
```

## 6. Reporte de pedidos por cliente

Sirve para revisar cuantos pedidos realizo cada usuario y su gasto acumulado.

```sql
SELECT
    u.full_name AS cliente,
    u.email,
    COUNT(o.id) AS total_pedidos,
    COALESCE(SUM(o.total), 0) AS total_comprado
FROM users u
LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'CONFIRMED'
WHERE u.role = 'USER'
GROUP BY u.id, u.full_name, u.email
ORDER BY total_comprado DESC;
```

## 7. Reporte de detalle de pedidos

Lista cada pedido con su cliente, producto, cantidad y subtotal.

```sql
SELECT
    o.id AS pedido_id,
    DATE(o.created_at) AS fecha,
    u.full_name AS cliente,
    p.name AS producto,
    oi.quantity AS cantidad,
    oi.unit_price AS precio_unitario,
    oi.subtotal
FROM orders o
JOIN users u ON u.id = o.user_id
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
ORDER BY o.created_at DESC, o.id DESC;
```

## 8. Reporte de productos por categoria

Resume cuantos productos hay por categoria y el stock total disponible.

```sql
SELECT
    c.name AS categoria,
    COUNT(p.id) AS total_productos,
    COALESCE(SUM(p.stock), 0) AS stock_total,
    COALESCE(ROUND(AVG(p.price), 2), 0) AS precio_promedio
FROM categories c
LEFT JOIN products p ON p.category_id = c.id AND p.active = TRUE
GROUP BY c.id, c.name
ORDER BY total_productos DESC, c.name;
```

## 9. Reporte de pedidos por estado

Permite ver cuantos pedidos hay en cada estado.

```sql
SELECT
    o.status AS estado,
    COUNT(o.id) AS total_pedidos,
    COALESCE(SUM(o.total), 0) AS importe_total
FROM orders o
GROUP BY o.status
ORDER BY total_pedidos DESC;
```

## 10. Reporte de visitas por pagina

Usa la tabla de analitica para saber que paginas reciben mas visitas.

```sql
SELECT
    page AS pagina,
    COUNT(*) AS visitas,
    MIN(visited_at) AS primera_visita,
    MAX(visited_at) AS ultima_visita
FROM site_visits
GROUP BY page
ORDER BY visitas DESC;
```

## 11. Reporte de carritos abandonados

Cuenta carritos no completados para medir oportunidades perdidas.

```sql
SELECT
    status AS estado,
    COUNT(*) AS total_carritos
FROM carts
GROUP BY status
ORDER BY total_carritos DESC;
```

## 12. Reporte de rendimiento del catalogo

Muestra el tiempo promedio de carga registrado para la pagina de catalogo.

```sql
SELECT
    page AS pagina,
    COUNT(*) AS mediciones,
    ROUND(AVG(load_time_ms), 0) AS promedio_ms,
    MIN(load_time_ms) AS minimo_ms,
    MAX(load_time_ms) AS maximo_ms
FROM performance_logs
WHERE page = 'catalogo'
GROUP BY page;
```

## Recomendacion de uso

- Para reportes de ventas, usar siempre `WHERE o.status = 'CONFIRMED'`.
- Para reportes publicos de productos, usar `WHERE p.active = TRUE`.
- `price` es el precio de venta que ve el cliente.
- `cost_price` es el costo interno y debe usarse solo en reportes administrativos.
- Para exportar a Excel o CSV, las consultas 3, 4, 6 y 7 son las mas utiles.
