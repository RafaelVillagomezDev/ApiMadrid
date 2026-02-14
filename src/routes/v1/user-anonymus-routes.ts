import express, { Router } from 'express';
import AnonymusController from '../../controllers/anonymous-controller';
import { revokeSession } from '../../controllers/blacklist-controller';
import { authToken } from '../../middleware/auth-token';

const router: Router = express.Router();

router.post('/token', AnonymusController.loginAnonymous);

router.post('/logout', authToken, revokeSession);
export default router;
