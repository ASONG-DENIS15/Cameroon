import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateReview } from '../middleware/validation.js';

const router = express.Router();

// Public Routes
router.get('/attraction/:attraction_id', reviewController.getAttractionReviews);

// Protected Routes
router.post('/', authenticate, validateReview, reviewController.createReview);
router.put('/:id', authenticate, reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);

export default router;
