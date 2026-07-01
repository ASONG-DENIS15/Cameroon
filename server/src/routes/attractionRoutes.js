import express from 'express';
import * as attractionController from '../controllers/attractionController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateAttraction } from '../middleware/validation.js';
import upload from '../middleware/fileUpload.js';

const router = express.Router();

// Public Routes
router.get('/', attractionController.getAllAttractions);
router.get('/featured', attractionController.getFeaturedAttractions);
router.get('/search', attractionController.searchAttractions);
router.get('/:id', attractionController.getAttractionById);

// Admin Routes
router.post('/', authenticate, authorize(['admin']), upload.single('image'), validateAttraction, attractionController.createAttraction);
router.put('/:id', authenticate, authorize(['admin']), upload.single('image'), validateAttraction, attractionController.updateAttraction);
router.delete('/:id', authenticate, authorize(['admin']), attractionController.deleteAttraction);

export default router;
