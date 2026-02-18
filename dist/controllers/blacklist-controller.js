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
exports.revokeSession = void 0;
const blacklist_model_1 = require("../../src/models/blacklist/blacklist-model");
const revokeSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userPayload = req.user;
        if (!userPayload || !userPayload.jti) {
            return res
                .status(400)
                .json({ message: 'No se encontró información de sesión válida' });
        }
        const { jti, exp, id_user } = userPayload;
        const expiresAt = new Date(exp * 1000)
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');
        yield (0, blacklist_model_1.addToken)(jti, // Esto irá a la columna 'value'
        'LOGOUT_MANUAL', // Esto irá a la columna 'type'
        expiresAt, // Esto irá a la columna 'expires_at'
        `El usuario ${id_user} cerró sesión`);
        // 4. Limpieza de cookies si las usas
        res.clearCookie('anonymousRefreshToken');
        return res.status(200).json({
            message: 'Sesión invalidada con éxito',
            code: 200,
        });
    }
    catch (error) {
        console.error('Error en revokeSession:', error);
        return res.status(500).json({ message: 'Error al invalidar el token' });
    }
});
exports.revokeSession = revokeSession;
