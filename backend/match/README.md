<p align="center">
  <img src="../../frontend/build/peerprep.svg" width="320" alt="PeerPrep Logo" />
</p>
<h1 align="center">PeerPrep Match Service</h1>
<p align="center">PeerPrep is a collaborative coding platform for you to practise coding interviews. <br/>Match with a partner and start coding with them now!</p>

---

This project was bootstrapped with [NestJS](https://nestjs.com/), a progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Match Service

Match session microservice for PeerPrep's backend built using NestJS. 

### Features
* Match user by difficulty and language
* Support polling of match status
* Generate a unique session id for a pair of matched users

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

* Server is exposed on localhost port 8084 by default
* Swagger API is available at `/match/api` endpoint
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
* [Node Cache Manager](https://github.com/BryanDonovan/node-cache-manager#readme) for Redis communication
* Swagger for automated REST API documentation