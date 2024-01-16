FROM node:21 AS builder
WORKDIR /usr/src/app

COPY ./src/frontend/gis/package*.json ./
COPY ./src/frontend/gis/src ./src
COPY ./src/frontend/gis/public ./public

RUN npm i
RUN npm run build

FROM node:21-alpine
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/build ./build
COPY ./src/frontend/gis/server ./server
COPY ./src/frontend/gis/package*.json ./
RUN npm install --omit=dev

EXPOSE 3000
ENTRYPOINT [ "node", "server", "3000" ]