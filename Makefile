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

images:
	docker build -t findsources/frontend:latest --file react/apps/frontend/Dockerfile .
	docker build -t findsources/producer:latest --file python/apps/producer/Dockerfile .
	docker build -t findsources/consumer:latest --file python/apps/consumer/Dockerfile .
	docker build -t findsources/elasticsearch:latest --file elasticsearch/Dockerfile .
	docker build -t findsources/monstache:latest --file monstache/Dockerfile .

push-images:
	docker push findsources/frontend
	docker push findsources/producer
	docker push findsources/consumer
	docker push findsources/elasticsearch
	docker push findsources/monstache
