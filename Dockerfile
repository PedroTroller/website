FROM alpine:3.3
MAINTAINER Fabien Schurter <fabien@fabschurt.com>

ENV DISPOSABLE_PKGS="bash            \
                     g++             \
                     gcc             \
                     make            \
                     git             \
                     python          \
                     nodejs          \
                     ruby-dev        \
                     ruby-io-console \
                     ruby-json       \
                     ruby-bundler    \
                     libffi-dev"

COPY . /opt/project
RUN apk update --no-cache && \
    apk add \
      $DISPOSABLE_PKGS \
      nginx            \
    && \
    cd /opt/project                                && \
    cp app/config/nginx.conf /etc/nginx/nginx.conf && \
    ./bin/build                                    && \
    rm -r /var/www                                 && \
    mv web /var/www                                && \
    cd /                                           && \
    apk del --purge $DISPOSABLE_PKGS               && \
    rm -rf /opt/project          \
           /tmp/*                \
           /var/cache/apk/*      \
           /usr/lib/node_modules \
           /root/.npm            \
           /root/.node-gyp       \
           /root/.cache/*

EXPOSE 80
CMD ["nginx"]
HEALTHCHECK --interval=15s --timeout=15s --retries=2 CMD wget -sq http://localhost/
