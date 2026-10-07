# Bước 2 "ngày/đêm + dân về nhà" — 05–06/10/2026 (lần 39)

Kế hoạch: `docs/ke-hoach/2026-10-05-buoc-2-ngay-dem.md` (anh duyệt 05/10: một ngày = 1 giờ game · luật sáng art bible chỉ đo
ban ngày · giấu bớt người khi vẽ). Kế hoạch mẹ `2026-10-04-moi-thu-tung-buoc.md` việc 2. Đọc trước bằng 4 agent song song
(1 agent hỏng vì máy chủ quá tải, 3 agent kia phủ đủ). Sim không đổi một dòng.

- **Số + hàm thuần** (`b42717d`): `data/tung_buoc.json > ngayDem` · `src/render/NgayDem.ts` (giờ trong ngày, độ tối, màu nhân,
  `?gio=`, giấu người vác theo băm) · `tests/NgayDem.test.ts`. Chia dư trên SỐ NHỊP trước rồi mới ra giờ — cùng nhịp dư thì
  cùng màu tới từng bit (bản đầu chia trên số thực, test bắt lệch 2·10⁻¹⁴).
- **Vẽ:** `u_toi` trong shader sprite (0 = giữ nguyên → bản đồ, màn trận, bench không đổi), nhân TRƯỚC phép cộng chớp sáng
  (loé xây, loé lên đời vẫn sáng giữa đêm). Đặt mỗi khung qua `CURRENT_PROGRAM` (đổi mẻ là đổi chương trình) — không thêm
  dòng vào `Gl.ts` (299/300). Hạt: cùng `u_toi`; kiểu 10 quầng cộng sáng (alpha 0 dưới trộn nhân sẵn = cộng thuần, cùng
  lô); tròn/que có phần lẻ ≥ 0,25 giữ sáng (lõi lửa, đốm đèn, Zzz). Đêm không thả chim, tắt bóng mây.
- **`HieuUngDem.ts`:** đèn ở 2 điểm khung sprite nhà dân (0,12; 0,52) và (0,22; 0,60) — đo trên nhà dân cả 5 đời, đều trúng
  cửa sổ/cửa ra vào/tường trước · lửa trại + củi + tàn lửa ở ngã tư kho, chọn chỗ đầu tiên không bị che trong `oThu` ·
  Zzz 3 chữ Z (mỗi chữ 3 que) trên nhà tắt đèn. Người vác: `VeCanh` lọc bản sao, đêm giấu 60 %, người đang về nhà giấu nửa.
- **Bẫy:** phép "bị che" của bước 1 đo theo cả khung sprite — khung nhà dân gồm bóng đổ trong suốt bên phải, nên lửa giữa ngã
  tư trống trơn vẫn bị tính "bị che", lõi lửa biến mất. Thêm `biCheBoi(..., theoThan)`: đo theo thân thật (ngang theo ô nền,
  dọc từ đỉnh sprite tới mép trước ô nền). Que giàn giáo bước 1 giữ cách cũ (anh đã duyệt).
- **Chỉnh sau ảnh:** đèn ở (0,5; 0,74) rơi vào bóng đổ → đo lại khung · Zzz `co` 3,5 → 9 · lửa ở ô đường trái bị mái nhà che
  → danh sách chỗ thử · quầng quanh lửa 0,6 → 0,35 (lõi lửa chìm trong quầng) · củi đen chữ "X" → nhỏ, theo trục ô, giữ sáng.
- **`?gio=<0..24>`** ghim giờ · **`?gio=lap`** một ngày trong 12 s · **`?tat=dem`** · `den` · `zzz` (cả ba trong `het`).
  Lệnh `npm run quay` tự bấm thẻ đầu ván nên camera bay tới chỗ vừa xây — clip quay ở `zoom=0.6`.

**Số:** khung đo art bible `?me=co_dai&zoom=0.6`: bản `main` cũ · `?gio=12` · `?tat=dem` cùng ra sáng 0,48 · bão hoà 0,56 ·
ấm 0,32 (ban ngày không đổi; số 30/09 0,52 là bản đồ cũ hơn) · HUD "3 lệnh vẽ" mọi ảnh đêm · `sim:thu` y hệt trừ dòng giây ·
`sim:van` 5 hạt × 5 kiểu thắng y hệt bản cũ mọi cột trừ cột giây chạy · test 613 → 625 · Fps iPhone: chưa đo — việc của anh.
**Soát độc lập 06/10** (4 agent; agent phản biện và góc "trường hợp biên" chết vì hết hạn mức tuần — Claude tự kiểm lại
từng lỗi và tự soát biên): 4 lỗi thật, đã sửa — cờ đỏ (kiểu 8) và lửa của bất ổn bị tối gần đen ban đêm, trái kế hoạch
"mang tin thì giữ sáng" → giữ sáng (ảnh `?gio=23&batOn=999`) · đèn/Zzz cắt suất theo thứ tự xa→gần nên đông nhà thì chỉ
nửa trên màn có đèn → chọn theo băm như `chonNha` · lô hạt thiếu ~26 chỗ ở trần tính được → `toiDaHat` 400 → 450.
Người trong đám đông bất ổn là sprite nên vẫn tối như mọi người — cờ và lửa đủ báo.
**Còn mở:** đời hiện đại ban đêm xanh đậm hơn các đời khác (một bộ màu cho cả 6 đời) — anh xem rồi quyết. Vùng ruộng/xưởng
không có đèn (chỉ nhà dân).
