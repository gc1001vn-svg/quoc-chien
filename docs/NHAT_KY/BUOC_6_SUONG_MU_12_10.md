# Bước 6 — Sương mù bản đồ tỉnh (12/10/2026, lần 50)

Kế hoạch anh duyệt 12/10: `docs/ke-hoach/2026-10-12-buoc-6-suong-mu.md`. Anh chọn: bản đồ tỉnh · đất nhạt, giấu hết · tan dần ~2 s.

- **Dò trước:** thành phố kín nhà từ đầu ván nên sương chỉ hợp bản đồ tỉnh. Nước ta (Hoả Nguyên) thấy 9/36 tỉnh lúc đầu
  (5 của mình + 4 giáp); nước khác 9–14.
- **Làm:** `VeBanDo.ts` — `tinhThay` (tỉnh của ta + giáp, dùng `tinhKe` có sẵn), dưới sương chỉ vẽ nền bằng `suong.nen`
  làm sáng `suong.sang`; tỉnh mới vào tầm nhìn tan trong `tanGiay` 2 s (nền sẫm dần, vật/nhà/cờ mọc từ chân). Khung đầu
  thấy ngay, không tan. `MapScene.ts` đẩy tên tỉnh dưới sương ra ngoài khung (`NhanTinh` tự ẩn). Sim không đổi. `?tat=suong`.
- **Chọn màu:** làm sáng ô cỏ (`hex_co`) 0,35 ra vàng chanh chói như tuyết; ô nước (`hex_nuoc`) 0,3 ra xanh như biển băng;
  ô nước 0,45 ra trắng phớt xanh như mây — chọn cái này. Bộ hình bản đồ không có ô xám.
- **Đo:** `npm run do` xanh · test +2 (`tests/XayTinh.test.ts`) · lệnh vẽ vẫn 1, 299 sprite (không sương 361).
  Ảnh: `anh_chup/suong_co.png`, `suong_tat.png`.
- **Chưa kiểm bằng ảnh:** lúc tan khi chiếm tỉnh (chỉ test số). Bấm ô dưới sương vẫn mở bảng tỉnh. Anh chưa đo iPhone.
- **Anh đo 12/10:** 60 fps. Chưa xem sương tan: đầu ván "hết quân" — quân mua bằng vàng mỗi giờ game (`TheGioi.gioTiep`), giờ 0 chưa có. Dặn anh qua giờ 1 rồi đánh tỉnh trung lập giáp ranh (Cửu Khê).
