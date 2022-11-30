#!/bin/sh

set -e

node napituti.js > napipatrik
node napituti.js --index > napipatrik.id

npm i node-fetch@2.6.6 jimp
node napituti.js --image

npm i xml2js
node napituti.js --rss > rss.new.xml && mv rss.new.xml rss.xml

npm i twitter-api-v2
node napituti.js --publish-twitter
