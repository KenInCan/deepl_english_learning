FROM node:lts-alpine

ENV APP_DIR /app

RUN mkdir -p /app
WORKDIR $APP_DIR
COPY package.json ./package.json
RUN npm install -g npm && npm install
COPY . .
