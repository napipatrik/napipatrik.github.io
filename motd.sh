#!/bin/bash

if command -v curl >/dev/null 2>&1; then
  LIST_JS=`curl -s 'https://napipatrik.hu/assets/js/patrikok.js'`
elif command -v wget >/dev/null 2>&1; then
  LIST_JS=`wget -qO- 'https://napipatrik.hu/assets/js/patrikok.js'`
else
  echo "Install either wget or curl!"
  exit 1
fi

IFS=$'\n'
LIST=($(echo "$LIST_JS" | egrep "^\s*'[^']+',?" | sed "s/[',]//g"))
OFFSET=$(($(($((`date +%Y` - 1970)) * 365  + `date +%j`)) % ${#LIST[@]} ))
DAILY_PATRIK=${LIST[$OFFSET]}

echo -e "  Napi Patrik:"
echo -e $DAILY_PATRIK | sed -e 's/^[ \t]*//'

