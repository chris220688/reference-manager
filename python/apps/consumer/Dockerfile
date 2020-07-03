FROM python:3.7.7-slim-buster

WORKDIR /usr/src/apps/consumer

COPY python/apps/consumer /usr/src/apps/consumer
COPY python/shared /usr/src/shared

RUN rm -rf *.log* && rm -rf .env
RUN pip install pipenv && pipenv install
