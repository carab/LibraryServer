FROM node

ADD . /src
WORKDIR /src

RUN npm install

EXPOSE 8888

CMD [ "node", "app.js" ]
