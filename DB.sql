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

CREATE TABLE DISHES (
    id CHAR(36) PRIMARY KEY,
    menu_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(6,2),
    category VARCHAR(50),
    FOREIGN KEY (menu_id) REFERENCES MENU(id) ON DELETE CASCADE
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
-- 4. NUEVA TABLA: Blacklist para seguridad y rendimiento 🛡️
-- ----------------------------------------------------

CREATE TABLE BlacklistEntry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- Valor a bloquear (IP, Client ID, etc.)
    value VARCHAR(255) NOT NULL,
    -- Tipo de valor ('IP', 'CLIENT_ID')
    type VARCHAR(50) NOT NULL,
    -- Razón del bloqueo
    reason TEXT,
    -- Fecha de creación
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Fecha de expiración (NULL = permanente)
    expires_at TIMESTAMP NULL,
    -- Restricción para asegurar que no haya el mismo valor/tipo duplicado
    CONSTRAINT unique_value_type UNIQUE (value, type)
);

-- Índice para optimizar las búsquedas de bloqueo
CREATE INDEX idx_blacklist_lookup ON BlacklistEntry (value, type, expires_at);