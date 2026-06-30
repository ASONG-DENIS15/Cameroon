import pool from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';

/**
 * User Model - Database queries
 */

/**
 * Create new user
 */
export const createUser = async (name, email, passwordHash, phone = null) => {
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password_hash, phone, role, is_verified) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, passwordHash, phone, 'tourist', false]
  );
  return result.insertId;
};

/**
 * Get user by email
 */
export const getUserByEmail = async (email) => {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL',
    [email]
  );
  return rows[0];
};

/**
 * Get user by ID
 */
export const getUserById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id, name, email, phone, role, profile_image, bio, is_verified, is_active, last_login, created_at, updated_at FROM users WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
  return rows[0];
};

/**
 * Get all users
 */
export const getAllUsers = async (limit = 10, offset = 0) => {
  const [rows] = await pool.execute(
    'SELECT id, name, email, phone, role, profile_image, is_verified, is_active, created_at FROM users WHERE deleted_at IS NULL LIMIT ? OFFSET ?',
    [limit, offset]
  );
  return rows;
};

/**
 * Get total user count
 */
export const getTotalUserCount = async () => {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL'
  );
  return rows[0].count;
};

/**
 * Update user
 */
export const updateUser = async (id, name, phone, bio, profileImage = null) => {
  const updates = [name, phone, bio];
  let query = 'UPDATE users SET name = ?, phone = ?, bio = ?';
  
  if (profileImage) {
    query += ', profile_image = ?';
    updates.push(profileImage);
  }
  
  query += ', updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  updates.push(id);
  
  const [result] = await pool.execute(query, updates);
  return result.affectedRows > 0;
};

/**
 * Update password
 */
export const updatePassword = async (id, passwordHash) => {
  const [result] = await pool.execute(
    'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [passwordHash, id]
  );
  return result.affectedRows > 0;
};

/**
 * Verify user email
 */
export const verifyUserEmail = async (id) => {
  const [result] = await pool.execute(
    'UPDATE users SET is_verified = true, verification_token = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

/**
 * Update last login
 */
export const updateLastLogin = async (id) => {
  await pool.execute(
    'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
    [id]
  );
};

/**
 * Delete user (soft delete)
 */
export const deleteUser = async (id) => {
  const [result] = await pool.execute(
    'UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

/**
 * Check email exists
 */
export const emailExists = async (email, excludeId = null) => {
  let query = 'SELECT COUNT(*) as count FROM users WHERE email = ? AND deleted_at IS NULL';
  const params = [email];
  
  if (excludeId) {
    query += ' AND id != ?';
    params.push(excludeId);
  }
  
  const [rows] = await pool.execute(query, params);
  return rows[0].count > 0;
};
