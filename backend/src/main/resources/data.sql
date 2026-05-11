INSERT IGNORE INTO users (full_name, email, password, role, phone, active) VALUES
('Administrador', 'admin@gmail.com', 'admin', 'ADMIN', '+51 999 888 777', TRUE),
('Usuario Demo', 'usuario@gmail.com', 'usuario', 'USER', '+51 988 777 666', TRUE),
('Ana Torres', 'ana.torres@gmail.com', 'usuario', 'USER', '+51 955 120 441', TRUE),
('Carlos Ramirez', 'carlos.ramirez@gmail.com', 'usuario', 'USER', '+51 944 331 902', TRUE),
('Valeria Soto', 'valeria.soto@gmail.com', 'usuario', 'USER', '+51 933 770 118', TRUE),
('Diego Chavez', 'diego.chavez@gmail.com', 'usuario', 'USER', '+51 922 604 833', TRUE),
('Mariana Vega', 'mariana.vega@gmail.com', 'usuario', 'USER', '+51 911 805 274', TRUE);

INSERT IGNORE INTO categories (name, description) VALUES
('Smartphones', 'Telefonos inteligentes de gama media y alta'),
('Laptops', 'Computadoras portatiles para estudio, trabajo y gaming'),
('Tablets', 'Tablets para productividad y entretenimiento'),
('Audio', 'Audifonos y dispositivos de sonido'),
('Gaming', 'Consolas y perifericos para videojuegos'),
('Wearables', 'Relojes inteligentes y dispositivos vestibles'),
('TV', 'Televisores y pantallas inteligentes'),
('Camaras', 'Camaras fotograficas y video profesional');

INSERT INTO products (name, description, category_id, price, stock, image, active)
SELECT 'iPhone 15 Pro', 'Smartphone premium con chip A17 Pro, pantalla Super Retina y camara profesional.', c.id, 1199.00, 18, 'assets/img/iphone15.png', TRUE
FROM categories c WHERE c.name = 'Smartphones' AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'iPhone 15 Pro');

INSERT INTO products (name, description, category_id, price, stock, image, active)
SELECT 'MacBook Pro M3', 'Laptop profesional con chip M3 para desarrollo, diseno y productividad avanzada.', c.id, 2299.00, 10, 'assets/img/laptop.png', TRUE
FROM categories c WHERE c.name = 'Laptops' AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'MacBook Pro M3');

INSERT INTO products (name, description, category_id, price, stock, image, active)
SELECT 'iPad Air', 'Tablet ligera y potente para estudiar, dibujar, trabajar y ver contenido.', c.id, 699.00, 20, 'assets/img/ipadair.png', TRUE
FROM categories c WHERE c.name = 'Tablets' AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'iPad Air');

INSERT INTO products (name, description, category_id, price, stock, image, active)
SELECT 'AirPods Pro', 'Audifonos inalambricos con cancelacion activa de ruido y audio espacial.', c.id, 249.00, 35, 'assets/img/airpodspro.png', TRUE
FROM categories c WHERE c.name = 'Audio' AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'AirPods Pro');

INSERT INTO products (name, description, category_id, price, stock, image, active)
SELECT 'Samsung Galaxy S24', 'Smartphone Android con pantalla AMOLED, alto rendimiento y camara avanzada.', c.id, 999.00, 16, 'assets/img/galaxys24.png', TRUE
FROM categories c WHERE c.name = 'Smartphones' AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Samsung Galaxy S24');

INSERT INTO products (name, description, category_id, price, stock, image, active)
SELECT 'Dell XPS 13', 'Ultrabook premium con pantalla compacta, diseno ligero y alto rendimiento.', c.id, 1299.00, 12, 'assets/img/dellxps13.png', TRUE
FROM categories c WHERE c.name = 'Laptops' AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Dell XPS 13');

INSERT INTO products (name, description, category_id, price, stock, image, active)
SELECT 'Nintendo Switch', 'Consola hibrida para jugar en modo portatil o conectada al televisor.', c.id, 349.00, 25, 'assets/img/nintendoswitch.png', TRUE
FROM categories c WHERE c.name = 'Gaming' AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Nintendo Switch');

INSERT INTO products (name, description, category_id, price, stock, image, active)
SELECT 'Apple Watch Series 9', 'Reloj inteligente con GPS, seguimiento de salud y notificaciones.', c.id, 429.00, 22, 'assets/img/applewatchseries9.png', TRUE
FROM categories c WHERE c.name = 'Wearables' AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Apple Watch Series 9');

