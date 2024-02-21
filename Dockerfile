FROM node:20-slim AS prod-deps
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

ENV DOCKER_BUILDKIT=1

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts


FROM node:20-slim AS builder

WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules

COPY . .

ENV NODE_ENV production

RUN pnpx nx frontend:build:production

FROM node:20-slim AS runner

ARG USERNAME=studios
ARG GROUP_NAME=studios
ARG UID=1001
ARG GID=1001

RUN addgroup --gid ${GID} --system ${GROUP_NAME}
RUN adduser --system --ingroup ${GROUP_NAME} --shell /bin/bash --uid ${UID} --disabled-password ${USERNAME}

USER $USERNAME

WORKDIR /app

COPY --from=builder --chown=${USERNAME}:${GROUP_NAME} /app/.next ./.next
#COPY --from=builder /app/node_modules ./node_modules
#COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/ ./

EXPOSE 3000

ENV NODE_ENV production

CMD ["pnpx", "nx", "serve", "frontend:production"]
