# Bước 1 "xây nhà từng bước" — 04/10/2026

Kế hoạch: `docs/ke-hoach/2026-10-04-buoc-1-xay-nha-tung-buoc.md` (anh duyệt 04/10, kèm đồng ý mở bước 1 khi chưa chơi thử
bản 04/10). Kế hoạch mẹ: `docs/ke-hoach/2026-10-04-moi-thu-tung-buoc.md` việc 1. Chỉ đổi hình — nhà đang xây vẫn sản xuất.

- **Sim chỉ ghi** (`0625d07`): `OVat.nhipXay` cho nhà, kho thống đốc xây thêm. `sim:thu` 97 dòng y hệt, `sim:van` 5 hạt
  y hệt mọi cột trừ cột giây chạy.
- **Vẽ** (`f4aba0f`): `data/tung_buoc.json` · `TungBuoc.ts` (tiến độ thuần theo nhịp) · `HieuUngXay.ts` · kiểu hình
  `que` (9) trong `Hat.ts`. 200 nhịp = 2 s ở 10× mở màn: vạch móng 15 % → mọc từ dưới lên + giàn giáo + bụi + thợ gõ →
  loé 15 % → xong. Giữ trọn từ góc sau ô trở xuống ngay lúc mọc (Gemini: cắt ngang cả sprite chỉ thấy bóng đổ trước).
- **Luật TP16** (`bc56a96`, `tests/BatBienXay.test.ts`): cố tình ghi lệch nhịp +1 → đỏ ngay (`ghi nhip 1907, xay luc 1906`).
- **Chụp, quay:** `?xay=nha_dan` (hay `kho`) thống đốc xây ngay lúc mở · `&xayTien=0.45` ghim giai đoạn · `&xayTien=lap`
  chạy lặp 3 s cho clip. `npm run quay -- "?xay=nha_dan&xayTien=lap" "10×" 9`.
- **Chỉnh sau ảnh đầu:** que 2,4 → 5 (đơn vị atlas), màu gỗ đậm hơn, tầng ván 24 → 30; loé 0,4 → 0,3 (0,4 trắng bệch).
- **Bẫy:** `tests/AiGoi.test.ts` đếm đúng danh sách chỗ gọi `xayNha` theo thứ tự nạp chương trình (không theo chữ cái) —
  thêm `xayThu` thì phải sửa cả hai danh sách.
- **Số:** lệnh vẽ thành phố vẫn 3 (HUD trong clip) · test 606 → 613 (+6 `TungBuoc`, +1 TP16; `AiGoi` thêm 2 chỗ gọi) ·
  `luat:sau` TP16 bản sâu 50 hạt 19 s. Fps iPhone: chưa đo — việc của anh.
- **Còn mở:** que vẽ sau mọi sprite nên đè lên vật đứng trước — đã chặn khi vật trước trùm ≥ 25 % hộp giàn giáo; anh thấy
  lỗi thì báo. Thợ chỉ đổi chân, không có hình vung búa.
- **05/10, anh đo iPhone: 60 fps** (bản 05/10 01:26). Lần mở đầu cả hai link hiện "29/09": service worker phát bản cũ trong
  máy trong lúc tải ~20 MB bản mới (precache 45 file, 19,5 MB). Thử trên máy ảo (Chromium, máy chủ giả Pages max-age=600,
  đổi bản A → B): giây đầu bản cũ, 5 s sau tự tải lại sang bản mới — cơ chế đúng. Anh để yên ~1 phút thì lên. Không sửa mã.
- **05/10, anh duyệt bước 1:** "Ưng rồi, không thấy que đè." Anh luôn mở bằng trình duyệt web (Safari), không qua app Claude.
