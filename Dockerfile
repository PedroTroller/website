FROM fabschurt/nginx
MAINTAINER Fabien Schurter <fabien@fabschurt.com>

ARG ENVIRONMENT=prod
ARG NO_WATCH=0

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
    cp app/config/nginx/app.conf /etc/nginx/servers.d/app.conf && \
    ENVIRONMENT=$ENVIRONMENT NO_WATCH=$NO_WATCH ./bin/build    && \
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

HEALTHCHECK --interval=15s --timeout=15s --retries=2 CMD wget -sq http://localhost/
