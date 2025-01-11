import { Request, Response, NextFunction } from 'express';

export const getRestaurant = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    return res.status(200).json("Hi"); // Enviar respuesta JSON
  } catch (error) {
    next(error); // Llamar al middleware de manejo de errores
  }
};


