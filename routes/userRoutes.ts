import { Router } from 'express';
import { createUserHandler, updateUserHandler, allUsersHandler, getUserDetailHandler, archiveUserHandler } from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';


const router: Router = Router();

router.post('/', createUserHandler); // Create a new user
router.get('/', authMiddleware, allUsersHandler); // Get all users
router.put('/', authMiddleware, updateUserHandler); // Update an existing user
router.get('/detail/', authMiddleware, getUserDetailHandler); // Get a user by ID
router.patch('/archive/', authMiddleware, archiveUserHandler); // Archive a user

export default router;