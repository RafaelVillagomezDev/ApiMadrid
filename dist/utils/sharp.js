"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.processAndUploadImageFlexible = void 0;
const sharp_1 = __importDefault(require("sharp"));
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const cloudinary_2 = require("./cloudinary");
// Configuración inicial
(0, cloudinary_2.configureCloudinary)();
let isCloudinaryConfigured = true;
// --- CONFIGURACIÓN DE SEGURIDAD ---
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB límite
const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_PIXELS = 10000000; // 10MP para evitar ataques de agotamiento de RAM
// Optimizamos Sharp para no colapsar el CPU en ataques DoS
sharp_1.default.concurrency(2);
sharp_1.default.cache(false);
const processSingleFileFromDisk = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = file.path;
    const cleanup = () => {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => err && console.error('Error cleanup:', err));
        }
    };
    try {
        // 1. SEGURIDAD: Validar tamaño antes de tocar el archivo
        if (file.size > MAX_FILE_SIZE) {
            throw new Error(`Archivo demasiado grande: ${file.originalname}`);
        }
        // 2. SEGURIDAD: Validar Mimetype real (no solo extensión)
        if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
            throw new Error(`Formato no permitido: ${file.mimetype}`);
        }
        let image = (0, sharp_1.default)(filePath).rotate();
        const metadata = yield image.metadata();
        // 3. SEGURIDAD: Evitar "Pixel Flood" (bombas de descompresión)
        const pixels = (metadata.width || 0) * (metadata.height || 0);
        if (pixels > MAX_PIXELS) {
            throw new Error("La resolución de la imagen es excesiva.");
        }
        const originalWidth = metadata.width || 0;
        const originalHeight = metadata.height || 0;
        // --- Tu lógica de redimensionamiento mantenida ---
        const allowedSizes = [
            { width: 574, height: 384 },
            { width: 768, height: 512 },
            { width: 1200, height: 800 },
        ];
        const targetSize = allowedSizes.reduce((prev, curr) => {
            const dist = (s) => Math.abs(originalWidth - s.width) + Math.abs(originalHeight - s.height);
            return dist(curr) < dist(prev) ? curr : prev;
        });
        const targetRatio = targetSize.width / targetSize.height;
        const originalRatio = originalWidth / originalHeight;
        // Redimensionado optimizado (evitamos buffers intermedios innecesarios)
        const pipeline = image.resize(originalRatio > targetRatio ? { height: targetSize.height } : { width: targetSize.width });
        const resizedBuffer = yield pipeline.toBuffer();
        const finalImage = (0, sharp_1.default)(resizedBuffer);
        const resizedMeta = yield finalImage.metadata();
        const left = Math.max(0, Math.floor((resizedMeta.width - targetSize.width) / 2));
        const top = Math.max(0, Math.floor((resizedMeta.height - targetSize.height) / 2));
        const buffer = yield finalImage
            .extract({ left, top, width: targetSize.width, height: targetSize.height })
            .jpeg({ quality: 85, mozjpeg: true }) // SEGURIDAD/OPTIMIZACIÓN: Forzamos compresión y limpieza de metadatos sensibles (EXIF)
            .toBuffer();
        // 4. SEGURIDAD: Sanitizar el nombre del archivo para Cloudinary
        // Evita ataques de path traversal o inyección de caracteres en URLs
        const safeFileName = `${Date.now()}-${file.originalname.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder: 'imagenes_restaurantes',
                public_id: path.parse(safeFileName).name,
                resource_type: 'image', // SEGURIDAD: Solo permitimos imágenes
                allowed_formats: ['jpg', 'png', 'webp'],
            }, (error, result) => {
                cleanup();
                if (error)
                    return reject(error);
                resolve(result);
            });
            stream_1.Readable.from(buffer).pipe(uploadStream).on('error', (err) => {
                cleanup();
                reject(err);
            });
        });
    }
    catch (error) {
        cleanup();
        throw error;
    }
});
const processAndUploadImageFlexible = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 5. SEGURIDAD: Límite de archivos por petición
    const MAX_FILES = 5;
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return next();
    }
    if (req.files.length > MAX_FILES) {
        return res.status(400).json({ error: `Máximo ${MAX_FILES} archivos permitidos.` });
    }
    try {
        const filePromises = req.files.map((file) => processSingleFileFromDisk(file));
        const results = yield Promise.all(filePromises);
        req.cloudinaryResults = results;
        next();
    }
    catch (error) {
        console.error('Error procesador imágenes:', error.message);
        res.status(400).json({ error: error.message || 'Error al procesar imágenes' });
    }
});
exports.processAndUploadImageFlexible = processAndUploadImageFlexible;
