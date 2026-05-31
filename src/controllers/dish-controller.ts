import { Request, Response, NextFunction } from 'express';
import { ApiResponseInterface } from '../types/api-type';
import { matchedData, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { DishFactory } from '../factory/dish-factory';

const DishController = {
    create: async (
        req: Request,
        res: Response,
        next: NextFunction
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
            const dishesArray = validData.dishes || [];

            // Mapeamos el array de la petición al formato que necesita tu base de datos
            const dishesToCreate = dishesArray.map((dishItem: any) => ({
                id: uuidv4(),
                restaurant_id: dishItem.restaurant_id,
                menu_id: dishItem.menu_id || null,
                name: dishItem.name,
                description: dishItem.description || null,
                price: dishItem.price,
                category: dishItem.category,
            }));


            await DishFactory.createDishes(dishesToCreate);

            const response: ApiResponseInterface = {
                message: `${dishesToCreate.length} platos creados con éxito`,
                code: 200,
            };

            res.status(200).send(response);
        } catch (error) {
            console.error('Error al crear los platos:', error);
            res.status(500).json({ error: 'Error al crear los platos' });
        }
    },
};

export default DishController;