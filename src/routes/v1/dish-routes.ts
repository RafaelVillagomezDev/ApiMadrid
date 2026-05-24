import DishController from '../../controllers/dish-controller';
import express, { Router } from 'express';
import { DishSchema } from '../../schemas/dish-schema';
import { authToken } from '../../middleware/auth-token';
import { checkBlacklist } from '../../middleware/verify-token-blacklist';

const router: Router = express.Router();
router.post(
  '/create/:restaurant_id/:menu_id',
  DishSchema.create,
  DishController.create,
  //authToken,
 // checkBlacklist,
);

export default router;
