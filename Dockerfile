FROM alpine:3.3
MAINTAINER Fabien Schurter <fabien@fabschurt.com>

ARG ENVIRONMENT=prod
ARG DISABLE_WATCH=1
ENV JEKYLL_ENV=${ENVIRONMENT}

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
    ./bin/build && \
    addgroup -S jekyll && \
    adduser -SDH -s /sbin/nologin -G jekyll jekyll && \
    chgrp -R jekyll web && \
    chmod -R g+w web && \
    apk del --purge \
      bash       \
      git        \
      libffi-dev \
      make       \
      g++        \
    && \
    rm -rf /tmp/*                \
           /var/cache/apk/*      \
           /usr/lib/node_modules \
           /root/.npm            \
           /root/.cache/*

EXPOSE 4000
USER jekyll
CMD ["./vendor/bin/jekyll", "serve", "--trace", "--force_polling", "--host", "0.0.0.0", "--source", "app/jekyll", "--destination", "web"]
