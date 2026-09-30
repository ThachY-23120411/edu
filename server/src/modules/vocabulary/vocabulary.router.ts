import { Router } from 'express';
import { VocabularyController } from './vocabulary.controller';

const router = Router();
const controller = new VocabularyController();

router.get('/', controller.getTerms);
router.get('/saved', controller.getSavedVocab);
router.get('/lookup/:word', controller.lookupWord);
router.post('/saved', controller.saveWord);
router.delete('/saved/:id', controller.removeSavedWord);
router.patch('/saved/:id/mastery', controller.updateMastery);

export default router;
