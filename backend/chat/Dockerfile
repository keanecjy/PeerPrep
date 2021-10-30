FROM node:12
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .

EXPOSE 8082
CMD ["yarn", "start:dev"]
