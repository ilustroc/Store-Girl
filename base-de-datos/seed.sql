USE tecnostore_db;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE audit_logs;
TRUNCATE TABLE stock_alerts;
TRUNCATE TABLE performance_logs;
TRUNCATE TABLE carts;
TRUNCATE TABLE site_visits;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Credenciales:
-- ADMIN: admin@gmail.com / Admin@123
-- USER:  usuario@gmail.com / Usuario@123
INSERT INTO users (id, full_name, email, password, role, phone, active, created_at) VALUES
(1, 'Administrador TecnoStore', 'admin@gmail.com', '$2a$10$zJko6lmGEe6FB0G1YjG9delsZ5Vjx6NpjuzxlNN7S3YEQPQvXY22W', 'ADMIN', '999100001', TRUE, '2026-01-02 08:00:00'),
(2, 'Usuario Demo', 'usuario@gmail.com', '$2a$10$.3H87kyQCztVQcvLhwb8luKlws5Rvb0rZ8.gS9TMj9jVOVpZmnNFi', 'USER', '999100002', TRUE, '2026-01-03 09:00:00'),
(3, 'Andrea Rojas', 'andrea.rojas@gmail.com', '$2a$10$.3H87kyQCztVQcvLhwb8luKlws5Rvb0rZ8.gS9TMj9jVOVpZmnNFi', 'USER', '955210101', TRUE, '2026-01-05 10:15:00'),
(4, 'Luis Mendoza', 'luis.mendoza@gmail.com', '$2a$10$.3H87kyQCztVQcvLhwb8luKlws5Rvb0rZ8.gS9TMj9jVOVpZmnNFi', 'USER', '955210102', TRUE, '2026-01-08 11:20:00'),
(5, 'Camila Peña', 'camila.pena@gmail.com', '$2a$10$.3H87kyQCztVQcvLhwb8luKlws5Rvb0rZ8.gS9TMj9jVOVpZmnNFi', 'USER', '955210103', TRUE, '2026-01-12 14:10:00'),
(6, 'Mateo Salazar', 'mateo.salazar@gmail.com', '$2a$10$.3H87kyQCztVQcvLhwb8luKlws5Rvb0rZ8.gS9TMj9jVOVpZmnNFi', 'USER', '955210104', TRUE, '2026-02-03 16:45:00');

INSERT INTO categories (id, name, description, active, created_at) VALUES
(1, 'Smartphones', 'Celulares Android y iPhone para productividad, fotografia y comunicacion.', TRUE, '2026-01-01 08:00:00'),
(2, 'Laptops', 'Equipos portatiles para estudio, oficina, diseno y gaming.', TRUE, '2026-01-01 08:00:00'),
(3, 'Tablets', 'Dispositivos tactiles para entretenimiento, lectura y trabajo.', TRUE, '2026-01-01 08:00:00'),
(4, 'Audio', 'Audifonos y parlantes para musica, llamadas y entretenimiento.', TRUE, '2026-01-01 08:00:00'),
(5, 'Gaming', 'Consolas y perifericos para videojuegos.', TRUE, '2026-01-01 08:00:00'),
(6, 'Wearables', 'Relojes y bandas inteligentes para actividad y salud.', TRUE, '2026-01-01 08:00:00'),
(7, 'TV', 'Televisores inteligentes para cine y entretenimiento.', TRUE, '2026-01-01 08:00:00'),
(8, 'Camaras', 'Camaras para fotografia, video y creacion de contenido.', TRUE, '2026-01-01 08:00:00'),
(9, 'Accesorios', 'Perifericos y complementos para equipos tecnologicos.', TRUE, '2026-01-01 08:00:00');

