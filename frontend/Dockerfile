FROM node:24-alpine AS base

COPY ./frontend /app
WORKDIR /app

FROM base AS build
RUN npm ci
RUN npm run build

FROM caddy:alpine

COPY --from=build /app/dist/ /srv/
COPY ./frontend/Caddyfile /etc/caddy/Caddyfile
