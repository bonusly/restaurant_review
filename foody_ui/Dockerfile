FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./

# Clear npm cache and install dependencies with legacy peer deps (including dev dependencies)
RUN npm cache clean --force && \
    npm install --include=dev --legacy-peer-deps && \
    npm rebuild

# Copy the rest of the application
COPY . .

# Expose port 5173
EXPOSE 5173

# Start the development server
CMD ["npx", "vite", "--host", "0.0.0.0"]
