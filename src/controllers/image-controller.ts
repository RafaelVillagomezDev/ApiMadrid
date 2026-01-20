import { Request, Response, NextFunction } from 'express';
import { validationResult, matchedData } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponseInterface } from '../types/api-type';
import { ImageInterface } from '../types/image-type';
import { ImageFactory } from '../factory/image-factory';

// Definición de una interfaz para los resultados de Cloudinary adjuntos por el middleware
interface CloudinaryResult {
  secure_url: string;
  public_id: string; 
  // Otros campos de Cloudinary que necesites
}

// Extender la interfaz Request para incluir los resultados procesados
interface CustomRequest extends Request {
  cloudinaryResults?: CloudinaryResult[];
}

const ImageController = {
  createImage: async (
    req: CustomRequest,
    res: Response<ApiResponseInterface>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Error de validación', data: errors.array(), code: 400 });
        return;
      }

      const { relatedId, relatedType } = matchedData(req);
      const cloudinaryResults = req.cloudinaryResults;

      if (!cloudinaryResults || cloudinaryResults.length === 0) {
        res.status(400).json({ message: 'No hay imágenes procesadas.', code: 400 });
        return;
      }

      const createdImages = [];
      for (const result of cloudinaryResults) {
        
        // 🚀 OPTIMIZACIÓN CRÍTICA: Transformación al vuelo
        // Insertamos f_auto (formato automático como WebP) y q_auto (calidad automática)
        // Reemplazamos "/upload/" por "/upload/f_auto,q_auto/"
        const optimizedUrl = result.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');

        const image: ImageInterface = {
          id: uuidv4(),
          relatedId,
          relatedType,
          url: optimizedUrl, // Guardamos la URL ya optimizada
        };

        const newImageRecord = await ImageFactory.createImage(image);
        createdImages.push(newImageRecord);
      }

      res.status(200).json({
        message: 'Imágenes creadas y optimizadas con éxito.',
        code: 200,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default ImageController;