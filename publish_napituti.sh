#!/bin/sh

set -e

# Check if there is a change since last run
#if [ $(cat napipatrik.id) = $(curl https://napipatrik.hu/napipatrik.id) ]; then
#  exit 0
#fi

npm i masto
node napituti.js --publish-mastodon
