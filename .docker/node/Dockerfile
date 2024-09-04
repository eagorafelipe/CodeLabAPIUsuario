FROM node:20.11.1-alpine3.19 AS builder
ENV TZ=America/Sao_Paulo
WORKDIR /home/node/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx tsc -p tsconfig.json

FROM node:20.11.1-alpine3.19 AS runner
RUN apk add --no-cache bash
ENV NODE_ENV=development
ENV TZ=America/Sao_Paulo
WORKDIR /home/node/app
RUN npm i -g @nestjs/cli
USER node
COPY . .