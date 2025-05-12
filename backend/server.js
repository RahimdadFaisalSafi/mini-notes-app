const express = require('express');
const cors = require('cors');
const path = require('path');
const winston = require('winston');
const noteRoutes = require('./routes/noteRoutes');

// Create a logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

const app = express();
const PORT = process.env.PORT || 3000;

// Log configuration
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
logger.info(`Legacy data directory: ${DATA_DIR} (kept for backward compatibility)`);

logger.info('Starting backend API...');
logger.info('Database Configuration:', {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD ? '[REDACTED]' : 'N/A'
});
logger.info('-------------------------------------------');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', noteRoutes);

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});