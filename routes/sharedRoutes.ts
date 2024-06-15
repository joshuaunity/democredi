import { Router } from 'express';
import { checkHealth } from '../controllers/sharedController';

const router: Router = Router();

router.get('/health/', checkHealth);

export default router;
