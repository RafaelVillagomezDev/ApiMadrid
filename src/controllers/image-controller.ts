import { Request, Response, NextFunction } from 'express';
import { validationResult, matchedData } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponseInterface } from '../types/api-type';
import { ImageInterface } from '../types/image-type';
import { uploadImagesToCloudinary } from '../utils/cloudinary';
import { ImageFactory } from '../factory/image-factory';
import * as Multer from 'multer';

const ImageController = {
  createImage: async (
    req: Request,
    res: Response<ApiResponseInterface>,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validación de la entrada
      /*const errors = validationResult(req);
      if (!errors.isEmpty()) {
         res.status(400).json({
          message: 'Error en la validación de los datos.',
          data: errors.array(),
          code: 400,
        });
        return
      }

      // Extraer los datos validados
      const validData = matchedData(req);
      const { relatedId, relatedType } = validData;*/

      const urls = []
      let files: any
      files = req.files

      for (const file of files) {
          

          const newPath = await uploadImagesToCloudinary(file)
          urls.push(newPath)
      }

      const multiImage = urls.map((url: any) => url)  
   
      res.status(200).json({
        message: 'Imagen creada con éxito',
        code: 200,
        data:multiImage
      }
        
      )
    } catch (error) {
      next(error);
    }
  },
};

export default ImageController;
