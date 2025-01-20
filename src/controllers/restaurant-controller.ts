import { ApiResponseInterface } from 'api-type';
import { Request, Response, NextFunction } from 'express';
import { matchedData, validationResult } from 'express-validator';
import { RestaurantInterface } from 'restaurant-type';
import { RestaurantFactory } from '../factory/restaurant-factory';
import { v4 as uuidv4 } from 'uuid';

const RestaurantController = {
  createRestaurant: async (
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

      const restaurant: RestaurantInterface = {
        id: await uuidv4(),
        email: validData.email,
        name: validData.name,
        address: validData.address,
      };

      await RestaurantFactory.createRestaurant(restaurant);

      const response: ApiResponseInterface = {
        message: 'Restaurante creado con éxito',
        code: 200,
      };

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  },
};

export default RestaurantController;
