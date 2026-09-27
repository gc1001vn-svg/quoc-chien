# Phase 12A — đường lên đời 6 + mẻ atlas tương lai (27/09/2026)

- **Anh chốt đầu phiên:** chia Phase 12 làm hai — 12A đời 6 + mẻ tương lai, 12B mẻ cổ đại + cận đại +
  **lên 6 nước**. Cho sửa `ASSET_CREDITS.md`. Kế hoạch: `docs/ke-hoach/2026-09-27-phase-12a-doi-6-tuong-lai.md`.
- **Xong:** 8 công nghệ đời 6 trong `data/tech.json` (Bán dẫn → Hợp hạch, giá 250–320) · đời 5 → 6
  cần 44 công nghệ + 400 nhà (`balance.json`) · `victory.json > khoa_hoc.doi` 5 → 6 · mẻ `tuong_lai`
  (`tools/me/tuong_lai.json`): chép khung `hien_dai`, thay 36 nhà/xưởng/mỏ/đồ vật bằng **Kenney Space
  Kit (CC0)**, đổi màu viền `metalRed` theo từng loại nhà · đời 6 dùng `tuong_lai` · `tai:asset` thêm `space-kit`.
- **Số đo:** `npm run do` 17/17 · 466 test (thêm 2: mọi đời trừ đời cuối có đường lên, mọi đời có
  công nghệ — cả hai đỏ trên dữ liệu cũ) · `sim:congnghe -- 320 6` ĐẠT, **đời 6 ở giờ 249** (đời 5 giờ
  147) · mẻ `tuong_lai_2x` 2 trang, trang 0 đầy 65,7 % (khớp số trang, `o_px`, `heSo`) · chụp
  `?me=tuong_lai`: 502 sprite, 1 lệnh vẽ.
- **Hệ quả cân bằng:** thắng khoa học từ giờ 190 → 265, `sim:van` khoa học **5/5 → 3/5** (2 hạt giống
  mất thủ đô ~giờ 201–216 trước khi xong đời 6). Vẫn ĐẠT. Chưa cân lại — ghi nợ.
- **Bẫy:** đá Space Kit dùng vật liệu `rock` + `rockTrack`, không có `rockDark` — tô thiếu thì mỏ
  vẫn cam. `xem_atlas.mjs` nhận tên file, không nhận đường dẫn (ghép vào `anh_chup/`).
  `structure_detailed` là khung rỗng — không hợp nhà dân, đổi `structure_closed`.
- **Chưa làm:** sprite người đời 6 vẫn là người hiện đại · cối xay (tuabin gió) giữ nguyên · đường
  vẫn hoạ tiết sỏi của mẻ hiện đại.
