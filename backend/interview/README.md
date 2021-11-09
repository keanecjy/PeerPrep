<p align="center">
  <img src="../../frontend/public/peerprep.svg" width="320" alt="PeerPrep Logo" />
</p>
<h1 align="center">PeerPrep Interview Service</h1>
<p align="center">PeerPrep is a collaborative coding platform for you to practise coding interviews. <br/>Match with a partner and start coding with them now!</p>

---

This project was bootstrapped with [NestJS](https://nestjs.com/), a progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Interview Session Microservice

Interview session microservice for PeerPrep's backend built using NestJS. 

### Features
* Handle live interview session through pub/sub functionality
* Store cache of session detail in Redis
* Retrieve random LeetCode question from the server based on language and difficulty
* Fallback LeetCode questions provided in the event of LeetCode downtime/server latency issue

## Requirements
* Redis

## Installation

```bash
$ yarn install
```

## Setting up the environment variables
1. Rename the `.env.sample` file to `.env`
2. Update the `REDIS_HOST` to point to your local redis instance
    ``` bash
    REDIS_HOST=redis
    REDIS_PORT=6379
    ```

## Running the app

* Server is exposed on localhost port 8083 by default
* Swagger API is available at `/interview/api` endpoint
```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Pushing to AWS server

```bash
# Update the image tag and AWS account in package.json as required

# Build and push
$ yarn run aws:build
```

## Technology
* Built using NestJS
* Socket.io for pub/sub functionality
* Axios as HTTP client
* [Node Cache Manager](https://github.com/BryanDonovan/node-cache-manager#readme) for Redis communication
* Swagger for automated REST API documentation