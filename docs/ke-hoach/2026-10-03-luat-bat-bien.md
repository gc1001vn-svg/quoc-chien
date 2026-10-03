# Luật bất biến — máy kiểm "điều game không bao giờ được phá" (03/10/2026)

Học từ `LAWS.bend` (kho `quyet-dinh/2026-10-03-hoc-tu-dot-4-doi-chieu-may.md`). Hiện 52 file test, 543 test,
36 giây — đều theo **ca cụ thể**. Luật bất biến chạy qua **nhiều hạt giống ngẫu nhiên** bằng `src/core/Rng.ts`,
không thêm thư viện. Danh sách luật do 10 agent đọc mã, chạy thử, phản biện, cài lỗi giả (03/10).

## 1. Luật (bản cho anh đọc; file thật: `docs/LUAT_BAT_BIEN.md`)

- **Thành phố:** hàng không tự sinh/tự mất (kho + nhà + trên vai = đầu ván + làm ra − dùng − hỏng) · không chỗ nào
  âm, kho chung không vượt trần, người vác không quá một chuyến · từ giờ 2 không nhà nào/hàng nào kẹt · kho riêng
  vượt trần nhiều nhất một chuyến · bảng số mỗi giờ khớp số mẻ × sản lượng · người vác luôn đứng trên đường TRONG
  bản đồ · một ô một vật · nhà đúng quy hoạch, cổng trên đường · đường nào cũng tới nơi · cờ "đang lấy" khớp người đi lấy.
- **Trận:** lính chết không sống lại, đội vỡ rút hẳn · không đội nào nhanh hơn tốc độ, không ra khỏi chiến trường ·
  có bên vỡ hết thì trận dừng ngay · kết quả = kịch bản = nhật ký · % dự đoán trong 0–100, tướng giỏi hơn không tụt %.
- **Thế giới:** mỗi tỉnh đúng một chủ, nước mất không còn tỉnh/quân · tỉnh chỉ đổi chủ khi bị láng giềng đang chiến
  đánh, thác thủ đô hoặc nổi loạn · vàng ≥ 0, bấm nút không tự sinh vàng · quân chỉ sinh khi mua, không vượt trần ·
  vàng tiêu = giá đội thật sự nhận · bất ổn trong khoảng, chạm ngưỡng sụp thì kết ván · thẻ bất ổn mở ⇔ chỉ số ≥ ngưỡng ·
  nút sáng ⇔ bấm ăn · chiến tranh thì cắt buôn · kết ván đúng lý do.
- **Công nghệ, thẻ, đồng hồ:** điểm nghiên cứu không tự sinh, đủ điểm thì xong · không xong trước tiền đề · lên đời
  từng bậc, đủ điều kiện thì phải lên · mỗi Eureka nổ đúng một lần, đủ điều kiện thì phải nổ · thẻ quyết định đúng
  nhịp · thống đốc không xây quá trần · trần = gốc + phần được cộng · đồng hồ không chạy quá, không chạy bù.
- **Mọi mảng:** cùng hạt giống + cùng lựa chọn → y hệt (thành phố chạy xen kẽ hai bản; trận chạy hai thứ tự).

## 2. Năm lỗi thật luật bắt được — đã tự chạy lại xác nhận 03/10

| Lỗi | Tái hiện (data thật) | Làm |
|---|---|---|
| Người vác đi ra ngoài bản đồ 96×96 (`Walkers.ts:102` làm tròn lên 96) | nhịp 117, ô (96,32); 315.416 lượt trong 2 giờ | sửa |
| Thùng kho đè vật (`XayThem.veKho` không xem ô trống) | `xayKho` lần 9: ô (81,81) xe_keo + dong_thung | sửa |
| Thẻ bất ổn còn mở sau nổi loạn dù dưới ngưỡng (`BatOn.ts:75-80`) | 8 lần / 3.115 giờ, chỉ số 31,5–33 < 40 | sửa |
| Mua quân đốt vàng: đội vừa mua bị giải ngũ ngay, không hoàn tiền (`ChienTranh.ts:62-68`) | tiêu 165 vàng, nhận đội giá 90 | sửa |
| Kho riêng vượt trần mãi (`Buildings.ts:269`, `City.ts:201,209`) — **đổi cân bằng** | trần 72, đo được 1.126 | sửa — anh chọn A 03/10 |

Lỗi nằm im (data hiện tại chưa chạm, sửa ở bộ đọc data): `nhieu > 1` thành hồi máu · `hang_xuat_phat > chien_truong`
· nhịp cuối chạy lố khi `nhip_giay` không chia hết `tran_giay`.

## 3. Cách làm

1. `docs/LUAT_BAT_BIEN.md`: mỗi luật một dòng có mã `[L..]`; 4 file `tests/BatBien{ThanhPho,Tran,TheGioi,Meta}.test.ts`,
   tên `it` mở đầu đúng mã đó; một test đối chiếu hai bên khớp mã (máy giữ, không chữ phải nhớ).
2. Một lần chạy mỗi hạt giống kiểm mọi luật của mảng (rẻ). `npm test` thêm **≤ 10 giây**; bản sâu (≥ 50 hạt, ván
   10 giờ) `npm run luat:sau`, `do.sh` chỉ chạy khi `src/sim/` hay `data/` khác `main`.
3. Mỗi lỗi: luật đỏ trên mã cũ → sửa → xanh; **mỗi lỗi một commit**; `sim:thu`, `sim:van`, `sim:tran` trước/sau ghi
   nhật ký. Luật của lỗi anh chưa duyệt sửa thì **chưa bật**: dòng của nó trong `LUAT_BAT_BIEN.md` ghi
   `(chưa bật)`, test đối chiếu mã bắt mọi luật không test mà thiếu dấu đó (`it.skip` bị `check:san` cấm).
   Lỗi chỉ hiện ở ván dài: bản sâu bắt (Gemini phản biện 03/10).

## 4. Đo — xong khi

- Mỗi luật có một lỗi giả cài vào bản chép làm nó đỏ (ghi nhật ký) · `npm run do` xanh · `luat:sau` xanh.
- Số `sim:van` / `sim:tran` lệch so với trước chỉ ở chỗ giải thích được bằng lỗi vừa sửa.

## 5. Không làm · lùi

- Không sửa (ghi nợ, anh quyết sau): trận đi theo hàng phụ thuộc thứ tự danh sách (`Battle.ts:180`, 1.445/2.000 trận)
  · AI xin hoà không bao giờ được nhận (0,7 vs 1,3) · % dự đoán lệch tỉ lệ thắng thật.
- Không đụng file khoá (`GAME_SPEC`, `TECH_SPEC`, `AGENTS.md`). Lùi: `git revert` đúng commit.
