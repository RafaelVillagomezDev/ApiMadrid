import { Request, Response, NextFunction } from 'express';
const DishController = {
    create: async (req: Request,
    res: Response,
    next: NextFunction):Promise<void> => {
        try {
           //
        } catch (error) {
            console.error('Error al crear el plato:', error);
            res.status(500).json({ error: 'Error al crear el plato' });
        }
    },
};

export default DishController;