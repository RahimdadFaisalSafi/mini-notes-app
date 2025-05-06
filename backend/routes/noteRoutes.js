const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Define the data directory and file path
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'notes.json');

// Ensure data directory exists
try {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        console.log(`Created data directory at ${DATA_DIR}`);
    }
} catch (error) {
    console.error(`Error creating data directory: ${error.message}`);
}

// Function to load notes from file
const loadNotes = () => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            // If file doesn't exist, initialize with empty array
            fs.writeFileSync(DATA_FILE, JSON.stringify([]), 'utf8');
            console.log(`Created empty notes file at ${DATA_FILE}`);
            return [];
        }
        
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error loading notes from ${DATA_FILE}: ${error.message}`);
        return [];
    }
};

// Function to save notes to file
const saveNotes = (notes) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Error saving notes to ${DATA_FILE}: ${error.message}`);
        return false;
    }
};

// Load initial notes data
let notes = loadNotes();

// Test route
router.get('/', (req, res) => {
    res.send('API is running...');
});

// Get all notes
router.get('/notes', async (req, res) => {
    try {
        // Reload from file to ensure we have the latest data
        notes = loadNotes();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes' });
    }
});

// Add a new note
router.post('/notes', async (req, res) => {
    const { text } = req.body;
    console.log(text);
    try {
        if (!text || text.trim() === '') {
            return res.status(400).json({ message: 'Note text is required' });
        }
        
        const newNote = {
            id: Date.now(),
            text,
            date: new Date().toLocaleString(),
        };
        
        // Add to the beginning of the array
        notes.unshift(newNote);
        
        // Save to file
        if (saveNotes(notes)) {
            res.status(201).json(newNote);
        } else {
            throw new Error('Failed to save note to file');
        }
    } catch (error) {
        console.error(`Error adding note: ${error.message}`);
        res.status(500).json({ message: 'Error adding note' });
    }
});

// Delete a note
router.delete('/notes/:id', async (req, res) => {
    try {
        const noteId = parseInt(req.params.id);
        const initialLength = notes.length;
        
        notes = notes.filter(note => note.id !== noteId);
        
        if (notes.length === initialLength) {
            return res.status(404).json({ message: 'Note not found' });
        }
        
        // Save the updated notes to file
        if (saveNotes(notes)) {
            res.status(204).json({ message: 'Note deleted successfully' });
        } else {
            throw new Error('Failed to save updated notes to file');
        }
    } catch (error) {
        console.error(`Error deleting note: ${error.message}`);
        res.status(500).json({ message: 'Error deleting note' });
    }
});

module.exports = router;