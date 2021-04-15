FROM node:12-alpine AS build
ARG PRIVATE_SSH=$PRIVATE_SSH
WORKDIR /app
COPY / /app
RUN apk add --no-cache git openssh-client
RUN mkdir -p -m 0600 /root/.ssh
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts
RUN printf "%s" "$PRIVATE_SSH" > /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa
RUN npm i --only=production

RUN GRPC_HEALTH_PROBE_VERSION=v0.3.2 && \
    wget -qO/app/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64 && \
    chmod +x /app/grpc_health_probe

FROM node:12-alpine
WORKDIR /app
COPY --from=build /app /app
ADD https://github.com/krallin/tini/releases/download/v0.19.0/tini /tini
RUN chmod +x /tini
RUN npm rebuild
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENTRYPOINT ["/tini", "--"]
