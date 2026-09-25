# PHASE 9 — phụ: quy trình Jules và kiểm chéo (25/09/2026)

Không chạm mã game. Chi tiết số đo: `ghi-nho/cong-cu/jules/PHAN_VIEC.md`.

- **Đánh giá Jules** (3 lần giao 23–25/09): tự báo sai 2/3; soát Phase 9 ra 0 lỗi mới;
  đứng 9 giờ 22 phút vì `giao_jules.mjs lay` không nhận trạng thái chờ → đã sửa ở kho.
- **`AGENTS.md`** (anh duyệt, 2 vé): một dòng trỏ `docs/JULES.md` — `check:token` 1.597/1.600.
- **Môi trường Jules:** "Run and snapshot" chạy được (445 gói, 12 s) nhưng phiên giao qua API
  vẫn **không có `node_modules`** — `~/.npm/_logs` chỉ có log ngày dựng ảnh gốc. Jules tự
  `npm ci` mất 10,6 s.
- **`npm run kiem:cheo`** (`scripts/kiem_cheo.mjs`): máy ghi kết quả 4 thước ra JSON,
  `--so-sanh` hai máy. Lần đầu: Jules kiểm số của Claude trên commit `3ed381e` → **KHỚP**
  (363/363 test, `sim:tran` lệch 2,24). Chạy thử bắt 3 lỗi của chính công cụ.
- **Chưa có test riêng cho `kiem_cheo.mjs`** — mới thử tay hai chiều.