INSERT INTO products (id, name, description, category_id, price, cost_price, stock, image, active, created_at) VALUES
(1, 'iPhone 15 Pro', 'Smartphone premium con pantalla Super Retina y camara profesional.', 1, 1199.00, 780.00, 18, 'assets/img/iphone15.png', TRUE, '2026-01-05 09:00:00'),
(2, 'Samsung Galaxy S24', 'Smartphone Android con pantalla AMOLED, alto rendimiento y camara avanzada.', 1, 999.00, 650.00, 16, 'assets/img/galaxys24.png', TRUE, '2026-01-05 09:10:00'),
(3, 'MacBook Pro M3', 'Laptop profesional para desarrollo, diseno y productividad avanzada.', 2, 2299.00, 1600.00, 10, 'assets/img/laptop.png', TRUE, '2026-01-05 09:20:00'),
(4, 'Dell XPS 13', 'Ultrabook premium con pantalla compacta, diseno ligero y alto rendimiento.', 2, 1299.00, 880.00, 12, 'assets/img/dellxps13.png', TRUE, '2026-01-05 09:30:00'),
(5, 'iPad Air', 'Tablet ligera para estudiar, dibujar, trabajar y ver contenido.', 3, 699.00, 430.00, 20, 'assets/img/ipadair.png', TRUE, '2026-01-05 09:40:00'),
(6, 'AirPods Pro', 'Audifonos inalambricos con cancelacion activa de ruido y audio espacial.', 4, 249.00, 135.00, 35, 'assets/img/airpodspro.png', TRUE, '2026-01-05 09:50:00'),
(7, 'Sony WH-1000XM5', 'Audifonos over-ear con cancelacion de ruido y sonido de alta calidad.', 4, 399.00, 250.00, 15, 'assets/img/sonywh1000xm5.png', TRUE, '2026-01-05 10:00:00'),
(8, 'Nintendo Switch', 'Consola hibrida para jugar en modo portatil o conectada al televisor.', 5, 349.00, 230.00, 25, 'assets/img/nintendoswitch.png', TRUE, '2026-01-05 10:10:00'),
(9, 'Razer DeathAdder V3', 'Mouse gaming ergonomico con sensor de alta precision.', 5, 89.00, 45.00, 40, 'assets/img/razerdeathadderv3.png', TRUE, '2026-01-05 10:20:00'),
(10, 'Apple Watch Series 9', 'Reloj inteligente con GPS, seguimiento de salud y notificaciones.', 6, 429.00, 285.00, 22, 'assets/img/applewatchseries9.png', TRUE, '2026-01-05 10:30:00'),
(11, 'LG OLED 65', 'Smart TV OLED 4K con HDR y alto contraste para cine en casa.', 7, 1899.00, 1280.00, 3, 'assets/img/lgoled65.png', TRUE, '2026-01-05 10:40:00'),
(12, 'Canon EOS R6', 'Camara mirrorless profesional con enfoque rapido y grabacion 4K.', 8, 2499.00, 1750.00, 4, 'assets/img/canoneosr6.png', TRUE, '2026-01-05 10:50:00'),
(13, 'Teclado Mecanico RGB', 'Teclado mecanico con iluminacion RGB y respuesta rapida.', 9, 229.00, 135.00, 30, 'assets/img/teclado.png', TRUE, '2026-01-05 11:00:00'),
(14, 'Combo Accesorios Pro', 'Kit de accesorios para escritorio, productividad y estudio.', 9, 149.00, 80.00, 0, 'assets/img/teclado-1.png', TRUE, '2026-01-05 11:10:00');

INSERT INTO orders (id, user_id, total, status, created_at) VALUES
(1, 3, 1448.00, 'CONFIRMED', '2026-05-10 09:15:00'),
(2, 4, 2698.00, 'CONFIRMED', '2026-05-10 10:40:00'),
(3, 5, 527.00, 'CONFIRMED', '2026-05-11 12:05:00'),
(4, 6, 1899.00, 'CONFIRMED', '2026-05-12 15:30:00'),
(5, 2, 1128.00, 'PENDING', '2026-05-13 17:20:00');

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal) VALUES
(1, 1, 1, 1, 1199.00, 1199.00),
(2, 1, 6, 1, 249.00, 249.00),
(3, 2, 3, 1, 2299.00, 2299.00),
(4, 2, 7, 1, 399.00, 399.00),
(5, 3, 8, 1, 349.00, 349.00),
(6, 3, 9, 2, 89.00, 178.00),
(7, 4, 11, 1, 1899.00, 1899.00),
(8, 5, 5, 1, 699.00, 699.00),
(9, 5, 10, 1, 429.00, 429.00);

