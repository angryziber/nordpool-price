FROM node:14-alpine

WORKDIR /app

RUN adduser -S app

COPY *.json ./
RUN npm ci

COPY . ./
RUN npm test

USER app
CMD node api
EXPOSE 7070
