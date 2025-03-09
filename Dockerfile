FROM node:alpine AS nodex

WORKDIR /home/node

RUN mkdir app/

COPY . app/

WORKDIR /home/node/app

RUN npm install

ENV version=production

USER 1000:1001