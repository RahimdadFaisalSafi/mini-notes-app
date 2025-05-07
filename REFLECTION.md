# Reflection Answers

## Path of an API Request

When the browser makes an API request to the backend, the path is as follows:

1. **Browser**: User interacts with the React app, which triggers a fetch request to `/api/notes`
   - This happens even though the environment variable is set to `http://localhost:3000/api/notes`
   - Our App.js code extracts the base URL and constructs the proper endpoint
2. **Host**: The request goes to the host machine at `http://localhost:8080/api/notes` (the port mapped to the frontend container)
3. **Frontend Container (Nginx)**: 
   - Nginx receives the request
   - Since the path matches the `/api/` location block in the nginx.conf
   - Nginx forwards the request to `http://backend-service:3000/api/notes` via the internal Docker network
4. **Docker Network**: The request travels across the Docker bridge network
5. **Backend Container**: 
   - The Node.js application receives the request at `/api/notes` 
   - The Express router processes it and sends back a response
   - The response follows the same path back to the browser in reverse

## Why Can't the Browser Resolve backend-service:3000 Directly?

The browser can't resolve `backend-service:3000` directly because:

1. **DNS Resolution**: `backend-service` is a Docker container name that is only resolvable within the Docker network. It's not a registered domain name on the public DNS system.

2. **Network Isolation**: Docker networks are isolated from the host network by default. The Docker networking system provides its own DNS service for name resolution between containers, but this is only accessible from within the Docker network.

3. **Port Availability**: Even if the browser could somehow resolve `backend-service`, port 3000 isn't directly exposed to the host network (we expose it only for debugging purposes).

Nginx in the frontend container can resolve `backend-service` because:
- Both containers (frontend and backend) are connected to the same Docker network (`my-app-network`)
- Docker automatically creates DNS entries for container names in the network
- Docker's embedded DNS server allows containers to find each other by name

## Role of the Custom Nginx Configuration

The custom Nginx configuration serves several important roles:

1. **Static File Serving**: It serves the compiled React application from `/usr/share/nginx/html` for requests to the root path.

2. **Single Page Application Support**: The `try_files $uri $uri/ /index.html;` directive ensures that SPA routing works correctly by falling back to `index.html` for routes that don't match physical files.

3. **Reverse Proxy**: It forwards requests with the `/api` prefix to the backend service, allowing the frontend and backend to appear as a single integrated application to the browser.

4. **Network Abstraction**: It abstracts the internal network structure from external clients. Browsers only need to know about a single host (localhost:8080), while the actual backend service location is hidden.

5. **Security Enhancement**: By not exposing the backend directly, we reduce the attack surface and can implement additional security measures at the Nginx level if needed.

6. **Header Management**: The configuration sets proper headers for proxy communication, ensuring that upgraded connections (like WebSockets) work correctly.

This pattern is commonly used in microservices architectures and provides a clean separation between frontend and backend services while maintaining a unified interface for clients.