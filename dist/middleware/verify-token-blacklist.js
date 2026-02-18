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
exports.checkBlacklist = void 0;
const blacklist_model_1 = require("../models/blacklist/blacklist-model");
const checkBlacklist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Extraemos el user de forma segura
        const user = req.user;
        // 2. Si no hay user o no hay jti, el token no pasó por authToken correctamente
        if (!(user === null || user === void 0 ? void 0 : user.jti)) {
            return res.status(401).json({
                error: 'INVALID_CONTEXT',
                message: 'No se pudo identificar la sesión (Falta JTI).',
            });
        }
        // 3. Consultamos tu modelo en MySQL
        const isRevoked = yield (0, blacklist_model_1.findTokenBlacklist)(user.jti);
        if (isRevoked) {
            return res.status(403).json({
                error: 'TOKEN_REVOKED',
                message: 'Este token ya no es válido, por favor inicia sesión de nuevo.',
            });
        }
        // Si llegamos aquí, el token es legítimo y no está bloqueado
        next();
    }
    catch (error) {
        // Logueamos el error para el desarrollador, pero respondemos algo genérico
        console.error('Error en Middleware Blacklist:', error);
        return res
            .status(500)
            .json({ message: 'Error interno de validación de seguridad' });
    }
});
exports.checkBlacklist = checkBlacklist;
