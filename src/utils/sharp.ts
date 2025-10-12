// imageProcessor.ts
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';
import { configureCloudinary } from './cloudinary';

// Asumimos que configureCloudinary esta ya 
configureCloudinary()
// Bandera para asegurar que la configuración solo se ejecute una vez
let isCloudinaryConfigured = false; 

// --- Función Auxiliar para Procesar un Único Archivo ---
const processSingleFileFromDisk = async (file: Express.Multer.File): Promise<any> => {
  const filePath = file.path;

  // Función de limpieza
  const cleanup = () => {
    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr) console.error("Error al eliminar archivo temporal:", unlinkErr);
    });
  };

  // 🛑 Verificación de existencia
  if (!fs.existsSync(filePath)) {
      cleanup();
      throw new Error(`[CRÍTICO] Archivo no encontrado en la ruta: ${filePath}`);
  }

  try {
    let image = sharp(filePath).rotate();
    const metadata = await image.metadata();

    const originalWidth = metadata.width || 0;
    const originalHeight = metadata.height || 0;

    // Lógica para elegir el tamaño objetivo
    const allowedSizes = [
      { width: 574, height: 384 },
      { width: 768, height: 512 },
      { width: 1200, height: 800 },
    ];
    const distance = (size: { width: number; height: number }) =>
      Math.abs(originalWidth - size.width) + Math.abs(originalHeight - size.height);
    const targetSize = allowedSizes.reduce((prev, curr) =>
      distance(curr) < distance(prev) ? curr : prev
    );
    
    // Lógica de redimensionamiento y recorte
    const targetRatio = targetSize.width / targetSize.height;
    const originalRatio = originalWidth / originalHeight;
    let resizeOptions: { width?: number; height?: number } = {};

    if (originalRatio > targetRatio) {
      resizeOptions.height = targetSize.height;
    } else {
      resizeOptions.width = targetSize.width;
    }
    
    // Redimensionar, calcular recorte y extraer (Buffer final)
    let buffer = await image.resize(resizeOptions).toBuffer();
    const resized = sharp(buffer);
    const resizedMeta = await resized.metadata();

    const left = Math.max(0, Math.floor((resizedMeta.width! - targetSize.width) / 2));
    const top = Math.max(0, Math.floor((resizedMeta.height! - targetSize.height) / 2));

    buffer = await resized
      .extract({ left, top, width: targetSize.width, height: targetSize.height })
      .toBuffer();

    // 🚀 RESTAURACIÓN: Subir a Cloudinary con Stream
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'imagenes', public_id: path.parse(file.filename).name },
        (error, result) => {
          cleanup(); // Limpiar después de la subida exitosa
          if (error) return reject(error);
          resolve(result); // Devolver el resultado de Cloudinary
        }
      );
      
      // Canalizar el buffer (en memoria) al stream de subida
      const readable = Readable.from(buffer);
      readable.pipe(uploadStream).on('error', (streamError) => {
          cleanup(); // Limpiar si el stream falla
          reject(streamError);
      });
    });

  } catch (error) {
    cleanup(); // Limpiar si falla antes de la subida
    throw error;
  }
};

// --- Middleware Principal para Array de Archivos ---
export const processAndUploadImageFlexible = async (req: any, res: any, next: any) => {
  
  // 🚀 Lógica de configuración (Asumiendo que configureCloudinary está disponible)
  if (!isCloudinaryConfigured) {
    try {
        // configureCloudinary(); // Descomentar si decides llamar aquí
        isCloudinaryConfigured = true;
    } catch (error) {
        console.error("Fallo al configurar Cloudinary:", error);
        return next(error);
    }
  }
  // ------------------------------------------------
    
  // 🛑 Verificar si hay archivos en req.files
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return next();
  }

  try {
    const filePromises = (req.files as Express.Multer.File[]).map(file => 
      processSingleFileFromDisk(file)
    );
    
    // Ejecutar todas las subidas en paralelo
    const results = await Promise.all(filePromises);

    // Adjuntar los resultados de Cloudinary al objeto req
    req.cloudinaryResults = results;
    console.log(req.cloudinaryResults)
    next();
  } catch (error) {
    console.error("Error procesando array de imágenes:", error);
    next(error);
  }
};