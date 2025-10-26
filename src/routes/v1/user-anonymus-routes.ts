import express, { Router } from 'express';
import AnonymusController from '../../controllers/anonymous-controller';
import { authTokenAnonymus } from '../../middleware/auth-token-anonymus';


const router: Router = express.Router();

router.post(
  '/token', authTokenAnonymus,AnonymusController.loginAnonymous
);
export default router;