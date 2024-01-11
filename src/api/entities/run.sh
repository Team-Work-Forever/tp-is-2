#!/bin/bash
export DATABASE_URL="postgresql://${PG_REL_USER}:${PG_REL_PASSWORD}@${PG_REL_HOST}:${PG_REL_PORT}/${PG_REL_DATABASE}"

if [ "$USE_DEV_MODE" = "true" ];
  then npm run start:dev;
  else npm run start:prod;
fi