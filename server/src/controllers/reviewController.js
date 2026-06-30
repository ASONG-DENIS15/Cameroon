import * as Review from '../models/Review.js';
import * as Booking from '../models/Booking.js';
import * as Attraction from '../models/Attraction.js';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../config/constants.js';

/**
 * Create Review
 */
export const createReview = async (req, res, next) => {
  try {
    const { attraction_id, rating, comment, booking_id } = req.body;
    const userId = req.user.id;

    // Check if user already reviewed
    const alreadyReviewed = await Review.userAlreadyReviewed(userId, attraction_id);
    if (alreadyReviewed) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: 'You have already reviewed this attraction'
      });
    }

    const reviewId = await Review.createReview(userId, attraction_id, rating, comment, booking_id);

    // Update attraction rating
    await Attraction.updateAttractionRating(attraction_id);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.BOOKING_SUCCESS,
      data: {
        id: reviewId,
        attraction_id,
        rating,
        comment
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Attraction Reviews
 */
export const getAttractionReviews = async (req, res, next) => {
  try {
    const { attraction_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const reviews = await Review.getAttractionReviews(attraction_id, limit, offset);
    const total = await Review.getTotalReviewCount(attraction_id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Review
 */
export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.getReviewById(id);
    if (!review) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.user_id !== userId) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Review.updateReview(id, rating, comment);
    await Attraction.updateAttractionRating(review.attraction_id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.UPDATE_SUCCESS
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Review
 */
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.getReviewById(id);
    if (!review) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.user_id !== userId && req.user.role !== 'admin') {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Review.deleteReview(id);
    await Attraction.updateAttractionRating(review.attraction_id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DELETE_SUCCESS
    });
  } catch (error) {
    next(error);
  }
};
