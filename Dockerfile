FROM node:alpine AS builder

WORKDIR /home/node/app

COPY . .

RUN npm install

ENV NODE_ENV=production

ENV PORT=3000


EXPOSE 3000

CMD ["node", "src/app.js"]
