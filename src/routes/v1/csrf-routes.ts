import express, { Router } from 'express';
import CsrfController from '../../controllers/csrf-controller';


const router: Router = express.Router();
router.get(
  '',CsrfController.getCsrfToken
);

export default router;
