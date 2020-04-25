SHELL := /bin/bash

stack:
	docker-compose up -d --build mongodb-arbiter mongodb-secondary mongodb-primary elasticsearch consumer producer monstache frontend nginx

frontend:
	docker-compose up -d --build nginx frontend consumer elasticsearch

replica-set:
	docker-compose up -d --build mongodb-arbiter mongodb-secondary mongodb-primary

test:
	docker-compose up -d --build nginx producer

clean:
	docker-compose down
	docker container prune -f
	docker image prune -a -f
	docker network prune -f
