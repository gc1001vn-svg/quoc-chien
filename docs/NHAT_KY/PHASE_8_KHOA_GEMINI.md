# Phiên 19–20/09 — kiểm khoá Gemini, không chạm mã game

Phiên ngắn, **không mở phase mới**: bước E của bảy bước còn treo (việc 19/09 "xem cối xay
quay trên iPhone" chưa có xác nhận trên máy thật).

## Đã đo

- `npm run do` **11/11 thước đạt** trên máy ảo sạch sau `npm ci`.
- `GEMINI_API_KEY` có trong môi trường, dài **53**, đầu `AQ.`.
- `GET /v1beta/models` → `HTTP 200`, **50 model**.
- Gọi thật `gemini-3.5-flash` → `HTTP 200`, trả `Hanoi`; **11 token vào / 2 token ra**
  (+861 `thoughtsTokenCount`, tổng 874). Dòng Flash chạy được trên free tier.

## Hai thứ mới biết

1. **Ô `Environment variables` không hiện lại giá trị đã lưu khi mở lại hộp thoại.** Chủ
   dự án tưởng mất khoá; máy ảo đọc được bình thường. Hệ quả cũ vẫn đúng và nay nặng hơn:
   **đừng bấm Save khi ô đó đang hiện rỗng** — lưu lúc đó là xoá sạch khoá cũ.
2. **Hook `ghi_so_lenh.mjs` chép 200 ký tự đầu mọi lệnh Bash vào `.claude/so_lenh.log`.**
   Một lệnh `node -e` so chuỗi khoá đã đẩy khoá vào sổ đó. Đã xoá dòng chứa khoá; file
   `.gitignore` nên không lên git (`check:khoa` quét 219 file theo dõi bởi git, 0 khoá).
   **Luật: không bao giờ đặt chuỗi khoá vào thân lệnh Bash**, chỉ tham chiếu qua `$BIEN`.

## Còn treo

Khoá Gemini **đã bị dán vào chat** nên nằm trong lịch sử hội thoại — xoay khoá. Mục 3 của
`docs/TIEN_DO.md` ghi việc này.
