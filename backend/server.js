const express = require('express');
const cors = require('cors');
const path = require('path');
const winston = require('winston');
const noteRoutes = require('./routes/noteRoutes');


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


const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
logger.info(`Using data directory: ${DATA_DIR}`);


logger.info('Starting backend API...');
logger.info('Database Configuration (received via ENV):', {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD ? '[REDACTED]' : 'N/A'
});
logger.info('-------------------------------------------');

app.use(cors());
app.use(express.json());

app.use('/api', noteRoutes);


app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});


app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
  logger.info(`Notes data will be stored in: ${DATA_DIR}`);
});