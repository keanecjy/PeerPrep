# Development only
FROM node:12
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .

CMD ["yarn", "start:dev"]