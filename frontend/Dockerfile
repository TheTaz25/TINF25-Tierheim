FROM node:24-alpine AS base

COPY . /app
WORKDIR /app

FROM base AS build
RUN npm ci
RUN npm run build

FROM caddy:alpine

COPY --from=build /app/dist/ /srv/
COPY ./Caddyfile /etc/caddy/Caddyfile
