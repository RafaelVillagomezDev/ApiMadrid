"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const errorLogger = (err, req, res, next) => {
    const error = err instanceof Error ? err : new Error(String(err));
    const logData = {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        ip: req.ip || req.connection.remoteAddress,
        headers: req.headers,
        userAgent: req.headers['user-agent'],
        message: error.message,
        stack: error.stack,
    };
    logger_1.default.error(`${req.method} ${req.originalUrl} - ERROR`, logData);
    next(error);
};
exports.errorLogger = errorLogger;
