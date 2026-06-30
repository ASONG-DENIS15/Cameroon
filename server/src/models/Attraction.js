import pool from '../config/database.js';

/**
 * Attraction Model - Database queries
 */

/**
 * Create new attraction
 */
export const createAttraction = async (attractionData) => {
  const {
    title, slug, description, location, regionId, latitude, longitude,
    category, entryFee, openingHours, closingHours, imageUrl, isFeatured
  } = attractionData;

  const [result] = await pool.execute(
    `INSERT INTO attractions 
    (title, slug, description, location, region_id, latitude, longitude, category, entry_fee, opening_hours, closing_hours, image_url, is_featured) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, slug, description, location, regionId, latitude, longitude, category, entryFee, openingHours, closingHours, imageUrl, isFeatured]
  );
  return result.insertId;
};

/**
 * Get all attractions
 */
export const getAllAttractions = async (limit = 10, offset = 0, filters = {}) => {
  let query = 'SELECT * FROM attractions WHERE 1=1';
  const params = [];

  if (filters.region_id) {
    query += ' AND region_id = ?';
    params.push(filters.region_id);
  }
  if (filters.category) {
    query += ' AND category = ?';
    params.push(filters.category);
  }
  if (filters.is_featured) {
    query += ' AND is_featured = ?';
    params.push(filters.is_featured);
  }
  if (filters.min_price !== undefined) {
    query += ' AND entry_fee >= ?';
    params.push(filters.min_price);
  }
  if (filters.max_price !== undefined) {
    query += ' AND entry_fee <= ?';
    params.push(filters.max_price);
  }
  if (filters.min_rating !== undefined) {
    query += ' AND average_rating >= ?';
    params.push(filters.min_rating);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const [rows] = await pool.execute(query, params);
  return rows;
};

/**
 * Get attraction by ID
 */
export const getAttractionById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT * FROM attractions WHERE id = ?',
    [id]
  );
  return rows[0];
};

/**
 * Get attraction by slug
 */
export const getAttractionBySlug = async (slug) => {
  const [rows] = await pool.execute(
    'SELECT * FROM attractions WHERE slug = ?',
    [slug]
  );
  return rows[0];
};

/**
 * Get featured attractions
 */
export const getFeaturedAttractions = async (limit = 6) => {
  const [rows] = await pool.execute(
    `SELECT * FROM attractions 
    WHERE is_featured = true 
    ORDER BY average_rating DESC, visit_count DESC 
    LIMIT ?`,
    [limit]
  );
  return rows;
};

/**
 * Get popular attractions
 */
export const getPopularAttractions = async (limit = 6) => {
  const [rows] = await pool.execute(
    `SELECT * FROM attractions 
    ORDER BY average_rating DESC, total_reviews DESC 
    LIMIT ?`,
    [limit]
  );
  return rows;
};

/**
 * Update attraction
 */
export const updateAttraction = async (id, attractionData) => {
  const updates = [];
  const values = [];

  Object.entries(attractionData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      updates.push(`${dbKey} = ?`);
      values.push(value);
    }
  });

  if (updates.length === 0) return false;

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const query = `UPDATE attractions SET ${updates.join(', ')} WHERE id = ?`;
  const [result] = await pool.execute(query, values);
  return result.affectedRows > 0;
};

/**
 * Delete attraction
 */
export const deleteAttraction = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM attractions WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

/**
 * Search attractions
 */
export const searchAttractions = async (searchTerm, limit = 10) => {
  const [rows] = await pool.execute(
    `SELECT * FROM attractions 
    WHERE MATCH(title, description) AGAINST(? IN BOOLEAN MODE) 
    OR title LIKE ? OR location LIKE ?
    LIMIT ?`,
    [`${searchTerm}*`, `%${searchTerm}%`, `%${searchTerm}%`, limit]
  );
  return rows;
};

/**
 * Get total attraction count
 */
export const getTotalAttractionCount = async (filters = {}) => {
  let query = 'SELECT COUNT(*) as count FROM attractions WHERE 1=1';
  const params = [];

  if (filters.region_id) {
    query += ' AND region_id = ?';
    params.push(filters.region_id);
  }
  if (filters.category) {
    query += ' AND category = ?';
    params.push(filters.category);
  }

  const [rows] = await pool.execute(query, params);
  return rows[0].count;
};

/**
 * Increment visit count
 */
export const incrementVisitCount = async (id) => {
  await pool.execute(
    'UPDATE attractions SET visit_count = visit_count + 1 WHERE id = ?',
    [id]
  );
};

/**
 * Update attraction rating
 */
export const updateAttractionRating = async (id) => {
  const [rows] = await pool.execute(
    `SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM reviews 
    WHERE attraction_id = ?`,
    [id]
  );

  if (rows[0].total > 0) {
    await pool.execute(
      'UPDATE attractions SET average_rating = ?, total_reviews = ? WHERE id = ?',
      [rows[0].avg_rating, rows[0].total, id]
    );
  }
};
