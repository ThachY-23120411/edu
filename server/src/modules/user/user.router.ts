import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();
const controller = new UserController();

router.get('/profile', controller.getProfile);
router.patch('/target', controller.updateTarget);

export default router;
