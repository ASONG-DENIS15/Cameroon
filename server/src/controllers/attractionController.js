import * as Attraction from '../models/Attraction.js';
import * as AttractionImage from '../models/AttractionImage.js';
import * as NearbyPlace from '../models/NearbyPlace.js';
import { generateSlug } from '../utils/helpers.js';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../config/constants.js';

/**
 * Get All Attractions
 */
export const getAllAttractions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, region_id, category, is_featured, min_price, max_price, min_rating } = req.query;
    const offset = (page - 1) * limit;

    const filters = {};
    if (region_id) filters.region_id = region_id;
    if (category) filters.category = category;
    if (is_featured) filters.is_featured = is_featured === 'true';
    if (min_price) filters.min_price = min_price;
    if (max_price) filters.max_price = max_price;
    if (min_rating) filters.min_rating = min_rating;

    const attractions = await Attraction.getAllAttractions(limit, offset, filters);
    const total = await Attraction.getTotalAttractionCount(filters);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: attractions,
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
 * Get Featured Attractions
 */
export const getFeaturedAttractions = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;
    const attractions = await Attraction.getFeaturedAttractions(limit);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: attractions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Attraction by ID
 */
export const getAttractionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const attraction = await Attraction.getAttractionById(id);

    if (!attraction) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Attraction not found'
      });
    }

    // Increment visit count
    await Attraction.incrementVisitCount(id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: attraction
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search Attractions
 */
export const searchAttractions = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const attractions = await Attraction.searchAttractions(q, limit);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: attractions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create Attraction (Admin)
 */
export const createAttraction = async (req, res, next) => {
  try {
    const { title, description, location, region_id, latitude, longitude, category, entry_fee, opening_hours, closing_hours, is_featured } = req.body;

    const slug = generateSlug(title);
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const attractionData = {
      title,
      slug,
      description,
      location,
      regionId: region_id,
      latitude,
      longitude,
      category,
      entryFee: entry_fee || 0,
      openingHours: opening_hours,
      closingHours: closing_hours,
      imageUrl,
      isFeatured: is_featured || false
    };

    const attractionId = await Attraction.createAttraction(attractionData);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.BOOKING_SUCCESS,
      data: {
        id: attractionId,
        ...attractionData
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Attraction (Admin)
 */
export const updateAttraction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const attraction = await Attraction.getAttractionById(id);

    if (!attraction) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Attraction not found'
      });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.image_url = `/uploads/${req.file.filename}`;
    }

    await Attraction.updateAttraction(id, updateData);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.UPDATE_SUCCESS
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Attraction (Admin)
 */
export const deleteAttraction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const attraction = await Attraction.getAttractionById(id);

    if (!attraction) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Attraction not found'
      });
    }

    await Attraction.deleteAttraction(id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DELETE_SUCCESS
    });
  } catch (error) {
    next(error);
  }
};
