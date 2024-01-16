# FROM node:21-alpine3.17

# WORKDIR /usr/src/app

# COPY src/api/entities/package.json ./
# COPY src/api/entities/tsconfig.json ./
# COPY src/api/entities/src ./src
# COPY src/api/entities/src/config/prisma ./prisma

# RUN apk add bash curl
# RUN npm update npm -g
# RUN npm install nodemon -g
# RUN npm install knex -g
# RUN npm install -g @nestjs/cli

# RUN npm i
# RUN npx prisma generate --schema=./src/config/prisma/schema.prisma

# RUN npm run build

# # CMD (sed -i 's/\r$//' ./run.sh) ; (chmod +x ./run.sh) ; ./run.sh
# CMD ["npm", "run", "start:prod"]
# Build Stage
FROM node:21 AS builder
WORKDIR /usr/src/app

COPY ./src/api/entities/package*.json ./
COPY ./src/api/entities/tsconfig.json ./
COPY ./src/api/entities/src ./src

RUN npm install -g @nestjs/cli

RUN npm i
RUN npx prisma generate --schema=./src/config/prisma/schema.prisma
RUN npm run build

# Production Stage
FROM node:21-alpine
WORKDIR /usr/src/app

RUN export DATABASE_URL="postgresql://${PG_REL_USER}:${PG_REL_PASSWORD}@${PG_REL_HOST}:${PG_REL_PORT}/${PG_REL_DATABASE}"

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src/config/prisma/schema.prisma .
COPY ./src/api/entities/package*.json ./
COPY ./src/api/entities/run.sh ./

RUN apk add curl
RUN npm install --omit=dev

RUN npx prisma generate

RUN sed -i 's/\r$//' ./run.sh
RUN chmod +x ./run.sh

EXPOSE 3000
ENTRYPOINT [ "sh", "run.sh" ]