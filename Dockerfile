FROM node:21

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev

LABEL org.opencontainers.image.source="https://github.com/dhartung/paper-image-server"

COPY ./dist .
# TODO: We con't want this file inside our docker container
# keep it for now for fast poc deployment
COPY rooms.yaml .

CMD [ "node", "/usr/src/app/index.js" ]