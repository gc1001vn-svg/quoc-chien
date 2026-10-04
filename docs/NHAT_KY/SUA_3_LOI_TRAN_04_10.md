# Sửa 3 lỗi trận — 04/10/2026

Kế hoạch: `docs/ke-hoach/2026-10-04-sua-3-loi-tran.md` (anh duyệt cả 3; AI được tự xin hoà cả với nước anh). Ba lỗi luật
bất biến đo ra 03/10, mỗi lỗi một commit, luật mới bắt đỏ TRƯỚC rồi mới sửa mã.

- **Đi hàng** (`dafd870`, luật TR14 — đỏ 155 vi phạm trước sửa): chụp `daCham` đầu nhịp. `sim:tran` lệch TB 2,24 → 1,97.
- **AI xin hoà** (`e9ede6e`, TG14 — đỏ trước sửa): `ti_le_xin_hoa` 0,7 → 0,9; bộ đọc từ chối cặp số chặn nhau
  (xin hoà × tuyên chiến ≤ 1). Bẫy: TG14 bản đầu XANH trên mã lỗi — hai bên cùng 0 quân thì luôn nhận; phải loại ca đó.
- **% thắng** (`4f7a5c4`, TR15): `duDoan` = tỉ lệ thắng của chính `tinhTran` qua hạt 1..32, dừng sớm khi 8 trận đầu
  cùng một bên thắng. 150 cặp đội hình × 200 trận: lệch lớn nhất **97,7 → 5,5 điểm** (p90 24,8 → 0). `sim:tran` lệch TB
  0,84, Brier 0,075 → 0,009. Bỏ 3 số chết `do_doc` `he_so_tam` `mu_phong_thu`.
- **Câu luật đổi, có lý do** (tính chất của công thức cũ, trận thật không có): TR07 bỏ "đổi bên ra phần bù" (bên giữ đất
  thắng khi hoà, lệch tới 3 điểm) và "địa hình phòng thủ không giúp bên đánh" (1/300 cặp ngược 9,4 điểm); TG09 nút sáng
  thì % trong [0, 1] — 0 % là thua chắc thật. TR07 sang `tests/BatBienDuDoan.test.ts` (chạy trên mỗi trận thì chậm chục lần),
  TR11–13 nay giữ TR02–06 + TR14.
- **Giá máy** (`fd145af`): tìm địch gần nhất so bình phương trước, sát nút mới gọi `Math.hypot` — trận 10v10 0,75 → 0,45 ms,
  `sim:tran` y hệt từng số. Bẫy: so bình phương trơn đổi cách chọn khi hai địch cách bằng nhau (đội hình đối xứng), TR04 bắt.
- **Một giờ thế giới** (`sim:van`, 3.913 giờ, máy ảo): trước p99 1,0 · max 3,6 ms → sau p99 9,4 · max 25 ms; 7 giờ > 16 ms.
  Trần kế hoạch 16 ms **vượt** ở 0,18 % số giờ. Đã thử: 16/24 trận dự đoán không đỡ (max 20–22 ms, tốn ở các ca dừng sớm 8 trận).
- **`sim:van`** (5 hạt, tỉ lệ đúng kiểu): trước 3/5 · 2/5 · 5/5 · 4/5 → sau đi hàng 2/5 · 2/5 · 5/5 · 4/5 → sau % mới
  **3/5 · 5/5 · 5/5 · 5/5**: AI không còn đánh liều vào thủ đô anh (khoa học 4 ván "mất thủ đô" → thắng).
- **Số:** `npm test` 18,9 → 19,9 s · `luat:sau` (6 file) 301 s · test 603 → 606.
