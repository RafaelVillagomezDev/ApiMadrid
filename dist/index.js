"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restaurant_routes_1 = __importDefault(require("./routes/v1/restaurant-routes"));
const image_routes_1 = __importDefault(require("./routes/v1/image-routes"));
const location_routes_1 = __importDefault(require("./routes/v1/location-routes"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_middleware_1 = require("./middleware/logger-middleware");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
const port = 3000;
app.use('/api/v1/restaurant', restaurant_routes_1.default);
app.use('/api/v1/image', image_routes_1.default);
app.use('/api/v1/location', location_routes_1.default);
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
//Logger Winstom
app.use(logger_middleware_1.requestLogger);
