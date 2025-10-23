CREATE DATABASE DB_APIMADRID;
USE DB_APIMADRID;

-- 1. Tablas independientes (no tienen claves foráneas)
CREATE TABLE USERS (
    id VARCHAR(255) PRIMARY KEY,  -- ID proporcionado por Google OAuth
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('user','cliente' 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE RESTAURANT (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50) UNIQUE,
    address VARCHAR(100),
    description TEXT,
    phone VARCHAR(20),
    type_food VARCHAR(50),
    web VARCHAR(800),
    CONSTRAINT unique_name_address UNIQUE (name, address),
    INDEX idx_name_address (name, address)
);


CREATE TABLE MENU (
    id CHAR(36) PRIMARY KEY,
    restaurant_id CHAR(36),
    name VARCHAR(100), -- ejemplo: "Menú del día"
    description TEXT,
    FOREIGN KEY (restaurant_id) REFERENCES RESTAURANT(id) ON DELETE CASCADE
);

CREATE TABLE DISHES (
    id CHAR(36) PRIMARY KEY,
    menu_id CHAR(36),
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

-- 3. Tablas polimórficas (relacionadas con varias posibles entidades)
CREATE TABLE IMAGES (
    id CHAR(36) PRIMARY KEY,
    relatedId CHAR(36),
    relatedType VARCHAR(50),
    url VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE LOCATION (
    id CHAR(36) PRIMARY KEY,
    relatedId CHAR(36),
    relatedType VARCHAR(50),
    address VARCHAR(500) NOT NULL,
    latitude VARCHAR(50),
    longitude VARCHAR(50),
    town VARCHAR(30),
    country VARCHAR(30),
    county VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
