import { ApiResponseInterface } from 'api-type';
import { Request, Response, NextFunction } from 'express';
import { matchedData, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { MenuInterface } from 'menu-types';
import { MenuFactory } from '../factory/menu-factory';


const MenuController = {
  createMenu: async (
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

      const menu: MenuInterface = {
        id: await uuidv4(),
        restaurant_id: validData.restaurant_id,
        dish_name:validData.dish_name,
        description:validData.description,
        price:validData.price,
        category:validData.category
      };

      await MenuFactory.createMenu(menu);

      const response: ApiResponseInterface = {
        message: 'Menu creado con éxito',
        code: 200,
      };

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  },
  
};

export default MenuController;

