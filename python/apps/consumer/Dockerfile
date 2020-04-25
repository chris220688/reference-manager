FROM python:3.7.7-slim-buster

WORKDIR /usr/src/apps/consumer

COPY python/apps/consumer /usr/src/apps/consumer
COPY python/shared /usr/src/shared

RUN rm .env && pip install pipenv && pipenv install
