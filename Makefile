SHELL := /bin/bash

stack:
	docker-compose up -d --build mongodb-arbiter mongodb-secondary mongodb-primary elasticsearch consumer producer monstache

clean:
	docker-compose down
	docker container prune -f
	docker image prune -a -f
	docker network prune -f
