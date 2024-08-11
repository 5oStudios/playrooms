FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

FROM base AS build

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts

COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpx nx run game-server:build

FROM node:22-alpine AS production

WORKDIR /app

COPY --from=build /app/dist/apps/backend/game-server ./dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/main.js", "--port", "3000"]
