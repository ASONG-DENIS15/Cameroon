import pool from '../config/database.js';

/**
 * Region Model - Database queries
 */

/**
 * Get all regions
 */
export const getAllRegions = async () => {
  const [rows] = await pool.execute(
    'SELECT * FROM regions ORDER BY name ASC'
  );
  return rows;
};

/**
 * Get region by ID
 */
export const getRegionById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT * FROM regions WHERE id = ?',
    [id]
  );
  return rows[0];
};

/**
 * Get region by name
 */
export const getRegionByName = async (name) => {
  const [rows] = await pool.execute(
    'SELECT * FROM regions WHERE name = ?',
    [name]
  );
  return rows[0];
};

/**
 * Create region
 */
export const createRegion = async (name, description, latitude, longitude, imageUrl) => {
  const [result] = await pool.execute(
    'INSERT INTO regions (name, description, latitude, longitude, image_url) VALUES (?, ?, ?, ?, ?)',
    [name, description, latitude, longitude, imageUrl]
  );
  return result.insertId;
};

/**
 * Update region
 */
export const updateRegion = async (id, name, description, latitude, longitude, imageUrl) => {
  const [result] = await pool.execute(
    'UPDATE regions SET name = ?, description = ?, latitude = ?, longitude = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, description, latitude, longitude, imageUrl, id]
  );
  return result.affectedRows > 0;
};

/**
 * Delete region
 */
export const deleteRegion = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM regions WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};