INSERT INTO products (name, description, category_id, price, stock, image, active)
SELECT 'Sony WH-1000XM5', 'Audifonos over-ear con cancelacion de ruido lider y sonido de alta calidad.', c.id, 399.00, 15, 'assets/img/sonywh1000xm5.png', TRUE
FROM categories c WHERE c.name = 'Audio' AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Sony WH-1000XM5');

INSERT INTO products (name, description, category_id, price, stock, image, active)
SELECT 'LG OLED 65', 'Smart TV OLED 4K con HDR, Dolby Vision y alto contraste para cine en casa.', c.id, 1899.00, 8, 'assets/img/lgoled65.png', TRUE
FROM categories c WHERE c.name = 'TV' AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'LG OLED 65');

INSERT INTO products (name, description, category_id, price, stock, image, active)
SELECT 'Canon EOS R6', 'Camara mirrorless profesional con enfoque rapido y grabacion 4K.', c.id, 2499.00, 7, 'assets/img/canoneosr6.png', TRUE
FROM categories c WHERE c.name = 'Camaras' AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Canon EOS R6');

INSERT INTO products (name, description, category_id, price, stock, image, active)
SELECT 'Razer DeathAdder V3', 'Mouse gaming ergonomico con sensor de alta precision y respuesta rapida.', c.id, 89.00, 40, 'assets/img/razerdeathadderv3.png', TRUE
FROM categories c WHERE c.name = 'Gaming' AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Razer DeathAdder V3');

UPDATE products SET stock = LEAST(stock, 4) WHERE name = 'Canon EOS R6';
UPDATE products SET stock = LEAST(stock, 3) WHERE name = 'LG OLED 65';

UPDATE products SET cost_price = 780.00 WHERE name = 'iPhone 15 Pro';
UPDATE products SET cost_price = 1600.00 WHERE name = 'MacBook Pro M3';
UPDATE products SET cost_price = 430.00 WHERE name = 'iPad Air';
UPDATE products SET cost_price = 135.00 WHERE name = 'AirPods Pro';
UPDATE products SET cost_price = 650.00 WHERE name = 'Samsung Galaxy S24';
UPDATE products SET cost_price = 880.00 WHERE name = 'Dell XPS 13';
UPDATE products SET cost_price = 230.00 WHERE name = 'Nintendo Switch';
UPDATE products SET cost_price = 285.00 WHERE name = 'Apple Watch Series 9';
UPDATE products SET cost_price = 250.00 WHERE name = 'Sony WH-1000XM5';
UPDATE products SET cost_price = 1280.00 WHERE name = 'LG OLED 65';
UPDATE products SET cost_price = 1750.00 WHERE name = 'Canon EOS R6';
UPDATE products SET cost_price = 45.00 WHERE name = 'Razer DeathAdder V3';

INSERT INTO orders (id, user_id, total, status, created_at)
SELECT 101, u.id, 0.00, 'CONFIRMED', '2026-05-10 09:15:00'
FROM users u
WHERE u.email = 'ana.torres@gmail.com'
AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.id = 101);

INSERT INTO orders (id, user_id, total, status, created_at)
SELECT 102, u.id, 0.00, 'CONFIRMED', '2026-05-10 10:40:00'
FROM users u
WHERE u.email = 'carlos.ramirez@gmail.com'
AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.id = 102);

INSERT INTO orders (id, user_id, total, status, created_at)
SELECT 103, u.id, 0.00, 'CONFIRMED', '2026-05-10 12:05:00'
FROM users u
WHERE u.email = 'valeria.soto@gmail.com'
AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.id = 103);

INSERT INTO orders (id, user_id, total, status, created_at)
SELECT 104, u.id, 0.00, 'CONFIRMED', '2026-05-10 15:30:00'
FROM users u
WHERE u.email = 'diego.chavez@gmail.com'
AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.id = 104);

