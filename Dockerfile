FROM fabschurt/nginx
MAINTAINER Fabien Schurter <fabien@fabschurt.com>

ARG ENVIRONMENT=prod
ARG DISABLE_WATCH=1
ARG CANONICAL_ROOT=http://fabschurt.com

COPY . /opt/project
WORKDIR /opt/project
RUN apk update --no-cache && \
    apk add \
      bash            \
      git             \
      g++             \
      gcc             \
      make            \
      python          \
      nodejs          \
      ruby-dev        \
      ruby-io-console \
      ruby-json       \
      ruby-bundler    \
      libffi-dev      \
    && \
    cp config/nginx/app.conf /etc/nginx/servers.d/app.conf                                       && \
    ENVIRONMENT=$ENVIRONMENT DISABLE_WATCH=$DISABLE_WATCH CANONICAL_ROOT=$CANONICAL_ROOT ./bin/build && \
    apk del --purge \
      git        \
      g++        \
      gcc        \
      make       \
      python     \
      libffi-dev \
    && \
    rm -rf /tmp/*                \
           /var/cache/apk/*      \
           /usr/lib/node_modules \
           /root/.npm            \
           /root/.node-gyp       \
           /root/.cache/*
