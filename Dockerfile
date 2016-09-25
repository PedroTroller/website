FROM fabschurt/nginx
MAINTAINER Fabien Schurter <fabien@fabschurt.com>

ENV PKGS="bash            \
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
RUN apk update --no-cache                                      && \
    apk add $PKGS                                              && \
    cd /opt/project                                            && \
    cp app/config/nginx/app.conf /etc/nginx/servers.d/app.conf && \
    ./bin/build                                                && \
    rm -r /var/www                                             && \
    mv web /var/www                                            && \
    cd /                                                       && \
    apk del --purge $PKGS                                      && \
    rm -rf /opt/project          \
           /tmp/*                \
           /var/cache/apk/*      \
           /usr/lib/node_modules \
           /root/.npm            \
           /root/.node-gyp       \
           /root/.cache/*

HEALTHCHECK --interval=15s --timeout=15s --retries=2 CMD wget -sq http://localhost/
