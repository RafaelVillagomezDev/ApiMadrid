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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.tokenSign = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_TOKEN = process.env.JWT_SECRET;
const tokenSign = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id_user, email, rol, jti }) {
    if (!SECRET_TOKEN) {
        throw new Error('JWT_SECRET no está definido en las variables de entorno.');
    }
    const sign = jsonwebtoken_1.default.sign({
        id_user: id_user,
        email: email,
        rol: rol,
        jti: jti,
    }, SECRET_TOKEN, {
        expiresIn: '30m', // Duración del Token de Acceso
    });
    return sign;
});
exports.tokenSign = tokenSign;
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!SECRET_TOKEN) {
        throw new Error('JWT_SECRET no está definido en las variables de entorno.');
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, SECRET_TOKEN);
        return decodedToken;
    }
    catch (e) {
        return null;
    }
});
exports.verifyToken = verifyToken;
