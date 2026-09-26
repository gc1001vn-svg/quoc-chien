# Phase 11A — thế giới chạy ngầm, ván có kết thúc (26/09/2026)

- **Anh chốt đầu phiên:** tách 11A (luật, chưa vẽ) / 11B (màn hình) · thắng Khoa học tạm lấy
  **đời 5** (`victory.json > khoa_hoc.doi`) · nợ "chiến dịch chưa nối kinh tế" + "chưa có AI
  nước khác" vào 11A. Kế hoạch: `docs/ke-hoach/2026-09-26-phase-11a-the-gioi.md`.
- **Xong:** `src/sim/campaign/` thêm `TheGioi` (gom, chạy theo giờ game) · `NgoaiGiao` (4 trạng
  thái, thương mại / đàm phán / đe doạ, bầu minh chủ) · `BatOn` (thẻ 3 lựa chọn, nổi loạn, sụp
  đổ) · `ChienTranh` (mua quân theo đời, đánh bằng `tinhTran()` có sẵn) · `AiNuoc` · `DieuKienThang`
  · `NoiThanhPho` (số nhà, đời, công nghệ, lương thực, thẻ của thành phố thật → nước người chơi).
  `BanDoTinh.tinhKe()` mới. Số ở `data/the_gioi.json` + `data/victory.json`. 18 test mới.
- **`npm run sim:van`:** vết thành phố thật 300 giờ (389 s lần đầu, lưu `.cache/sim_van/`), rồi
  5 chiến lược × 5 hạt giống, mỗi ván 0,01–0,1 s. **ĐẠT.** Đúng kiểu: thống trị **2/5** ·
  khoa học 5/5 · văn hoá 5/5 · ngoại giao 5/5 · bỏ mặc thua 5/5.
- **Lệch kế hoạch:** thẻ bất ổn nằm trong `the_gioi.json`, không vào `decisions.json` · AI không
  xây ô tỉnh (`ChienDich.ts` không đụng) — kinh tế AI rút gọn theo số tỉnh · test viết sau code.
- **Luật sửa khi cân (lỗi thật, không phải chỉnh số):** bên yếu tự thoát chiến tranh bằng đàm
  phán → nay bên mạnh gấp 1,3 lần không chịu · quân đầy trần không bao giờ thay lính cũ → giải
  ngũ đội yếu nhất · một đội quân giữ mọi tỉnh cùng lúc → rải theo số tỉnh, thủ đô ×2 + tướng
  cấp 3 · trần quân theo đất (15 + 3/tỉnh) · văn hoá tính cả nước đã mất (không thì thôn tính = thắng Văn hoá).
- **Chưa làm / nợ:** thống trị chỉ 2/5 hạt giống (đã quá trần 3 lần chỉnh — hỏi anh) · thế giới
  chưa tác động ngược vào thành phố · bất ổn chưa tính dân bậc cao · chưa có màn nào (11B).
- **Bẫy:** `node .../cai_dat.mjs` bị bộ lọc quyền chặn `[Code from External]` đầu phiên — không
  chạy được, không mò đường vòng.
