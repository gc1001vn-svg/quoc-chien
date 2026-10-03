# Luật bất biến (03/10/2026)

Kế hoạch: `docs/ke-hoach/2026-10-03-luat-bat-bien.md` (anh duyệt 03/10: "duyệt, chọn A sửa luôn"). Học từ `LAWS.bend`
của Bend 2 (kho ghi-nho, đợt tra thứ 4).

- **Làm gì:** 56 luật ở `docs/LUAT_BAT_BIEN.md`, 4 file `tests/BatBien{ThanhPho,Tran,TheGioi,Meta}.test.ts` — mỗi hạt giống
  MỘT lần chạy kiểm mọi luật của mảng. `BatBienDanhSach` giữ docs ↔ test khớp mã. `npm test` bản ngắn; `npm run luat:sau`
  bản sâu (≥ 50 hạt, ván dài), `do.sh` chỉ gọi khi `src/sim/` hay `data/` khác `main`.
- **Cách tìm:** 10 agent đọc 5 mảng `src/sim`, chạy thử ≥ 20 hạt giống, phản biện + cài lỗi giả. 8 agent viết test rồi cài
  hơn 150 lỗi giả vào bản chép: luật nào để lọt thì sửa test (vd TP08 thêm ván ép trần nhỏ, TR05 thêm trận gương).
- **Lỗi thật luật bắt, đã sửa — mỗi lỗi một commit:** thùng kho đè nhà/xe kéo (TP10) · thẻ bất ổn còn mở dưới ngưỡng sau
  nổi loạn (TG08) · mua quân đốt vàng (TR08, TG05) · 3 lỗi nằm im của bộ đọc `battle.json` (TR11–13). So với mốc đầu phiên:
  `sim:tran` y hệt, `sim:van` tỉ lệ y nguyên (mua quân đổi đúng một ván), thùng kho không đổi số nào.
- **Chưa đẩy `main`, chờ anh — đổi nhịp game:** người vác đi ra ngoài bản đồ (TP06, TP14) · kho riêng phình mãi (TP04).
  Bảng số 3 bản đồ: `docs/TIEN_DO.md` mục 3. Mã nằm ở nhánh `claude/gracious-curie-pm0flr`.
- **Bẫy gặp:** `check:san`/`khoa`/`ten`/`tran` chỉ quét file git đang theo dõi → file mới lọt tới lúc commit (chữ `it.skip`
  trong comment làm `main` đỏ một commit, `c7cb269` → sửa `c6220d2`; sửa thước `e68e47c`, bản chuẩn `check_ten` ở kho).
  `sim:van` lưu vết thành phố theo băm `data/`, KHÔNG theo mã → sửa `src/sim/city` phải chạy `sim:van -- --lam-lai`.
  `AiGoi.test.ts` lấy mã thật làm đề → thêm chỗ gọi `xayNha` là phải sửa danh sách của nó. Bản sửa mua quân đầu của tôi
  sai (không giải ngũ đội vừa mua nhưng vẫn giải ngũ đội CÙNG LOẠI cũ — vẫn đốt vàng); TR08 bắt ngay.
- **Số:** test 543 → 599, `npm test` 35,6 → 38,1 giây (trần kế hoạch +10). `luat:sau` xem `docs/TIEN_DO.md` mục 2.
- **Chưa làm:** 3 việc ghi `docs/NO_KY_THUAT.md` mục "Luật bất biến" để anh quyết.
