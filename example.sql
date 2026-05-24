USE DB_APIMADRID;

-- ============================================================================
-- 1. INSERTAR RESTAURANTES
-- ============================================================================
SET @rest1 = UUID();
SET @rest2 = UUID();
SET @rest3 = UUID();
SET @rest4 = UUID();

INSERT INTO RESTAURANT (id, name, email, address, description, phone, type_food, web) VALUES
(@rest1, 'La Tagliatella Gran Vía', 'granvia@tagliatella.es', 'Calle de Gran Vía, 32, Madrid', 'Auténtica gastronomía italiana en el corazón de Madrid.', '+34 915 22 22 22', 'Italiana', 'https://www.latagliatella.es'),
(@rest2, 'Taberna El Sur', 'contacto@tabernaelsur.com', 'Calle de la Torrecilla del Leal, 12, Madrid', 'Tapas tradicionales españolas y raciones generosas en Lavapiés.', '+34 915 27 11 11', 'Española', 'https://www.tabernaelsur.com'),
(@rest3, 'Ramen Kagura', 'info@ramenkagura.com', 'Calle de las Fuentes, 1, Madrid', 'El primer ramen bar artesanal de Madrid, fideos caseros diarios.', '+34 915 48 33 33', 'Japonesa', 'https://www.ramenkagura.com'),
(@rest4, 'Tepic', 'reservas@tepic.es', 'Calle de Ayala, 14, Madrid', 'Auténtica cocina mexicana tradicional alejada de los clichés del Tex-Mex.', '+34 915 22 00 00', 'Mexicana', 'https://www.tepic.es');


-- ============================================================================
-- 2. INSERTAR PLATOS EN LA CARTA (Organizados por Categorías)
-- ============================================================================

-- --- Platos del Restaurante 1 (Italiano) ---
SET @r1_ent1 = UUID(); SET @r1_pri1 = UUID(); SET @r1_pos1 = UUID(); SET @r1_beb1 = UUID();
SET @r1_ent2 = UUID(); SET @r1_pri2 = UUID();

INSERT INTO DISHES (id, id, name, description, price, category) VALUES
(@r1_ent1, @rest1, 'Focaccia Di Recco', 'Pan plano crujiente relleno de queso stracchino fundido.', 11.50, 'entrantes'),
(@r1_ent2, @rest1, 'Carpaccio de Buey', 'Láminas finas de buey con lascas de parmigiano y alcaparras.', 14.20, 'entrantes'),
(@r1_pri1, @rest1, 'Rigatoni Boscaiola', 'Pasta con salsa de boletus, bacon, crema y trufa negra.', 16.80, 'principal'),
(@r1_pri2, @rest1, 'Pizza Quattro Formaggi', 'Base de tomate, mozzarella, gorgonzola, scamorza y emmental.', 15.50, 'principal'),
(@r1_pos1, @rest1, 'Tiramisú Tradicional', 'Bizcocho de soletilla empapado en café, amaretto y mascarpone.', 6.50, 'postres'),
(@r1_beb1, @rest1, 'Copa de Vino Chianti', 'Vino tinto italiano de la región de Toscana.', 4.00, 'bebidas');

-- --- Platos del Restaurante 2 (Español) ---
SET @r2_ent1 = UUID(); SET @r2_pri1 = UUID(); SET @r2_pos1 = UUID(); SET @r2_beb1 = UUID();
SET @r2_ent2 = UUID(); SET @r2_pri2 = UUID();

INSERT INTO DISHES (id, restaurant_id, name, description, price, category) VALUES
(@r2_ent1, @rest2, 'Croquetas de Jamón Ibérico', 'Bechamel cremosa con virutas de jamón ibérico de bellota (8 uds).', 12.00, 'entrantes'),
(@r2_ent2, @rest2, 'Patatas Bravas de la Taberna', 'Patatas crujientes con salsa brava casera picante secreta.', 8.50, 'entrantes'),
(@r2_pri1, @rest2, 'Rabo de Toro Estofado', 'Guiso tradicional de rabo de toro al vino tinto de Madrid.', 19.50, 'principal'),
(@r2_pri2, @rest2, 'Pulpo a la Brasa', 'Pata de pulpo con parmentier de patata y aceite de pimentón.', 22.00, 'principal'),
(@r2_pos1, @rest2, 'Torrija Caramelizada', 'Torrija empapada en leche infusionada con helado de vainilla.', 7.00, 'postres'),
(@r2_beb1, @rest2, 'Caña de Cerveza', 'Cerveza tirada perfectamente bien fría.', 2.80, 'bebidas');

-- --- Platos del Restaurante 3 (Japonés) ---
SET @r3_ent1 = UUID(); SET @r3_pri1 = UUID(); SET @r3_pos1 = UUID(); SET @r3_beb1 = UUID();
SET @r3_ent2 = UUID(); SET @r3_pri2 = UUID();

