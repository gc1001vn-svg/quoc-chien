# Phase 11B — nối thế giới vào game: ngoại giao, thẻ bất ổn, đánh tỉnh, màn kết (27/09)

## Bối cảnh

11A xong 26/09: `TheGioi` chạy ngầm, `sim:van` ĐẠT, chưa ai import từ `render/`/`ui/`. Anh chọn (a)
27/09: nhận thống trị 2/5, cân tiếp khi chơi thật. Bước E: 11A không đổi màn hình → không cần iPhone. Anh duyệt 27/09 "làm đi".

## Làm gì (mỗi khối: test trước, code, `npm run do`, commit)

1. **Tách `TheGioi.ts` (299/300 dòng)** — `tuyenChien/damPhan/deDoa/dauTuVanHoa/chonBatOn` chỉ dùng
   API công khai → chuyển sang `sim/campaign/HanhDong.ts` (hàm thuần nhận `TheGioi`). Test 11A giữ xanh.
2. **`sim/campaign/HienTheGioi.ts`** — hàm thuần dựng số cho màn (vào `TheGioi`, ra object hiển thị):
   `hangNgoaiGiao()` (mỗi nước: tên, trạng thái, quan hệ, sức quân so với ta, nút nào bấm được + lý do
   khoá) · `theBatOn()` (chỉ số, giờ còn tới nổi loạn, 3 lựa chọn + đủ vàng không) · `tanCongTinh(id)`
   (được không, lý do, % thắng từ `xacSuatThang`) · `manKet()`. **Giao Jules viết test** (đặc tả +
   chữ ký do Claude viết), Claude cài 3–7 lỗi thử để chấm; trần 30 phút, quá thì tự làm.
3. **Một thế giới dùng chung hai màn** — `main.ts` dựng `TheGioi` một lần, đưa vào cả hai cảnh.
   `CityScene`: mỗi lần chốt giờ → `tg.gioTiep(soNuocTa(...))` (chỗ nối có sẵn `NoiThanhPho.ts`).
   Nhịp thế giới = giờ thành phố, không nhịp riêng.
4. **Bản đồ tỉnh đọc chủ tỉnh từ `TheGioi`** — `VeBanDo` (màu), `NhanTinh`, `BangTinh` hiện chủ thật;
   tỉnh chiếm được thì xây ô được (`ChienDich` nhận hàm tra chủ thay vì `t.nuoc` cố định).
5. **Màn** (DOM, cùng kiểu `DecisionCard`, dựng một lần rồi bật/tắt `hidden`):
   - Thanh trên: vàng · bất ổn · giờ ván · sức quân — cả hai màn.
   - Nút `🤝 Ngoại giao` → bảng 3 nước: trạng thái, quan hệ, sức; nút Thương mại / Đàm phán /
     Đe doạ / Tuyên chiến (tuyên chiến cần để đánh — thống trị).
   - `BangTinh`: tỉnh kề đánh được → nút `⚔ Tấn công (thắng ~X%)`, kết quả vào `NhatKySuKien`.
   - Thẻ bất ổn 3 lựa chọn, **dừng sim** như thẻ quyết định, trả lại tốc độ cũ.
   - Màn thắng/thua: kiểu gì, giờ thứ mấy, nút `Ván mới`.
6. **Tốc độ** — anh chọn 27/09: thêm nút 200× và 500× (`TOC_DO` ở `Clock.ts`); anh báo fps khi chơi.

## Ngoài phạm vi

Lưu ván (Phase 13) · vẽ quân đi trên bản đồ · thế giới tác động ngược vào thành phố · đời 6 ·
cân lại thống trị · màn ghi công CC-BY.

## Đo bằng gì

`npm run do` xanh · test mới cho `HanhDong` + `HienTheGioi` (Jules, chấm bằng lỗi cài thử) ·
`sim:van` vẫn ĐẠT y số cũ (tách không đổi luật) · `npm run chup:man` ảnh bảng ngoại giao / thẻ / màn
kết ở 393 px · **anh chơi thật trên iPhone qua bản duyệt** (đăng đè link cũ).

## Lùi bằng gì

Mỗi khối một commit. Màn mới chỉ đọc `TheGioi`; revert khối 3–5 là game về như 10B.

## Rủi ro

- `CityScene.ts` 298 dòng, `MapScene.ts` 243 — nối vào có thể chạm trần dòng → tách trước.
- iPhone màn hẹp: bảng ngoại giao + thẻ + nút tốc độ chen nhau → chụp 393 px trước khi đăng.
- Cuối phiên: file này vào `docs/ke-hoach/`, nhật ký `PHASE_11B.md`, `TIEN_DO.md` 1–5, gộp `main`.
