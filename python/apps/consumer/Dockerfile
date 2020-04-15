FROM python:3.7.7-slim-buster

WORKDIR /usr/src/apps/consumer

COPY python/apps/consumer .

RUN rm .env && pip install pipenv && pipenv install
