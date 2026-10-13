#!/bin/sh
# Render ทุกแบนเนอร์เป็น PNG ใน out/  (ใช้ Chromium headless)
cd "$(dirname "$0")"
C=${CHROME:-/opt/pw-browsers/chromium}
for x in "a11 1080 1080 1" "a45 1080 1350 1" "a169 1440 810 1.3333334" \
         "b11 1080 1080 1" "b45 1080 1350 1" "b169 1440 810 1.3333334" \
         "c11 1080 1080 1" "c45 1080 1350 1" "c169 1440 810 1.3333334"; do
  set -- $x
  $C --headless=new --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=3000 \
     --force-device-scale-factor=$4 --window-size=$2,$(($3+300)) --screenshot="$PWD/out/$1.png" "file://$PWD/index.html#$1" 2>/dev/null
  python3 -c "
from PIL import Image
im=Image.open('out/$1.png'); s=$4
im.crop((0,0,round($2*s),round($3*s))).save('out/$1.png')"
done
