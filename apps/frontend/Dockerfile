# Use the specific Node version
FROM node:lts-slim

# Set environment variables for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable corepack
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json pnpm-lock.yaml ./

# Install dependencies using pnpm with caching
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts

# Install nx globally
RUN pnpm install -g nx

# Copy the entire application
COPY . .

# Build the frontend for production
RUN nx run frontend:build:production

# Serve the frontend in production
CMD ["nx", "run", "frontend:serve:production"]
