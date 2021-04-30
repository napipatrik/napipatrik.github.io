#!/bin/sh

if [ "$TRAVIS_EVENT_TYPE" != "cron" ]; then
  echo "This build is for cron only!"
  exit 0
fi

node napituti.js > napipatrik
node napituti.js --index > napipatrik.id

npm i request request-promise-native jimp
node napituti.js --image

npm i xml2js
node napituti.js --rss > rss.new.xml && mv rss.new.xml rss.xml

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"
git config --global push.default simple

git remote set-url origin https://${GH_TOKEN}@github.com/napipatrik/napipatrik.github.io.git > /dev/null 2>&1
git checkout develop
git add $TRAVIS_BUILD_DIR/napipatrik
git add $TRAVIS_BUILD_DIR/napipatrik.id
git add $TRAVIS_BUILD_DIR/napipatrik.jpg
git add $TRAVIS_BUILD_DIR/rss.xml
if [ "$(git log --format='%ae' 'HEAD^!')" = "travis@travis-ci.org" ] && [ "$(git log --format='%s' 'HEAD^!')" = "Rotate napipatrik" ]; then
  git commit --amend -m "Rotate napipatrik"
  git push --force
else
  git commit -m "Rotate napipatrik"
  git push
fi

