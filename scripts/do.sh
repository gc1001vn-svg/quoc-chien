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
chay "check:san" "node scripts/check_san.mjs"
# `do:luat` do xem luat trong AGENTS.md co doi hanh vi khong — goi Gemini, ~4 phut (29/09:
# ca `npm run do` 7 phut 13 giay). Chi can khi luat hay bo de DOI so voi main; luat dung yen
# thi do lai ra dung so cu. Ep chay: DO_LUAT=1 npm run do.
if [ "${DO_LUAT:-}" = 1 ] || ! git diff --quiet origin/main -- AGENTS.md docs/BO_DE.md 2>/dev/null; then
  bo_qua_neu_thieu "do:luat" '[ -n "${GEMINI_API_KEY:-}" ]' \
    "node scripts/do_luat.mjs" "thieu GEMINI_API_KEY"
else
  bo_qua_neu_thieu "do:luat" 'false' "true" \
    "AGENTS.md va docs/BO_DE.md khong doi so voi main (ep chay: DO_LUAT=1)"
fi
# `luat:sau` chay luat bat bien qua >= 50 hat giong, van dai (vai phut); `npm test` o tren chi
# chay ban ngan. Chi can khi ma mo phong hay du lieu DOI so voi main. Ep chay: DO_LUAT_SAU=1
# (khong dung LUAT_SAU - bien do lam ca `npm test` chay ban sau). docs/LUAT_BAT_BIEN.md.
if [ "${DO_LUAT_SAU:-}" = 1 ] || ! git diff --quiet origin/main -- src/sim data 2>/dev/null; then
  chay "luat:sau" "npm run luat:sau"
else
  bo_qua_neu_thieu "luat:sau" 'false' "true" \
    "src/sim/ va data/ khong doi so voi main (ep chay: DO_LUAT_SAU=1)"
fi

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
