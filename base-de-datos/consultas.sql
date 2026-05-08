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
