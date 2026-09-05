#!/usr/bin/env bash
# Lenh do duy nhat cua du an. Chay duoc khong can hoi ai.
# Luat chung: cong-cu/thuoc_do.md cua repo ghi-nho. Nguong dat: docs/thuoc-do.md.
set -uo pipefail

dat=0
tong=0

chay() {
  tong=$((tong + 1))
  printf '%-28s' "$1"
  if eval "$2" >/tmp/do_$$.log 2>&1; then
    echo "DAT"
    dat=$((dat + 1))
  else
    echo "HONG"
    tail -20 /tmp/do_$$.log | sed 's/^/    /'
  fi
}

chay "lint"       "npm run lint"
chay "typecheck"  "npm run typecheck"
chay "test"       "npm test"
chay "build"      "npm run build"
chay "check:base" "npm run check:base"
chay "check:credits" "npm run check:credits"

rm -f /tmp/do_$$.log
echo "Số đo: ${dat}/${tong} thước đạt"
[ "$dat" -eq "$tong" ]
