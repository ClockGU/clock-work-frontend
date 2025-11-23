# Setup stage
FROM node:20.19.5-alpine3.21 AS build-stage
ARG VITE_ALLOWED_HOST
ARG VITE_AUTH_API
ARG VITE_CONTENT_API
ARG VITE_PUBLIC_URL

ENV VITE_ALLOWED_HOST=${VITE_ALLOWED_HOST} VITE_AUTH_API=${VITE_AUTH_API} VITE_CONTENT_API=${VITE_CONTENT_API} VITE_PUBLIC_URL=${VITE_PUBLIC_URL}


RUN addgroup -S app --gid 32767 \
    && adduser -G app --uid 32767 -h /app -D app

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

COPY --chown=app:app . .
USER app
RUN yarn build


FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/docker/dokku/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
