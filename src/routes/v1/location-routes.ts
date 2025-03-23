
import express, { Router } from 'express';
import { LocationSchema } from '../../schemas/location-schema';
import LocationController from '../../controllers/location-controller';


const router: Router = express.Router();

router.post(
  '/create/:relatedType/:relatedId',
  LocationSchema.create,
  LocationController.createLocation
);

export default router;
