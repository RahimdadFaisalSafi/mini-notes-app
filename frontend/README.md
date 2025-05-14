# Notes App with PostgreSQL Database

This is a full-stack Notes application that uses PostgreSQL for persistent data storage. The application includes a React frontend, Node.js/Express backend, and a PostgreSQL database, all containerized with Docker.

## Project Structure

```
├── backend/
│   ├── routes/
│   │   └── noteRoutes.js   # API routes
│   ├── sql/
│   │   └── initial_schema.sql  # SQL schema creation script
│   ├── db.js               # Database connection module
│   ├── server.js           # Main application entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── App.jsx
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## Database Schema

The application uses a simple PostgreSQL schema with a single `notes` table:

```sql
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Initial Setup

### Prerequisites

- Docker and Docker Compose installed on your system
- Git for version control

### Installing Dependencies

The backend requires the PostgreSQL driver:

```bash
cd backend
npm install pg
```# Notes Application with Docker Persistence

This project implements a simple notes application with React frontend and Node.js/Express backend. The backend uses file-based persistence with Docker volumes to ensure data is preserved across container restarts.

## Project Structure

```
notes-app/
├── frontend/
│   ├── Dockerfile
│   └── ... (React application files)
├── backend/
│   ├── Dockerfile
│   ├── server.js
│   ├── routes/
│   │   └── noteRoutes.js
│   └── ... (Node.js application files)
└── README.md
```

## Data Persistence Implementation

The backend now uses file-based persistence instead of in-memory storage:

1. Notes are stored in a JSON file (`notes.json`) in a dedicated data directory
2. The data directory is mounted as a Docker volume to persist data across container restarts
3. File operations are handled using Node.js `fs` module with proper error handling
4. The application checks for the existence of the data directory and file on startup

## Volume Type Decision

You can use either a **named volume** or a **bind mount** for persistence. Here's the reasoning behind each choice:

### Named Volume Advantages:
- **Managed by Docker**: Docker takes care of storing the data in a location that persists across container restarts
- **Portability**: The setup is more portable as it doesn't depend on specific host directories
- **Isolation**: Better isolation from the host filesystem
- **Data Safety**: Named volumes are not automatically deleted when containers are removed

### Bind Mount Advantages:
- **Visibility**: Data is directly accessible on the host filesystem for inspection and backup
- **Development Convenience**: For development, you can easily view and modify the data files directly
- **Flexibility**: Can be mounted from any location on the host

For this development environment, both approaches would work well. Named volumes provide better isolation and portability, while bind mounts offer easier visibility and access to the data files.

## Running the Application with Docker Commands

### Building the Images

```bash
# Build the backend image
cd backend
docker build -t notes-backend:persistence .

# Build the frontend image
cd ../frontend
docker build -t notes-frontend --build-arg VITE_API_URL=http://localhost:8081/api/notes .
```

### Starting the Backend with Persistence

#### Option 1: Using a Named Volume

```bash
# Create a named volume
docker volume create notes-data

# Run the backend container with the named volume
docker run -d -p 8081:3000 --name notes-backend-persistent \
  -v notes-data:/app/data notes-backend:persistence
```

#### Option 2: Using a Bind Mount

```bash
# Create a directory on your host machine
mkdir -p ./backend-data

# Run the backend container with the bind mount
docker run -d -p 8081:3000 --name notes-backend-persistent \
  -v $(pwd)/backend-data:/app/data notes-backend:persistence
```

### Starting the Frontend

```bash
# Run the frontend container
docker run -d -p 8080:80 --name notes-frontend notes-frontend
```

## Testing Persistence

1. Access the frontend at http://localhost:8080
2. Add some notes through the frontend
3. Stop and remove the backend container:
   ```bash
   docker stop notes-backend-persistent
   docker rm notes-backend-persistent
   ```
4. Start a new backend container with the same volume:
   ```bash
   # If using named volume
   docker run -d -p 8081:3000 --name notes-backend-persistent \
     -v notes-data:/app/data notes-backend:persistence
   
   # OR if using bind mount
   docker run -d -p 8081:3000 --name notes-backend-persistent \
     -v $(pwd)/backend-data:/app/data notes-backend:persistence
   ```
5. Access the frontend again and verify the notes are still available

## Managing Containers

```bash
# List running containers
docker ps

# View container logs
docker logs notes-backend-persistent

# Stop containers
docker stop notes-frontend notes-backend-persistent

# Remove containers
docker rm notes-frontend notes-backend-persistent

# List volumes
docker volume ls

# Inspect volume data
docker volume inspect notes-data
```

## Data Location

- **Named Volume**: Docker manages this storage. Find location with `docker volume inspect notes-data`
- **Bind Mount**: Data is stored in the `./backend-data` directory on your host

### Manual Schema Creation

After starting the stack for the first time, you need to manually create the database schema:

1. Ensure the stack is running:
   ```
   docker-compose up -d
   ```

2. Execute the SQL schema file in the PostgreSQL container:
   ```
   docker exec -i $(docker-compose ps -q database) psql -U notes_user -d notes_db < backend/sql/initial_schema.sql
   ```

## Running the Application

1. Start the application stack:
   ```
   docker-compose up -d --build
   ```

2. Access the application in your browser:
   ```
   http://localhost:8080
   ```

3. To stop the application:
   ```
   docker compose down
   ```

4. To completely reset the database (remove all data):
   ```
   docker compose down -v
   ```
   Then follow the "Initial Setup" steps again.

## Testing Functionality

1. Create a new note by typing in the input field and clicking "Add Note"
2. View all notes listed in the "My Notes" section
3. Delete a note by clicking the "Delete" button next to it
4. Test persistence by restarting just the database:
   ```
   docker-compose restart database
   ```
   Then refresh your app to verify the notes are still there.

## Implementation Details

### Database Connection

- The backend uses the `pg` driver with a connection pool for efficient database connections
- Connection pooling improves performance by reusing database connections instead of creating new ones for each request
- The backend connects to the database using environment variables provided in Docker Compose

### Security Features

- SQL injection is prevented using parameterized queries:
  ```javascript
  db.query('INSERT INTO notes (text) VALUES ($1)', [userInput])
  ```
- The backend only starts after the database is confirmed healthy via Docker Compose health checks

### Manual Schema Management

This implementation uses manual schema management, which includes:
- Creating SQL scripts by hand
- Manually executing these scripts against the database
- No automated migration system

While this approach is straightforward for learning, production applications would benefit from an automated migration tool like Knex.js, Sequelize, or TypeORM.

## Advantages of Database vs File-based Storage

- **Concurrency**: Multiple users can access and modify data simultaneously
- **Scalability**: Can handle larger amounts of data more efficiently
- **Data integrity**: ACID transactions ensure data remains consistent
- **Query capabilities**: Complex data retrieval through SQL
- **Backup and recovery**: Built-in mechanisms for data protection