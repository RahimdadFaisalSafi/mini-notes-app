-- Drop the table if it exists (useful during development)
DROP TABLE IF EXISTS notes;

-- Create the notes table
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on the date for better performance when sorting
CREATE INDEX notes_date_idx ON notes(date);

-- Add some initial sample data (optional)
INSERT INTO notes (text, date) VALUES 
  ('Welcome to the Notes App with PostgreSQL!', CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ('This note is stored in a database.', CURRENT_TIMESTAMP);