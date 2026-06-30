import pool from '../config/database.js';

/**
 * Token Model - Database queries
 */

/**
 * Create token
 */
export const createToken = async (userId, token, tokenType, expiresAt) => {
  const [result] = await pool.execute(
    'INSERT INTO tokens (user_id, token, token_type, expires_at) VALUES (?, ?, ?, ?)',
    [userId, token, tokenType, expiresAt]
  );
  return result.insertId;
};

/**
 * Get token
 */
export const getToken = async (token) => {
  const [rows] = await pool.execute(
    'SELECT * FROM tokens WHERE token = ? AND expires_at > NOW() AND used_at IS NULL',
    [token]
  );
  return rows[0];
};

/**
 * Mark token as used
 */
export const markTokenAsUsed = async (id) => {
  const [result] = await pool.execute(
    'UPDATE tokens SET used_at = CURRENT_TIMESTAMP WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

/**
 * Delete expired tokens
 */
export const deleteExpiredTokens = async () => {
  await pool.execute(
    'DELETE FROM tokens WHERE expires_at < NOW()'
  );
};

/**
 * Get user refresh tokens
 */
export const getUserRefreshTokens = async (userId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM tokens WHERE user_id = ? AND token_type = ? AND expires_at > NOW() AND used_at IS NULL',
    [userId, 'refresh']
  );
  return rows;
};
