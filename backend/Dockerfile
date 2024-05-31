ARG STAGE=test

FROM --platform=amd64 node:20-alpine AS base

FROM base AS build-base

WORKDIR /app

RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml ./
COPY lib/sdk ./lib/sdk
RUN pnpm install --frozen-lockfile

COPY . .

RUN npm run build

FROM build-base AS test

FROM build-base AS staging

RUN pnpm install --production --frozen-lockfile

FROM build-base AS production

RUN pnpm install --production --frozen-lockfile

FROM ${STAGE} AS build

FROM base

RUN npm i -g is-ci

WORKDIR /app/build

ARG REPO_COMMIT_ID=local
ENV REPO_COMMIT_ID=${REPO_COMMIT_ID}

ARG STAGE=test
ENV STAGE=${STAGE}

ARG NODE_CONFIG_ENV=development
ENV NODE_CONFIG_ENV=${NODE_CONFIG_ENV}

COPY --from=build /app/build /app/build
COPY --from=build /app/node_modules /app/build/node_modules

EXPOSE 3333