INSERT INTO orders (id, user_id, total, status, created_at)
SELECT 105, u.id, 0.00, 'PENDING', '2026-05-10 17:20:00'
FROM users u
WHERE u.email = 'mariana.vega@gmail.com'
AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.id = 105);

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal)
SELECT 1001, 101, p.id, 1, p.price, p.price
FROM products p
WHERE p.name = 'iPhone 15 Pro'
AND EXISTS (SELECT 1 FROM orders o WHERE o.id = 101)
AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.id = 1001);

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal)
SELECT 1002, 101, p.id, 1, p.price, p.price
FROM products p
WHERE p.name = 'AirPods Pro'
AND EXISTS (SELECT 1 FROM orders o WHERE o.id = 101)
AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.id = 1002);

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal)
SELECT 1003, 102, p.id, 1, p.price, p.price
FROM products p
WHERE p.name = 'MacBook Pro M3'
AND EXISTS (SELECT 1 FROM orders o WHERE o.id = 102)
AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.id = 1003);

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal)
SELECT 1004, 102, p.id, 1, p.price, p.price
FROM products p
WHERE p.name = 'Sony WH-1000XM5'
AND EXISTS (SELECT 1 FROM orders o WHERE o.id = 102)
AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.id = 1004);

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal)
SELECT 1005, 103, p.id, 1, p.price, p.price
FROM products p
WHERE p.name = 'Nintendo Switch'
AND EXISTS (SELECT 1 FROM orders o WHERE o.id = 103)
AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.id = 1005);

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal)
SELECT 1006, 103, p.id, 2, p.price, p.price * 2
FROM products p
WHERE p.name = 'Razer DeathAdder V3'
AND EXISTS (SELECT 1 FROM orders o WHERE o.id = 103)
AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.id = 1006);

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal)
SELECT 1007, 104, p.id, 1, p.price, p.price
FROM products p
WHERE p.name = 'LG OLED 65'
AND EXISTS (SELECT 1 FROM orders o WHERE o.id = 104)
AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.id = 1007);

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal)
SELECT 1008, 105, p.id, 1, p.price, p.price
FROM products p
WHERE p.name = 'iPad Air'
AND EXISTS (SELECT 1 FROM orders o WHERE o.id = 105)
AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.id = 1008);

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal)
SELECT 1009, 105, p.id, 1, p.price, p.price
FROM products p
WHERE p.name = 'Apple Watch Series 9'
AND EXISTS (SELECT 1 FROM orders o WHERE o.id = 105)
AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.id = 1009);

UPDATE orders o
SET total = (
    SELECT COALESCE(SUM(oi.subtotal), 0)
    FROM order_items oi
    WHERE oi.order_id = o.id
)
WHERE o.id IN (101, 102, 103, 104, 105);

INSERT INTO site_visits (id, session_id, visited_at, source, page)
SELECT 1001, 'seed-session-001', '2026-05-10 08:30:00', 'web', 'home'
WHERE NOT EXISTS (SELECT 1 FROM site_visits sv WHERE sv.id = 1001);

INSERT INTO site_visits (id, session_id, visited_at, source, page)
SELECT 1002, 'seed-session-001', '2026-05-10 08:31:00', 'web', 'catalogo'
WHERE NOT EXISTS (SELECT 1 FROM site_visits sv WHERE sv.id = 1002);

INSERT INTO site_visits (id, session_id, visited_at, source, page)
SELECT 1003, 'seed-session-002', '2026-05-10 09:00:00', 'web', 'catalogo'
WHERE NOT EXISTS (SELECT 1 FROM site_visits sv WHERE sv.id = 1003);

INSERT INTO site_visits (id, session_id, visited_at, source, page)
SELECT 1004, 'seed-session-003', '2026-05-10 10:20:00', 'web', 'producto'
WHERE NOT EXISTS (SELECT 1 FROM site_visits sv WHERE sv.id = 1004);

INSERT INTO site_visits (id, session_id, visited_at, source, page)
SELECT 1005, 'seed-session-004', '2026-05-10 11:10:00', 'web', 'catalogo'
WHERE NOT EXISTS (SELECT 1 FROM site_visits sv WHERE sv.id = 1005);

INSERT INTO site_visits (id, session_id, visited_at, source, page)
SELECT 1006, 'seed-session-005', '2026-05-10 12:40:00', 'web', 'home'
WHERE NOT EXISTS (SELECT 1 FROM site_visits sv WHERE sv.id = 1006);

INSERT INTO site_visits (id, session_id, visited_at, source, page)
SELECT 1007, 'seed-session-006', '2026-05-10 13:25:00', 'web', 'catalogo'
WHERE NOT EXISTS (SELECT 1 FROM site_visits sv WHERE sv.id = 1007);

