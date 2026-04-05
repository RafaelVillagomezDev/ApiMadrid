"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
if (!process.env.DBHOST ||
    !process.env.DBUSER ||
    !process.env.DBPASSWORD ||
    !process.env.DBDATABASE ||
    !process.env.DBPORT) {
    throw new Error('Variables de entorno vacias');
}
const connection = {
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE,
    port: process.env.DBPORT ? parseInt(process.env.DBPORT, 10) : 3306,
    connectionLimit: 10,
    connectTimeout: 10000,
    waitForConnections: true,
    queueLimit: 0,
    debug: false,
    timezone: 'Z',
    multipleStatements: true,
    charset: 'utf8mb4_general_ci',
    maxIdle: 1,
};
// Crear el pool de conexiones
const pool = mysql2_1.default.createPool(connection);
exports.pool = pool;
