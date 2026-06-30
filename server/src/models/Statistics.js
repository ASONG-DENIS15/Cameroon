import pool from '../config/database.js';

/**
 * Statistics Model - Database queries
 */

/**
 * Get dashboard statistics
 */
export const getDashboardStatistics = async () => {
  const stats = {};

  // Total users
  const [userRows] = await pool.execute(
    'SELECT COUNT(*) as count FROM users WHERE role = "tourist" AND deleted_at IS NULL'
  );
  stats.totalUsers = userRows[0].count;

  // Total bookings
  const [bookingRows] = await pool.execute(
    'SELECT COUNT(*) as count FROM bookings'
  );
  stats.totalBookings = bookingRows[0].count;

  // Total revenue
  const [revenueRows] = await pool.execute(
    'SELECT SUM(total_price) as total FROM bookings WHERE status IN ("confirmed", "completed")'
  );
  stats.totalRevenue = revenueRows[0].total || 0;

  // Confirmed bookings
  const [confirmedRows] = await pool.execute(
    'SELECT COUNT(*) as count FROM bookings WHERE status = "confirmed"'
  );
  stats.confirmedBookings = confirmedRows[0].count;

  // Pending bookings
  const [pendingRows] = await pool.execute(
    'SELECT COUNT(*) as count FROM bookings WHERE status = "pending"'
  );
  stats.pendingBookings = pendingRows[0].count;

  return stats;
};

/**
 * Get monthly statistics
 */
export const getMonthlyStatistics = async () => {
  const [rows] = await pool.execute(
    `SELECT 
      DATE_TRUNC('month', created_at) as month,
      COUNT(*) as bookings,
      SUM(total_price) as revenue
    FROM bookings
    WHERE status IN ('confirmed', 'completed')
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY month DESC
    LIMIT 12`
  );
  return rows;
};

/**
 * Get top attractions
 */
export const getTopAttractions = async (limit = 5) => {
  const [rows] = await pool.execute(
    `SELECT a.id, a.title, a.image_url, COUNT(b.id) as booking_count, SUM(b.total_price) as revenue
    FROM attractions a
    LEFT JOIN bookings b ON a.id = b.attraction_id
    GROUP BY a.id
    ORDER BY booking_count DESC
    LIMIT ?`,
    [limit]
  );
  return rows;
};

/**
 * Get statistics by date
 */
export const getStatisticsByDate = async (date) => {
  const [rows] = await pool.execute(
    'SELECT * FROM statistics WHERE stat_date = ?',
    [date]
  );
  return rows[0];
};

/**
 * Update or create statistics
 */
export const updateStatistics = async (statDate, stats) => {
  const exists = await getStatisticsByDate(statDate);
  
  if (exists) {
    await pool.execute(
      `UPDATE statistics SET 
      total_users = ?, total_bookings = ?, total_revenue = ?, 
      new_bookings = ?, completed_bookings = ?, cancelled_bookings = ?, 
      page_views = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE stat_date = ?`,
      [stats.totalUsers, stats.totalBookings, stats.totalRevenue, 
       stats.newBookings, stats.completedBookings, stats.cancelledBookings,
       stats.pageViews, statDate]
    );
  } else {
    await pool.execute(
      `INSERT INTO statistics 
      (stat_date, total_users, total_bookings, total_revenue, new_bookings, completed_bookings, cancelled_bookings, page_views)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [statDate, stats.totalUsers, stats.totalBookings, stats.totalRevenue,
       stats.newBookings, stats.completedBookings, stats.cancelledBookings, stats.pageViews]
    );
  }
};
