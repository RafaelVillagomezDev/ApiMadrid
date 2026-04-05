"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTokenBlacklist = exports.addTokenBlackList = void 0;
const addTokenBlackList = () => {
    const query = `INSERT INTO BlacklistEntry (value, type, expires_at, reason) VALUES (?, ?, ?, ?)`;
    return query;
};
exports.addTokenBlackList = addTokenBlackList;
const searchTokenBlacklist = () => {
    const query = `SELECT value FROM BlacklistEntry WHERE value = ? LIMIT 1`;
    return query;
};
exports.searchTokenBlacklist = searchTokenBlacklist;
