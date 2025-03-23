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
        relatedId: validData.relatedId,
        id: await uuidv4(),
        relatedType:validData.relatedType,
        address: validData.address,
        latitude:geoData.latitud,
        longitude:geoData.longitud,
        country:geoData.country,
        town:geoData.town,
        county:geoData.county
      };

    
      
      
      await LocationFactory.createLocation(location);

      const response: ApiResponseInterface = {
        message: 'Localización creada con éxito',
        code: 200,
      };

      res.status(200).send(response);

    } catch (error) {
      next(error);
    }
  },
};

export default LocationController;
