FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production=true

COPY . .

EXPOSE 3000
CMD sh ./wait-for-db.sh