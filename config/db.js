const mysql = require('mysql2/promise');
require('dotenv').config();
const logger = require('../utils/logger');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 1000,
  timezone: 'local',
  dateStrings: true,
  supportBigNumbers: true,
  bigNumberStrings: true
});

// Log connection events
pool.on('connection', (connection) => {
  logger.debug('New database connection established');
});

pool.on('acquire', (connection) => {
  logger.debug('Connection acquired', connection.threadId);
});

module.exports = pool;
