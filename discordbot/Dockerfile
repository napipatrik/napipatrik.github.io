FROM node:14

WORKDIR /srv

ENV NODE_ENV=production

COPY . /srv
RUN cd /srv; npm install

CMD ["npm", "run", "start"]
