"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTokenBlacklist = exports.addToken = void 0;
const bd_1 = require("../../connection/bd");
const blacklist_query_1 = require("../../queries/blacklist-query");
const promisePool = bd_1.pool.promise();
/**
 * Agrega un token a la lista negra
 */
const addToken = (jti, block_type, expires_at, reason) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = (0, blacklist_query_1.addTokenBlackList)();
        const [result] = yield promisePool.execute(query, [
            jti,
            block_type,
            expires_at,
            reason,
        ]);
        return result;
    }
    catch (error) {
        console.error('Error al añadir token a la blacklist:', error);
        throw new Error('No se pudo invalidar el token.');
    }
});
exports.addToken = addToken;
/**
 * Busca un token en la lista negra
 */
const findTokenBlacklist = (jti) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, blacklist_query_1.searchTokenBlacklist)();
    const [rows] = yield promisePool.execute(query, [jti]);
    return rows.length > 0 ? rows[0] : null;
});
exports.findTokenBlacklist = findTokenBlacklist;
