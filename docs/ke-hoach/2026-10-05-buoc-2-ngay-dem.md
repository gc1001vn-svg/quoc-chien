# Bước 2 — Ngày/đêm + dân về nhà · 05/10/2026 · ANH DUYỆT 05/10

Kế hoạch mẹ (anh duyệt 04/10): `docs/ke-hoach/2026-10-04-moi-thu-tung-buoc.md` việc 2. Anh bảo 05/10 "làm luôn".
Việc: thành phố có sáng → chiều tà → đêm (tối xanh, đèn cửa sổ, lửa trại ở kho, nhà dân "Zzz", ít người đi đường) → bình minh.
Xong là khi: bảng ảnh 4 giờ + clip một ngày gửi anh; ảnh trưa trùng ảnh cũ; lệnh vẽ vẫn 3; anh đo iPhone ≥ 58 fps.

## Hiện trạng (đo 05/10, 3 agent đọc song song)
- Sim không có "ngày": `DongHo` chỉ đếm nhịp. 1 giờ game = 36.000 nhịp = **6 phút thật ở 10×** (mở màn), 7,2 s ở 500×.
- Shader sprite chưa có uniform màu; dùng chung cho bản đồ, màn trận, bench → uniform mới phải **0 = ban ngày**.
- Người trên đường đều là **người vác thật của sim** (đỉnh 87); chỉ 11 % đi từ nhà dân.
- Hạt (`Hat.ts`: khói, que, chim) vẽ riêng, không qua shader sprite → ban đêm vẫn sáng nếu không nhân màu.
- `CityScene.ts` 300/300 dòng, `Gl.ts` 299, `VeCanh.ts` 296 → logic mới vào file mới, file cũ sửa tại chỗ.
- Dò asset 05/10 (`npm run do:asset` zzz · lửa trại · campfire · đèn lồng · torch): có model lửa trại/đuốc/đèn 3D, icon Zzz
  2D — dùng phải nướng vào mẻ cổ đại đã 90,2 % trang → vẽ bằng hạt, khai `TU_LAM.md`.

## Phương án
**A (đề xuất):** pha màu trong shader sprite có sẵn + hạt nhân cùng màu + đèn/lửa là hạt cộng sáng trong lô `Hat` sẵn có
(alpha 0 dưới trộn nhân sẵn = cộng thuần). 0 lệnh vẽ thêm (giữ 3), 0 ảnh mới, sim không đổi. ~1 phiên.
**B:** làm tối trong hậu kỳ `HauKy` (ít dòng hơn). Hỏng: hạt đèn vẽ vào FBO TRƯỚC hậu kỳ nên bị tối theo; `?tat=hauky` hay
nút "Hiệu ứng" là mất đêm; kế hoạch mẹ cấm lớp phủ cả màn. → Chọn A.

## Làm — mỗi việc một commit
1. **`data/tung_buoc.json` khối `ngayDem`:** chu kỳ (nhịp), giờ lúc mở màn, giờ chiều tà/đêm/bình minh, màu chiều, màu đêm,
   tỉ lệ giấu người, số và cỡ đèn, lửa, Zzz, trần trong khung camera, nhịp `?gio=lap`. Số khởi điểm: bảng thử 30/09 anh đã
   xem (đêm (0,25; 0,31; 0,53), quầng đèn (0,8; 0,52; 0,27), chiều (1; 0,86; 0,70)) — chỉnh trên ảnh chụp.
2. **`src/render/NgayDem.ts` (thuần, không GL)** khuôn `TungBuoc.ts`: từ `nhipSim` ra giờ trong ngày, độ tối 0..1, màu nhân.
   Chỉ phụ thuộc nhịp sim → dừng, tua cùng nhịp cùng hình. `?gio=<0..24>` ghim giờ, `?gio=lap` chạy một ngày trong N giây.
3. **Shader:** `Shader.ts` thêm `u_toi` (vec3, 0 = không đổi), nhân trước phép cộng loé (loé xây, loé lên đời không tối).
   Đặt mỗi khung ở `batDauKhungCoHieuUng` (đổi mẻ đổi chương trình shader); vị trí uniform null thì bỏ qua, không ném lỗi.
