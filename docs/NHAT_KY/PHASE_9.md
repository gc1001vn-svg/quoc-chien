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
  (dung sai 10) · 1000 trận + 1000 trận cân bằng **~0,5 giây**. Đo riêng 5000 trận: lệch ≤ 3.
- **Cân bằng:** quân thuần một loại thắng quân hỗn hợp cùng tiền ≤ **62 %** (giáo thủ, sát
  trần 65). **Cung thủ thuần chỉ 7 %** — yếu, không cấm theo thước; xem lại khi có Phase 10.
- **Không làm:** quân đi giữa các tỉnh, nối trận vào `ChienDich.ts` — về nợ.