-- Historial ampliado de ventas: 70 pedidos entre el 06/01/2026 y el 17/07/2026.
-- Los identificadores altos permiten aplicar este bloque sobre una base ya iniciada.
INSERT IGNORE INTO users (id, full_name, email, password, role, phone, active, created_at) VALUES
(101, 'Daniela Campos', 'daniela.campos@gmail.com', '$2a$10$.3H87kyQCztVQcvLhwb8luKlws5Rvb0rZ8.gS9TMj9jVOVpZmnNFi', 'USER', '955310101', TRUE, '2026-01-02 09:10:00'),
(102, 'Jorge Quispe', 'jorge.quispe@gmail.com', '$2a$10$.3H87kyQCztVQcvLhwb8luKlws5Rvb0rZ8.gS9TMj9jVOVpZmnNFi', 'USER', '955310102', TRUE, '2026-01-02 10:20:00'),
(103, 'Sofia Ramirez', 'sofia.ramirez@gmail.com', '$2a$10$.3H87kyQCztVQcvLhwb8luKlws5Rvb0rZ8.gS9TMj9jVOVpZmnNFi', 'USER', '955310103', TRUE, '2026-01-03 11:30:00'),
(104, 'Renato Flores', 'renato.flores@gmail.com', '$2a$10$.3H87kyQCztVQcvLhwb8luKlws5Rvb0rZ8.gS9TMj9jVOVpZmnNFi', 'USER', '955310104', TRUE, '2026-01-03 15:40:00'),
(105, 'Lucia Vargas', 'lucia.vargas@gmail.com', '$2a$10$.3H87kyQCztVQcvLhwb8luKlws5Rvb0rZ8.gS9TMj9jVOVpZmnNFi', 'USER', '955310105', TRUE, '2026-01-04 08:50:00'),
(106, 'Miguel Paredes', 'miguel.paredes@gmail.com', '$2a$10$.3H87kyQCztVQcvLhwb8luKlws5Rvb0rZ8.gS9TMj9jVOVpZmnNFi', 'USER', '955310106', TRUE, '2026-01-04 12:15:00'),
(107, 'Fernanda Silva', 'fernanda.silva@gmail.com', '$2a$10$.3H87kyQCztVQcvLhwb8luKlws5Rvb0rZ8.gS9TMj9jVOVpZmnNFi', 'USER', '955310107', TRUE, '2026-01-05 09:25:00'),
(108, 'Alonso Castillo', 'alonso.castillo@gmail.com', '$2a$10$.3H87kyQCztVQcvLhwb8luKlws5Rvb0rZ8.gS9TMj9jVOVpZmnNFi', 'USER', '955310108', TRUE, '2026-01-05 10:35:00');

CREATE TEMPORARY TABLE seed_sales_sequence (
    sequence_number INT PRIMARY KEY
);

INSERT INTO seed_sales_sequence (sequence_number) VALUES
(0), (1), (2), (3), (4), (5), (6), (7), (8), (9),
(10), (11), (12), (13), (14), (15), (16), (17), (18), (19),
(20), (21), (22), (23), (24), (25), (26), (27), (28), (29),
(30), (31), (32), (33), (34), (35), (36), (37), (38), (39),
(40), (41), (42), (43), (44), (45), (46), (47), (48), (49),
(50), (51), (52), (53), (54), (55), (56), (57), (58), (59),
(60), (61), (62), (63), (64), (65), (66), (67), (68), (69);

