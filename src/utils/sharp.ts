import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Middleware para recortar/redimensionar y subir a Cloudinary
export const processAndUploadImageFlexible = async (req: any, res: any, next: any) => {
  if (!req.file) return next();

  try {
    const imagePath = req.file.path;
    let image = sharp(imagePath);
    const metadata = await image.metadata();

    let width = metadata.width || 0;
    let height = metadata.height || 0;

    // Si es vertical o casi cuadrada (relación < 1.1), rotar a horizontal
    if (height > width || height / width > 0.9) {
      image = image.rotate(90);
      [width, height] = [height, width]; // intercambiar ancho y alto
    }

    // Tamaños permitidos
    const allowedSizes = [
      { width: 574, height: 384 },
      { width: 768, height: 512 },
      { width: 1200, height: 800 },
    ];

    // Elegir el tamaño más cercano
    const distance = (size: { width: number; height: number }) =>
      Math.abs(width - size.width) + Math.abs(height - size.height);

    const targetSize = allowedSizes.reduce((prev, curr) =>
      distance(curr) < distance(prev) ? curr : prev
    );

    // Redimensionar y recortar centrado
    const buffer = await image
      .resize(targetSize.width, targetSize.height, {
        fit: 'cover',
        position: 'center',
      })
      .toBuffer();

    // Subir a Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'imagenes', public_id: path.parse(req.file.filename).name },
      (error, result) => {
        if (error) return next(error);
        req.file.cloudinary = result;

        fs.unlink(imagePath, () => {}); // Borrar local

        next();
      }
    );

    const readable = Readable.from(buffer);
    readable.pipe(uploadStream);
  } catch (error) {
    next(error);
  }
};
