# CS3219 PeerPrep v2.0
by Group 38

## Getting started

### Development
Dev environments is setup using docker images due to the ease of usage and the lack of requirement for load balancing

#### Prerequisites

1. [Docker](https://docs.docker.com/get-docker/)
1. [docker-compose](https://docs.docker.com/compose/install/)

#### Running 

From the root of this repository, run
```bash
$ docker-compose up
$ docker-compose up --build  # if force rebuilding is required
```

This will spin up both the frontend and backend in development mode (with support for live reload/ watch mode).

If you only need either frontend or specific backend microservice, you can select one of the line below
```bash
$ docker-compose up client
$ docker-compose up account # Will start up postgres as dependency
$ docker-compose up chat
$ docker-compose up interview
$ docker-compose up match
```

To shut down services after you are done, run
```bash
$ docker-compose down
```
**Important to update node modules changes*



To clear local postgres data, run the following to clear all volumes
```bash
$ docker-compose down -v
```

### Without Docker

Note that without Docker, you will need to have your own instance of Postgres running (for account service) and set the necessary environment variables when running the backend.

#### Prerequisites

1. Node
1. Yarn

#### Running

**Installation**
```bash
yarn install # in root folder
```

**Frontend**
```bash
yarn fe:start # in root folder
```

**Backend**
```bash
yarn be:start # in root folder
yarn be:chat:start # in root folder to start specific service
```
## Team members
- Keane
- Jin Hao
- Ashley
- Jum Ming
