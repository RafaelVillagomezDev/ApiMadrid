"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
// Asegúrate de que el directorio exista
const ensureUploadDirectoryExists = () => {
    const dir = './uploads';
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
};
const multerStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        ensureUploadDirectoryExists();
        cb(null, './uploads');
    },
    filename: (_req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `${Date.now()}.${ext}`);
    },
});
const fileFilter = (_req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true); // Aceptar el archivo
    }
    else {
        cb(null, false);
    }
};
exports.upload = (0, multer_1.default)({
    storage: multerStorage,
    fileFilter: fileFilter,
});
