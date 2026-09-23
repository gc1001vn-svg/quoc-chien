# Phase 8D — mở đường lên đời 4 và 5 (23/09)

Chủ dự án chốt 23/09: phiên này 8D ngắn, phiên sau Phase 9 trận đánh đúng `KE_HOACH.md`.

## Đo trước (23/09, `npm run sim:congnghe`, 120 giờ)

Đời 3 · 21/24 công nghệ · **241 nhà** / trần 414. Lên đời 4 đòi 270 nhà → kẹt.
Đời 4–6 `len: null`, `tech.json` chỉ có công nghệ đời 1–3.

## Gốc chặn

`Governor.nhaCanXay` chỉ xây nhà **làm ra** món đang thiếu. Không gì xây thêm `nha_dan`
(nhà **tiêu thụ**), nên nhu cầu cố định từ bản đồ đầu → thành phố cân bằng ở 241.
Nâng trần hay hạ `nguongCho` đều vô ích — đã đo 11/09.

## Làm gì

1. **Dân kéo về khi đủ ăn.** `Governor`: không thiếu món nào liên tục `gioNoDu` giờ
   → xây một nhà trong `nhaDanMoi` (bắt đầu: `nha_dan`). Hai số mới ở `data/policy.json`.
   Test trước ở `tests/` (đỏ rồi mới sửa).
2. **Công nghệ đời 4 và 5** vào `data/tech.json`: 8 + 8 cái, tên lịch sử thật, ≤2 tiền đề,
   `moThe: []` (thẻ mới để phase sau), thưởng cùng khuôn `noiTran`/`doiNguong`.
3. **Mở `len`** đời 4→5 trong `data/balance.json`. Đời 5→6 **giữ `null`** (tương lai là
   Phase 12). Số `soCongNghe`/`soNha` chốt **theo số đo**, không đoán.
4. `sim:congnghe`: thêm tham số số giờ (mặc định 120).

## Đo bằng gì

- `npm run sim:congnghe` 120 giờ: **tới đời 4**, nhà > 270.
- `npm run sim:congnghe 240`: **tới đời 5** — mẻ `hien_dai` hiện ra không cần `?me=`.
- `npm run sim:thu`: không hàng âm, không chuỗi kẹt.
- Trần hiệu năng (`TECH_SPEC` mục 2): walker đỉnh < 600, số sprite trong trần. Vượt là
  lỗi, cắt `nhaDanMoi`/`gioNoDu` cho tới khi dưới.
- `npm run do` xanh.

## Lùi bằng gì

`gioNoDu` đặt rất lớn là tắt luật dân kéo về; `len` về `null`. Không sửa `.ts` nào ngoài
`Governor.ts`, `Policy.ts` và script sim.

## Rủi ro

- Thành phố phình → walker kẹt, fps iPhone tụt. Có thước đo, không có thước trên máy thật —
  sau phiên phải nhờ anh đo fps.
- Mẻ trung cổ 2× hết chỗ atlas: 8D không thêm sprite nào, không đụng.
