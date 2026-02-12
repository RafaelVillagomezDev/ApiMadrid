import RestaurantController from '../../controllers/restaurant-controller';
import express, { Router } from 'express';
import { RestaurantSchema } from '../../schemas/restaurant-schema';
import { verifyHmacAuthenticity } from '../../auth/auth-hmac';
import { authToken } from '../../middleware/auth-token';
import { checkBlacklist } from '../../middleware/verify-token-blacklist';
import { apiLimiter } from '../../middleware/rate-limit-middleware';


const router: Router = express.Router();

router.post(
  '/create',
  RestaurantSchema.create,
  RestaurantController.createRestaurant,
);

router.get(
  '',authToken, checkBlacklist,
  RestaurantController.getRestaurants

)

router.post(
  '/remove/:id',verifyHmacAuthenticity, authToken,RestaurantSchema.remove,
  RestaurantController.removeRestaurant

)

export default router;
