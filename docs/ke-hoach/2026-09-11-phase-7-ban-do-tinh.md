# Phase 7 — bản đồ tỉnh — 11/09/2026

## Hỏi đáp trước khi lập kế hoạch

- Hỏi: Vào bản đồ tỉnh bằng cách nào? → Đáp: **Nút góc màn, bấm qua lại.**
- Hỏi: Bấm vào một tỉnh thì Phase này làm được gì? → Đáp: **Chọn ô, chọn công trình, xây luôn.**
- Hỏi: Lớp chiến dịch có chạy theo thời gian không? → Đáp: **Có, nhưng chỉ nhịp xây.**

Ba điều đã chốt 11/09 (`TIEN_DO.md` mục 5), phiên này không hỏi lại: ô lục giác ·
4 nước · 28 tỉnh · mỗi tỉnh 7 hex.

---

Việc: Dựng lớp chiến dịch — 4 nước, 28 tỉnh lục giác, bấm tỉnh chọn ô xây công trình,
và một màn bản đồ vẽ được, bấm nút qua lại với màn thành phố.

Xong là khi: Trên iPhone bấm nút "Bản đồ tỉnh" thấy 28 tỉnh lục giác bốn màu phe,
bấm một tỉnh của mình thấy 4–6 ô xây dựng, chọn công trình thì ô đó đổi hình sau N lượt,
bấm "Về thành phố" quay lại đúng chỗ cũ.

Cách đo:
  `npm run do` → **6/6 thước** (nay 6/6, 133 test).
  `npm run sim:thu ban-do` → in bảng 28 tỉnh: chủ sở hữu, số ô trống/đang xây/đã xây;
  chạy 200 lượt không có tỉnh nào kẹt, không ô nào xây hai lần.
  `npm run chup:man '?man=ban-do'` → tôi tự nhìn ảnh; **sprite ≤ 5.000 · lệnh vẽ ≤ 4 ·
  trang atlas cùng lúc ≤ 4** (nay 2 trang, mỗi mức 1).

Phương án A (đề xuất): nướng mẻ hex riêng `hex_1` từ gói `kaykit-medieval-hexagon`
(CC0, đã có trong kho, 187 tên `hex_*` + nhà 5 màu) · `sim/campaign/` thuần TS +
`render/MapScene.ts` + nút đổi màn · ~cả phiên · rủi ro: sprite hex nướng ra không
xếp khít, hoặc mẻ mới vượt trần trang atlas.
Phương án B: không nướng, vẽ lục giác bằng màu phẳng trong shader · ~nửa phiên ·
rủi ro: bản đồ trông khác hẳn 6 phase trước, và phải viết đường vẽ đa giác mới
chỉ dùng một lần — sau này thay bằng sprite thì bỏ đi.
  Vì sao chọn A: gói hex đã nằm sẵn trong kho, đúng phong cách KayKit đang dùng,
  và 5 màu nhà là 4 phe + trung lập chứ không phải tô màu giả.

Giả sử A hỏng rồi — ba lý do:
  1. Hex nướng ra hở/chồng mép vì bước lưới sai → **chặn**: nướng MỘT hex trước, đo
     rộng·cao ảnh, chụp cụm 7 hex nhìn tận mắt, khít rồi mới nướng cả mẻ.
  2. Mẻ `hex_1` vượt một trang ở mức 2× → **chặn**: nướng 1× trước, đọc số trang trong
     JSON; vượt thì bỏ 15 sprite đường và 15 sprite sông trước, không hạ độ nét.
  3. Phình quá một phiên vì ôm cả quân đội/ngoại giao → **chặn**: cắt cứng, xem mục
     KHÔNG làm.

Lùi bằng: không gộp `main`. Màn bản đồ chỉ là một nút thêm vào màn thành phố — bỏ nút
và bỏ `MapScene.ts` là về đúng Phase 6, không đụng gì lớp thành phố.

KHÔNG làm: quân đội và trận đánh (Phase 9) · ngoại giao (Phase 11) · AI nước khác bành
trướng · sương mù giấy da động (vùng chưa khám phá chỉ là màu nền tĩnh) · công trình tỉnh
đổ hàng vào kho thành phố (giữ hai lớp tách nhau, tránh vỡ cân bằng Phase 3–6).

Cần anh trả lời: không có — ba câu đã hỏi xong ở trên.
