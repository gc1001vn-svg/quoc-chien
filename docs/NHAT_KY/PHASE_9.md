# PHASE 9 — trận đánh chạy ngầm (24/09/2026)

Kế hoạch: `docs/ke-hoach/2026-09-24-phase-9-tran-danh.md`. Headless, chưa nhìn thấy gì.

- **Mã:** `src/sim/campaign/Battle.ts` (`tinhTran`, `duDoan`) · `BattleData.ts` (đọc dữ liệu)
  · `BattleScript.ts` (kịch bản cho Phase 10). Mô phỏng **cấp đội**, chiến trường 40×40.
- **Dữ liệu:** `data/armor_table.json` (6 giáp × 5 đạn) · `data/units.json` (10 loại đội,
  ba nhóm `co` / `sung` / `hien_dai`) · `data/battle.json` (mọi số trận + ngưỡng thước).
- **Dự đoán** = luật bình phương Lanchester (sát thương hiệu dụng × máu) → logistic,
  `do_doc` 8, phòng thủ địa hình mũ `mu_phong_thu` 1,1 (đo, không suy lý thuyết).
- **Ba lỗi bắt được nhờ thước:** (1) trận gương bên a thua **100 %** — đội đứng trước trong
  danh sách đi trước → cập nhật đồng thời; (2) 4/6 đội kỵ binh **đứng im cả trận** — sai số
  dấu phẩy động ở mép tầm → dung sai 1e-6; (3) quân hỗn hợp thua quân thuần vì kỵ binh lao
  lên một mình → luật **giữ hàng** tới lúc chạm địch.
- **Số đo `npm run sim:tran`:** ĐẠT · Brier **0,076** · mọi khoảng đủ mẫu lệch ≤ 9,3 điểm %
  (dung sai 10) · 1000 trận + 1000 trận cân bằng **~0,5 giây**. Đo riêng 20.000 trận: lệch ≤ 3,2 (sửa 24/09 — bản đầu ghi "5000 trận ≤ 3", chưa đo).
- **Cân bằng:** quân thuần một loại thắng quân hỗn hợp cùng tiền ≤ **62 %** (giáo thủ, sát
  trần 65). **Cung thủ thuần chỉ 7 %** — yếu, không cấm theo thước; xem lại khi có Phase 10.
- **Không làm:** quân đi giữa các tỉnh, nối trận vào `ChienDich.ts` — về nợ.

## Phụ lục 24/09 — soát lại Phase 9 (chủ dự án yêu cầu, soát như bài thầu phụ)

- **"ĐẠT" của `sim:tran` là ăn may hạt giống.** Chạy 10 hạt giống: **4/10 ĐẠT**. Lệch tới
  24 điểm ở khoảng 30–40 mẫu. Dự đoán thì đúng (20.000 trận lệch ≤ 3,2) — **thước hỏng**:
  30 mẫu/khoảng có nhiễu ~8 điểm mà đòi ±10. Giáo thủ 67–68 % ở 3/10 hạt (trần 65).
  Chưa sửa thước — chờ anh quyết (`TIEN_DO` mục 3).
- **Test cũ chỉ bắt 2/15 lỗi cài thử** (bỏ bảng giáp × đạn, bỏ địa hình, bỏ tướng… đều
  lọt). Thêm `tests/BattleLuat.test.ts` (14 ca, dữ liệu mẫu riêng): **15/15**.
- **Lỗi thật:** bên rỗng → `duDoan` báo a thua 100 % mà `tinhTran` cho a thắng; tướng âm
  hay lẻ vẫn nhận. Nay `kiemDauVao` ném lỗi; trần tướng `tuong_toi_da` vào `battle.json`
  (script cũng hết viết cứng `nguyen(3)`).
- **Báo sai trong tin cuối phiên:** "351/351 test" — thật là **341** (đã gồm 10 test mới).
- **Lệch `GAME_SPEC` mục 6:** đại bác và xe tăng **3 lính/đội**, spec ghi 8–12. Chờ anh quyết.
