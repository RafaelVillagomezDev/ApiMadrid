DROP DATABASE IF EXISTS DB_APIMADRID;
CREATE DATABASE DB_APIMADRID;
USE DB_APIMADRID;

-- ----------------------------------------------------
-- 1. Tablas independientes
-- ----------------------------------------------------

CREATE TABLE USERS (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('user', 'cliente', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE RESTAURANT (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE,
    address VARCHAR(100) NOT NULL,
    description TEXT,
    phone VARCHAR(20),
    type_food VARCHAR(50),
    web VARCHAR(800),
    CONSTRAINT unique_name_address UNIQUE (name, address),
    INDEX idx_name_address (name, address)
);

CREATE TABLE METHODS_PAYMENT (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,         
    icon_url VARCHAR(255) NULL                 
);

-- ----------------------------------------------------
-- 2. Tablas relacionadas 
-- ----------------------------------------------------

CREATE TABLE RESTAURANT_PAYMENTS (
    restaurant_id CHAR(36) NOT NULL,
    method_payment_id INT NOT NULL,
    PRIMARY KEY (restaurant_id, method_payment_id),
    FOREIGN KEY (restaurant_id) REFERENCES RESTAURANT(id) ON DELETE CASCADE,
    FOREIGN KEY (method_payment_id) REFERENCES METHODS_PAYMENT(id) ON DELETE CASCADE,
    INDEX idx_payment_restaurant (method_payment_id, restaurant_id)
);

CREATE TABLE MENU (
    id CHAR(36) PRIMARY KEY,
    restaurant_id CHAR(36) NOT NULL,
    name VARCHAR(100),
    description TEXT,
    FOREIGN KEY (restaurant_id) REFERENCES RESTAURANT(id) ON DELETE CASCADE
);

CREATE TABLE DISHES (
    id CHAR(36) PRIMARY KEY,
    restaurant_id CHAR(36) NOT NULL,          
    menu_id CHAR(36) NULL,                    
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(6,2),
    category VARCHAR(50),                     
    FOREIGN KEY (restaurant_id) REFERENCES RESTAURANT(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES MENU(id) ON DELETE SET NULL,
    CONSTRAINT unique_dish_name_per_restaurant UNIQUE (restaurant_id, name),
    -- Índice añadido para la búsqueda masiva de platos de tu controlador anterior
    INDEX idx_restaurant_menu_category (restaurant_id, menu_id, category) 
);

CREATE TABLE REFRESH_TOKENS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);

-- ----------------------------------------------------
-- 3. Tablas polimórficas (Localización e Imágenes)
-- ----------------------------------------------------

CREATE TABLE IMAGES (
    id CHAR(36) PRIMARY KEY,
    relatedId CHAR(36) NOT NULL,
    relatedType VARCHAR(50) NOT NULL,
    url VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_images_polymorphic (relatedId, relatedType)
);

CREATE TABLE LOCATION (
    id CHAR(36) PRIMARY KEY,
    relatedId CHAR(36) NOT NULL,
    relatedType VARCHAR(50) NOT NULL,
    address VARCHAR(500) NOT NULL,
    latitude VARCHAR(50),
    longitude VARCHAR(50),
    town VARCHAR(30),
    country VARCHAR(30),
    county VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_location_polymorphic (relatedId, relatedType)
);

-- ----------------------------------------------------
-- 4. Seguridad y rendimiento
-- ----------------------------------------------------

CREATE TABLE BlacklistEntry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    CONSTRAINT unique_value_type UNIQUE (value, type)
);

CREATE INDEX idx_blacklist_lookup ON BlacklistEntry (value, type, expires_at);

-- ----------------------------------------------------
-- 5. VISTA: Corregida para agrupar sin la columna JSON
-- ----------------------------------------------------

CREATE OR REPLACE VIEW V_RESTAURANTS AS
SELECT 
    r.id,
    r.name,
    r.email,
    r.address,
    r.description,
    r.phone,
    r.type_food,
    r.web,
    ROUND(
        (COALESCE(AVG(CASE WHEN d.category = 'entrantes' THEN d.price END), 0.00) / 2) +
        COALESCE(AVG(CASE WHEN d.category = 'principal' THEN d.price END), 0.00) +
        (COALESCE(AVG(CASE WHEN d.category = 'postres'   THEN d.price END), 0.00) * 0.33) +
        COALESCE(AVG(CASE WHEN d.category = 'bebidas'   THEN d.price END), 0.00), 
        2
    ) AS average_price
FROM RESTAURANT r
LEFT JOIN DISHES d ON r.id = d.restaurant_id
GROUP BY 
    r.id, 
    r.name, 
    r.email, 
    r.address, 
    r.description, 
    r.phone, 
    r.type_food, 
    r.web;


-- ----------------------------------------------------
-- 6. Inserciones de datos iniciales (Seeders)
-- ----------------------------------------------------

-- ----------------------------------------------------
INSERT INTO METHODS_PAYMENT (name, icon_url) VALUES 
('Efectivo', 'https://res.cloudinary.com/dlxgtpema/image/upload/v1780251884/cash_sqndkx.svg'),
('Visa', 'https://res.cloudinary.com/dlxgtpema/image/upload/v1780251883/visa_pcdahv.svg'),
('Apple Pay', 'https://res.cloudinary.com/dlxgtpema/image/upload/v1780251883/apple_pay_mg6p2a.svg'),
('Mastercard', 'https://res.cloudinary.com/dlxgtpema/image/upload/v1780251883/mastercard_y8ysl9.svg');