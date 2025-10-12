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
    req: CustomRequest, // Usar la interfaz extendida
    res: Response<ApiResponseInterface>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // 1. Validar entrada (sin cambios, es correcto)
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          message: 'Error en la validación de los datos.',
          data: errors.array(),
          code: 400,
        });
        return;
      }

      const { relatedId, relatedType } = matchedData(req);
      
      // 2. 🛑 CLAVE: Obtener los resultados de Cloudinary del middleware
      const cloudinaryResults = req.cloudinaryResults;

      // Verificar si hay resultados del procesamiento
      if (!cloudinaryResults || cloudinaryResults.length === 0) {
        // Asumimos que si hay archivos, el middleware de subida siempre adjunta algo.
        // Si falla aquí, el error real debería ser capturado en el middleware anterior.
        res.status(400).json({
          message: 'No se encontraron resultados de imágenes procesadas.',
          code: 400,
        });
        return;
      }

      // 3. Crear registros usando las URLs YA SUBIDAS
      const createdImages = [];
      for (const result of cloudinaryResults) {
        const url = result.secure_url;
        const publicId = result.public_id; // Útil para tener una referencia para eliminación futura

        const image: ImageInterface = {
          id: uuidv4(),
          relatedId,
          relatedType,
          url,
     
        };

        const newImageRecord = await ImageFactory.createImage(image);
        createdImages.push(newImageRecord);
      }

      res.status(200).json({
        message: 'Imágenes creadas con éxito.',
        code: 200,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default ImageController;