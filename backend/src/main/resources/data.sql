INSERT INTO users (full_name, email, password, role, phone, active) VALUES
('Administrador', 'admin@gmail.com', 'admin', 'ADMIN', '+51 999 888 777', TRUE),
('Usuario Demo', 'usuario@gmail.com', 'usuario', 'USER', '+51 988 777 666', TRUE);

INSERT INTO categories (name, description) VALUES
('Smartphones', 'Telefonos inteligentes de gama media y alta'),
('Laptops', 'Computadoras portatiles para estudio, trabajo y gaming'),
('Tablets', 'Tablets para productividad y entretenimiento'),
('Audio', 'Audifonos y dispositivos de sonido'),
('Gaming', 'Consolas y perifericos para videojuegos'),
('Wearables', 'Relojes inteligentes y dispositivos vestibles'),
('TV', 'Televisores y pantallas inteligentes'),
('Camaras', 'Camaras fotograficas y video profesional');

INSERT INTO products (name, description, category_id, price, stock, image, active) VALUES
('iPhone 15 Pro', 'Smartphone premium con chip A17 Pro, pantalla Super Retina y camara profesional.', 1, 1199.00, 18, 'assets/img/iphone15.png', TRUE),
('MacBook Pro M3', 'Laptop profesional con chip M3 para desarrollo, diseno y productividad avanzada.', 2, 2299.00, 10, 'assets/img/laptop.png', TRUE),
('iPad Air', 'Tablet ligera y potente para estudiar, dibujar, trabajar y ver contenido.', 3, 699.00, 20, 'assets/img/ipadair.png', TRUE),
('AirPods Pro', 'Audifonos inalambricos con cancelacion activa de ruido y audio espacial.', 4, 249.00, 35, 'assets/img/airpodspro.png', TRUE),
('Samsung Galaxy S24', 'Smartphone Android con pantalla AMOLED, alto rendimiento y camara avanzada.', 1, 999.00, 16, 'assets/img/galaxys24.png', TRUE),
('Dell XPS 13', 'Ultrabook premium con pantalla compacta, diseno ligero y alto rendimiento.', 2, 1299.00, 12, 'assets/img/dellxps13.png', TRUE),
('Nintendo Switch', 'Consola hibrida para jugar en modo portatil o conectada al televisor.', 5, 349.00, 25, 'assets/img/nintendoswitch.png', TRUE),
('Apple Watch Series 9', 'Reloj inteligente con GPS, seguimiento de salud y notificaciones.', 6, 429.00, 22, 'assets/img/applewatchseries9.png', TRUE),
('Sony WH-1000XM5', 'Audifonos over-ear con cancelacion de ruido lider y sonido de alta calidad.', 4, 399.00, 15, 'assets/img/sonywh1000xm5.png', TRUE),
('LG OLED 65', 'Smart TV OLED 4K con HDR, Dolby Vision y alto contraste para cine en casa.', 7, 1899.00, 8, 'assets/img/lgoled65.png', TRUE),
('Canon EOS R6', 'Camara mirrorless profesional con enfoque rapido y grabacion 4K.', 8, 2499.00, 7, 'assets/img/canoneosr6.png', TRUE),
('Razer DeathAdder V3', 'Mouse gaming ergonomico con sensor de alta precision y respuesta rapida.', 5, 89.00, 40, 'assets/img/razerdeathadderv3.png', TRUE);
