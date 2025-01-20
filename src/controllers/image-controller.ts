import { ApiResponseInterface } from 'api-type';
import { Request, Response, NextFunction } from 'express';
import { matchedData, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { ImageInterface } from 'image-type';
import { ImageFactory } from '../factory/image-factory';

const ImageController = {
  createImage: async (
    req: Request,
    res: Response<ApiResponseInterface>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const errors = validationResult(req);
      const errorResponse: ApiResponseInterface = {
        message: 'Error en validación',
        data: errors.array(),
        code: 400,
      };

      if (!errors.isEmpty()) {
        res.status(400).json(errorResponse);
        return;
      }

      const validData = matchedData(req);

      const image: ImageInterface = {
        id: await uuidv4(),
        relatedId: await uuidv4(),
        relatedType: validData.relatedType,
        url: 'pepe',
      };

      await ImageFactory.createImage(image);

      const response: ApiResponseInterface = {
        message: 'Imagen creada con éxito',
        code: 200,
      };

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  },
};

export default ImageController;
