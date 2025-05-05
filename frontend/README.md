# Containerized Notes Application

A simple full-stack notes application with a React frontend and Node.js/Express backend, containerized with Docker.

## Application Structure

- **Frontend**: React application built with Vite, styled with Tailwind CSS
- **Backend**: Express.js API with in-memory storage for notes

## Features

- Create new notes
- View all notes
- Delete notes
- Containerized deployment with Docker

## Dockerized Setup

### Building and Running Containers Separately

#### Backend Container

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build the backend Docker image:
   ```bash
   docker build -t my-backend-api .
   ```

3. Run the backend container:
   ```bash
   docker run -d -p 8081:3000 --name my-backend my-backend-api
   ```

#### Frontend Container

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Build the frontend Docker image with the API URL:
   ```bash
   docker build --build-arg VITE_API_URL=http://localhost:8081/api/notes -t my-frontend-app .
   ```

3. Run the frontend container:
   ```bash
   docker run -d -p 8080:80 --name my-frontend my-frontend-app
   ```

4. Access the application in your browser at:
   ```
   http://localhost:8080
   ```

## Development Setup

### Backend

1. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

### Frontend

1. Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Create a `.env` file with the API URL:
   ```
   VITE_API_URL=http://localhost:3000/api/notes
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```