FROM node:20

WORKDIR /srv

ENV NODE_ENV=production

COPY ./package*.json /srv/
RUN cd /srv; npm install
COPY . /srv/

CMD ["npm", "run", "start"]
