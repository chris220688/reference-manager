FROM node:13.12.0-alpine AS builder
WORKDIR /app
COPY react/apps/frontend .
RUN yarn run build

FROM node:13.12.0-alpine
RUN yarn global add serve
WORKDIR /app
COPY --from=builder /app/build .
CMD ["serve", "-p", "3000", "-s", "."]