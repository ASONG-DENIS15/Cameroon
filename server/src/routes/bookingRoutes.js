import express from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateBooking } from '../middleware/validation.js';

const router = express.Router();

// Protected Routes
router.post('/', authenticate, validateBooking, bookingController.createBooking);
router.get('/', authenticate, bookingController.getUserBookings);
router.get('/:id', authenticate, bookingController.getBookingById);
router.post('/:id/cancel', authenticate, bookingController.cancelBooking);

export default router;
