-- Productos activos con categoria
SELECT p.id, p.name, c.name AS category, p.price, p.stock
FROM products p
JOIN categories c ON c.id = p.category_id
WHERE p.active = TRUE
ORDER BY p.name;

-- Productos por categoria
SELECT c.name AS category, COUNT(p.id) AS total_products
FROM categories c
LEFT JOIN products p ON p.category_id = c.id AND p.active = TRUE
GROUP BY c.name
ORDER BY c.name;

-- Pedidos de un usuario
SELECT o.id, u.email, o.total, o.status, o.created_at
FROM orders o
JOIN users u ON u.id = o.user_id
WHERE u.email = 'usuario@gmail.com'
ORDER BY o.created_at DESC;

-- Detalle de un pedido
SELECT oi.order_id, p.name, oi.quantity, oi.unit_price, oi.subtotal
FROM order_items oi
JOIN products p ON p.id = oi.product_id
WHERE oi.order_id = 1;

-- 1. Rotacion de inventario por categoria
SELECT
    c.name AS category,
    COALESCE(SUM(CASE WHEN o.status = 'CONFIRMED' THEN oi.quantity ELSE 0 END), 0) AS units_sold,
    ROUND(AVG(p.stock), 2) AS average_stock,
    ROUND(COALESCE(SUM(CASE WHEN o.status = 'CONFIRMED' THEN oi.quantity ELSE 0 END), 0) / NULLIF(AVG(p.stock), 0), 2) AS rotation_index
FROM categories c
LEFT JOIN products p ON p.category_id = c.id AND p.active = TRUE
LEFT JOIN order_items oi ON oi.product_id = p.id
LEFT JOIN orders o ON o.id = oi.order_id
GROUP BY c.id, c.name
ORDER BY rotation_index DESC;

-- 2. Densidad de ventas diarias
SELECT DATE(created_at) AS sale_day, SUM(total) AS daily_revenue
FROM orders
WHERE status = 'CONFIRMED'
GROUP BY DATE(created_at)
ORDER BY sale_day;

-- 3. Ranking de rentabilidad por producto
SELECT
    p.name AS product,
    p.price AS sale_price,
    p.cost_price,
    COALESCE(SUM(oi.quantity), 0) AS units_sold,
    ROUND((p.price - COALESCE(p.cost_price, 0)) * COALESCE(SUM(oi.quantity), 0), 2) AS margin
FROM products p
LEFT JOIN order_items oi ON oi.product_id = p.id
LEFT JOIN orders o ON o.id = oi.order_id AND o.status = 'CONFIRMED'
GROUP BY p.id, p.name, p.price, p.cost_price
ORDER BY margin DESC
LIMIT 5;

-- 4. Efectividad de stock minimo
SELECT
    (SELECT COUNT(*) FROM stock_alerts WHERE status = 'ATTENDED') AS attended_alerts,
    (SELECT COUNT(*) FROM products WHERE stock = 0 AND active = TRUE) AS out_of_stock_products,
    ROUND(
        (SELECT COUNT(*) FROM stock_alerts WHERE status = 'ATTENDED') * 100 /
        NULLIF((SELECT COUNT(*) FROM products WHERE stock = 0 AND active = TRUE), 0),
        2
    ) AS stock_effectiveness_rate;

-- 5. Tasa de conversion de ventas
SELECT
    (SELECT COUNT(*) FROM orders WHERE status = 'CONFIRMED') AS confirmed_purchases,
    (SELECT COUNT(*) FROM site_visits) AS total_visits,
    ROUND((SELECT COUNT(*) FROM orders WHERE status = 'CONFIRMED') * 100 / NULLIF((SELECT COUNT(*) FROM site_visits), 0), 2) AS conversion_rate;

-- 6. Tasa de abandono del carrito
SELECT
    COUNT(*) AS total_carts,
    SUM(CASE WHEN status <> 'COMPLETED' THEN 1 ELSE 0 END) AS not_completed_carts,
    ROUND(SUM(CASE WHEN status <> 'COMPLETED' THEN 1 ELSE 0 END) * 100 / NULLIF(COUNT(*), 0), 2) AS abandonment_rate
FROM carts;

-- 7. Tiempo promedio de carga del catalogo
SELECT page, ROUND(AVG(load_time_ms), 0) AS average_load_time_ms, COUNT(*) AS measurements
FROM performance_logs
WHERE page = 'catalogo'
GROUP BY page;

-- 8. Pedidos confirmados correctamente
SELECT
    status,
    COUNT(*) AS total,
    ROUND(COUNT(*) * 100 / NULLIF((SELECT COUNT(*) FROM orders), 0), 2) AS percentage
FROM orders
GROUP BY status
ORDER BY total DESC;
