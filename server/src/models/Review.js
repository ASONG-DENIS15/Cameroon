import pool from '../config/database.js';

/**
 * Review Model - Database queries
 */

/**
 * Create new review
 */
export const createReview = async (userId, attractionId, rating, comment = null, bookingId = null) => {
  const [result] = await pool.execute(
    `INSERT INTO reviews (user_id, attraction_id, booking_id, rating, comment, is_verified_booking) 
    VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, attractionId, bookingId, rating, comment, bookingId ? true : false]
  );
  return result.insertId;
};

/**
 * Get review by ID
 */
export const getReviewById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT r.*, u.name as user_name, u.profile_image 
    FROM reviews r 
    JOIN users u ON r.user_id = u.id 
    WHERE r.id = ?`,
    [id]
  );
  return rows[0];
};

/**
 * Get attraction reviews
 */
export const getAttractionReviews = async (attractionId, limit = 10, offset = 0) => {
  const [rows] = await pool.execute(
    `SELECT r.*, u.name as user_name, u.profile_image 
    FROM reviews r 
    JOIN users u ON r.user_id = u.id 
    WHERE r.attraction_id = ? 
    ORDER BY r.created_at DESC 
    LIMIT ? OFFSET ?`,
    [attractionId, limit, offset]
  );
  return rows;
};

/**
 * Get user reviews
 */
export const getUserReviews = async (userId, limit = 10, offset = 0) => {
  const [rows] = await pool.execute(
    `SELECT r.*, a.title as attraction_title, a.image_url 
    FROM reviews r 
    JOIN attractions a ON r.attraction_id = a.id 
    WHERE r.user_id = ? 
    ORDER BY r.created_at DESC 
    LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );
  return rows;
};

/**
 * Get all reviews (admin)
 */
export const getAllReviews = async (limit = 10, offset = 0, filters = {}) => {
  let query = `SELECT r.*, a.title as attraction_title, u.name as user_name 
              FROM reviews r 
              JOIN attractions a ON r.attraction_id = a.id 
              JOIN users u ON r.user_id = u.id 
              WHERE 1=1`;
  const params = [];

  if (filters.attraction_id) {
    query += ' AND r.attraction_id = ?';
    params.push(filters.attraction_id);
  }
  if (filters.rating) {
    query += ' AND r.rating = ?';
    params.push(filters.rating);
  }
  if (filters.verified_only) {
    query += ' AND r.is_verified_booking = true';
  }

  query += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const [rows] = await pool.execute(query, params);
  return rows;
};

/**
 * Update review
 */
export const updateReview = async (id, rating, comment) => {
  const [result] = await pool.execute(
    'UPDATE reviews SET rating = ?, comment = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [rating, comment, id]
  );
  return result.affectedRows > 0;
};

/**
 * Delete review
 */
export const deleteReview = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM reviews WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

/**
 * Check if user already reviewed
 */
export const userAlreadyReviewed = async (userId, attractionId) => {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as count FROM reviews WHERE user_id = ? AND attraction_id = ?',
    [userId, attractionId]
  );
  return rows[0].count > 0;
};

/**
 * Get total reviews count
 */
export const getTotalReviewCount = async (attractionId = null) => {
  let query = 'SELECT COUNT(*) as count FROM reviews';
  const params = [];

  if (attractionId) {
    query += ' WHERE attraction_id = ?';
    params.push(attractionId);
  }

  const [rows] = await pool.execute(query, params);
  return rows[0].count;
};

/**
 * Get average rating
 */
export const getAverageRating = async (attractionId) => {
  const [rows] = await pool.execute(
    'SELECT AVG(rating) as avg_rating FROM reviews WHERE attraction_id = ?',
    [attractionId]
  );
  return rows[0].avg_rating || 0;
};

/**
 * Increment helpful count
 */
export const incrementHelpfulCount = async (id) => {
  await pool.execute(
    'UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = ?',
    [id]
  );
};
