FROM node:22-alpine

WORKDIR /app

RUN adduser -S app
ENV TZ=Europe/Tallinn

COPY *.json ./
RUN npm ci

COPY . ./

USER app
RUN npm test

CMD node api
EXPOSE 7070
