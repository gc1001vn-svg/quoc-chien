# Phiên 20/09 (lần 4) — đo ba khoá LLM ngoài, dựng `hoi_gemini.mjs`

Không chạm mã game. Phiên đo xem Gemini, DeepSeek, Grok phân việc được gì.

## Đo được gì

- **Chỉ Gemini flash dùng được.** `gemini-3.7-flash` · `3.5-flash` · `3.1-flash-lite` đều
  `200`. `gemini-3.1-pro-preview` `429` (`limit: 0`), `gemini-3-pro-image` (nano-banana-pro)
  `429` → **sinh ảnh asset không dùng được**.
- **DeepSeek `402 Insufficient Balance`**, `GET /user/balance` trả `total_balance "0.00"`,
  `is_available:false`. Đo 6 lần, không lần nào qua.
- **xAI `403 permission-denied`**, `/v1/api-key` `200` báo `team_blocked:true`,
  `api_key_blocked:false` — khoá đúng, team hết credit.
- **Vì sao phiên trước tưởng DeepSeek chạy:** đo bằng `/models` (không tính tiền) nên ra
  `200`. Endpoint tính tiền mới nói thật.
- **Trần free tier Gemini, API tự khai khi ép 8 request song song:**
  `GenerateRequestsPerMinutePerProjectPerModel-FreeTier (5)` — 5 req/phút **riêng từng
  model**. 5 lần tuần tự 5×`200`; 8 lần song song 7×`429`.
- **`503 high demand`** ~15% số lần gọi trong ngày; retry 2 lần + tụt bậc model cứu hết.
- **Free khác đều bị allowlist chặn:** `openrouter.ai` · `api.groq.com` · `api.mistral.ai`
  · `api.cerebras.ai` · `models.github.ai` … đều `CONNECT tunnel failed, response 403`.
  Tính ra **không đáng xin mở**: nhịp gọi thật không chạm trần 5/phút, tụt bậc đã đủ.

## Đổi gì

`ghi-nho/cong-cu/hoi_gemini.mjs` (kho ghi nhớ, không nằm ở repo này): ném file lớn sang
Gemini lấy đáp ngắn. Chặn cứng repo private và chuỗi giống API key; gọi bằng `curl` vì
`fetch` của Node không đi qua CONNECT của proxy. Lãi: `NO_KY_THUAT.md` 34 KB = 11.437 tok
nếu Claude tự đọc, qua Gemini còn ~222 tok.

Luật: `ghi-nho/quyet-dinh/2026-09-20-goi-gemini-flash-cho-viec-nhap.md`.

## Việc của chủ dự án

Xác nhận việc 19/09 (cối xay trên iPhone) **chạy OK** → bước E hết treo, phiên sau mở
thẳng Phase 9.
