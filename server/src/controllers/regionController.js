import * as Region from '../models/Region.js';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../config/constants.js';

/**
 * Get All Regions
 */
export const getAllRegions = async (req, res, next) => {
  try {
    const regions = await Region.getAllRegions();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: regions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Region by ID
 */
export const getRegionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const region = await Region.getRegionById(id);

    if (!region) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Region not found'
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: region
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create Region (Admin)
 */
export const createRegion = async (req, res, next) => {
  try {
    const { name, description, latitude, longitude, image_url } = req.body;

    const regionId = await Region.createRegion(name, description, latitude, longitude, image_url);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.BOOKING_SUCCESS,
      data: {
        id: regionId,
        name,
        description,
        latitude,
        longitude,
        image_url
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Region (Admin)
 */
export const updateRegion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, latitude, longitude, image_url } = req.body;

    const region = await Region.getRegionById(id);
    if (!region) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Region not found'
      });
    }

    await Region.updateRegion(id, name, description, latitude, longitude, image_url);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.UPDATE_SUCCESS
    });
  } catch (error) {
    next(error);
  }
};
