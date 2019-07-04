#!/bin/bash

PATH="$PATH:/usr/games"

if command -v curl >/dev/null 2>&1; then
  LIST_JS=`curl -s -m 5 'https://napipatrik.hu/assets/js/patrikok.js'`
elif command -v wget >/dev/null 2>&1; then
  LIST_JS=`wget -T 5 -qO- 'https://napipatrik.hu/assets/js/patrikok.js'`
else
  echo "Install either wget or curl!"
  exit 1
fi

IFS=$'\n'
LIST=($(echo "$LIST_JS" | egrep "^\s*'[^']+',?" | sed "s/[',]//g"))
OFFSET=$(($(($((`date +%Y` - 1970)) * 365  + `date +%j`)) % ${#LIST[@]} ))
DAILY_PATRIK=${LIST[$OFFSET]}


echo -e "  Napi Patrik:"
if command -v cowsay >/dev/null 2>&1; then
  echo -e $DAILY_PATRIK | sed -e 's/^[ \t]*//' | cowsay
else
  echo -e $DAILY_PATRIK | sed -e 's/^[ \t]*//'
  echo
fi

