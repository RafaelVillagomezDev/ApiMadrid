"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.existImage = exports.createImage = void 0;
const createImage = () => {
    const query = `INSERT INTO IMAGES (id, relatedId, relatedType, url) VALUES (?, ?, ?, ?)`;
    return query;
};
exports.createImage = createImage;
const existImage = () => {
    const query = 'SELECT * FROM `images` WHERE `id` = ?;';
    return query;
};
exports.existImage = existImage;
