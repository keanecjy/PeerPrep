<p align="center">
  <img src="../../frontend/public/peerprep.svg" width="320" alt="PeerPrep Logo" />
</p>
<h1 align="center">PeerPrep Chat Service</h1>
<p align="center">PeerPrep is a collaborative coding platform for you to practise coding interviews. <br/>Match with a partner and start coding with them now!</p>

---

This project was bootstrapped with [NestJS](https://nestjs.com/), a progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Chat Microservice

Chat microservice for PeerPrep's backend built using NestJS. 

### Features
* Provides pub/sub functionality for live chat

## Installation

```bash
$ yarn install
```

## Running the app
* Server is exposed on localhost port 8082 by default
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