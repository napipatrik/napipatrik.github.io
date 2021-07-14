#!/bin/bash

PATH="$PATH:/usr/games"

if command -v curl >/dev/null 2>&1; then
  DAILY_PATRIK=`curl -s -m 5 'https://napipatrik.hu/napipatrik'`
elif command -v wget >/dev/null 2>&1; then
  DAILY_PATRIK=`wget -T 5 -qO- 'https://napipatrik.hu/napipatrik'`
else
  echo "Install either wget or curl!"
  exit 1
fi


echo -e "  Napi Patrik:"
if command -v cowsay >/dev/null 2>&1; then
  echo -e $DAILY_PATRIK | sed -e 's/^[ \t]*//' | cowsay
else
  echo -e $DAILY_PATRIK | sed -e 's/^[ \t]*//'
  echo
fi

