FROM elixir:1.15.7-alpine

ENV MIX_ENV=prod \
    TERM=xterm \
    LANG=C.UTF-8

WORKDIR /usr/src/app

COPY /src/daemon/watcher ./

RUN apk add bash

RUN mix local.rebar --force && mix local.hex --force
RUN mix deps.get --only prod
RUN mix deps.compile

RUN mix release

ENTRYPOINT ["/usr/src/app/_build/prod/rel/watcher/bin/watcher", "start"]
