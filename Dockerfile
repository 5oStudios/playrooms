FROM node:20-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./
ENV DOCKER_BUILDKIT=1
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts

RUN npm install -g nx

COPY . .

RUN nx build frontend:production

EXPOSE 3000

ENV NODE_ENV production

CMD ["nx", "serve", "frontend:production"]
