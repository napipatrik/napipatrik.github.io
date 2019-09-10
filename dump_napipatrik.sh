#!/bin/sh

node napipatrik.js > napipatrik

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"
git config --global push.default simple

git remote set-url origin https://${GH_TOKEN}@github.com/napipatrik/napipatrik.github.io.git > /dev/null 2>&1
git checkout master
git add $TRAVIS_BUILD_DIR/napipatrik
git commit -m "Rotate napipatrik"
git push

