#!/bin/bash


# export REACT_APP_API_ENTITIES_URL=$API_ENTITIES_URL
# export REACT_APP_API_GIS_URL=$API_GIS_URL
# export REACT_APP_API_GRAPHQL_URL=$API_GRAPHQL_URL
# export REACT_APP_API_PROC_URL=$API_PROC_URL
echo "Starting GIS Frontend on port $WEB_PORT"
npm install;
npm run build;
node server $WEB_PORT;

# if [ $USE_DEV_MODE = "true" ];
#   then
#     npm run start;
#   else

# fi