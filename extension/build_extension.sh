#!/bin/bash

sed -i "s/\([0-9.]\+\)\.[0-9]\+/\1\.$(fgrep "'," patrikok.js | wc -l)/g" manifest.json
zip -r extension.zip fonts/ *.png *.jpg *.css *.json *.js *.html
