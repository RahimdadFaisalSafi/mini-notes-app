const express = require('express');
const cors = require('cors');
const path = require('path');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Define data directory path - can be overridden via environment variable
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
console.log(`Using data directory: ${DATA_DIR}`);

app.use(cors());
app.use(express.json());

app.use('/api', noteRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Fallback for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Notes data will be stored in: ${DATA_DIR}`);
});