FROM node:21 AS builder
WORKDIR /usr/src/app

COPY ./src/frontend/ent/package*.json ./

RUN npm install

COPY ./src/frontend/ent/. ./

RUN npm run build

FROM node:21-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY ./src/frontend/ent/package*.json ./

RUN npm i

EXPOSE 3000

CMD ["npm", "start"]
