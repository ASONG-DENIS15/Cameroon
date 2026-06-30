import pool from '../config/database.js';

/**
 * Booking Model - Database queries
 */

/**
 * Create new booking
 */
export const createBooking = async (bookingData) => {
  const {
    bookingNumber, userId, attractionId, bookingDate, numberOfAdults,
    numberOfChildren, totalVisitors, totalPrice, specialRequests
  } = bookingData;

  const [result] = await pool.execute(
    `INSERT INTO bookings 
    (booking_number, user_id, attraction_id, booking_date, number_of_adults, number_of_children, total_visitors, total_price, special_requests) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [bookingNumber, userId, attractionId, bookingDate, numberOfAdults, numberOfChildren, totalVisitors, totalPrice, specialRequests]
  );
  return result.insertId;
};

/**
 * Get booking by ID
 */
export const getBookingById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT b.*, a.title as attraction_title, u.name as user_name, u.email 
    FROM bookings b 
    JOIN attractions a ON b.attraction_id = a.id 
    JOIN users u ON b.user_id = u.id 
    WHERE b.id = ?`,
    [id]
  );
  return rows[0];
};

/**
 * Get booking by booking number
 */
export const getBookingByNumber = async (bookingNumber) => {
  const [rows] = await pool.execute(
    'SELECT * FROM bookings WHERE booking_number = ?',
    [bookingNumber]
  );
  return rows[0];
};

/**
 * Get user bookings
 */
export const getUserBookings = async (userId, limit = 10, offset = 0) => {
  const [rows] = await pool.execute(
    `SELECT b.*, a.title as attraction_title, a.image_url, a.location 
    FROM bookings b 
    JOIN attractions a ON b.attraction_id = a.id 
    WHERE b.user_id = ? 
    ORDER BY b.created_at DESC 
    LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );
  return rows;
};

/**
 * Get all bookings (admin)
 */
export const getAllBookings = async (limit = 10, offset = 0, filters = {}) => {
  let query = `SELECT b.*, a.title as attraction_title, u.name as user_name, u.email 
              FROM bookings b 
              JOIN attractions a ON b.attraction_id = a.id 
              JOIN users u ON b.user_id = u.id 
              WHERE 1=1`;
  const params = [];

  if (filters.status) {
    query += ' AND b.status = ?';
    params.push(filters.status);
  }
  if (filters.attraction_id) {
    query += ' AND b.attraction_id = ?';
    params.push(filters.attraction_id);
  }
  if (filters.user_id) {
    query += ' AND b.user_id = ?';
    params.push(filters.user_id);
  }

  query += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const [rows] = await pool.execute(query, params);
  return rows;
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (id, status, cancellationReason = null) => {
  let query = 'UPDATE bookings SET status = ?';
  const params = [status];

  if (status === 'cancelled') {
    query += ', cancellation_reason = ?, cancelled_at = CURRENT_TIMESTAMP';
    params.push(cancellationReason);
  }

  query += ', updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  params.push(id);

  const [result] = await pool.execute(query, params);
  return result.affectedRows > 0;
};

/**
 * Cancel booking
 */
export const cancelBooking = async (id, reason) => {
  const [result] = await pool.execute(
    `UPDATE bookings 
    SET status = 'cancelled', cancellation_reason = ?, cancelled_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?`,
    [reason, id]
  );
  return result.affectedRows > 0;
};

/**
 * Get total bookings count
 */
export const getTotalBookingCount = async (filters = {}) => {
  let query = 'SELECT COUNT(*) as count FROM bookings WHERE 1=1';
  const params = [];

  if (filters.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }
  if (filters.attraction_id) {
    query += ' AND attraction_id = ?';
    params.push(filters.attraction_id);
  }

  const [rows] = await pool.execute(query, params);
  return rows[0].count;
};

/**
 * Get user booking count
 */
export const getUserBookingCount = async (userId) => {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as count FROM bookings WHERE user_id = ?',
    [userId]
  );
  return rows[0].count;
};

/**
 * Get total revenue
 */
export const getTotalRevenue = async () => {
  const [rows] = await pool.execute(
    `SELECT SUM(total_price) as total FROM bookings WHERE status IN ('confirmed', 'completed')`
  );
  return rows[0].total || 0;
};

/**
 * Get revenue by date range
 */
export const getRevenueByDateRange = async (startDate, endDate) => {
  const [rows] = await pool.execute(
    `SELECT SUM(total_price) as total FROM bookings 
    WHERE status IN ('confirmed', 'completed') 
    AND created_at BETWEEN ? AND ?`,
    [startDate, endDate]
  );
  return rows[0].total || 0;
};
