FROM node:16-alpine

WORKDIR /app

RUN adduser -S app

COPY *.json ./
RUN npm ci

COPY . ./

USER app
RUN npm test

CMD node api
EXPOSE 7070
