import { Router } from 'express';
import { CatalogController } from './catalog.controller';

const router = Router();
const controller = new CatalogController();

router.get('/hub', controller.getHubData);
router.get('/categories', controller.getCategories);
router.get('/targets', controller.getTargetOptions);
router.get('/universities', controller.getUniversities);

export default router;
