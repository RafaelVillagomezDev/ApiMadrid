import { Request, Response, NextFunction } from 'express';
import { ApiResponseInterface } from '../types/api-type';
import { matchedData, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

const DishController = {
    create: async (req: Request,
        res: Response,
        next: NextFunction): Promise<void> => {
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

            const dish = {
                id: await uuidv4(),
                restaurant_id: validData.restaurant_id,
                menu_id: validData.menu_id,
                name: validData.name,
                description: validData.description,
                price: validData.price,
                category: validData.category,
            };

            const response: ApiResponseInterface = {
                message: 'Plato creado con éxito',
                data: dish,
                code: 200,
                count: 1
            };

            res.status(200).send(response);
        } catch (error) {
            console.error('Error al crear el plato:', error);
            res.status(500).json({ error: 'Error al crear el plato' });
        }
    },
};

export default DishController;