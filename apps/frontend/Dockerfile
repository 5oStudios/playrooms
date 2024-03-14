# Use the specific Node version
FROM node:lts-slim

# Set environment variables for pnpm
#ENV PNPM_HOME="/pnpm"
#ENV PATH="$PNPM_HOME:$PATH"

# Enable corepack
RUN corepack enable

# Set working directory
#WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Enable Docker BuildKit
#ENV DOCKER_BUILDKIT=1

# Install dependencies using pnpm with caching
RUN npm install

# Install nx globally
RUN #pnpm install -g nx

# Copy the entire application
COPY . .

# Build the frontend for production
RUN npx nx run frontend:build:production

# Serve the frontend in production
CMD ["npx","nx", "run", "frontend:serve:production"]
