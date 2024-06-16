import { Router } from 'express';
import { getTransactionHandler, getTransactionsHandler } from '../controllers/transactionController';
import authMiddleware from '../middleware/authMiddleware';

const router: Router = Router();

router.get('/wallet/', authMiddleware, getTransactionsHandler); // Get all wallet transactions
router.get('/:id/', authMiddleware, getTransactionHandler); // Get a transaction details

export default router;