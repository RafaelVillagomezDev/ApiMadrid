import { ApiResponseInterface } from 'api-type';
import { Request, Response, NextFunction } from 'express';
import { matchedData, validationResult } from 'express-validator';
import {
  RestaurantInterface,
  RestaurantQueryInterface,
  RestaurantQueryPagination,
  RestaurantRemoveQueryInterface,
} from 'restaurant-type';
import { RestaurantFactory } from '../factory/restaurant-factory';
import { v4 as uuidv4 } from 'uuid';
import { getCoords } from '../utils/geodata';
import { LocationInterface } from 'location-type';
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
        id: uuidv4(),
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
        message: 'Restaurante creado con éxito con sus imágenes y localización',
        code: 200,
      });
    } catch (error) {
      next(error);
    }
  },
  getRestaurants: async (
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

      const queryData: RestaurantQueryPagination = {
        name: validData.name,
        id: validData.id,
        address: validData.address,
        limit: validData.limit,
        offset: validData.offset,
      };

      const data = await RestaurantFactory.getRestaurant(queryData);

      const response: ApiResponseInterface = {
        message: 'Restaurante obtenidos con éxito',
        data: data.data,
        code: 200,
        count: data.total,
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

      const restaurant: RestaurantRemoveQueryInterface = {
        id: validData.id,
      };

      await RestaurantFactory.removeRestaurant(restaurant);

      const response: ApiResponseInterface = {
        message: 'Restaurante eliiminado con éxito',
        code: 200,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
};

export default RestaurantController;
