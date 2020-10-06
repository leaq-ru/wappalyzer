FROM node:12-alpine AS build
WORKDIR /app
COPY / /app
RUN apk add --no-cache git openssh-client
RUN git config --global url."https://nnqq:$GH_CI_TOKEN@github.com/".insteadOf "https://github.com/"
RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts
RUN --mount=type=ssh,id=github npm install--only=production

FROM node:12-alpine
WORKDIR /app
COPY --from=build /app /app
