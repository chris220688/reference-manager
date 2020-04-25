SHELL := /bin/bash

stack:
	docker-compose up -d --build mongodb-primary mongodb-secondary mongodb-arbiter elasticsearch monstache frontend producer consumer nginx

frontend:
	docker-compose up -d --build frontend consumer elasticsearch nginx

replica-set:
	docker-compose up -d --build mongodb-arbiter mongodb-secondary mongodb-primary

clean:
	docker-compose down
	docker container prune -f
	docker image prune -a -f
	docker network prune -f
