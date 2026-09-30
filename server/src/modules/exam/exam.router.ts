import { Router } from 'express';
import { ExamController } from './exam.controller';

const router = Router();
const controller = new ExamController();

router.get('/', controller.getExams);
router.get('/:id', controller.getExamById);
router.post('/:id/bookmark', controller.toggleBookmark);

export default router;
