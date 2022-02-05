#!/bin/bash

if [[ `id -u` -ne 0 ]]; then
  echo "Please run as root"
  exit 1
fi

cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null

cp scripts/napipatrik /usr/bin/napipatrik
cp scripts/motd.sh /etc/update-motd.d/99-napipatrik

cd - >/dev/null
