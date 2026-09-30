import { Router } from 'express';
import { ResultController } from './result.controller';

const router = Router();
const controller = new ResultController();

router.get('/:id', controller.getResult);

export default router;
