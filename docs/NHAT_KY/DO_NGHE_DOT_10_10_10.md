# Đồ nghề đợt 10, 10/10 (lần 43) — không đổi cách chơi

Kế hoạch anh duyệt 10/10 ("làm hết", 2 món): kho `ghi-nho` `docs/ke-hoach/2026-10-10-nang-cap-dot-10.md`. Nguồn: hai lỗi phiên
đợt 9 tự khai; agent Haiku đọc lại ~1.640 sự kiện, chép 90 lệnh Bash. Đầu phiên `npm run do`: 17 đạt, 2 bỏ qua.

- **Món 1 — hook chặn ống `| tail` nuốt mã lệnh đo:** `scripts/chan_vong_vo_han.mjs` (đồng bộ từ kho) chặn khi cuối ống là lệnh
  lọc/xem mà sau nó là `&& git push|commit` hay `$?`; có `pipefail` thì cho qua. Gốc: đợt 9 viết `do.sh 2>&1 | tail && git push`
  **3 lần**, lần cuối đẩy kho khi đỏ. Chạy lại 90 lệnh đợt 9: chặn đúng 3, chặn nhầm **0/87**. Kho 96 → 108 mẫu; chặn đúng lệnh thử
  thật trong phiên (`echo thu | tail -1 && git commit --dry-run`).
- **Món 2 — hook báo "xong" bỏ qua câu đang chờ:** `chờ`/`đợi` … `xong` cùng vế câu không tính; "Đã chờ CI chạy xong" vẫn chặn.
  Đổi chốt "không làm" đợt 8–9 — kho `quyet-dinh/2026-10-10-bao-xong-bo-qua-cau-dang-cho.md`. Kho 108 → **114/114** mẫu. Dùng thật:
  câu cuối lượt "Đang chờ CI và Deploy của `d122b76` chạy xong." — bản cũ chặn (mã 2), bản mới cho qua (mã 0).
- Gộp `main` `d122b76`, CI + Deploy xanh (chờ bằng `cho_ci.sh`).
