import { ApiResponseInterface } from '../types/api-type';
import { Request, Response, NextFunction } from 'express';
import { matchedData, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { MenuInterface } from '../types/menu-types';
import { MenuFactory } from '../factory/menu-factory';

const MenuController = {
  createMenu: async (
    req: Request,
    res: Response<ApiResponseInterface>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorResponse: ApiResponseInterface = {
          message: 'Error en validación',
          data: errors.array(),
          code: 400,
        };
        res.status(400).json(errorResponse);
        return;
      }

      const validData = matchedData(req, { locations: ['body'] });

      const menu: MenuInterface = {
        id: await uuidv4(),
        restaurant_id: validData.restaurant_id,
        name: validData.name,
        description: validData.description,
        dishes: validData.dishes,
      };

      await MenuFactory.createMenu(menu);

      const response: ApiResponseInterface = {
        message: 'Menú creado con éxito',
        code: 200,
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
};

export default MenuController;
