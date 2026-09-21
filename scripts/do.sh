#!/usr/bin/env bash
# Lenh do duy nhat cua du an. Chay duoc khong can hoi ai.
# Luat chung: cong-cu/thuoc_do.md cua repo ghi-nho. Nguong dat: docs/thuoc-do.md.
set -uo pipefail

dat=0
tong=0
bo_qua=0
ds_bo_qua=""

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

# Thuoc KHONG CHAY DUOC trong may nay (thieu khoa, thieu mang, thieu GPU).
# Khai ra, dung lo di: "Record skipped or unavailable checks honestly" —
# luat chep tu `Human-Agent-Society/reef` (Apache-2.0). Thuoc bo qua KHONG tinh
# vao mau so, de "11/11 dat" khong bao giờ la con so tu khen.
bo_qua_neu_thieu() {
  local ten="$1" dieu_kien="$2" lenh="$3"
  if eval "$dieu_kien" >/dev/null 2>&1; then
    chay "$ten" "$lenh"
  else
    printf '%-28s' "$ten"
    echo "BO QUA"
    bo_qua=$((bo_qua + 1))
    ds_bo_qua="${ds_bo_qua}  ${ten}: ${4}\n"
  fi
}

chay "lint"       "npm run lint"
chay "typecheck"  "npm run typecheck"
chay "test"       "npm test"
chay "build"      "npm run build"
chay "khoi:dong" "npm run khoi:dong"
chay "check:base" "npm run check:base"
chay "check:credits" "npm run check:credits"
chay "check:token" "npm run check:token"
chay "check:kehoach" "npm run check:kehoach"
chay "check:hook" "node scripts/check_hook.mjs"
chay "check:khoa" "npm run check:khoa"
chay "check:nguong" "node scripts/check_nguong.mjs"
chay "check:cap" "node scripts/check_cap.mjs"
chay "check:ten" "node scripts/check_ten.mjs"
chay "check:tran" "node scripts/check_tran.mjs"
bo_qua_neu_thieu "do:luat" '[ -n "${GEMINI_API_KEY:-}" ]' \
  "node scripts/do_luat.mjs" "thieu GEMINI_API_KEY"

rm -f /tmp/do_$$.log
if [ "$bo_qua" -gt 0 ]; then
  echo "Bỏ qua ${bo_qua} thước:"
  printf "%b" "$ds_bo_qua"
fi
if [ "$bo_qua" -gt 0 ]; then
  echo "Số đo: ${dat}/${tong} thước đạt · ${bo_qua} bỏ qua"
else
  echo "Số đo: ${dat}/${tong} thước đạt"
fi
[ "$dat" -eq "$tong" ]
