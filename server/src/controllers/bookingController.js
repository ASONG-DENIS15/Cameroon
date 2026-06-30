import * as Booking from '../models/Booking.js';
import * as Attraction from '../models/Attraction.js';
import * as User from '../models/User.js';
import { generateBookingNumber } from '../utils/helpers.js';
import { sendBookingConfirmationEmail } from '../utils/emailSender.js';
import { HTTP_STATUS, SUCCESS_MESSAGES, BOOKING_STATUS } from '../config/constants.js';

/**
 * Create Booking
 */
export const createBooking = async (req, res, next) => {
  try {
    const { attraction_id, booking_date, number_of_adults, number_of_children, special_requests } = req.body;
    const userId = req.user.id;

    // Get attraction
    const attraction = await Attraction.getAttractionById(attraction_id);
    if (!attraction) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Attraction not found'
      });
    }

    // Get user
    const user = await User.getUserById(userId);

    const totalVisitors = number_of_adults + (number_of_children || 0);
    const totalPrice = attraction.entry_fee * totalVisitors;
    const bookingNumber = generateBookingNumber();

    const bookingData = {
      bookingNumber,
      userId,
      attractionId: attraction_id,
      bookingDate,
      numberOfAdults: number_of_adults,
      numberOfChildren: number_of_children || 0,
      totalVisitors,
      totalPrice,
      specialRequests: special_requests
    };

    const bookingId = await Booking.createBooking(bookingData);

    // Send confirmation email
    await sendBookingConfirmationEmail(user.email, {
      userName: user.name,
      attractionTitle: attraction.title,
      bookingNumber,
      bookingDate,
      totalVisitors,
      adults: number_of_adults,
      children: number_of_children || 0,
      totalPrice,
      status: BOOKING_STATUS.PENDING
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.BOOKING_SUCCESS,
      data: {
        id: bookingId,
        bookingNumber,
        ...bookingData
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get User Bookings
 */
export const getUserBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user.id;
    const offset = (page - 1) * limit;

    const bookings = await Booking.getUserBookings(userId, limit, offset);
    const total = await Booking.getUserBookingCount(userId);

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
 * Get Booking by ID
 */
export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.getBookingById(id);

    if (!booking) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    if (req.user.role === 'tourist' && booking.user_id !== req.user.id) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel Booking
 */
export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    const booking = await Booking.getBookingById(id);
    if (!booking) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    if (req.user.role === 'tourist' && booking.user_id !== userId) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Booking.cancelBooking(id, reason || 'User cancelled');

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};
