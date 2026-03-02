# Use an official Node.js runtime as a parent image
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the frontend
RUN npm run build

# Expose the port the app runs on (Cloud Run uses PORT environment variable)
EXPOSE 3001

# Run the Node.js server
CMD ["node", "server.js"]
