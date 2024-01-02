FROM node:21

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev

LABEL org.opencontainers.image.source="https://github.com/dhartung/paper-image-server"

COPY ./dist .

CMD [ "node", "/usr/src/app/index.js" ]