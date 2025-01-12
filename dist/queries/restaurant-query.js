"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRestaurant = void 0;
const createRestaurant = () => {
    const query = `INSERT IGNORE INTO RESTAURANT (Id,Email,Name,Address) VALUES (?, ?, ?, ?);`;
    return query;
};
exports.createRestaurant = createRestaurant;
