# Phase 12B — lên 6 nước + mẻ atlas cận đại (27/09/2026)

- **Anh chốt đầu phiên:** 12B = 6 nước + cận đại; cổ đại sang **12C**. Dò 27/09: kho-game không có bộ
  CC0 cổ đại, Poly Pizza vẫn `403` Cloudflare (đo lại, ghi chép từ 15/09 chưa lần nào tải được từ máy
  ảo). Giữa phiên anh chọn **Modular Buildings + City Kit Industrial** thay Retro Urban; cho sửa
  `ASSET_CREDITS.md`. Kế hoạch: `docs/ke-hoach/2026-09-27-phase-12b-6-nuoc-can-dai.md`.
- **Xong:** màu phe **tím, cam** — KayKit bốn màu dùng chung hình và một ảnh bảng màu, màu phe chỉ ở ô
  cột 1 hàng 0 (chia 8×4); `mau_cot` nhận thêm khoá `"cot,hang"` (kit khai `so_hang`) · thuật xếp atlas
  lấp khe kệ cũ và chồng dưới ô (mẻ `hex_1` về lại 1 trang mỗi cỡ, 84,4 %) · **6 nước, 36 tỉnh** trên lưới
  9×4 (6 × 5 + 6 trung lập, mỗi nước 26 ô xây) · `victory.json > van_hoa.ti_le` 1,5 → 0,9 · mẻ
  **`can_dai`** cho đời 3–4: khung `trung_co_2` + 14 nhà máy/mỏ/lò City Kit Industrial nhuộm gạch + 10
  nhà phố Modular Buildings đổi màu tường/mái.
- **Số đo:** `npm run do` 17/17 · **484 test** · `sim:van` ĐẠT — thống trị 3/5 (trước 2/5), khoa học
  2/5 (trước 3/5), văn hoá 5/5, ngoại giao 4/5 · `can_dai_2x` 2 trang (trang 0 83,1 %) · bản duyệt
  **27/09 23:09**, mở thẳng `?me=can_dai`.
- **Bẫy:** Retro Urban ghi toạ độ ảnh ngoài 0..1 (`vt 3 -11`) — máy nướng kẹp mép thì ra xám trơn;
  lặp ảnh thì ra khối pixel như chồng thùng hàng, lệch tông → loại, gỡ luôn phần lặp ảnh đã thêm.
  Văn hoá so với TỔNG các nước khác: thêm nước là mốc tự cao lên. Bảng màu Modular: cột 15 tường,
  1 mái, 7 cửa, 11 khung kính, 13 viền chân.
- **Chưa làm:** mẻ cổ đại (12C) · ngoại giao hạt 3 mất thủ đô giờ 14 (Tử Vân giáp thẳng đất ta, đánh
  sớm) · `hex_nuoc` là sprite không ai dùng (báo, chưa xoá).
