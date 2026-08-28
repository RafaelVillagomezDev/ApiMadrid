import { Request, Response, NextFunction } from 'express';
import { validationResult, matchedData } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponseInterface } from '../types/api-type';
import { ImageInterface } from '../types/image-type';
import { ImageFactory } from '../factory/image-factory';

interface CloudinaryResult {
  secure_url: string;
  public_id: string;
}


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
        res.status(400).json({
          message: 'Error de validación',
          data: errors.array(),
          code: 400,
        });
        return;
      }

      const { relatedId, relatedType } = matchedData(req);
      const cloudinaryResults = req.cloudinaryResults;

      if (!cloudinaryResults || cloudinaryResults.length === 0) {
        res.status(400).json({ message: 'No hay imágenes procesadas.', code: 400 });
        return;
      }

  
      const imagesToCreate: ImageInterface[] = cloudinaryResults.map((result) => {
        const optimizedUrl = result.secure_url.replace(
          '/upload/',
          '/upload/f_auto,q_auto/',
        );

        return {
          id: uuidv4(),
          relatedId,
          relatedType,
          url: optimizedUrl,
        };
      });

      // OPTIMIZACIÓN: Ejecutamos todas las inserciones a la vez (en paralelo)
      await Promise.all(
        imagesToCreate.map((image) => ImageFactory.createImage(image))
      );

      
      res.status(201).json({
        message: 'Imágenes creadas y optimizadas con éxito.',
        data: imagesToCreate as unknown as Record<string, unknown>[],
        code: 201,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default ImageController;