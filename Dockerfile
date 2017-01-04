FROM fabschurt/nginx
MAINTAINER Fabien Schurter <fabien@fabschurt.com>

ARG ENVIRONMENT=prod
ARG DISABLE_WATCH=1
ARG CANONICAL_ROOT=http://fabschurt.com

COPY config/nginx/app.conf /etc/nginx/conf.d
COPY . /opt/codebase
WORKDIR /opt/codebase
RUN apk update --no-cache && \
    apk add \
      bash            \
      git             \
      nodejs          \
      ruby-dev        \
      ruby-io-console \
      ruby-json       \
      ruby-bundler    \
      libffi-dev      \
      make            \
      g++             \
    && \
    ENVIRONMENT=${ENVIRONMENT} DISABLE_WATCH=${DISABLE_WATCH} CANONICAL_ROOT=${CANONICAL_ROOT} ./bin/build && \
    apk del --purge \
      bash            \
      git             \
      ruby-io-console \
      ruby-json       \
      ruby-bundler    \
      libffi-dev      \
      make            \
      g++             \
    && \
    rm -rf /tmp/*                \
           /var/cache/apk/*      \
           /usr/lib/node_modules \
           /root/.npm            \
           /root/.cache/*
