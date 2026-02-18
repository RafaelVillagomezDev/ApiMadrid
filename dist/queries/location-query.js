"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocation = exports.createLocation = exports.existLocation = void 0;
const existLocation = () => {
    const query = 'SELECT * FROM `location` WHERE `relatedId` = ?;';
    return query;
};
exports.existLocation = existLocation;
const createLocation = () => {
    const query = `INSERT IGNORE INTO location (id,relatedId,relatedType,address,latitude,longitude,town,country,county) VALUES (?, ?, ?, ?,?,?,?,?,?);`;
    return query;
};
exports.createLocation = createLocation;
const getLocation = () => {
    const query = `SELECT *
  FROM location WHERE relatedId = ? 
   `;
    return query;
};
exports.getLocation = getLocation;
