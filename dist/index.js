"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restaurant_routes_1 = __importDefault(require("./routes/v1/restaurant-routes"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const customFormat = ':method :url :status :res[content-length] - :response-time ms :remote-addr';
// Usar morgan con el formato personalizado
app.use((0, morgan_1.default)(customFormat));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
const port = 3000;
app.use('/api/v1/restaurant', restaurant_routes_1.default);
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