INSERT IGNORE INTO orders (id, user_id, total, status, created_at)
SELECT
    1001 + sequence_number,
    ELT(MOD(sequence_number, 10) + 1, 2, 3, 101, 102, 103, 104, 105, 106, 107, 108),
    0.00,
    CASE
        WHEN MOD(sequence_number + 1, 13) = 0 THEN 'CANCELLED'
        WHEN MOD(sequence_number + 1, 9) = 0 THEN 'PENDING'
        ELSE 'CONFIRMED'
    END,
    TIMESTAMP(
        DATE_ADD('2026-01-06', INTERVAL FLOOR(sequence_number * 192 / 69) DAY),
        MAKETIME(9 + MOD(sequence_number, 10), MOD(sequence_number * 7, 60), 0)
    )
FROM seed_sales_sequence;

-- Cada pedido tiene de uno a tres productos y precios tomados del catalogo real.
INSERT IGNORE INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal)
SELECT
    5001 + s.sequence_number,
    1001 + s.sequence_number,
    p.id,
    IF(MOD(s.sequence_number, 5) = 0, 2, 1),
    p.price,
    p.price * IF(MOD(s.sequence_number, 5) = 0, 2, 1)
FROM seed_sales_sequence s
JOIN products p ON p.id = MOD(s.sequence_number * 3, 14) + 1;

INSERT IGNORE INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal)
SELECT
    5101 + s.sequence_number,
    1001 + s.sequence_number,
    p.id,
    IF(MOD(s.sequence_number, 7) = 0, 2, 1),
    p.price,
    p.price * IF(MOD(s.sequence_number, 7) = 0, 2, 1)
FROM seed_sales_sequence s
JOIN products p
    ON p.id = MOD(MOD(s.sequence_number * 3, 14) + 4 + MOD(s.sequence_number, 5), 14) + 1
WHERE MOD(s.sequence_number, 3) <> 1;

INSERT IGNORE INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal)
SELECT
    5201 + s.sequence_number,
    1001 + s.sequence_number,
    p.id,
    1,
    p.price,
    p.price
FROM seed_sales_sequence s
JOIN products p
    ON p.id = MOD(MOD(s.sequence_number * 3, 14) + 10 + MOD(s.sequence_number, 2), 14) + 1
WHERE MOD(s.sequence_number, 4) = 0;

UPDATE orders o
JOIN (
    SELECT order_id, SUM(subtotal) AS calculated_total
    FROM order_items
    WHERE order_id BETWEEN 1001 AND 1070
    GROUP BY order_id
) totals ON totals.order_id = o.id
SET o.total = totals.calculated_total;

-- Actividad relacionada para mantener coherentes los indicadores de experiencia.
INSERT IGNORE INTO site_visits (id, session_id, visited_at, source, page)
SELECT
    2001 + s.sequence_number,
    CONCAT('history-session-', LPAD(s.sequence_number + 1, 3, '0')),
    DATE_SUB(o.created_at, INTERVAL 45 MINUTE),
    ELT(MOD(s.sequence_number, 4) + 1, 'direct', 'search', 'social', 'email'),
    'home'
FROM seed_sales_sequence s
JOIN orders o ON o.id = 1001 + s.sequence_number;

INSERT IGNORE INTO site_visits (id, session_id, visited_at, source, page)
SELECT
    2101 + s.sequence_number,
    CONCAT('history-session-', LPAD(s.sequence_number + 1, 3, '0')),
    DATE_SUB(o.created_at, INTERVAL 30 MINUTE),
    ELT(MOD(s.sequence_number, 4) + 1, 'direct', 'search', 'social', 'email'),
    'catalogo'
FROM seed_sales_sequence s
JOIN orders o ON o.id = 1001 + s.sequence_number;

INSERT IGNORE INTO site_visits (id, session_id, visited_at, source, page)
SELECT
    2201 + s.sequence_number,
    CONCAT('history-session-', LPAD(s.sequence_number + 1, 3, '0')),
    DATE_SUB(o.created_at, INTERVAL 10 MINUTE),
    ELT(MOD(s.sequence_number, 4) + 1, 'direct', 'search', 'social', 'email'),
    'producto'
FROM seed_sales_sequence s
JOIN orders o ON o.id = 1001 + s.sequence_number;

