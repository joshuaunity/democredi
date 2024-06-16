import { Router } from 'express';
import { createKycHandler, getAllKycsHandler, getKycByIdHandler, updateKycHandler, deleteKycHandler } from '../controllers/kycController';
import authMiddleware from '../middleware/authMiddleware';


const router: Router = Router();

router.post('/', authMiddleware, createKycHandler); // Create a new kyc record
router.get('/', authMiddleware, getAllKycsHandler); // Get all kyc records
router.get('/:id/', authMiddleware, getKycByIdHandler); // Get a kyc record by ID
router.put('/:id/', authMiddleware, updateKycHandler); // Update a kyc record
router.delete('/:id/', authMiddleware, deleteKycHandler); // Delete a kyc record

export default router;