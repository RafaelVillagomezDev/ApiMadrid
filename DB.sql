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

-- ----------------------------------------------------
-- 2. Tablas relacionadas (Datos del Restaurante/Usuario)
-- ----------------------------------------------------

CREATE TABLE MENU (
    id CHAR(36) PRIMARY KEY,
    restaurant_id CHAR(36) NOT NULL,
    name VARCHAR(100),
    description TEXT,
    FOREIGN KEY (restaurant_id) REFERENCES RESTAURANT(id) ON DELETE CASCADE
);

-- Tabla modificada: Permite platos sueltos (carta) y platos en menús
CREATE TABLE DISHES (
    id CHAR(36) PRIMARY KEY,
    restaurant_id CHAR(36) NOT NULL,          -- Todo plato se asocia a un restaurante
    menu_id CHAR(36) NULL,                    -- NULL si es plato suelto de la carta
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(6,2),
    category VARCHAR(50),                     -- 'entrantes', 'principal', 'postres', 'bebidas'
    FOREIGN KEY (restaurant_id) REFERENCES RESTAURANT(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES MENU(id) ON DELETE SET NULL
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
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
-- 5. VISTA: Cálculo dinámico de precio medio ponderado
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