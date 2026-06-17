import express, { Router } from 'express';
import { revokeSession } from '../../controllers/blacklist-controller';
import { authToken } from '../../middleware/auth-token';
import { UserSchema } from '../../schemas/user-schema';
import UserController from '../../controllers/user-controller';
import { checkBlacklist } from '../../middleware/verify-token-blacklist';

const router: Router = express.Router();

router.post('/token',UserSchema.login, UserController.loginUser);
router.post('/create', UserSchema.create, UserController.createUser);
router.post('/logout', authToken, revokeSession);
export default router;
