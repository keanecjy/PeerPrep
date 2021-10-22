run:
	docker-compose up

build:
	docker-compose up --build

rebuild:
	docker-compose down -v && docker compose up --build

stop:
	docker-compose down -v
