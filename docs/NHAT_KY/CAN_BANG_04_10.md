# Cân bằng lại nhịp game sau 2 bản sửa — 04/10/2026 (lựa chọn B)

Hai bản sửa của 03/10 (người vác ra ngoài bản đồ — TP06, TP14 · kho riêng phình mãi — TP04) đúng thiết kế
nhưng đời 6 không tới trong 320 giờ. Anh chọn B: chỉnh số trước, gộp và đẩy `main` một lần.

## Gốc — đo, không đoán

- **Nút thắt là SỐ NHÀ, không phải công nghệ.** Lên đời 6 cần 44 công nghệ + 400 nhà (`balance.json`). Nhánh sửa có
  44 công nghệ quanh giờ 240 như `main`, nhưng giờ 320 chỉ 377–395 nhà.
- **Vì sao ít nhà:** lỗi kho cũ giữ hàng trong kho riêng → kho chung báo rỗng → thống đốc thấy "thiếu" gần như mỗi
  giờ và xây nhà sản xuất. Sửa xong thành phố đủ ăn, thống đốc chỉ thêm một nhà dân mỗi `gioNoDu` = 3 giờ.
  Đếm `Governor.daLam` 320 giờ, bản đồ gốc: `main` 231 việc (18 kho, 13 nhà dân) · nhánh 153 việc (0 kho, 46 nhà dân).
- **Kho đứng ở 6:** đỉnh người vác 657 → 142–215, không chạm `nguongDinh` 600 nên thống đốc không xây kho nào.
  Kéo theo bốn Eureka mốc 9/14/18/22 kho không bao giờ nổ (`main` nổ ở giờ 4/20/44/68).

## Phương án đã thử (bản chép, `sim:congnghe -- 320 6`, ba bản đồ gốc · 777 · 4242)

| Phương án | Đời 6 ở giờ | Nhà giờ 320 | Kho | Eureka | Đỉnh người vác |
|---|---|---|---|---|---|
| `main` (trước sửa) | 248 · 265 · 281 | 453 · 445 · 433 | 37 · 37 · 38 | 19 · 18 · 18 | 652–663 |
| Nhánh, chưa chỉnh | không tới (đời 5: 184 · 205 · 202) | 395 · 377 · 377 | 6 | 13 · 13 · 14 | 142–215 |
| `gioNoDu` 2 | 260 · 272 · 263 | 436 · 426 · 436 | 6 | 15 · 13 · 15 | 231–271 |
| `nguongDinh` 180 | không tới (đời 5: 222 · 221 · 232) | 372 · 374 · 362 | 19–32 | 13–14 | 135–139 |
| **`gioNoDu` 2 + Eureka theo nhà — chọn** | **260 · 272 · 263** | 436 · 426 · 436 | 6 | **19 · 17 · 19** | 231–271 |

`nguongDinh` 180 loại: kho mới chiếm lượt của thống đốc (mỗi giờ một việc), nhà còn chậm hơn.
`main` đo lại hôm nay ra 248 · 265 · 281; `TIEN_DO` 03/10 ghi 249 · 261 · 281 — lệch 1 và 4 giờ, chưa rõ vì sao.

## Đã đổi

- `data/policy.json` `gioNoDu` 3 → 2.
- `data/eureka.json` Kiến trúc vòm · In ấn · Kế toán kép · Động cơ hơi nước: 9/14/18/22 kho → 200/210/240/270 công
  trình. Chọn theo số nhà của bản mới ở đúng giờ `main` nổ (194 · 214 · 243 · 270 nhà ở giờ 4 · 20 · 44 · 68).

## `sim:van -- --lam-lai` (5 hạt giống)

| | Thống trị | Khoa học | Văn hoá | Ngoại giao | Bỏ mặc thua |
|---|---|---|---|---|---|
| `main` | 3/5 | 3/5 | 5/5 | 4/5 | 5/5 |
| Nhánh, chưa chỉnh | 1/5 | 2/5 | 5/5 | 4/5 | 5/5 |
| **Bản đẩy** | **3/5** | 2/5 | 5/5 | 4/5 | 5/5 |

Khoa học tụt cả ở nhánh chưa chỉnh (`TIEN_DO` 03/10 chỉ ghi thống trị). Ván thua là lối chơi chỉ nghiên cứu bị mất
thủ đô; `main` cũng thua hạt 1 như vậy, và hạt nào thua thì đổi giữa các bản — `gioNoDu` không phải gốc.

## Phản biện (Gemini, vịt cao su) — 3 ý, không ý nào đứng

1. "Mốc 200–270 nhà không nổ đúng giờ nếu nhà khởi đầu nhỏ hơn" — thành phố mở ván ~190 nhà, đã đo nổ đủ (19 · 17 · 19).
2. "6 kho sẽ nghẽn khi lên 420+ nhà" — giờ nào có ≥ 2 lượt bỏ cuộc thì thống đốc đã tự xây kho; kho vẫn 6 suốt 320 giờ.
3. "Mất thủ đô giờ 231 do `gioNoDu`" — nhánh chưa chỉnh cũng thua 2/5 ván khoa học, chỉ khác hạt.

## Còn nợ (ghi `docs/NO_KY_THUAT.md`)

Thẻ khẩn "Đường đông nghịt" (`dinh` ≥ 600) và luật thống đốc xây kho (`nguongDinh` 600) không bao giờ chạm nữa.
