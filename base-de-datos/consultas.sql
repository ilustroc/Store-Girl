-- Productos activos para el catalogo
SELECT id, name, category, price, stock
FROM products
WHERE active = TRUE
ORDER BY name;

-- Ventas por estado
SELECT status, COUNT(*) AS total_pedidos, SUM(total) AS total_ventas
FROM sales_orders
GROUP BY status;

-- Productos mas vendidos
SELECT product_name, SUM(quantity) AS unidades, SUM(subtotal) AS ventas
FROM order_items
GROUP BY product_name
ORDER BY unidades DESC;

-- Pedidos de un usuario
SELECT order_number, customer_email, status, total, created_at
FROM sales_orders
WHERE customer_email = 'usuario@gmail.com'
ORDER BY created_at DESC;
