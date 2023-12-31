FROM node:21

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev

COPY ./dist .

CMD [ "node", "server.js" ]