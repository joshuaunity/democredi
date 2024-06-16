import { Router } from 'express';
import { createWalletHandler, getWalletHandler, depositHandler, transferHandler } from '../controllers/walletController';
import authMiddleware from '../middleware/authMiddleware';

const router: Router = Router();

router.post('/', authMiddleware, createWalletHandler); // Create a new wallet
router.get('/', authMiddleware, getWalletHandler); // Get wallet details
router.post('/deposit/', authMiddleware, depositHandler); // Deposit into wallet
router.post('/transfer/', authMiddleware, transferHandler); // Transfer money between wallets

export default router;