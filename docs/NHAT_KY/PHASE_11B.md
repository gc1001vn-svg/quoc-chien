# Phase 11B — nối thế giới vào màn hình (27/09/2026)

- **Anh chốt đầu phiên:** duyệt kế hoạch ("làm đi") · chọn thêm nút **200× và 500×** để chơi hết
  một ván. Kế hoạch: `docs/ke-hoach/2026-09-27-phase-11b-man-the-gioi.md`.
- **Xong:** `main.ts` dựng MỘT `TheGioi` cho hai màn (`ui/DungTheGioi.ts`). Thành phố chốt giờ →
  thế giới qua một giờ (`ui/TheGioiThanhPho.ts`, gắn sau `moDau()` như `sim:van`). Thanh số cả hai
  màn · bảng 🤝 Ngoại giao (buôn bán / đàm phán / đe doạ / tuyên chiến + đầu tư văn hoá) · nút
  ⚔ Tấn công trong bảng tỉnh (có % thắng) · thẻ bất ổn dùng chung tấm chắn thẻ quyết định (dừng sim)
  · màn thắng/thua. Bản đồ tỉnh (màu, cờ, nhãn, quyền xây) đọc chủ tỉnh từ thế giới.
- **Tách cho dưới 300 dòng:** `TheGioi.ts` 299→290 (`HanhDong.ts`, `lyDoKhongDanh()`), `CityScene.ts`
  298→286 (`render/ThamSoCanh.ts`).
- **Số đo:** `npm run do` 16/16 (`do:luat` bỏ qua — không đụng `AGENTS.md`) · 456 test · `sim:van`
  y số cũ sau khi tách · test `HienTheGioi` 14 ca bắt **7/7** lỗi cài thử · Chromium 393 px: 500× ra
  ~7,5 s/giờ game; thẻ bất ổn hiện đúng (ép ngưỡng 3 trong bản build tạm, không commit).
- **Lệch kế hoạch:** Jules quá trần 30 phút → Claude tự viết test · bỏ khoá "Đã liên minh" ở nút
  đàm phán (`tg.damPhan` vẫn nhận, nút phải khớp hành động) · kết quả đánh tỉnh hiện trong bảng tỉnh,
  không vào `NhatKySuKien` (bảng đó chỉ ở màn thành phố).
- **Bẫy:** 9 nút tốc độ rộng 415 px > 393 px, nút dừng lọt ngoài mép trái; xuống dòng thì đè hàng nút
  trái ở +56 px → thu nhỏ nút trên màn hẹp. `pkill -f <chuỗi>` giết luôn lệnh bash chứa chuỗi đó.
- **Chờ anh:** chơi thật qua bản duyệt (mục 3 `TIEN_DO.md`).
