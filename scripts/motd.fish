function fish_greeting
  if command -v curl >/dev/null 2>&1
    set DAILY_PATRIK (curl -s -m 5 'https://napipatrik.hu/napipatrik')
  else if command -v wget >/dev/null 2>&1
    set DAILY_PATRIK (wget -T 5 -qO- 'https://napipatrik.hu/napipatrik')
  else
    echo "Install either wget or curl!"
    exit 1
  end

  echo -e "  Napi Patrik:"
  if command -v cowsay >/dev/null 2>&1
    echo -e $DAILY_PATRIK | sed -e 's/^[ \t]*//' | cowsay
  else
    echo -e $DAILY_PATRIK | sed -e 's/^[ \t]*//'
    echo
  end
end
