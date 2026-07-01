import pool from '../config/database.js';

/**
 * Nearby Places Model - Database queries
 */

/**
 * Add nearby place
 */
export const addNearbyPlace = async (attractionId, placeType, name, distanceKm, latitude, longitude, phone = null, website = null, rating = null) => {
  const [result] = await pool.execute(
    `INSERT INTO nearby_places (attraction_id, place_type, name, distance_km, latitude, longitude, phone, website, rating) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [attractionId, placeType, name, distanceKm, latitude, longitude, phone, website, rating]
  );
  return result.insertId;
};

/**
 * Get nearby places by attraction and type
 */
export const getNearbyPlaces = async (attractionId, placeType = null) => {
  let query = 'SELECT * FROM nearby_places WHERE attraction_id = ?';
  const params = [attractionId];

  if (placeType) {
    query += ' AND place_type = ?';
    params.push(placeType);
  }

  query += ' ORDER BY distance_km ASC';
  const [rows] = await pool.execute(query, params);
  return rows;
};

/**
 * Delete nearby place
 */
export const deleteNearbyPlace = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM nearby_places WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};
