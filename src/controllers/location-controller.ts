import { ApiResponseInterface } from 'api-type';
import { Request, Response, NextFunction } from 'express';
import { matchedData, validationResult } from 'express-validator';
import { LocationInterface } from 'location-type';
import { LocationFactory } from '../factory/location-factory';


import { v4 as uuidv4 } from 'uuid';
import { getCoords } from '../utils/geodata';



const LocationController = {
  createLocation: async (
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

      const geoData=await getCoords(validData.address);


      const location: LocationInterface = {
        id_location: validData.id,
        id: await uuidv4(),
        address: validData.address,
        latitud:geoData.latitud,
        longitud:geoData.longitud
      };

      console.log(geoData)
      
      
      //await LocationFactory.createLocation(location);

      /*const response: ApiResponseInterface = {
        message: 'Restaurante creado con éxito',
        code: 200,
      };*/

      //res.status(200).send(location);

    } catch (error) {
      next(error);
    }
  },
};

export default LocationController;
