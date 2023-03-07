FROM node:10 as build
WORKDIR /usr/src/app
RUN mkdir storage
COPY . .
RUN [ "npm", "install" ]
 
FROM gcr.io/distroless/nodejs-debian10
COPY --from=build /usr/src/app /app
WORKDIR /app
CMD ["."]
EXPOSE 3000