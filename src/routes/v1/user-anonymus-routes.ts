import express, { Router } from 'express';
import AnonymusController from '../../controllers/anonymous-controller';


const router: Router = express.Router();

router.post(
  '/token',AnonymusController.loginAnonymous
);
export default router;