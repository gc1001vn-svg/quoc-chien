# THANG CHẤM HÌNH — người chấm độc lập trước khi gửi anh

> Kế hoạch: kho `ghi-nho` `docs/ke-hoach/2026-10-09-nang-cap-dot-7.md` món 2 (anh duyệt 09/10).
> Ý gốc: bài Anthropic 24/03/2026 — người làm không tự chấm bài mình; một agent khác chấm theo thang cố định.
> **Lời trong ngoặc kép là chữ của anh, chép nguyên văn từ `docs/NHAT_KY/`, `TIEN_DO.md`. Không thêm tính từ khác.**

## Cách chấm

- Người chấm nhận: ảnh (hoặc bảng ảnh) + **một dòng "bản này đổi gì"**. Chấm **phần đổi**, không chấm lại cả game
  — anh khen "Ưng rồi" bước xây nhà 05/10 trong khi cả thành phố vẫn là bản anh chê "chán" 30/09.
- Mỗi tiêu chí: **ĐẠT** hoặc **TRƯỢT**. Trượt phải chỉ **chỗ trong ảnh** (góc nào, vật gì). Không chỉ được chỗ thì
  không tính lỗi. Không chấm điểm, không khen.
- **Một tiêu chí trượt = SỬA TRƯỚC, chưa gửi anh.** Cả bốn đạt = GỬI.
- Ảnh phải **chứa phần đổi** (chụp đúng chỗ: `?o=a,b`, `?xay=`, `?gio=`); dòng "đổi gì" dùng chữ nghĩa đen — ghi "ánh sáng",
  đừng ghi "đèn" (đo 09/10: người chấm hiểu "đèn mới" là cột đèn, tìm không thấy, đánh trượt).

## Bốn tiêu chí

**1. Đồng bộ phong cách** (`ART_BIBLE.md` luật 1, 9)
- Anh chê: "gượng gạo" (29/09, ruộng, trại ghép 6 tay vẽ: rào đá, lều màu bệt cạnh nhà có hoạ tiết, gà dê mỗi con một kiểu).
- Trượt khi: hai món cùng loại công trình khác tay vẽ (màu bệt cạnh hoạ tiết) · một con thú, đồ vật lạc kiểu so với nhà quanh nó.

**2. Có hồn riêng** — không phải cảnh "mặc định"
- Anh chê: "các công trình vẫn nhìn rất là chán" (30/09, sau khi đã sửa đèn — "màu thì ổn hơn") · "vẫn đơn điệu" (25/09, trận) ·
  "đừng lấy game đồ hoạ thấp làm mẫu nữa" (04/10).
- Anh khen: "Ưng rồi, không thấy que đè." (05/10 — nhà mọc dần, giàn giáo, bụi, thợ gõ).
- Trượt khi: phần đổi chỉ là nhà giống hệt nhau xếp hàng · không có gì đang xảy ra (không người làm, không khói, không việc) ·
  thiếu đồ quanh nhà, nền lót (`ART_BIBLE.md` luật 6, 11).

**3. Tay nghề — bằng số, không bằng mắt** (`ART_BIBLE.md` luật 2, 3, 5, 7)
- Ảnh ban ngày: độ sáng TB **≥ 0,36**, bão hoà **≥ 0,37** — số đo do người gửi kèm (`node tools/do_hinh.mjs`), người chấm không ước.
- Trượt khi: số dưới ngưỡng · nền ô tối xen ô cỏ như bàn cờ · một vật to nhỏ lệch hẳn cỡ cùng loại · que, mảnh hình đè lên vật khác.

**4. Nhìn ra cái gì là gì** (`ART_BIBLE.md` luật 12)
- Anh chê: "chỉ thấy húc vào nhau" (25/09, trận) · kỵ binh "chỉ thấy đầu" (25/09) · "mượt nhưng không thấy cái gì di chuyển cả" (Phase 4) ·
  không thấy nút trận cờ vì khung che (26/09).
- Trượt khi: không gọi tên được một vật trong phần đổi · lính, người chỉ là chấm hay khối · nút, chữ bị che, tràn, chồng nhau.

## Mẫu trả lời

```
1 Đồng bộ: ĐẠT | TRƯỢT — <chỗ trong ảnh: vật gì>
2 Có hồn:  ĐẠT | TRƯỢT — <chỗ>
3 Tay nghề: ĐẠT | TRƯỢT — <số hay chỗ>
4 Nhìn ra: ĐẠT | TRƯỢT — <chỗ>
Kết: GỬI | SỬA TRƯỚC
```

## Độ khớp với anh — đo trước khi tin

Chấm lại ảnh dựng từ bản cũ anh đã phán (build lại đúng commit, `chup_man`), người chấm **không biết** lời anh.

**Đo 09/10 — Haiku 5.5 (agent chỉ đọc), 5 ảnh: khớp 4/5.** 7 lượt công cụ · ~99 nghìn token · 4 phút.

| Ảnh (commit) | Anh phán | Người chấm | Khớp |
|---|---|---|---|
| Trận đầu tiên `?tran=1` (`b46ac80`, 25/09) | chê: "chỉ thấy húc vào nhau" | SỬA TRƯỚC — lính xa chỉ là khối, nhật ký đè lính | ✓ |
| Ruộng trại thêm gà, dê (`c7373e3`, 28/09) | chê: "gượng gạo" | SỬA TRƯỚC — sáng 0,28 < 0,36, mái bạt bệt cạnh nhà hoạ tiết | ✓ (khung không có gà, dê) |
| Đèn mới cả thành phố (`5ad7372`, 30/09) | chê: "vẫn nhìn rất là chán" | SỬA TRƯỚC — nhà một mẫu lặp lại | ✓ (thêm một lý do sai: tìm cột đèn) |
| Nhà xây dần `?xay=nha_dan&xayTien=0.45` (`1691b50`, 04/10) | khen: "Ưng rồi, không thấy que đè." | GỬI | ✓ |
| Giao diện iPhone dọc (`81fa24d`, 04/10) | "ok" | SỬA TRƯỚC — nút tốc độ hiện mờ xuyên thẻ thứ ba | ✗ — lỗi **có thật**, còn ở bản 09/10 |

Đọc ra: Haiku đủ tin cho kết GỬI / SỬA TRƯỚC; lý do từng dòng vẫn phải kiểm lại bằng mắt. Khắt hơn anh ở lỗi giao diện nhỏ.
Chưa đo: ảnh khen nhiều hơn (mới 2/5), ảnh iPhone thật từ `anh-ios` (món 1, chờ vé).
