import { Router } from 'express';
import { NotebookController } from './notebook.controller';

const router = Router();
const controller = new NotebookController();

router.get('/mistakes', controller.getMistakes);
router.post('/mistakes', controller.saveMistake);
router.delete('/mistakes/:id', controller.removeMistake);
router.patch('/mistakes/:id/resolve', controller.toggleResolved);

export default router;
