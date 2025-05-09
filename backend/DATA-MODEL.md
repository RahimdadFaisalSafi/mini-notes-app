# SQL Recap: Notes Application Data Model

## Table Design

### Table: notes

This table stores individual note entries from the Notes application.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier for each note |
| text | VARCHAR(1000) | NOT NULL | The content of the note |
| created_at | TIMESTAMP | NOT NULL | When the note was created |

#### Primary Key
The `id` column serves as the primary key because:
- It uniquely identifies each note
- It's an integer value which is efficient for indexing and lookups
- It matches the current implementation which uses a timestamp-based ID

### Optional Extension: User Relationship

If we wanted to extend this to support multiple users:

#### Table: users

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier for each user |
| username | VARCHAR(50) | NOT NULL, UNIQUE | Username for login |
| email | VARCHAR(100) | NOT NULL, UNIQUE | User's email address |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password for security |
| created_at | TIMESTAMP | NOT NULL | When the user account was created |

#### Modified notes table with Foreign Key

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier for each note |
| user_id | INTEGER | FOREIGN KEY | Reference to the user who owns this note |
| text | VARCHAR(1000) | NOT NULL | The content of the note |
| created_at | TIMESTAMP | NOT NULL | When the note was created |

Foreign Key: `user_id` references `users(id)`, which establishes the relationship that each note belongs to exactly one user.

## SQL Queries (CRUD Operations)

### CREATE - Insert a new note

```sql
INSERT INTO notes (id, text, created_at) 
VALUES (?, ?, CURRENT_TIMESTAMP);
```

When implementing in code, the placeholder `?` for `id` would be replaced with the current timestamp (similar to `Date.now()` in the JavaScript code), and the placeholder for `text` would be the content of the note.

### READ - Get all notes

```sql
SELECT id, text, created_at 
FROM notes
ORDER BY created_at DESC;
```

This orders the notes by creation time (newest first), similar to how the current implementation uses `unshift()` to add new notes to the beginning of the array.

### READ - Get a single note by ID

```sql
SELECT id, text, created_at 
FROM notes 
WHERE id = ?;
```

### READ - Optional query with filter

```sql
-- Example: Get notes created today
SELECT id, text, created_at 
FROM notes 
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;
```

### UPDATE - Modify a note's text

```sql
UPDATE notes 
SET text = ? 
WHERE id = ?;
```

### DELETE - Remove a note by ID

```sql
DELETE FROM notes 
WHERE id = ?;
```

## Mapping API Endpoints to SQL Queries

| API Endpoint | HTTP Method | SQL Operation | Description |
|--------------|------------|--------------|-------------|
| `/api/notes` | GET | SELECT | Retrieves all notes from the database |
| `/api/notes/:id` | GET | SELECT with WHERE | Retrieves a specific note by ID |
| `/api/notes` | POST | INSERT INTO | Creates a new note |
| `/api/notes/:id` | PUT | UPDATE | Updates an existing note (not implemented in current code) |
| `/api/notes/:id` | DELETE | DELETE FROM | Deletes a note by ID |

## Reflection Questions

### 1. Advantages of a structured database over JSON file storage

**Advantage 1: Concurrency and Data Integrity**
A database can handle multiple simultaneous operations with transaction support, preventing data corruption when multiple users or processes try to write to the database at the same time. The current JSON implementation could lose data if two write operations occur simultaneously.

**Advantage 2: Scalability and Performance**
Databases are built to handle large volumes of data efficiently with indexing, query optimization, and caching mechanisms. As the notes application grows, a JSON file would become increasingly slow to read and write.

**Advantage 3: Query Capabilities**
SQL databases allow complex queries (filtering, sorting, aggregating) without loading the entire dataset into memory. The current implementation loads all notes even when only specific ones are needed.

**Advantage 4: Data Validation and Constraints**
Databases enforce data types, constraints (NOT NULL, UNIQUE), and referential integrity automatically. With JSON files, all validation must be handled in application code.

### 2. Purpose of Primary Key

The primary key (`id` column) serves to uniquely identify each row in the table, making it possible to reference, update, or delete specific notes. In my design, I implemented this as an INTEGER column that would contain unique timestamp-based IDs, similar to the current implementation using `Date.now()`.

The primary key also enables efficient indexing for quick lookups, which becomes increasingly important as the dataset grows.

### 3. Foreign Key Purpose (Optional Extension)

In the extended design with users, the foreign key `user_id` in the notes table models the relationship that "a note belongs to a user." This enforces referential integrity, ensuring that every note is associated with a valid user ID. It prevents orphaned notes (notes associated with non-existent users) and enables operations like "get all notes for a specific user" efficiently.

### 4. API Endpoint to SQL Query Mapping

- `GET /api/notes`: Executes a `SELECT` query to retrieve all notes.
- `GET /api/notes/:id`: Executes a `SELECT` query with a `WHERE` clause to retrieve a specific note.
- `POST /api/notes`: Executes an `INSERT INTO` query to create a new note.
- `DELETE /api/notes/:id`: Executes a `DELETE FROM` query to remove a specific note.

Each endpoint would execute the corresponding SQL operation, replacing the current file-based data access.

### 5. Importance of Databases for Containerized Applications and DevOps

Using a database for persistent data is crucial in containerized environments because:

1. **Statelessness**: Containers are designed to be stateless and ephemeral. When a container is restarted or replaced, its file system is reset. Storing data in a database ensures it persists beyond the container's lifecycle.

2. **Horizontal Scaling**: In a DevOps environment, multiple instances of an application may run simultaneously. A shared database ensures all instances access the same data, maintaining consistency.

3. **Backup and Recovery**: Databases provide built-in mechanisms for backup, replication, and disaster recovery, which are essential for production systems in DevOps environments.

4. **Separation of Concerns**: Following best practices, separating the application (container) from its data (database) allows independent scaling, updating, and management of each component.

The current implementation storing notes in a JSON file within the container would lose all data when the container is replaced, making it unsuitable for containerized deployments without additional volume mounts or other persistence solutions.