import { Request, Response, NextFunction } from 'express';
import { validationResult, matchedData } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponseInterface } from '../types/api-type';
import { ImageInterface } from '../types/image-type';
import { uploadImagesToCloudinary } from '../utils/cloudinary';
import { ImageFactory } from '../factory/image-factory';

const ImageController = {
  createImage: async (
    req: Request,
    res: Response<ApiResponseInterface>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Validar entrada
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
      const files = req.files as Express.Multer.File[];

      // Verificar si hay archivos
      if (!files || files.length === 0) {
        res.status(400).json({
          message: 'No se han proporcionado imágenes.',
          code: 400,
        });
        return;
      }

      // Subir imágenes y crear cada una individualmente
      for (const file of files) {
        const url = await uploadImagesToCloudinary(file);

        const image: ImageInterface = {
          id: uuidv4(),
          relatedId,
          relatedType,
          url,
        };

        await ImageFactory.createImage(image);
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
