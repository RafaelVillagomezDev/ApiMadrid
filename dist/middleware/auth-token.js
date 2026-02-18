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
exports.authToken = void 0;
const handle_jwt_1 = require("../utils/handle-jwt");
/*
  Middleware: función que verifica la autenticidad del token (Authorization: Bearer <token>)
  y adjunta el payload del usuario a la petición si es válido.
*/
const authToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    // 1. Valida Bearer en el header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            message: 'Error en la validación de los datos.',
            code: 400,
        });
        return;
    }
    try {
        // 2. Extraer el token: Divide por espacio y toma la segunda parte (el token)
        const token = authHeader.split(' ')[1];
        // 3. Verificar el token. Asegúrate de que verifyToken ahora devuelve el payload o null
        const payloadToken = yield (0, handle_jwt_1.verifyToken)(token);
        // 4. Validar el payload
        if (!payloadToken || !payloadToken.id_user) {
            res.status(401).json({
                message: 'Acesso invalido',
                code: 401,
            });
            return;
        }
        req.user = payloadToken;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.authToken = authToken;
