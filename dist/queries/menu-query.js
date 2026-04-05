"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDishes = exports.createMenu = void 0;
const createMenu = () => {
    const query = `INSERT INTO MENU (id, restaurant_id, name, description) VALUES (?, ?, ?, ?)`;
    return query;
};
exports.createMenu = createMenu;
const createDishes = () => {
    const query = `INSERT INTO DISHES (id, menu_id, name, description, price, category) VALUES (?, ?, ?, ?, ?, ?)`;
    return query;
};
exports.createDishes = createDishes;
