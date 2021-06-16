#!/bin/sh

node napituti.js > napipatrik
node napituti.js --index > napipatrik.id

npm i request request-promise-native jimp
node napituti.js --image

npm i xml2js
node napituti.js --rss > rss.new.xml && mv rss.new.xml rss.xml
