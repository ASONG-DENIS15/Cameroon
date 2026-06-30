import mysql from 'mysql2/promise.js';
import dotenv from 'dotenv';

dotenv.config();

// Create Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
  timezone: '+00:00'
});

// Test Connection
pool.getConnection().then(connection => {
  console.log('✅ Database connected successfully');
  connection.release();
}).catch(error => {
  console.error('❌ Database connection failed:', error.message);
  process.exit(1);
});

export default pool;
