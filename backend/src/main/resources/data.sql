INSERT IGNORE INTO users (full_name, email, password, role, phone, active) VALUES
('Administrador', 'admin@gmail.com', 'admin', 'ADMIN', '+51 999 888 777', TRUE),
('Usuario Demo', 'usuario@gmail.com', 'usuario', 'USER', '+51 988 777 666', TRUE);

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
