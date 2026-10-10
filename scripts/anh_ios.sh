#!/usr/bin/env bash
# Chup game trong Safari cua iPhone GIA LAP, tren may Mac cua GitHub — `.github/workflows/anh-ios.yml` goi.
# Ke hoach: kho ghi-nho `docs/ke-hoach/2026-10-09-nang-cap-dot-7.md` mon 1. Fps trong gia lap la cua GPU
# Mac, khong phai iPhone — fps that van doi anh do.
#
# Dung (can `dist/` da build): bash scripts/anh_ios.sh "<duong them, vd ?gio=23>" ["iPhone 16 Pro"]
# Ra: anh_ios/ios.png · anh_ios/trang_thai.txt (may nao, game bao gi) · anh_ios/may_chu.log
set -euo pipefail
DUONG="${1:-}"
MAY="${2:-iPhone 16 Pro}"
CHO_GIAY="${CHO_GIAY:-180}"
RA=anh_ios
mkdir -p "$RA" www
ln -sfn "$PWD/dist" www/quoc-chien

# python ghi moi GET ra stderr, ke ca `__da-ve?<trang thai>` game gui khi khung dau len man (`?kiem=1`,
# `src/main.ts`) — Safari gia lap khong cho may doc trang, nen day la cach duy nhat biet game da ve.
python3 -m http.server 4173 --bind 127.0.0.1 --directory www 2> "$RA/may_chu.log" &
MAY_CHU=$!
trap 'kill $MAY_CHU 2>/dev/null || true' EXIT

# Dung ten may neu co; khong thi iPhone cua ban iOS moi nhat.
read -r UDID TEN < <(xcrun simctl list devices available -j | python3 -c '
import json, re, sys
ten = sys.argv[1]
ban = lambda rt: [int(x) for x in re.findall(r"\d+", rt)]
ds = [d for rt, v in sorted(json.load(sys.stdin)["devices"].items(), key=lambda kv: ban(kv[0]))
      if "iOS" in rt for d in v if d["name"].startswith("iPhone")]
d = ([x for x in ds if x["name"] == ten] or ds)[-1]
print(d["udid"], d["name"])' "$MAY")
xcrun simctl boot "$UDID" 2>/dev/null || true   # da bat san thi bao loi — bo qua
xcrun simctl bootstatus "$UDID" -b
# Safari mo lan dau hien bang goi y che noi dung (anh 09/10), simctl khong bam duoc nut dong: mo nhap mot
# lan cho no hien, tat Safari, roi moi mo game. shortcut: chua chac bang khong hien lai, hong thi can cong cu bam (idb).
# May vua bat, man hinh chinh chua dung xong thi openurl qua han 28 s (run 38022434453): thu lai, het luot thi bo qua.
for _ in 1 2 3 4; do xcrun simctl openurl "$UDID" "http://127.0.0.1:4173/" && break; sleep 10; done
sleep 15
xcrun simctl terminate "$UDID" com.apple.mobilesafari || true

case "$DUONG" in *\?*) URL="http://127.0.0.1:4173/quoc-chien/${DUONG}&kiem=1" ;;
                  *) URL="http://127.0.0.1:4173/quoc-chien/${DUONG}?kiem=1" ;; esac
xcrun simctl openurl "$UDID" "$URL"

BAO="KHONG CO tin bao sau ${CHO_GIAY} giay — game chua ve, hay man den"
for _ in $(seq 1 "$CHO_GIAY"); do
  if grep -q '__da-ve?' "$RA/may_chu.log"; then
    BAO=$(grep -o '__da-ve?[^ ]*' "$RA/may_chu.log" | head -1 \
      | python3 -c 'import sys, urllib.parse; print(urllib.parse.unquote(sys.stdin.read().strip().split("?", 1)[1]))')
    break
  fi
  sleep 1
done
sleep "${CHO_THEM:-2}"   # khung da ve con phai len man; khoi, chim can lau hon thi dat CHO_THEM
xcrun simctl io "$UDID" screenshot "$RA/ios.png"
printf 'May: %s\nURL: %s\nGame bao: %s\n' "$TEN" "$URL" "$BAO" | tee "$RA/trang_thai.txt"
