# Containerized React Notes App

This project is a simple React Notes application containerized using Docker with a multi-stage build approach.

## Features

- Create and delete notes
- Notes persist in localStorage
- Containerized with Docker using multi-stage build
- Optimized for production deployment

## Project Structure

- `src/` - React application source code
- `public/` - Static assets
- `Dockerfile` - Multi-stage Docker build configuration
- `.dockerignore` - Files excluded from Docker build context

## Docker Build Process

The application uses a multi-stage Docker build:

1. **Stage 1 (Builder)**: Uses `node:lts-alpine` to:
   - Install dependencies
   - Build the React application with Vite
   - Generate optimized static files

2. **Stage 2 (Runtime)**: Uses `nginx:alpine` to:
   - Serve the static files generated in Stage 1
   - Provide a lightweight runtime environment
   - Include health checking

## How to Use

### Prerequisites

- Docker installed on your system

### Building the Docker Image

```bash
docker build -t mini-notes-app .
```

### Running the Container

```bash
docker run -p 80:80 mini-notes-app
```

This will make the application accessible at http://localhost:8080

### Checking Container Status

```bash
# List running containers
docker ps

# Inspect container details
docker inspect <container_id>
```

## Development vs Production

This Docker setup is optimized for production use. For development:

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`

## Notes on Single-Page Application Configuration

For proper SPA routing with Nginx, you might need to customize the Nginx configuration. The current setup works for basic applications without client-side routing.