"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restaurant_routes_1 = __importDefault(require("./routes/v1/restaurant-routes"));
const image_routes_1 = __importDefault(require("./routes/v1/image-routes"));
const location_routes_1 = __importDefault(require("./routes/v1/location-routes"));
const user_anonymus_routes_1 = __importDefault(require("./routes/v1/user-anonymus-routes"));
const menu_routes_1 = __importDefault(require("./routes/v1/menu-routes"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_middleware_1 = require("./middleware/logger-middleware");
const error_middleware_1 = require("./middleware/error-middleware");
const error_handler_1 = require("./middleware/error-handler");
const rate_limit_middleware_1 = require("./middleware/rate-limit-middleware");
const auth_csrf_1 = require("./auth/auth-csrf");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        callback(null, origin);
    },
    // 2. Permite el intercambio de cookies (vital para CSRF y Sesiones)
    credentials: true,
    // 3. Métodos permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // 4. Headers permitidos (añadimos x-csrf-token)
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'x-csrf-token',
        'Accept',
        'X-Requested-With',
    ],
}));
// Responder explícitamente a OPTIONS antes que a otros middlewares
app.options('*', (0, cors_1.default)());
app.use(express_1.default.json());
app.set('trust proxy', 1);
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
const port = 3000;
//Logger Winstom
app.use(logger_middleware_1.requestLogger);
//Cookie Parser
app.use(auth_csrf_1.initCookieParser);
//AUTH CSRF
app.use('/api/', auth_csrf_1.csrfProtection);
//Rate limit Middleware
app.use('/api/', rate_limit_middleware_1.apiLimiter);
//Routes
app.use('/api/v1/restaurant', restaurant_routes_1.default);
app.use('/api/v1/image', image_routes_1.default);
app.use('/api/v1/menu', menu_routes_1.default);
app.use('/api/v1/location', location_routes_1.default);
app.use('/api/v1/anonymous', user_anonymus_routes_1.default);
//Logger de errores para capturarlos s
app.use(error_middleware_1.errorLogger);
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
//Envio errores a Cliente
app.use(error_handler_1.errorHandler);
