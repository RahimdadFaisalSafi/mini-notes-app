# Docker Setup Instructions for Notes App

## Prerequisites
- Docker installed on your system
- Project with the directory structure as described in the Directory Structure document

## Step 1: Stop and Remove Any Existing Containers
```bash
# List all containers
docker ps -a

# Stop and remove any existing containers (replace container_name with your actual container names)
docker stop container_name
docker rm container_name
```

## Step 2: Create a Docker Network
```bash
docker network create my-app-network
```

## Step 3: Set Up the Backend

### Navigate to the backend directory
```bash
cd backend
```

### Build the backend Docker image
```bash
docker build -t my-backend-api:network-proxy .
```

### Run the backend container
```bash
docker run -d \
  --name backend-service \
  --network my-app-network \
  -p 8081:3000 \
  -v my-backend-data:/app/data \
  -e PORT=3000 \
  my-backend-api:network-proxy
```

## Step 4: Set Up the Frontend

### Navigate to the frontend directory
```bash
cd frontend
```

### Make sure the nginx.conf file exists in the frontend directory
Create the nginx.conf file as specified in the provided configuration.

### Build the frontend Docker image
```bash
docker build \
  --build-arg VITE_API_URL=/api/notes \
  -t my-frontend-app:network-proxy .
```

### Run the frontend container
```bash
docker run -d \
  --name frontend-app \
  --network my-app-network \
  -p 8080:80 \
  my-frontend-app:network-proxy
```

## Step 5: Test the Application
- Open your browser and navigate to http://localhost:8080
- You should see the Notes App interface
- Add, view, and delete notes to test the functionality
- The data will persist even if you stop and restart the backend container

## Debugging Tips

### View container logs
```bash
# View logs from the backend container
docker logs backend-service

# View logs from the frontend container
docker logs frontend-app
```

### Check running containers
```bash
docker ps
```

### Inspect the network
```bash
docker network inspect my-app-network
```

### Access container shell
```bash
# Access backend container shell
docker exec -it backend-service sh

# Access frontend container shell
docker exec -it frontend-app sh
```

### Test backend directly
If you need to test the backend API directly, you can access it at:
http://localhost:8081/api/notes

### Restart containers
```bash
docker restart backend-service
docker restart frontend-app
```

### Stop and remove containers
```bash
# Stop containers
docker stop backend-service frontend-app

# Remove containers
docker rm backend-service frontend-app

# Remove network
docker network rm my-app-network

# Remove volume (caution: this will delete persistent data)
docker volume rm my-backend-data
```