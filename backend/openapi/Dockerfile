FROM --platform=linux/amd64 node:20-alpine AS base

FROM base AS build

WORKDIR /app

RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml ./
COPY lib/sdk ./lib/sdk
RUN pnpm install --frozen-lockfile

COPY . .

RUN npm run openapi:spec
RUN npm run openapi:build

FROM base

WORKDIR /app

RUN npm i -g serve

COPY --from=build /app/openapi /app/openapi
COPY package.json .

EXPOSE 8080

CMD ["npx", "serve", "openapi/build", "-p", "8080"]
