FROM node:12-alpine AS build
ARG GH_CI_TOKEN=$GH_CI_TOKEN
WORKDIR /app
COPY / /app
RUN apk add --no-cache git
RUN git config --global url."https://$GH_CI_TOKEN@github.com/".insteadOf "ssh://git@github.com/"
RUN npm install --only=production

FROM node:12-alpine
WORKDIR /app
COPY --from=build /app /app
