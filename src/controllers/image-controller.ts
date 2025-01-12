import { ApiResponseInterface } from 'api-type';
import { Request, Response, NextFunction } from 'express';
import { matchedData, validationResult } from 'express-validator';
import { RestaurantInterface } from 'restaurant-type';
import { RestaurantFactory } from '../factory/restaurant-factory';
import { v4 as uuidv4 } from 'uuid';

const ImageController = {
  createImage: async (
    req: Request,
    res: Response<ApiResponseInterface>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const errors = validationResult(req);
      const errorResponse: ApiResponseInterface = {
        message: 'Validation failed',
        data: errors.array(),
        code: 400,
      };

      if (!errors.isEmpty()) {
        res.status(400).json(errorResponse);
        return;
      }

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
