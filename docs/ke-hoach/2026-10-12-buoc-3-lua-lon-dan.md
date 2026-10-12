# Bước 3 — Ruộng lúa lớn dần · 12/10/2026 · ANH DUYỆT 12/10

Kế hoạch mẹ (anh duyệt 04/10): `docs/ke-hoach/2026-10-04-moi-thu-tung-buoc.md` việc 3.
Việc: ruộng cổ đại đi một vòng cày → mạ → lúa xanh → lúa vàng → gặt, rồi lặp lại.
Xong là khi: bảng ảnh các chặng + clip gửi anh; lệnh vẽ vẫn 3; `sim:van` y hệt; anh đo iPhone ≥ 58 fps.

## Hiện trạng (đo 12/10)
- Một mẻ ruộng chỉ 70 nhịp = 0,7 s ở 10× (mở màn) → lớn theo từng mẻ thì nhấp nháy.
- Shader sprite không nhuộm được từng hình (chỉ màu tối chung + chớp sáng).
- Mẻ cổ đại đã có `ruong_trong`, `ruong_lua_1..3` (luống gieo ⅓ → ⅔ → đủ, cùng màu vàng). Mẻ khác chỉ có `ruong`.
- `VeCanh.ts` 298/300 dòng → logic vào file mới `src/render/LuaLon.ts`.

## Anh chọn 12/10
- **Câu 1 — một mùa ~20 s ở 10×** (2.000 nhịp): mỗi ruộng lệch pha theo ô; kho đầy (`nhipTac() > 0`) thì đứng ở
  lúa vàng chờ gặt — **chỉ áp lúc tới gặt**: đo 12/10 mỗi ruộng bật/tắt tắc 30–135 lần một giờ game, áp cả mùa thì nhảy hình. Chỉ đổi hình, sim không đổi, số cân bằng giữ nguyên.
- **Câu 2 — nướng thêm 2 hình** vào mẻ cổ đại: `ruong_ma` (xanh nhạt), `ruong_lua_xanh` (xanh đậm) = `ruong_lua_3`
  đổi `mau` lớp lúa. Atlas 2× trang 2 còn chỗ (3,5 %).

## Làm
1. `data/tung_buoc.json` mục `lua`: chu kỳ nhịp, các chặng (tới phần nào của mùa → sprite nào), sprite khi tắc.
   Gặt = vàng đủ → ⅔ → ⅓ → trống (dùng lại `ruong_lua_2`, `_1`).
2. `src/render/LuaLon.ts` thuần số (test được): phần mùa theo nhịp + lệch pha, chọn sprite; atlas thiếu chặng nào
   thì vẽ `ruong` như cũ (mẻ khác, lúc đổi mẻ). `?tat=lua` tắt.
3. `VeCanh.veLopVat` gọi một hàm, không thêm dòng logic.
4. Nướng lại `co_dai` (2 hình mới), đo atlas: số trang không đổi.

## Đo
- `npm run do`; test mới `tests/LuaLon.test.ts`: dừng hình thì đứng chặng, cùng nhịp cùng hình, tua thì đi vòng.
- Bảng ảnh các chặng (`chup:man`), clip một mùa (`npm run quay`).

## Rủi ro
- Hình xanh nhuộm `mau` ra xỉn → chỉnh số `mau`, nướng lại (chỉ tốn thời gian máy).
- Lùi: `git revert`; tắt tạm `?tat=lua`.
