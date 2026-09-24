# Phiên đồ nghề 23–24/09 — hook chặn đọc file lớn, dò đường Gemini trả phí

Không chạm mã game. Không mở phase mới.

- Tra autoharness, oh-my-openagent, shunt (Spotify): **không cài cái nào**. Lý do:
  `ghi-nho/quyet-dinh/2026-09-23-autoharness-omo-shunt-khong-dung.md`.
- Lấy ý shunt → hook **`chan_doc_lon.mjs`** (PreToolUse, matcher `Read`): `Read` không
  `offset`/`limit` mà file quá ~10.000 token (`byte/3`) thì chặn, chỉ ba đường thay. Không
  chặn `cat`. Bản gốc ở kho, cài bằng `cai_dat.mjs` (commit `31576d6`).
- `hoi_gemini.mjs` (kho) nhận ảnh qua `--anh`. Đo 5 loại việc đưa Gemini Flash: hỏi file lớn
  4/4, rà diff 2/2, đọc ảnh 3/3; viết test chạy nhưng còn 1 lỗi `tsc` + 10 `eslint`; tra web
  `429`. Bảng xếp loại: `ghi-nho/quyet-dinh/2026-09-23-viec-nao-dua-sang-gemini.md`.
- Gói AI Pro không dùng cho API. Đường 10 USD tín dụng Cloud cần thẻ + nạp trước 5 USD →
  chủ dự án chọn **Jules** (ăn quota gói, không cần thẻ). Khoá `JULES_API_KEY` đã thêm.
- **Số đo:** `npm run do` 17/17 đạt (23/09) · kho 52/52 mẫu.
- **Bài học:** đưa link bước 1 sai (`/profile` thay `/program/my-benefits`) — trang Google bị
  máy ảo chặn nên không tự mở kiểm được; link lấy từ nguồn thứ ba phải nói rõ là chưa kiểm.
