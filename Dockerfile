FROM node:24-alpine

WORKDIR /app

RUN adduser -S app
ENV TZ=Europe/Tallinn

COPY *.json ./
RUN npm ci

COPY . ./

RUN npm run build

USER app
RUN npm test

CMD node api
EXPOSE 7070
