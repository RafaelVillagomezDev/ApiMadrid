import RestaurantController from '../../controllers/restaurant-controller';
import express, { Router } from 'express';
import { RestaurantSchema } from '../../schemas/restaurant-schema';

import { verifyHmacAuthenticity } from '../../auth/auth-hmac';

const router: Router = express.Router();

router.post(
  '/create',verifyHmacAuthenticity,
  RestaurantSchema.create,
  RestaurantController.createRestaurant,
);

router.get(
  '',RestaurantSchema.get,
  RestaurantController.getRestaurants

)

router.post(
  '/remove/:id', verifyHmacAuthenticity,RestaurantSchema.remove,
  RestaurantController.removeRestaurant

)

export default router;
