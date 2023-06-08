#!/bin/sh

set -e

# Change anything only on cron schedule
if [ "$GITHUB_EVENT_NAME" != "schedule" ]; then
  echo "Daily quote is the same, using existing dumps"
  curl -s https://napipatrik.hu/napipatrik --output napipatrik
  curl -s https://napipatrik.hu/napipatrik.id --output napipatrik.id
  curl -s https://napipatrik.hu/napipatrik.jpg --output napipatrik.jpg
  curl -s https://napipatrik.hu/rss.xml --output rss.xml
  exit 0
fi

echo "Dumping daily quote assets..."
node napituti.js > napipatrik
node napituti.js --index > napipatrik.id

npm i node-fetch@2.6.6 jimp
node napituti.js --image

npm i xml2js
node napituti.js --rss > rss.new.xml && mv rss.new.xml rss.xml
