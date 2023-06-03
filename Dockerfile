# syntax=docker/dockerfile:1
FROM node:12-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "dist/bin/www"]