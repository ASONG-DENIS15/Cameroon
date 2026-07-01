import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, authorize(['admin']));

// Dashboard
router.get('/dashboard/statistics', adminController.getDashboardStatistics);
router.get('/analytics/top-attractions', adminController.getTopAttractions);
router.get('/analytics/revenue', adminController.getTotalRevenue);

// Bookings Management
router.get('/bookings', adminController.getAllBookings);
router.put('/bookings/:id/status', adminController.updateBookingStatus);

export default router;
