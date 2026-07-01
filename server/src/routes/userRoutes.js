import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/fileUpload.js';

const router = express.Router();

// Protected Routes
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, upload.single('profileImage'), userController.updateProfile);
router.post('/change-password', authenticate, userController.changePassword);

// Admin Routes
router.get('/', authenticate, authorize(['admin']), userController.getAllUsers);
router.delete('/:id', authenticate, authorize(['admin']), userController.deleteUser);

export default router;
