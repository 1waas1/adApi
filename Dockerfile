FROM node:14

WORKDIR /usr/src/app

COPY . .

RUN npm install && npm install nodemon

EXPOSE 8080

CMD ["node", "./src/rout"]