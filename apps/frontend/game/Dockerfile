# Stage 1: Build the application
FROM node:lts-slim AS installer

# Set environment variables for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable corepack
RUN corepack enable

# Copy package.json and lock file
COPY ../../../pnpm-lock.yaml ./pnpm-lock.yaml
COPY ../../../package.json ./package.json

# Install dependencies using pnpm with caching
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts

FROM node:lts-slim AS builder

COPY --from=installer ./node_modules ./node_modules

COPY ../../../ .

RUN npx next build apps/frontend/game

FROM node:lts-slim AS production


COPY --from=builder ./apps/frontend/game/.next ./.next
COPY --from=builder ./node_modules ./node_modules

EXPOSE 3000

CMD ["npx", "next", "start"]
