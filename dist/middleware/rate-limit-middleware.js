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
exports.apiLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
const logger_1 = __importDefault(require("../../src/utils/logger"));
const jsonwebtoken_1 = require("jsonwebtoken"); // O la librería que uses para JWT
const blacklist_model_1 = require("../models/blacklist/blacklist-model");
exports.apiLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 10 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Has excedido el límite de peticiones. Intenta de nuevo más tarde.',
        code: 429,
    },
    handler: (req, res, next, options) => __awaiter(void 0, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        let jtiToBlock = 'unknown';
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = (0, jsonwebtoken_1.decode)(token);
                if (decoded && decoded.jti) {
                    jtiToBlock = decoded.jti;
                    yield (0, blacklist_model_1.addToken)(decoded.jti, 'rate_limit_abuse', new Date(Date.now() + options.windowMs).toISOString(), `Excedió el límite de ${options.max} peticiones`);
                }
            }
            catch (err) {
                logger_1.default.error('Error al decodificar token en rate limiter', err);
            }
        }
        logger_1.default.error('RATE LIMIT SUPERADO', {
            ip: req.ip,
            jti: jtiToBlock,
            endpoint: req.originalUrl,
            method: req.method,
        });
        res.status(options.statusCode).send(options.message);
    }),
});
