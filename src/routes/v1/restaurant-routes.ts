import RestaurantController from '../../controllers/restaurant-controller';
import express, { Router } from 'express';
import { RestaurantSchema } from '../../schemas/restaurant-schema';

import { verifyHmacAuthenticity } from '../../auth/auth-hmac';
import { authToken } from '../../middleware/auth-token';

const router: Router = express.Router();

router.post(
  '/create',verifyHmacAuthenticity,authToken,
  RestaurantSchema.create,
  RestaurantController.createRestaurant,
);

router.get(
  '',RestaurantSchema.get,authToken,
  RestaurantController.getRestaurants

)

router.post(
  '/remove/:id',verifyHmacAuthenticity, authToken,RestaurantSchema.remove,
  RestaurantController.removeRestaurant

)

export default router;
