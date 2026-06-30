import * as Booking from '../models/Booking.js';
import * as Attraction from '../models/Attraction.js';
import * as Admin from '../models/Admin.js';
import * as User from '../models/User.js';
import * as Statistics from '../models/Statistics.js';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * Get Dashboard Statistics
 */
export const getDashboardStatistics = async (req, res, next) => {
  try {
    const stats = await Statistics.getDashboardStatistics();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Bookings (Admin)
 */
export const getAllBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, attraction_id } = req.query;
    const offset = (page - 1) * limit;

    const filters = {};
    if (status) filters.status = status;
    if (attraction_id) filters.attraction_id = attraction_id;

    const bookings = await Booking.getAllBookings(limit, offset, filters);
    const total = await Booking.getTotalBookingCount(filters);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: bookings,
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
 * Update Booking Status (Admin)
 */
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, cancellation_reason } = req.body;

    const booking = await Booking.getBookingById(id);
    if (!booking) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Booking not found'
      });
    }

    await Booking.updateBookingStatus(id, status, cancellation_reason);

    // Log admin activity
    await Admin.logAdminActivity(
      req.user.id,
      'UPDATE_BOOKING_STATUS',
      'booking',
      id,
      { old_status: booking.status, new_status: status },
      req.ip
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Booking status updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Top Attractions
 */
export const getTopAttractions = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;
    const attractions = await Statistics.getTopAttractions(limit);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: attractions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Total Revenue
 */
export const getTotalRevenue = async (req, res, next) => {
  try {
    const revenue = await Booking.getTotalRevenue();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { totalRevenue: revenue }
    });
  } catch (error) {
    next(error);
  }
};
