FROM node:12.6.0-alpine

COPY dist /app/dist
COPY node_modules /app/node_modules

WORKDIR /app
EXPOSE 8080
ADD . /app


CMD node /app/dist/main.js
