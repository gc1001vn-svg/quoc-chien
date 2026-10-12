# Bước 3 — Ruộng lúa lớn dần (12/10/2026, lần 47)

Kế hoạch anh duyệt 12/10: `docs/ke-hoach/2026-10-12-buoc-3-lua-lon-dan.md` (mẹ: `2026-10-04-moi-thu-tung-buoc.md` việc 3).

- **Làm:** `src/render/LuaLon.ts` + `data/tung_buoc.json` mục `lua`. Một mùa 2.000 nhịp (~20 s ở 10×), mỗi ruộng lệch pha
  theo ô: cày trống → mạ → lúa xanh → lúa vàng → gặt (vàng → ⅔ → ⅓ → trống). Chỉ đổi tên sprite — sim không đổi.
  `?tat=lua` tắt, `?luaTien=<0..1>` ghim chặng để chụp. `VeCanh.ts` chỉ đổi một lời gọi (299/300 dòng).
- **Tắc kho chỉ áp lúc gặt:** đo 12/10 (thành phố mở màn, không thống đốc, 1 giờ game) mỗi ruộng bật/tắt `nhipTac` 31–135
  lần, tắc 13–79 % thời gian. Áp cả mùa (như câu anh chọn) thì ruộng nhảy hình vài giây một lần → chỉ giữ lúa vàng từ
  `gatTu` 0,86.
- **CHƯA NƯỚNG `ruong_ma`, `ruong_lua_xanh`:** Google Drive "Quota exceeded" — 256/256 file OBJ, cả bản glTF, của
  `ultimatefantasyrts` đều là trang HTML lỗi (giống 05/10). Mẻ chỉ cần 4 model: `Farm_Dirt_Level1`,
  `Farm_FirstAge_Level{1,2,3}_Wheat`. Thiếu hình thì `LuaLon` vẽ `ruong` (vàng) — hiện vòng là cày → vàng → gặt.
  `tools/me/co_dai.json` đã khai sẵn hai hình (`mau` lớp lúa `[1.3,2.1,0.75]`, `[0.8,1.6,0.5]` — chưa nhìn thử).
- **Đo:** `npm run do` xanh (gồm `luat:sau` vì `data/` đổi) · test +6 (`tests/LuaLon.test.ts`) · lệnh vẽ vẫn 2 trên ảnh.
  Ảnh 4 chặng: `anh_chup/lua_bang.png` (không lên git).
- **Chưa:** nướng khi Drive mở lại; anh đo iPhone ≥ 58 fps.
- **Anh đo 12/10:** 59 fps, "ruộng ok" (bản chưa có 2 hình xanh).
