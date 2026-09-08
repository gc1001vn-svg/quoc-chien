# PHASE 6 — Thẻ quyết định: game chơi được (08/09/2026)

Mốc lớn thứ nhất của kế hoạch. Trước phiên này chủ dự án chỉ ngồi nhìn; giờ thành phố
hỏi, và câu trả lời làm thành phố đổi thật.

## Đã làm

- `src/sim/decision/Engine.ts` + `data/decisions.json` + `data/balance.json`: quét điều
  kiện mỗi giờ game, chọn thẻ điểm cao nhất chưa hỏi gần đây. Thẻ **khẩn** phá được luật
  giãn cách nhưng không phá luật không hỏi lại.
- `HauQua.ts`: xây nhà, xây kho, đổi ngưỡng thống đốc, nới trần. Mọi thứ đi qua
  `ThanhPho.xayNha`/`xayKho` của Phase 5 — không có đường đặt nhà thứ hai. Báo cả việc
  **không** làm được (`Xây Cối xay 0/2`).
- `NhatKy.ts` + `ui/NhatKySuKien.ts`: một dòng thời gian duy nhất, bốn dòng gần nhất hiện
  góc trái.
- `Van.ts` nối thống đốc + động cơ + nhật ký làm một, nên `sim:thu` và game trong trình
  duyệt chạy **y hệt nhau**.
- `ui/DecisionCard.ts`: tấm chắn trượt lên từ đáy, che dưới một nửa màn. Dừng sim lúc hiện,
  trả lại **đúng** tốc độ cũ lúc đóng. Mặt được và mặt mất nằm ngay trên nút.
- `ui/TocDo.ts`: dừng · 1× · 2× · 4× · 8×.
- Tên nhà, tên hàng và toàn bộ chữ trên thẻ chuyển sang tiếng Việt **có dấu**.

## Số đo

`npm run do` **6/6 đạt**, **124 test** (trước 108). `npm run sim:thu` **ĐẠT**, 10 giờ game,
tự chọn lựa chọn đầu tiên: **5 thẻ đã hỏi · 94 → 105 nhà · 4 kho · 84.058 chuyến một giờ ·
đông nhất 321 người · 0 bỏ cuộc.** (Phase 5: 71.156 chuyến.)

Ảnh máy ảo: **547 sprite · 1 lệnh vẽ** ở 1,00× — tấm chắn không đụng gì tới phần vẽ.

## Hai chỗ suýt hỏng

1. **Thẻ chỉ hỏi ở mốc giờ game.** Một giờ game ở 1× là **một giờ thật** — mở game ra
   ngồi 60 phút không ai hỏi gì. Chữa hai đường: `Van.batDau()` hỏi ngay một thẻ bằng
   bảng số của giờ `moDau` vừa chạy, và thêm nút tốc độ (8× thì một giờ game còn 7,5 phút).
2. **Chữ trong game không dấu.** Luật "không dấu" của dự án chỉ áp cho commit và ghi chú
   trong code — chữ người chơi đọc thì phải có dấu. Đã thêm một test chặn: văn thẻ không
   có dấu là hỏng.

## Dọn kèm

`Cham.ts` khai `interface ThongKe` **hai lần y hệt nhau** — TypeScript gộp lại nên không
ai thấy. Đã xoá bản thừa.
