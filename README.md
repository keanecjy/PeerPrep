<p align="center">
  <img src="frontend/build/peerprep.svg" width="320" alt="PeerPrep Logo" />
</p>
<h1 align="center">PeerPrep v2.0</h1>
<p align="center">PeerPrep is a collaborative coding platform for you to practise coding interviews. <br/>Match with a partner and start coding with them now!</p>

---

This project was developed under CS3219 module by [Group 38](#development-team)

Table of Contents
===
- [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Project Report](#project-report)
  - [Development](#development)
      - [Prerequisites](#prerequisites)
      - [Setting up the env secrets](#setting-up-the-env-secrets)
      - [Running](#running)
      - [Ports](#ports)
      - [Without Docker](#without-docker)
  - [Deployment](#deployment)
  - [Some helpful scripts](#some-helpful-scripts)
    - [Make commands](#make-commands)
    - [Yarn commands](#yarn-commands)
  - [Development Team](#development-team)


## Introduction
This project features the full-stack project which uses a microservice architecure for backend and React for frontend. PeerPrep is a web application that helps students better prepare themselves for technical whiteboard interviews by providing them with a platform to practise coding questions together with their peers.

The backend consists of 4 microservices:
1. Account Service
2. Matching Service
3. Chat Service
4. Interview Session Service

## Project Report
View our Project Report [here](./38-FinalReport-1.pdf)

## Development
This section specifies instructions to run the application locally and test the integration between each services.

For our development environment, we use `docker-compose` to build and run the different services, as well as download the required images such as Postgres and Redis. The build configuration is defined in the `docker-compose.yml` file

This workflow provides support for hot-reload so that changes are reflected almost instantenously

#### Prerequisites

1. [Docker](https://docs.docker.com/get-docker/)
1. [docker-compose](https://docs.docker.com/compose/install/)

#### Setting up the env secrets
For local development, you will have to add in your own email credentials to support email sending features

1. Navigate to `backend/account`
2. Rename the `.env.sample` to `.env`
3. Update the first 4 environment secrets to connect with your email server using your credentials
    ```
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_ID=<your gmail password>
    EMAIL_PASS=<your gmail password>
    ```
    *The other environment variables below can be ignored, as they are defined in the `docker-compose.yml` file*

#### Running 

From the root of this repository, run
```bash
$ docker-compose up
$ # or
$ docker-compose up --build  # to detect changes in dependencies and rebuild image
```

This will spin up both the frontend and backend in development mode (with support for live reload/ watch mode).

If you only need either frontend or specific backend microservice, you can select one of the line below
```bash
$ docker-compose up client
$ docker-compose up account
$ docker-compose up chat
$ docker-compose up interview
$ docker-compose up match
```

To shut down services after you are done, run
```bash
$ # Important for updating node modules changes
$ docker-compose down
```


To clear local postgres data, run the following to clear all volumes
```bash
$ docker-compose down -v
```

#### Ports

| Service           	| Port 	|
|-------------------	|------	|
| Frontend Client   	| 3000 	|
| Backend Server    	| 3001 	|
| Account Service   	| 8081 	|
| Chat Service      	| 8082 	|
| Interview Service 	| 8083 	|
| Match Service     	| 8084 	|
| Postgres Service  	| 5432 	|
| Redis Service     	| 6379 	|

To simulate the Ingress routing in actual deployment, we use Nginx to do route requests to the appropriate microservice

The Nginx routing is exposed on port **3031**

#### Without Docker

If you choose to run the application without Docker support, you can refer to the README file in each individual microservice.

Note that you will need to have your own instance of Postgres or Redis running locally and also set up the necessary environment variables. More instructions is located in indivudal README

## Deployment
For our deployment build, we uses kubernetes to orchestrate our docker images. Kubernetes provide support for autoscaling, metrics and pod management. 

We deploy our kubernetes cluster onto AWS EKS. For more information refer to the [README](./k8s/README.md) file in `k8s` folder.

## Some helpful scripts
### Make commands
The make commands defined in Makefile help simplify any complex docker-compose command

*This commands should be run in the root folder*
```bash
# Start the docker network
make start

# Start the docker network in detach mode
make run_detach

# Start the docker network and rebuild if changes are detected
make build

# Tear down the network, remove all volumes then bring up the network
make rebuild

# Tear down the network & remove all volumes
make stop

# Tear down the network & only remove node_modules volume (without deleting psql data)
make dependencyclean

# Remove all images and exited containers
make dockerclean
```

### Yarn commands
We use yarn workspaces to reduce installation of duplicated dependency. Here we provide some convenient yarn commands to run throughout the whole repo.

*This commands should be run in the root folder*
```bash
# Dependency installation for all services
yarn install

# Start frontend (with live reload)
yarn fe:start

# Start whole backend (with live reload & no nginx routing)
yarn be:start

# Start specific backend microservice
yarn be:chat:start

# Prettify all files in workspaces
yarn lint

# Login to AWS
yarn aws:login

# Build and update all backend microservices image to AWS ECR
yarn aws:build:all
```
## Development Team
- [Keane](https://github.com/keanecjy)
- [Jin Hao](https://github.com/JinHao-L)
- [Ashley](https://github.com/Ashley-Lau)
- [Jun Ming](https://github.com/OhJunMing)
