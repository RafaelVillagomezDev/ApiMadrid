import { ApiResponseInterface } from '../types/api-type';
import { Request, Response, NextFunction } from 'express';
import { matchedData, validationResult } from 'express-validator';
import {
  RestaurantInterface,
  RestaurantQueryPagination,
  RestaurantRemoveQueryInterface,
} from '../types/restaurant-type';
import { RestaurantFactory } from '../factory/restaurant-factory';
import { v4 as uuidv4 } from 'uuid';
import { getCoords } from '../utils/geodata';
import { LocationInterface } from '../types/location-type';
import { LocationFactory } from '../factory/location-factory';

const RestaurantController = {
  createRestaurant: async (
    req: Request,
    res: Response<ApiResponseInterface>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res
          .status(400)
          .json({
            message: 'Error en validación',
            data: errors.array(),
            code: 400,
          });
        return;
      }

      const validData = matchedData(req);
      const restaurantId = uuidv4();

      const restaurant: RestaurantInterface = {
        id: restaurantId,
        email: validData.email,
        name: validData.name,
        address: validData.address,
        description: validData.description,
        phone: validData.phone,
        type_food: validData.type_food,
        web: validData.web,
      };

      const geoData = await getCoords(validData.address);

      const location: LocationInterface = {
        id:  uuidv4(),
        relatedId: restaurantId, // Usamos el ID generado
        relatedType: 'restaurant',
        address: validData.address,
        latitude: geoData.latitud,
        longitude: geoData.longitud,
        country: geoData.country,
        town: geoData.town,
        county: geoData.county,
      };

      // EJECUCIÓN MASIVA EN PARALELO
      await Promise.all([
        RestaurantFactory.createRestaurant(restaurant),
        LocationFactory.createLocation(location),
      ]);

      res.status(200).send({
        message: 'Restaurante creado con éxito',
        data:{
          "id":restaurantId,
          "relatedType":"restaurant"
        },
        code: 200,
      });
    } catch (error) {
      next(error);
    }
  },
  
  getRestaurants: async (
    req: Request,
    res: Response<ApiResponseInterface | any>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          message: 'Error en validación',
          data: errors.array(),
          code: 400,
        });
        return;
      }

      const validData = matchedData(req, { includeOptionals: true });

      // 1. Valores seguros para paginación basados en 'page' y 'limit'
      // Usamos Math.max(1, ...) para asegurarnos de que nunca sea 0 o negativo
      const currentLimit = Math.max(1, parseInt(validData.limit) || 6);
      const currentPage = Math.max(1, parseInt(validData.page) || 1);

      // 2. Preparamos el queryData usando 'page'
      const queryData: RestaurantQueryPagination = {
        name: validData.name,
        id: validData.id,
        address: validData.address,
        type_food: validData.type_food,
        limit: currentLimit,
        page: currentPage, 
      };

      // 3. Ejecutamos la consulta a través de la Factory
      const data = await RestaurantFactory.getRestaurant(queryData);

      // 4. Cálculos de paginación
      const total_items = data.total || 0;
      const page_items = data.data ? data.data.length : 0;
      const total_pages = Math.ceil(total_items / currentLimit);

      // 5. Construcción de la respuesta
      const response = {
        message: 'Restaurantes obtenidos con éxito', 
        data: data.data || [],
        code: 200,
        total_items: total_items,
        page_items: page_items,
        total_pages: total_pages,
        current_page: currentPage 
      };

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  },

  removeRestaurant: async (
    req: Request,
    res: Response<ApiResponseInterface>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          message: 'Error en validación',
          data: errors.array(),
          code: 400,
        });
        return;
      }

      const validData = matchedData(req);

      const restaurant: RestaurantRemoveQueryInterface = {
        id: validData.id,
      };

      await RestaurantFactory.removeRestaurant(restaurant);

      const response: ApiResponseInterface = {
        message: 'Restaurante eliminado con éxito',
        code: 200,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
};

export default RestaurantController;