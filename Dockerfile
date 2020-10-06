FROM node:12-alpine AS build
ARG GH_CI_TOKEN=$GH_CI_TOKEN
WORKDIR /app
COPY / /app
RUN apk add --no-cache git
RUN git config --global url."https://nnqq:$GH_CI_TOKEN@github.com/".insteadOf "ssh://git@github.com/"
RUN npm install --only=production

RUN GRPC_HEALTH_PROBE_VERSION=v0.3.2 && \
    wget -qO/app/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64 && \
    chmod +x /app/grpc_health_probe

FROM node:12-alpine
WORKDIR /app
COPY --from=build /app /app
