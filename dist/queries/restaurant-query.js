"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRestaurant = exports.existRestaurant = exports.createRestaurant = void 0;
const createRestaurant = () => {
    const query = `INSERT IGNORE INTO RESTAURANT (id,email,name,address,description) VALUES (?, ?, ?, ?,?);`;
    return query;
};
exports.createRestaurant = createRestaurant;
const existRestaurant = () => {
    const query = 'SELECT * FROM `restaurant` WHERE `email` = ?;';
    return query;
};
exports.existRestaurant = existRestaurant;
const isRestaurant = () => {
    const query = 'SELECT id FROM restaurant WHERE id = ?';
    return query;
};
exports.isRestaurant = isRestaurant;
