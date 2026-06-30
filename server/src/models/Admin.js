import pool from '../config/database.js';

/**
 * Admin Model - Database queries
 */

/**
 * Get admin by user ID
 */
export const getAdminByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT a.*, u.name, u.email 
    FROM admins a 
    JOIN users u ON a.user_id = u.id 
    WHERE a.user_id = ? AND a.is_active = true`,
    [userId]
  );
  return rows[0];
};

/**
 * Get all admins
 */
export const getAllAdmins = async () => {
  const [rows] = await pool.execute(
    `SELECT a.*, u.name, u.email 
    FROM admins a 
    JOIN users u ON a.user_id = u.id 
    WHERE a.is_active = true 
    ORDER BY a.created_at DESC`
  );
  return rows;
};

/**
 * Create admin
 */
export const createAdmin = async (userId, adminLevel, department) => {
  const [result] = await pool.execute(
    'INSERT INTO admins (user_id, admin_level, department) VALUES (?, ?, ?)',
    [userId, adminLevel, department]
  );
  return result.insertId;
};

/**
 * Log admin activity
 */
export const logAdminActivity = async (adminId, action, entityType, entityId, changes, ipAddress) => {
  await pool.execute(
    `INSERT INTO admin_activity_logs (admin_id, action, entity_type, entity_id, changes, ip_address) 
    VALUES (?, ?, ?, ?, ?, ?)`,
    [adminId, action, entityType, entityId, JSON.stringify(changes), ipAddress]
  );
};

/**
 * Get admin activity logs
 */
export const getAdminActivityLogs = async (adminId = null, limit = 50, offset = 0) => {
  let query = `SELECT * FROM admin_activity_logs WHERE 1=1`;
  const params = [];

  if (adminId) {
    query += ' AND admin_id = ?';
    params.push(adminId);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const [rows] = await pool.execute(query, params);
  return rows;
};
