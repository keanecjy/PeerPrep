FROM node:12
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .

ARG REDIS_HOST

ENV REDIS_HOST=${REDIS_HOST}

EXPOSE 8083
CMD ["yarn", "start:dev"]
