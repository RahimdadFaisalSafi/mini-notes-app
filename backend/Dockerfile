FROM node:lts-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy application code
COPY . .

# Expose API port (default 3000)
EXPOSE 3000

# Set environment variable for port
ENV PORT=3000

# Define startup command
CMD ["npm", "start"]