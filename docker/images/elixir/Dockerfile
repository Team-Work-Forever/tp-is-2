FROM elixir:1.15.7-alpine

WORKDIR /usr/src/app

# install bash
RUN apk add bash

ENTRYPOINT (sed -i 's/\r$//' ./run.sh) ; (chmod +x ./run.sh) ; ./run.sh