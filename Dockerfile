FROM node:12-alpine AS build
WORKDIR /app
COPY / /app
RUN apk add --no-cache git
RUN git config --global url."https://nnqq:$GH_CI_TOKEN@github.com/".insteadOf "https://github.com/"
RUN npm install --only=production

FROM node:12-alpine
WORKDIR /app
COPY --from=build /app/node_modules /app/node_modules
