run:
	docker-compose up

build:
	docker-compose up --build

rebuild:
	docker-compose down -v && docker compose up --build

stop:
	docker-compose down -v

dockerclean:
	echo "remove exited containers and images"
	docker ps --filter status=dead --filter status=exited -aq | xargs  docker rm -v
	docker images --no-trunc | grep "<none>" | awk '{print $3}' | xargs  docker rmi
	echo "^ above errors are ok"
