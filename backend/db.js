const { Pool } = require('pg');
const winston = require('winston');

// Use the same logger that's already configured in the app
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

// Create a connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    logger.error('Error connecting to database:', err);
  } else {
    logger.info('Successfully connected to PostgreSQL database');
    logger.info(`Server time: ${res.rows[0].now}`);
  }
});

module.exports = {
  query: (text, params) => {
    logger.debug('Executing query:', { text, params });
    return pool.query(text, params);
  },
  pool
};