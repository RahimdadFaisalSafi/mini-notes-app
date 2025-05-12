const express = require('express');
const router = express.Router();
const db = require('./db');
const path = require('path');
const winston = require('winston');

// Create a logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

// Define the data directory (for legacy code reference)
const DATA_DIR = path.join(process.cwd(), 'data');
logger.info(`Legacy data directory path: ${DATA_DIR} (no longer used for persistence)`);

// Test route
router.get('/', (req, res) => {
  res.send('API is running...');
});

// Get all notes
router.get('/notes', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM notes ORDER BY date DESC',
      []
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

// Add a new note
router.post('/notes', async (req, res) => {
  const { text } = req.body;
  logger.info(`Attempting to add note: ${text}`);
  
  try {
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Note text is required' });
    }
    
    // Use parameterized query to prevent SQL injection
    const result = await db.query(
      'INSERT INTO notes (text, date) VALUES ($1, CURRENT_TIMESTAMP) RETURNING *',
      [text]
    );
    
    const newNote = result.rows[0];
    
    // Format the date to match the expected format in the frontend
    newNote.date = new Date(newNote.date).toLocaleString();
    
    logger.info(`Note added successfully with ID: ${newNote.id}`);
    res.status(201).json(newNote);
  } catch (error) {
    logger.error(`Error adding note: ${error.message}`);
    res.status(500).json({ message: 'Error adding note' });
  }
});

// Delete a note
router.delete('/notes/:id', async (req, res) => {
  try {
    const noteId = parseInt(req.params.id);
    logger.info(`Attempting to delete note with ID: ${noteId}`);
    
    // Use parameterized query to prevent SQL injection
    const result = await db.query(
      'DELETE FROM notes WHERE id = $1 RETURNING *',
      [noteId]
    );
    
    if (result.rowCount === 0) {
      logger.warn(`Note with ID ${noteId} not found`);
      return res.status(404).json({ message: 'Note not found' });
    }
    
    logger.info(`Note with ID ${noteId} deleted successfully`);
    res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting note: ${error.message}`);
    res.status(500).json({ message: 'Error deleting note' });
  }
});

module.exports = router;