INSERT IGNORE INTO carts (id, user_id, session_id, status, created_at, updated_at)
SELECT
    3001 + s.sequence_number,
    o.user_id,
    CONCAT('history-session-', LPAD(s.sequence_number + 1, 3, '0')),
    CASE
        WHEN o.status = 'CONFIRMED' THEN 'COMPLETED'
        WHEN o.status = 'CANCELLED' THEN 'ABANDONED'
        ELSE 'ACTIVE'
    END,
    DATE_SUB(o.created_at, INTERVAL 20 MINUTE),
    o.created_at
FROM seed_sales_sequence s
JOIN orders o ON o.id = 1001 + s.sequence_number;

INSERT IGNORE INTO performance_logs (id, page, load_time_ms, created_at)
SELECT
    4001 + s.sequence_number,
    'catalogo',
    620 + MOD(s.sequence_number * 137, 1200),
    DATE_SUB(o.created_at, INTERVAL 28 MINUTE)
FROM seed_sales_sequence s
JOIN orders o ON o.id = 1001 + s.sequence_number;

DROP TEMPORARY TABLE seed_sales_sequence;

INSERT INTO site_visits (id, session_id, visited_at, source, page) VALUES
(1, 'seed-session-001', '2026-05-10 08:30:00', 'web', 'home'),
(2, 'seed-session-001', '2026-05-10 08:31:00', 'web', 'catalogo'),
(3, 'seed-session-002', '2026-05-10 09:00:00', 'web', 'catalogo'),
(4, 'seed-session-003', '2026-05-10 10:20:00', 'web', 'producto'),
(5, 'seed-session-004', '2026-05-10 11:10:00', 'web', 'catalogo'),
(6, 'seed-session-005', '2026-05-10 12:40:00', 'web', 'home'),
(7, 'seed-session-006', '2026-05-10 13:25:00', 'web', 'catalogo');

INSERT INTO carts (id, user_id, session_id, status, created_at, updated_at) VALUES
(1, 3, 'seed-session-001', 'COMPLETED', '2026-05-10 08:32:00', '2026-05-10 09:15:00'),
(2, 4, 'seed-session-002', 'COMPLETED', '2026-05-10 09:05:00', '2026-05-10 10:40:00'),
(3, 5, 'seed-session-003', 'COMPLETED', '2026-05-10 10:25:00', '2026-05-11 12:05:00'),
(4, 6, 'seed-session-004', 'COMPLETED', '2026-05-10 11:12:00', '2026-05-12 15:30:00'),
(5, 2, 'seed-session-005', 'ACTIVE', '2026-05-10 16:30:00', '2026-05-13 17:20:00'),
(6, NULL, 'seed-session-006', 'ABANDONED', '2026-05-10 13:25:00', '2026-05-10 13:48:00');

INSERT INTO performance_logs (id, page, load_time_ms, created_at) VALUES
(1, 'catalogo', 820, '2026-05-10 08:31:00'),
(2, 'catalogo', 970, '2026-05-10 09:00:00'),
(3, 'catalogo', 1160, '2026-05-10 11:10:00'),
(4, 'catalogo', 890, '2026-05-10 13:25:00');

INSERT INTO stock_alerts (id, product_id, alert_type, stock_at_alert, status, created_at, attended_at) VALUES
(1, 12, 'LOW_STOCK', 4, 'PENDING', '2026-05-10 08:00:00', NULL),
(2, 11, 'LOW_STOCK', 3, 'ATTENDED', '2026-05-10 09:00:00', '2026-05-10 15:00:00'),
(3, 14, 'LOW_STOCK', 0, 'PENDING', '2026-05-10 09:30:00', NULL);

INSERT INTO audit_logs (id, user_id, action, entity, entity_id, description, created_at) VALUES
(1, 1, 'PRODUCT_CREATED', 'Product', 1, 'Carga inicial de productos', '2026-05-10 08:00:00'),
(2, 1, 'REPORT_EXPORTED', 'Report', NULL, 'Reporte inicial de ventas', '2026-05-10 18:00:00');
