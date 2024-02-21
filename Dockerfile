FROM node:20-slim AS deps
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

ENV DOCKER_BUILDKIT=1

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts


FROM node:20-slim AS runner

ARG USERNAME=studios
ARG GROUP_NAME=studios
ARG UID=1001
ARG GID=1001

RUN addgroup --gid ${GID} --system ${GROUP_NAME}
RUN adduser --system --ingroup ${GROUP_NAME} --shell /bin/bash --uid ${UID} --disabled-password ${USERNAME}

USER $USERNAME

WORKDIR /app

COPY --from=deps --chown=${USERNAME}:${GROUP_NAME} /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

ENV NODE_ENV production

RUN nx run frontend:build:production

CMD ["nx", "run", "frontend:serve:production"]
