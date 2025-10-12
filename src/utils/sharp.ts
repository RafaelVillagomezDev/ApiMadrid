
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export const processAndUploadImageFlexible = async (req: any, res: any, next: any) => {
  if (!req.file) return next();

  try {
    const imagePath = req.file.path;
    let image = sharp(imagePath).rotate(); // aplica orientación EXIF automáticamente
    const metadata = await image.metadata();

    const originalWidth = metadata.width || 0;
    const originalHeight = metadata.height || 0;

    // Tamaños permitidos
    const allowedSizes = [
      { width: 574, height: 384 },
      { width: 768, height: 512 },
      { width: 1200, height: 800 },
    ];

    // Elegir el tamaño más cercano
    const distance = (size: { width: number; height: number }) =>
      Math.abs(originalWidth - size.width) + Math.abs(originalHeight - size.height);
    const targetSize = allowedSizes.reduce((prev, curr) =>
      distance(curr) < distance(prev) ? curr : prev
    );

    const targetRatio = targetSize.width / targetSize.height;
    const originalRatio = originalWidth / originalHeight;

    let resizeOptions: { width?: number; height?: number } = {};

    if (originalRatio > targetRatio) {
      // Imagen más ancha → ajustamos altura y sobrará ancho
      resizeOptions.height = targetSize.height;
    } else {
      // Imagen más alta → ajustamos ancho y sobrará altura
      resizeOptions.width = targetSize.width;
    }

    // Redimensionamos manteniendo proporción
    let buffer = await image.resize(resizeOptions).toBuffer();
    const resized = sharp(buffer);
    const resizedMeta = await resized.metadata();

    // Calcular coordenadas para recorte centrado
    const left = Math.max(0, Math.floor((resizedMeta.width! - targetSize.width) / 2));
    const top = Math.max(0, Math.floor((resizedMeta.height! - targetSize.height) / 2));

    // Recortar exactamente al tamaño objetivo
    buffer = await resized
      .extract({ left, top, width: targetSize.width, height: targetSize.height })
      .toBuffer();

    // Subir a Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'imagenes', public_id: path.parse(req.file.filename).name },
      (error, result) => {
        if (error) return next(error);
        req.file.cloudinary = result;

        fs.unlink(imagePath, () => {});
        next();
      }
    );

    const readable = Readable.from(buffer);
    readable.pipe(uploadStream);
  } catch (error) {
    next(error);
  }
};
