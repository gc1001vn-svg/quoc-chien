# Phiên 20/09 (lần 3) — kiểm 7 khoá sau khi xoay, không chạm mã game

## Làm gì

Chủ dự án hỏi: đủ 7 khoá chưa, `GEMINI_API_KEY` còn đuôi `ICfQ` không, gọi thử cả 7.

- **Xoay rồi.** Đuôi nay `mVEA`, dài 53 ký tự, khác `ICfQ` của khoá lộ 19/09.
- **Đủ 7 khoá** (tính cặp Openverse là hai chuỗi). Gọi thật từng cái, không in chuỗi:
  Gemini `200` · DeepSeek `200` · Freesound `200` · Poly Pizza `200` · Openverse `200` ·
  xAI `403`.
- `403` của xAI **không phải khoá sai**, nguyên văn: `Your team … has either used all
  available credits or reached its monthly spending limit.`

## Hai chỗ tài liệu sai, đã sửa

1. **"50 model" là số SAI** — `/v1beta/models` mặc định `pageSize=50` nên cắt bớt. Tổng
   thật **58 model**, phải thêm `?pageSize=200`.
2. **Lệnh liệt kê khoá bỏ sót `OPENVERSE_CLIENT_ID`** — tên biến không khớp regex
   `/KEY|TOKEN|SECRET|_API/i`. Đếm bằng regex đó ra 6, tưởng thiếu một. Đã ghi bẫy vào
   `docs/TIEN_DO.md` mục 3.

## Hai thứ về môi trường máy ảo

- **Ô `Setup script` đang RỖNG.** Chữ `#!/bin/bash` / `npm install` trong ô là **chữ gợi ý
  màu xám**, không phải script đã lưu — cùng sắc với `No credentials yet.` ở ô trên. Vì
  vậy dòng `Run setup script` là vòng tròn xám (bỏ qua), không phải lỗi. Hệ quả: mỗi phiên
  phải chạy tay `npm ci`, mất một lượt gọi.
- **Khoá lộ lần hai, lần này bằng ẢNH CHỤP.** Ảnh ô `Environment variables` đọc được trọn
  `XAI_API_KEY` (84 ký tự) và `FREESOUND_KEY` (40 ký tự); `GEMINI_API_KEY` bị cắt, lộ một
  phần đầu. Luật cũ "không gõ khoá vào chat" **chưa đủ** — phải thêm: **không chụp ô đó**.

## Số đo

`npm run do`: 11/11 thước đạt. Commit `3f136d8`, đã gộp `main`.
