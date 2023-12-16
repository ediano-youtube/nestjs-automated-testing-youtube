FROM node:18-bookworm

RUN npm install -g npm@9 && npm i -g @nestjs/cli@10

USER node

WORKDIR /home/node/api

CMD [ "tail", "-f", "/dev/null" ]
