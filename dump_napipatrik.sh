#!/bin/sh

if [ "$TRAVIS_EVENT_TYPE" != "cron" ]; then
  echo "This build is for cron only!"
  exit 0
fi

node napipatrik.js > napipatrik
node napipatrik.js --index > napipatrik.id

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"
git config --global push.default simple

git remote set-url origin https://${GH_TOKEN}@github.com/napipatrik/napipatrik.github.io.git > /dev/null 2>&1
git checkout master
git add $TRAVIS_BUILD_DIR/napipatrik
git add $TRAVIS_BUILD_DIR/napipatrik.id
git commit -m "Rotate napipatrik"
git push

