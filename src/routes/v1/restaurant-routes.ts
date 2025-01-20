import RestaurantController from '../../controllers/restaurant-controller';
import express, { Router } from 'express';
import { RestaurantSchema } from '../../schemas/restaurant-schema';
import { ImageSchema } from '../../schemas/image-schema';
import ImageController from '../../controllers/image-controller';
const router: Router = express.Router();

router.post(
  '/create',
  RestaurantSchema.create,
  RestaurantController.createRestaurant,
);

router.post('/:id/image', ImageSchema.create, ImageController.createImage);
export default router;
