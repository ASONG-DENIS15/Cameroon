import { body, validationResult } from 'express-validator';
import { HTTP_STATUS } from '../config/constants.js';
import { validateEmail, validatePhone, validatePassword } from '../utils/validators.js';

/**
 * Validation Error Handler
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Registration Validation
 */
export const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .custom(validateEmail).withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .custom(validatePassword).withMessage('Password must be at least 8 characters with uppercase, lowercase, number and special character'),
  body('phone')
    .optional()
    .trim()
    .custom(validatePhone).withMessage('Invalid phone format'),
  handleValidationErrors
];

/**
 * Login Validation
 */
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .custom(validateEmail).withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

/**
 * Password Reset Validation
 */
export const validatePasswordReset = [
  body('password')
    .notEmpty().withMessage('Password is required')
    .custom(validatePassword).withMessage('Password must be at least 8 characters with uppercase, lowercase, number and special character'),
  body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
  handleValidationErrors
];

/**
 * Attraction Validation
 */
export const validateAttraction = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required'),
  body('region_id')
    .notEmpty().withMessage('Region is required')
    .isInt().withMessage('Invalid region'),
  body('latitude')
    .notEmpty().withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('longitude')
    .notEmpty().withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),
  body('entry_fee')
    .optional()
    .isFloat({ min: 0 }).withMessage('Entry fee must be a positive number'),
  body('opening_hours')
    .optional()
    .trim(),
  body('closing_hours')
    .optional()
    .trim(),
  handleValidationErrors
];

/**
 * Booking Validation
 */
export const validateBooking = [
  body('attraction_id')
    .notEmpty().withMessage('Attraction is required')
    .isInt().withMessage('Invalid attraction'),
  body('booking_date')
    .notEmpty().withMessage('Booking date is required')
    .isISO8601().withMessage('Invalid date format'),
  body('number_of_adults')
    .notEmpty().withMessage('Number of adults is required')
    .isInt({ min: 1 }).withMessage('At least 1 adult is required'),
  body('number_of_children')
    .optional()
    .isInt({ min: 0 }).withMessage('Invalid number of children'),
  body('special_requests')
    .optional()
    .trim(),
  handleValidationErrors
];

/**
 * Review Validation
 */
export const validateReview = [
  body('attraction_id')
    .notEmpty().withMessage('Attraction is required')
    .isInt().withMessage('Invalid attraction'),
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .optional()
    .isLength({ min: 3 }).withMessage('Comment must be at least 3 characters'),
  handleValidationErrors
];

/**
 * Contact Form Validation
 */
export const validateContact = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .custom(validateEmail).withMessage('Invalid email format'),
  body('phone')
    .optional()
    .trim()
    .custom(validatePhone).withMessage('Invalid phone format'),
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ min: 5 }).withMessage('Subject must be at least 5 characters'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  handleValidationErrors
];
