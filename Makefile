run:
	docker-compose up

run_detach:
	docker-compose up -d

build:
	docker-compose up --build

rebuild:
	docker-compose down -v && docker compose up --build

stop:
	docker-compose down -v

dependencyclean:
	docker-compose down
	docker volume ls | grep "peerprep_.*_node_modules" | awk '{print $2}' | xargs docker volume rm

dockerclean:
	echo "remove exited containers and images"
	docker ps --filter status=dead --filter status=exited -aq | xargs  docker rm -v
	docker images --no-trunc | grep "<none>" | awk '{print $3}' | xargs  docker rmi
	echo "^ above errors are ok"
