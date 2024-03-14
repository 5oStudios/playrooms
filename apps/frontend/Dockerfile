# Stage 1: Build the application
FROM node:lts-slim AS builder

# Set environment variables for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable corepack
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY ../../pnpm-lock.yaml ./pnpm-lock.yaml
COPY ../../package.json ./package.json

# Install dependencies using pnpm with caching
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts

# Copy the entire application
COPY ../../ .

# Build the frontend for production
RUN pnpx nx run frontend:build:production

FROM node:lts-slim AS runner

# Copy built files from the previous stage
COPY --from=builder /app/dist/apps/frontend/.next /app/dist/apps/frontend/.next

# Set working directory
WORKDIR /app/dist/apps/frontend

EXPOSE 80

CMD ["npx", "serve", "-s", ".next", "-l", "80"]