INSERT INTO site_visits (id, session_id, visited_at, source, page)
SELECT 1008, 'seed-session-007', '2026-05-10 16:05:00', 'web', 'producto'
WHERE NOT EXISTS (SELECT 1 FROM site_visits sv WHERE sv.id = 1008);

INSERT INTO carts (id, user_id, session_id, status, created_at, updated_at)
SELECT 1001, u.id, 'seed-session-001', 'COMPLETED', '2026-05-10 08:32:00', '2026-05-10 09:15:00'
FROM users u WHERE u.email = 'ana.torres@gmail.com'
AND NOT EXISTS (SELECT 1 FROM carts c WHERE c.id = 1001);

INSERT INTO carts (id, user_id, session_id, status, created_at, updated_at)
SELECT 1002, u.id, 'seed-session-002', 'COMPLETED', '2026-05-10 09:05:00', '2026-05-10 10:40:00'
FROM users u WHERE u.email = 'carlos.ramirez@gmail.com'
AND NOT EXISTS (SELECT 1 FROM carts c WHERE c.id = 1002);

INSERT INTO carts (id, user_id, session_id, status, created_at, updated_at)
SELECT 1003, u.id, 'seed-session-003', 'COMPLETED', '2026-05-10 10:25:00', '2026-05-10 12:05:00'
FROM users u WHERE u.email = 'valeria.soto@gmail.com'
AND NOT EXISTS (SELECT 1 FROM carts c WHERE c.id = 1003);

INSERT INTO carts (id, user_id, session_id, status, created_at, updated_at)
SELECT 1004, u.id, 'seed-session-004', 'COMPLETED', '2026-05-10 11:12:00', '2026-05-10 15:30:00'
FROM users u WHERE u.email = 'diego.chavez@gmail.com'
AND NOT EXISTS (SELECT 1 FROM carts c WHERE c.id = 1004);

INSERT INTO carts (id, user_id, session_id, status, created_at, updated_at)
SELECT 1005, u.id, 'seed-session-005', 'ACTIVE', '2026-05-10 16:30:00', '2026-05-10 17:20:00'
FROM users u WHERE u.email = 'mariana.vega@gmail.com'
AND NOT EXISTS (SELECT 1 FROM carts c WHERE c.id = 1005);

INSERT INTO carts (id, user_id, session_id, status, created_at, updated_at)
SELECT 1006, NULL, 'seed-session-006', 'ABANDONED', '2026-05-10 13:25:00', '2026-05-10 13:48:00'
WHERE NOT EXISTS (SELECT 1 FROM carts c WHERE c.id = 1006);

INSERT INTO performance_logs (id, page, load_time_ms, created_at)
SELECT 1001, 'catalogo', 820, '2026-05-10 08:31:00'
WHERE NOT EXISTS (SELECT 1 FROM performance_logs pl WHERE pl.id = 1001);

INSERT INTO performance_logs (id, page, load_time_ms, created_at)
SELECT 1002, 'catalogo', 970, '2026-05-10 09:00:00'
WHERE NOT EXISTS (SELECT 1 FROM performance_logs pl WHERE pl.id = 1002);

INSERT INTO performance_logs (id, page, load_time_ms, created_at)
SELECT 1003, 'catalogo', 1160, '2026-05-10 11:10:00'
WHERE NOT EXISTS (SELECT 1 FROM performance_logs pl WHERE pl.id = 1003);

INSERT INTO performance_logs (id, page, load_time_ms, created_at)
SELECT 1004, 'catalogo', 890, '2026-05-10 13:25:00'
WHERE NOT EXISTS (SELECT 1 FROM performance_logs pl WHERE pl.id = 1004);

INSERT INTO stock_alerts (id, product_id, alert_type, stock_at_alert, status, created_at, attended_at)
SELECT 1001, p.id, 'LOW_STOCK', 4, 'PENDING', '2026-05-10 08:00:00', NULL
FROM products p WHERE p.name = 'Canon EOS R6'
AND NOT EXISTS (SELECT 1 FROM stock_alerts sa WHERE sa.id = 1001);

INSERT INTO stock_alerts (id, product_id, alert_type, stock_at_alert, status, created_at, attended_at)
SELECT 1002, p.id, 'LOW_STOCK', 3, 'ATTENDED', '2026-05-10 09:00:00', '2026-05-10 15:00:00'
FROM products p WHERE p.name = 'LG OLED 65'
AND NOT EXISTS (SELECT 1 FROM stock_alerts sa WHERE sa.id = 1002);
