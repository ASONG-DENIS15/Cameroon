import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateRegister, validateLogin, validatePasswordReset } from '../middleware/validation.js';

const router = express.Router();

// Public Routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', validatePasswordReset, authController.resetPassword);
router.post('/verify-email', authController.verifyEmail);
router.post('/refresh-token', authController.refreshToken);

// Protected Routes
router.get('/profile', authenticate, authController.getProfile);

export default router;
