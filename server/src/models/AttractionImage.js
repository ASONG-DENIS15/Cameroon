import pool from '../config/database.js';

/**
 * Attraction Images Model - Database queries
 */

/**
 * Add attraction image
 */
export const addAttractionImage = async (attractionId, imageUrl, caption = null, isMain = false, displayOrder = 0) => {
  const [result] = await pool.execute(
    'INSERT INTO attraction_images (attraction_id, image_url, caption, is_main, display_order) VALUES (?, ?, ?, ?, ?)',
    [attractionId, imageUrl, caption, isMain, displayOrder]
  );
  return result.insertId;
};

/**
 * Get attraction images
 */
export const getAttractionImages = async (attractionId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM attraction_images WHERE attraction_id = ? ORDER BY display_order ASC',
    [attractionId]
  );
  return rows;
};

/**
 * Delete attraction image
 */
export const deleteAttractionImage = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM attraction_images WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};
