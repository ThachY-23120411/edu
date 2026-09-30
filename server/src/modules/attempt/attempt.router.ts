import { Router } from 'express';
import { AttemptController } from './attempt.controller';

const router = Router();
const controller = new AttemptController();

router.get('/recent', controller.getRecent);
router.post('/start', controller.startOrResume);
router.put('/:id/answers', controller.saveAnswer);
router.post('/:id/submit', controller.submit);

export default router;
