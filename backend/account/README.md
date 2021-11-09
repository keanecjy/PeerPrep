<p align="center">
  <img src="../../frontend/public/peerprep.svg" width="320" alt="PeerPrep Logo" />
</p>
<h1 align="center">PeerPrep Account Service</h1>
<p align="center">PeerPrep is a collaborative coding platform for you to practise coding interviews. <br/>Match with a partner and start coding with them now!</p>

---

This project was bootstrapped with [NestJS](https://nestjs.com/), a progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Account Microservice

Account microservice for PeerPrep's backend built using NestJS. 

### Features
* Provides JWT authentication functionality
* CRUD functionality for user profiles and interview history
* Provides email authentication for new user
* Provides email service for user to reset/change password

## Requirements
* Locally running PostgreSQL server
* Or PostgreSQL image if using docker (exposed on localhost)

## Installation

```bash
$ yarn install
```

## Setting up the environment variables
1. Rename the `.env.sample` file to `.env`
2. Add in your email credentials (used for sending verification mail to users)
    ```
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_ID=<your email>
    EMAIL_PASS=<your email password>
    ```
3. If necessary, update the `EMAIL_HOST` and `EMAIL_PORT` to fit the user case
4. Update the postgres connection url. 
    
    The format is as follows:
    ``` bash
    # DATABASE_URL=postgresql://[user[:password]@][netloc][:port][/dbname]
    DATABASE_URL=postgres://postgres:postgres@postgres:5432/postgres
    ```
## Running the app

* Server is exposed on localhost port 8080 by default
* Swagger API is available at `/api` endpoint
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
* Passport.js for authentication strategies
* NodeMailer for mailing functionality
* TypeORM for mapping relational database to objects
* Swagger for automated REST API documentation