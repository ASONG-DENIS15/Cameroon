import pool from '../config/database.js';

/**
 * Wishlist Model - Database queries
 */

/**
 * Add to wishlist
 */
export const addToWishlist = async (userId, attractionId) => {
  const [result] = await pool.execute(
    'INSERT INTO wishlists (user_id, attraction_id) VALUES (?, ?)',
    [userId, attractionId]
  );
  return result.insertId;
};

/**
 * Remove from wishlist
 */
export const removeFromWishlist = async (userId, attractionId) => {
  const [result] = await pool.execute(
    'DELETE FROM wishlists WHERE user_id = ? AND attraction_id = ?',
    [userId, attractionId]
  );
  return result.affectedRows > 0;
};

/**
 * Get user wishlist
 */
export const getUserWishlist = async (userId, limit = 10, offset = 0) => {
  const [rows] = await pool.execute(
    `SELECT a.* FROM attractions a 
    JOIN wishlists w ON a.id = w.attraction_id 
    WHERE w.user_id = ? 
    ORDER BY w.created_at DESC 
    LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );
  return rows;
};

/**
 * Check if in wishlist
 */
export const isInWishlist = async (userId, attractionId) => {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as count FROM wishlists WHERE user_id = ? AND attraction_id = ?',
    [userId, attractionId]
  );
  return rows[0].count > 0;
};

/**
 * Get wishlist count
 */
export const getWishlistCount = async (userId) => {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as count FROM wishlists WHERE user_id = ?',
    [userId]
  );
  return rows[0].count;
};
