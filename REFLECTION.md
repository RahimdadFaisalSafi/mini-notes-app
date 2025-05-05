# Reflection Answers

### What exactly is stored in the Docker image for the API – source code plus all dependencies (dev and prod) or only production dependencies?

In the backend Dockerfile, we use `npm install --production` which means only production dependencies are installed, not development dependencies. The Docker image contains:
- The source code of the application
- Only production dependencies from package.json (those not listed under "devDependencies")
- The Node.js runtime environment

This approach keeps the Docker image smaller and more secure by excluding development tools, testing libraries, and other dependencies not needed for running the application in production.

### What role does Nginx play in the frontend container in this full-stack setup?

Nginx serves several important roles in the frontend container:

1. **Static File Server**: Nginx efficiently serves the static built files (HTML, CSS, JavaScript) that comprise the React application.
2. **Performance Optimization**: Nginx is optimized for serving static content with high performance and low resource usage.
3. **Single Page Application Support**: The configuration with `try_files $uri $uri/ /index.html;` ensures that all routes in the React app are properly handled by returning the main index.html file for client-side routing.
4. **Security Layer**: Nginx adds a layer of security between the internet and the application code.
5. **Load Balancing** (if configured): In more complex setups, Nginx can also act as a load balancer.

### Why is a tool like nodemon usually not used in the final production container (backend)?

Nodemon is not used in production containers for several reasons:

1. **Resource Overhead**: Nodemon continually monitors the file system for changes, which consumes extra CPU and memory resources.
2. **Unnecessary Functionality**: In production, code changes should not be happening, so the file watching and auto-restart features are redundant.
3. **Stability**: Production applications need stable, predictable processes without unexpected restarts.
4. **Security**: Having additional tools like nodemon increases the attack surface of the container.
5. **Container Philosophy**: Docker containers should be immutable - if code changes are needed, a new container should be built and deployed rather than changing code in a running container.

### How does the frontend container communicate with the backend container when both are started separately and ports are mapped?

The path of an HTTP request from the browser to the backend:

1. The user interacts with the React application running in their browser.
2. The React app makes a fetch request to the backend API URL (e.g., `http://localhost:8081/api/notes`).
3. The browser sends this HTTP request to localhost port 8081.
4. The host operating system receives this request on port 8081 and forwards it to the Docker network.
5. Docker's port mapping routes traffic from host port 8081 to container port 3000.
6. The Node.js Express application running inside the backend container receives the request on port 3000.
7. Express processes the request, executes the corresponding route handler, and generates a response.
8. The response follows the reverse path back to the browser.

Despite being in separate containers, communication works because of Docker's port mapping that exposes the internal container ports to the host network.

### Why is the backend URL (VITE_API_URL) injected as a build argument during the frontend build and not simply set as an environment variable for the running frontend container?

The backend URL is injected as a build argument rather than a runtime environment variable because:

1. **Client-Side Execution**: React applications run in the browser after being built. Once the JavaScript bundle is created during the build process, the environment variables need to be "baked in" to the code.
2. **Build-Time vs. Runtime**: Environment variables in a traditional Node.js application can be accessed at runtime, but in a frontend application, they must be included during the build process.
3. **No Server Processing**: The Nginx container serving the frontend files is just a static file server with no JavaScript engine to process environment variables at request time.
4. **Security and Flexibility**: This approach allows you to build different versions of the frontend for different environments (development, staging, production) with appropriate API URLs without changing the source code.

Vite specifically uses the `import.meta.env` syntax to access environment variables, which are replaced with actual values during the build process.

### Briefly describe which best practices you used when installing the Node.js dependencies in the backend Dockerfile and why.

Best practices used in the backend Dockerfile:

1. **Production Dependencies Only**: Using `npm install --production` installs only the dependencies required to run the application, excluding development dependencies. This reduces image size, potential security vulnerabilities, and build time.

2. **Multi-Stage Copy Process**: Copying package.json and package-lock.json first before copying the rest of the code allows Docker to cache the dependency installation layer, speeding up builds when only application code changes.

3. **Official Node.js Alpine Image**: Using `node:lts-alpine` provides a secure, up-to-date, and smaller base image compared to full Debian-based Node.js images.

4. **Working Directory**: Setting a specific working directory (`/app`) keeps the container organized and avoids conflicts with system files.

5. **Explicit Port Exposure**: Using the `EXPOSE` directive clearly documents which ports the container uses.

6. **Explicit CMD**: Defining the exact startup command ensures the application starts consistently regardless of base image changes.