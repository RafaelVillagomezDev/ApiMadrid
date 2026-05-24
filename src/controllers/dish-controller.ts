import { Request, Response, NextFunction } from 'express';
import { ApiResponseInterface } from '../types/api-type';
import { matchedData, validationResult } from 'express-validator';


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

            const response: ApiResponseInterface = {
                message: 'Restaurante obtenidos con éxito',
                data: validData,
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