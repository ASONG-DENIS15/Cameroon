import express from 'express';
import * as regionController from '../controllers/regionController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.get('/', regionController.getAllRegions);
router.get('/:id', regionController.getRegionById);

// Admin Routes
router.post('/', authenticate, authorize(['admin']), regionController.createRegion);
router.put('/:id', authenticate, authorize(['admin']), regionController.updateRegion);

export default router;