INSERT INTO DISHES (id, restaurant_id, name, description, price, category) VALUES
(@r3_ent1, @rest3, 'Gyoza de Cerdo', 'Empanadillas japonesas tostadas a la plancha (5 uds).', 6.80, 'entrantes'),
(@r3_ent2, @rest3, 'Edamame Spicy', 'Vainas de soja verde hervidas con un toque de chile de Shichimi.', 4.50, 'entrantes'),
(@r3_pri1, @rest3, 'Tonkotsu Ramen Shoyu', 'Caldo espeso de cerdo (24h de cocción), fideos, chashu y huevo nitamago.', 12.90, 'principal'),
(@r3_pri2, @rest3, 'Miso Ramen Veggie', 'Caldo a base de miso, tofu frito, verduras de temporada y fideos.', 11.50, 'principal'),
(@r3_pos1, @rest3, 'Mochi de Té Verde', 'Pastel de arroz glutinoso relleno de helado de matcha.', 4.50, 'postres'),
(@r3_beb1, @rest3, 'Té Verde Genmaicha', 'Té verde japonés caliente con arroz tostado.', 3.00, 'bebidas');

-- --- Platos del Restaurante 4 (Mexicano) ---
SET @r4_ent1 = UUID(); SET @r4_pri1 = UUID(); SET @r4_pos1 = UUID(); SET @r4_beb1 = UUID();
SET @r4_ent2 = UUID(); SET @r4_pri2 = UUID();

INSERT INTO DISHES (id, restaurant_id, name, description, price, category) VALUES
(@r4_ent1, @rest4, 'Guacamole Tepic', 'Preparado al momento en molcajete, acompañado de totopos caseros.', 13.50, 'entrantes'),
(@r4_ent2, @rest4, 'Aguachile de Camarón', 'Langostinos marinados en lima, chile serrano, pepino y cebolla morada.', 16.00, 'entrantes'),
(@r4_pri1, @rest4, 'Tacos al Pastor', 'Cerdo marinado en axiote con piña, cebolla y cilantro (4 uds).', 14.50, 'principal'),
(@r4_pri2, @rest4, 'Enchiladas Verdes', 'Tortillas rellenas de pollo con salsa verde de tomate, queso y nata.', 15.50, 'principal'),
(@r4_pos1, @rest4, 'Pastel de Tres Leches', 'Bizcocho húmedo bañado en tres tipos de leche con merengue.', 6.80, 'postres'),
(@r4_beb1, @rest4, 'Margarita Clásica', 'Cóctel de tequila, triple seco y zumo de lima fresca.', 8.50, 'bebidas');


-- ============================================================================
-- 3. INSERTAR MENÚS ESPECIALES (Combos o Promociones)
-- ============================================================================
SET @menu_r1 = UUID();
SET @menu_r2 = UUID();
SET @menu_r3 = UUID();

INSERT INTO MENU (id, restaurant_id, name, description, price_combo) VALUES
(@menu_r1, @rest1, 'Menú Ejecutivo Italiano', 'Disponible de lunes a viernes. Incluye un entrante, un principal, un postre y una bebida a elegir.', 22.90),
(@menu_r2, @rest2, 'Menú Degustación Cañí', 'Una selección de nuestras mejores tapas tradicionales para compartir.', 35.00),
(@menu_r3, @rest3, 'Menú Ramen Diario', 'El combo perfecto para el almuerzo con nuestro ramen estrella.', 15.50);

-- Nota: El Restaurante 4 (Tepic) no se incluye en esta tabla porque prefiere vender solo platos sueltos de su carta actual.


-- ============================================================================
-- 4. ASOCIAR PLATOS A LOS MENÚS (Tabla Intermedia)
-- ============================================================================

-- Platos que entran dentro del 'Menú Ejecutivo Italiano' (Restaurante 1)
INSERT INTO MENU_DISHES (menu_id, dish_id) VALUES
(@menu_r1, @r1_ent1), -- Focaccia
(@menu_r1, @r1_pri1), -- Rigatoni
(@menu_r1, @r1_pos1), -- Tiramisú
(@menu_r1, @r1_beb1); -- Chianti

-- Platos que componen el 'Menú Degustación Cañí' (Restaurante 2)
INSERT INTO MENU_DISHES (menu_id, dish_id) VALUES
(@menu_r2, @r2_ent1), -- Croquetas
(@menu_r2, @r2_ent2), -- Patatas Bravas
(@menu_r2, @r2_pri1); -- Rabo de Toro

-- Platos que componen el 'Menú Ramen Diario' (Restaurante 3)
INSERT INTO MENU_DISHES (menu_id, dish_id) VALUES
(@menu_r3, @r3_ent1), -- Gyozas
(@menu_r3, @r3_pri1), -- Tonkotsu Ramen
(@menu_r3, @r3_beb1); -- Té Verde