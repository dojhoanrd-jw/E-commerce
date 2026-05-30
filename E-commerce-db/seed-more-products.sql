-- Extra catalog products across categories (some on sale). Managed by admin (seller_id NULL).

INSERT INTO public.product (name, description, stock, price, sale_price, imageurl, category) VALUES
('Auriculares Inalámbricos Pro', 'Cancelación de ruido activa, 30h de batería y estuche de carga.', 60, 129.99, 99.99, 'https://picsum.photos/seed/headphones/500/500', 'Electrónica'),
('Teclado Mecánico RGB', 'Switches rojos, retroiluminación RGB y diseño compacto.', 40, 79.99, NULL, 'https://picsum.photos/seed/keyboard/500/500', 'Electrónica'),
('Mouse Gamer 16000 DPI', 'Sensor óptico de alta precisión y 7 botones programables.', 80, 49.99, 39.99, 'https://picsum.photos/seed/mouse/500/500', 'Electrónica'),
('Monitor 27" 144Hz', 'Panel IPS QHD, 144Hz y 1ms para gaming fluido.', 25, 299.99, NULL, 'https://picsum.photos/seed/monitor/500/500', 'Electrónica'),
('Cámara Web Full HD', '1080p con micrófono integrado y enfoque automático.', 50, 59.99, NULL, 'https://picsum.photos/seed/webcam/500/500', 'Electrónica'),
('Power Bank 20000mAh', 'Carga rápida USB-C, suficiente para varios días.', 100, 39.99, 29.99, 'https://picsum.photos/seed/powerbank/500/500', 'Electrónica'),
('Cafetera Espresso', 'Prepara espresso y cappuccino en casa con vaporizador.', 30, 189.99, 149.99, 'https://picsum.photos/seed/coffee/500/500', 'Hogar'),
('Aspiradora Robot', 'Limpieza automática con mapeo inteligente y app.', 20, 249.99, NULL, 'https://picsum.photos/seed/robot/500/500', 'Hogar'),
('Lámpara LED de Escritorio', 'Brillo regulable, temperatura de color ajustable y puerto USB.', 70, 34.99, NULL, 'https://picsum.photos/seed/lamp/500/500', 'Hogar'),
('Set de Ollas Antiadherentes', 'Juego de 8 piezas aptas para todo tipo de cocina.', 35, 119.99, 89.99, 'https://picsum.photos/seed/pots/500/500', 'Hogar'),
('Camiseta Algodón Premium', 'Suave, transpirable y disponible en varios colores.', 120, 24.99, NULL, 'https://picsum.photos/seed/tshirt/500/500', 'Ropa'),
('Chaqueta Impermeable', 'Cortavientos ligera ideal para outdoor.', 45, 89.99, 69.99, 'https://picsum.photos/seed/jacket/500/500', 'Ropa'),
('Zapatillas Running', 'Amortiguación ligera para entrenamiento diario.', 55, 109.99, NULL, 'https://picsum.photos/seed/sneakers/500/500', 'Ropa'),
('Balón de Fútbol Pro', 'Tamaño 5, cosido a máquina y resistente.', 90, 29.99, NULL, 'https://picsum.photos/seed/football/500/500', 'Deportes'),
('Set de Mancuernas 20kg', 'Ajustables, perfectas para entrenar en casa.', 40, 99.99, 79.99, 'https://picsum.photos/seed/dumbbell/500/500', 'Deportes'),
('Bicicleta de Montaña', 'Cuadro de aluminio, 21 velocidades y frenos de disco.', 15, 449.99, 399.99, 'https://picsum.photos/seed/bike/500/500', 'Deportes'),
('Set de Construcción 1000 pzs', 'Bloques compatibles para construir sin límites.', 65, 59.99, NULL, 'https://picsum.photos/seed/bricks/500/500', 'Juguetes'),
('Peluche Gigante', 'Suave y abrazable, 80cm de pura ternura.', 50, 39.99, 24.99, 'https://picsum.photos/seed/teddy/500/500', 'Juguetes');