4. **Hạt:** `Hat.ts` cùng `u_toi` cho khói, bụi, que; icon kho đầy/thiếu và đám đông bất ổn giữ sáng (mang tin). Kiểu
   hạt mới `sang` (quầng cộng sáng). Đêm: không thả chim, tắt bóng mây hậu kỳ.
5. **`src/render/HieuUngDem.ts`:** đèn cửa sổ nhà dân (theo băm, nhấp nháy nhẹ) · lửa trại ở ngã tư kho (lõi + quầng +
   tàn lửa bay) · "Zzz" trên nhà dân đã xây xong (chữ Z vẽ bằng que có sẵn). Trần số trong khung từ data; lõi bị vật
   đứng trước che ≥ 25 % thì bỏ (như que bước 1).
6. **Dân về nhà:** lọc ở `VeCanh.ts` (một dòng): đêm giấu dần người vác theo băm cố định (không nhấp nháy), người
   đang về nhà giấu sau cùng. **Sim không đổi** — hàng vẫn về kho đúng nhịp, chỉ không vẽ người.
7. `?tat=dem` (tắt hết, ra ban ngày như cũ) · `den` · `zzz`; `?tat=het` gồm cả ba. Test `NgayDem.test.ts`, `HieuUng.test.ts`.
8. `ART_BIBLE.md` luật 2–3 ghi "đo ảnh ban ngày" (nếu anh chọn) · `TU_LAM.md` · nhật ký · `TIEN_DO.md`.

## Đo
- `npm run do` mỗi commit (`luat:sau`, `sim:van` tự chạy lại vì `data/` đổi). `sim:thu` 97 dòng, `sim:van` 5 hạt y hệt.
- Ảnh `?gio=12` trùng ảnh `?tat=dem` và đo `do_hinh` khung art bible ra đúng số 30/09 (cổ đại 0,52 · 0,47 · 0,28).
- Bảng ảnh: cổ đại 4 giờ (12 · 18 · 22 · 6) + đêm ở trung cổ, hiện đại (một bộ màu cho cả 6 đời). Clip `?gio=lap`.
- HUD "3 lệnh vẽ" trên ảnh đêm · `khoi:dong` với `?gio=22` (bắt shader dịch hỏng). Anh: iPhone ≥ 58 fps.

## Giả sử A hỏng — ba lý do
- Bản đồ tỉnh/màn trận đen thui vì uniform thiếu → chặn: nghĩa 0 = ban ngày; `khoi:dong` mở cả hai màn.
- Đêm quá tối vì hậu kỳ (đường cong chữ S, viền tối) dìm thêm → chỉnh số trên ảnh chụp CUỐI, không trên ảnh atlas.
- Quầng sáng to nhiều cái → tụt fps iPhone (fill-rate) → trần số đèn trong khung + bán kính trong data; anh báo thì giảm.

## Rủi ro khác
- Ở 200×/500× một ngày còn 18 s / 7,2 s: trời sáng tối nhanh. Giữ "cùng nhịp cùng hình"; chu kỳ nằm trong data.
- Giấu người vác: hàng "tự tới kho" lúc đêm mà không thấy người. Không đổi sim (đổi là phải đo lại cả bảng cân bằng).
- Thẻ quyết định hiện đúng mỗi giờ game → nếu một ngày = một giờ game thì thẻ luôn hiện cùng giờ (chọn buổi sáng).

Lùi bằng: `git revert` từng commit; `?tat=dem` trả ban ngày như cũ.
KHÔNG làm: soi sáng đất quanh lửa theo từng điểm ảnh (tốn fill-rate) · lều/nhà đổi hình ban đêm · đổi sim · `HauKy` màu đêm.
Anh chọn 05/10: một ngày = **1 giờ game** · luật 2–3 art bible **chỉ đo ảnh ban ngày** · **giấu bớt người khi vẽ**.
