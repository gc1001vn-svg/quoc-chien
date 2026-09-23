# PHASE 8D — mở đường lên đời 4 và 5 (23/09/2026)

Chủ dự án chốt 23/09: 8D ngắn, phiên sau Phase 9 trận đánh đúng `KE_HOACH.md`.
Kế hoạch: `docs/ke-hoach/2026-09-23-phase-8d-len-doi.md`.

- **Gốc chặn không phải số, mà là luật.** `Governor` chỉ xây nhà **làm ra** món đang thiếu,
  không gì xây thêm nhà **tiêu thụ** → nhu cầu đứng yên từ bản đồ đầu, thành phố cân bằng
  ở 241. Hạ `soNha` chỉ che bệnh.
- **Luật mới "dân kéo về":** `gioNoDu` (3) giờ liền không thiếu món nào → xây một nhà trong
  `nhaDanMoi` (`nha_dan`). Hai số ở `data/policy.json`. Thêm miệng ăn → lại thiếu → lại xây
  nhà sản xuất. Test viết trước, đỏ 2 ca rồi mới sửa.
- **16 công nghệ mới** (đời 4: 130–170 điểm, đời 5: 185–230), chỉ `noiTran` — tổng
  `doiNguong` của cây đã chạm đáy luật `_doiNguong` (−12 / −60). `moThe: []`, thẻ mới để sau.
- **`len` đời 4 → 5 = 30 công nghệ + 330 công trình.** Đời 5 → 6 giữ `null` (Phase 12).
- `sim:congnghe` nhận `-- <giờ> <đời>`, in thêm đỉnh walker; mặc định đòi đời 4 / 120 giờ.
- **Số đo (sim:congnghe, hạt giống cố định):** 120 giờ → đời 4 ở giờ **109**, 288 nhà;
  240 giờ → đời 5 ở giờ **212**, 380 nhà, 32/40 công nghệ. Walker đỉnh **657** / trần 1.200.
  Trước 8D: kẹt đời 3, 241 nhà. `sim:thu` ĐẠT.
- **Chưa đo trên máy thật:** thành phố to hơn ~55 % → fps iPhone cần anh đo lại.
