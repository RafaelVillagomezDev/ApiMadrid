import RestaurantController from '../../controllers/restaurant-controller';
import express, { Router } from 'express';
import { RestaurantSchema } from '../../schemas/restaurant-schema';
import { ImageSchema } from '../../schemas/image-schema';

const router: Router = express.Router();

router.post(
  '/create',
  RestaurantSchema.create,
  RestaurantController.createRestaurant,
);

export default router;
