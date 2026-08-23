import express, { Router } from 'express';
import AuthController from '../../controllers/auth-controller';


const router: Router = express.Router();
router.post(
  '/refresh',AuthController.refreshToken
);

export default router;
