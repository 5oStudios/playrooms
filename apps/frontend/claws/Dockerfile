FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts

COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpx nx run claws:build


FROM node:22-alpine AS production
WORKDIR /app
COPY --from=build /app/dist/apps/frontend/claws ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-lock.yaml ./
EXPOSE 3001

CMD ["npx", "next", "start", "-p", "3001"]
