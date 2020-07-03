FROM python:3.7.7-slim-buster

WORKDIR /usr/src/apps/producer

COPY python/apps/producer /usr/src/apps/producer
COPY python/shared /usr/src/shared

ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

RUN rm -rf *.log* && rm -rf .env
RUN pip install pipenv && pipenv install
