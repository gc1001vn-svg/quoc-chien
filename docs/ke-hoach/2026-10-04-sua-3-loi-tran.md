# Sửa 3 lỗi trận — 04/10/2026

Ba lỗi luật bất biến đo ra 03/10 (`docs/NO_KY_THUAT.md` mục "Luật bất biến"). Game chiến thuật, trận tính trước bằng
`tinhTran(dauVao, duLieu, hatGiong)` (tất định theo hạt), `duDoan()` ra % thắng hiện trước trận và AI dùng % này để quyết đánh.

Anh duyệt 04/10: "Duyệt cả 3"; AI được tự xin hoà cả với nước anh ("Được"). Gemini phản biện: đúng 1 ý (giá máy → thêm
dừng sớm khi vượt trần), 1 ý đã đưa anh chọn (xin hoà với người chơi), 1 ý sai (đội không đi xuyên — mã dừng ở mép tầm).

## Mốc đo trước
- Lỗi 3: 150 cặp đội hình × 200 trận — |dự đoán − tỉ lệ thắng thật| p90 24,8 điểm, lớn nhất 97,7 (báo 100 %, thật 2 %).
  Thay bằng chạy thật 32 trận hạt cố định: lớn nhất 5,4 điểm (16 trận: 14,7). Giá 8,5 ms một lần dự đoán.

## Việc — mỗi việc một commit
1. Đi hàng (`Battle.ts`): cờ `daCham[bên]` bật GIỮA vòng lặp các đội, nên nhịp vừa chạm địch đội đứng sau đi tốc độ riêng,
   đội đứng trước đi tốc độ hàng. Sửa: chụp `daCham` đầu nhịp, mọi đội đọc bản chụp. Luật mới TR14 kiểm trên vết vị trí.
2. AI xin hoà: AI xin khi sức mình/sức địch < `ti_le_xin_hoa` 0,7; bên kia từ chối khi mạnh hơn ≥ 1,3 lần → không bao giờ
   nhận (1/0,7 = 1,43 > 1,3). Sửa data 0,7 → 0,9: AI yếu 77–90 % xin được, yếu hơn nữa vẫn bị từ chối (đúng ý thiết kế).
   Bộ đọc data từ chối `ti_le_xin_hoa` ≤ 1/`ti_le_tuyen_chien`. Luật mới TG14.
3. Dự đoán: `duDoan` = tỉ lệ thắng của chính `tinhTran` qua `so_tran_du_doan` = 32 hạt cố định (số trong data). Xoá 3 số
   của công thức cũ (chết). Bộ nhớ đệm theo đội hình, có trần số mục, để AI mỗi giờ không tính lại cặp cũ.
   Luật mới TR15: lệch ≤ 10 điểm so với 200 hạt khác. Sửa câu TR07: giữ "0–100 %" và "tướng giỏi hơn không làm tụt %"
   (đo 0/600 lần ngược); bỏ "đổi bên ra phần bù" (bên giữ đất thắng khi hoà, lệch tới 3 điểm) và "địa hình phòng thủ
   mạnh hơn không giúp bên đánh" (1/300 lần ngược 9,4 điểm) — tính chất của công thức cũ, trận thật không có.

## Đo
- Mỗi commit: `npm run do` (tự chạy `luat:sau` bản sâu vì đổi mã mô phỏng), `sim:tran`, `sim:van` so mốc, bảng trước/sau.
- Trần: `npm test` tăng ≤ 10 s (nay 38 s); một giờ thế giới thêm ≤ 16 ms (đo `gioTiep` trước/sau) — vượt thì dừng sớm.

## Rủi ro
- AI quyết đánh theo % mới → tỉ lệ kiểu thắng `sim:van` đổi; báo bảng.
- AI xin hoà được cả với người chơi: tự trả 20 vàng, quan hệ +12, chỉ thành ngừng bắn khi quan hệ ≥ −20.
- Lùi: `git revert` từng commit.
