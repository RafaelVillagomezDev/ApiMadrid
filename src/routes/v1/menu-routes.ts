import MenuController from '../../controllers/menu-controller';
import { MenuSchema } from '../../schemas/menu-schema';

import express, { Router } from 'express';

const router: Router = express.Router();

router.post('/create/:restaurant_id', MenuSchema.create, MenuController.createMenu);

export default router;
