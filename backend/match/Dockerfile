FROM node:12 as build
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn build

CMD ["node", "dist/main"]
