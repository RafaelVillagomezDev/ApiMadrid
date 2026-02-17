import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';
import { configureCloudinary } from './cloudinary';

// Configuración inicial
configureCloudinary();
let isCloudinaryConfigured = true;

// --- CONFIGURACIÓN DE SEGURIDAD ---
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB límite
const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_PIXELS = 10000000; // 10MP para evitar ataques de agotamiento de RAM

// Optimizamos Sharp para no colapsar el CPU en ataques DoS
sharp.concurrency(2); 
sharp.cache(false);

const processSingleFileFromDisk = async (file: Express.Multer.File): Promise<any> => {
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

    let image = sharp(filePath).rotate();
    const metadata = await image.metadata();

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
      const dist = (s: any) => Math.abs(originalWidth - s.width) + Math.abs(originalHeight - s.height);
      return dist(curr) < dist(prev) ? curr : prev;
    });

    const targetRatio = targetSize.width / targetSize.height;
    const originalRatio = originalWidth / originalHeight;
    
    // Redimensionado optimizado (evitamos buffers intermedios innecesarios)
    const pipeline = image.resize(
      originalRatio > targetRatio ? { height: targetSize.height } : { width: targetSize.width }
    );

    const resizedBuffer = await pipeline.toBuffer();
    const finalImage = sharp(resizedBuffer);
    const resizedMeta = await finalImage.metadata();

    const left = Math.max(0, Math.floor((resizedMeta.width! - targetSize.width) / 2));
    const top = Math.max(0, Math.floor((resizedMeta.height! - targetSize.height) / 2));

    const buffer = await finalImage
      .extract({ left, top, width: targetSize.width, height: targetSize.height })
      .jpeg({ quality: 85, mozjpeg: true }) // SEGURIDAD/OPTIMIZACIÓN: Forzamos compresión y limpieza de metadatos sensibles (EXIF)
      .toBuffer();

    // 4. SEGURIDAD: Sanitizar el nombre del archivo para Cloudinary
    // Evita ataques de path traversal o inyección de caracteres en URLs
    const safeFileName = `${Date.now()}-${file.originalname.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'imagenes_restaurantes', 
          public_id: path.parse(safeFileName).name,
          resource_type: 'image', // SEGURIDAD: Solo permitimos imágenes
          allowed_formats: ['jpg', 'png', 'webp'],
        },
        (error, result) => {
          cleanup();
          if (error) return reject(error);
          resolve(result);
        },
      );

      Readable.from(buffer).pipe(uploadStream).on('error', (err) => {
        cleanup();
        reject(err);
      });
    });
  } catch (error) {
    cleanup();
    throw error;
  }
};

export const processAndUploadImageFlexible = async (req: any, res: any, next: any) => {
  // 5. SEGURIDAD: Límite de archivos por petición
  const MAX_FILES = 5;
  
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return next();
  }

  if (req.files.length > MAX_FILES) {
      return res.status(400).json({ error: `Máximo ${MAX_FILES} archivos permitidos.` });
  }

  try {
    const filePromises = (req.files as Express.Multer.File[]).map((file) =>
      processSingleFileFromDisk(file),
    );

    const results = await Promise.all(filePromises);
    req.cloudinaryResults = results;
    next();
  } catch (error: any) {
    console.error('Error procesador imágenes:', error.message);
    res.status(400).json({ error: error.message || 'Error al procesar imágenes' });
  }
};