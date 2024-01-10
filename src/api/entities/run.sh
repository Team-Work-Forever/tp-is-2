#!/bin/bash

export DATABASE_URL="postgresql://${PG_REL_USER}:${PG_REL_PASSWORD}@${PG_REL_HOST}:${PG_REL_PORT}/${PG_REL_DATABASE}"

# RUN npm install;
# RUN npx prisma generate --schema=./src/config/prisma/schema.prisma;

# if [ "$USE_DEV_MODE" = "true" ];
#   then npm run start:dev;
#   else npm run start:prod;
# fi

npm run start:prod;