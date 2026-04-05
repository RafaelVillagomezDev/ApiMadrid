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
const handle_jwt_1 = require("../utils/handle-jwt");
const crypto_1 = __importDefault(require("crypto")); // Módulo nativo para generar IDs únicos
const AnonymusController = {
    loginAnonymous: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Generamos un ID único para esta sesión específica
            const uniqueAnonId = crypto_1.default.randomUUID();
            const payloadData = {
                id_user: uniqueAnonId,
                email: `${uniqueAnonId}@api.com`,
                rol: 'no_cliente',
                jti: crypto_1.default.randomUUID(),
            };
            const accessToken = yield (0, handle_jwt_1.tokenSign)(payloadData);
            res.status(200).json({
                message: 'Acceso anónimo único concedido.',
                data: {
                    user: {
                        token: accessToken,
                    },
                },
                code: 200,
            });
        }
        catch (error) {
            next(error);
        }
    }),
};
exports.default = AnonymusController;
