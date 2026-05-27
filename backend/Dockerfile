FROM node:24-alpine AS base

COPY . /app
WORKDIR /app

FROM base AS build
RUN npm ci
RUN npm run build:ts

FROM base

RUN npm install fastify-cli --global
COPY --from=build /app/dist /app

WORKDIR /app
RUN mkdir db

RUN npm ci

CMD ["fastify", "start", "-p 80", "app.js"]

EXPOSE 80
