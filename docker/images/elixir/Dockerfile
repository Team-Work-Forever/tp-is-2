FROM elixir:1.15.7-alpine

WORKDIR /usr/src/app

COPY /src/daemon/watcher ./

# install bash
RUN apk add bash

RUN mix deps.get
RUN mix compile
# RUN mix run

ENTRYPOINT mix run --no-halt
#  (sed -i 's/\r$//' ./run.sh) ; (chmod +x ./run.sh) ; ./run.sh