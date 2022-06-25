FROM node:lts

# amplify CLI
RUN npm install -g @aws-amplify/cli

ENV APP_DIR /app/

RUN mkdir -p /app
WORKDIR $APP_DIR
COPY package.json $APP_DIR/package.json
RUN npm install
COPY . $APP_DIR
