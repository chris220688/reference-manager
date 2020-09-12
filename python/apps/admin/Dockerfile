FROM python:3.7.7-slim-buster

WORKDIR /usr/src/apps/admin

COPY python/apps/admin /usr/src/apps/admin
COPY python/shared /usr/src/shared

RUN rm -rf *.log* && rm -rf .env
RUN pip install pipenv && pipenv install
