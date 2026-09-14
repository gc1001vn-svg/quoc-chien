# Phiên 14/09 — hook nhắc kho + fail-open

**Không đụng màn hình game.** Game vẫn ở Phase 8A. Phiên này đọc mã nguồn
`supermemoryai/claude-supermemory` (MIT) rồi lấy ba thứ về.

## Vì sao không cài supermemory

Plugin của họ là **hook + lệnh gạch chéo** — đúng hai thứ **không** đồng bộ xuống
phiên web (`~/.claude/plugins/synced/<bucket>/` đo lại 14/09 vẫn rỗng,
`anthropics/claude-code#92031` còn mở). Chủ dự án làm trên iPhone nên cài vào là
không chạy dòng nào. Bản local cần server chạy liên tục, máy ảo xoá mỗi phiên.
Auto-capture còn đẩy nguyên hội thoại lên server họ.

## Ba thứ lấy về

1. **`scripts/nhac_kho.mjs` — hook `UserPromptSubmit`.** Tra bốn file kho theo từ
   khoá câu vừa gõ, chèn 1–2 khối. Tra **trong hook** tốn 0 lượt gọi; đợi model
   tự quyết đi tra tốn một lượt (13/09: 400.323 token/lượt).
2. **`dau_phien.mjs` in giá token của chính nó** — 2 dòng ≈ 26 tok. Trần "dưới
   ~10 dòng" trước giờ ước bằng mắt.
3. **Bốn hook cũ thêm lưới `uncaughtException`/`unhandledRejection` → thoát 0.**
   Trước đó `file_path` là object làm `isAbsolute()` ném lỗi, cả vệt stack vào
   ngữ cảnh. Fail-open, không fail-closed: 12/09 đo 13 lần chặn thì 4 lần chặn nhầm.

## Bốn lỗi đã sửa khi chỉnh `nhac_kho.mjs` (đều do đo, không do đoán)

- **Nối hai dòng không liền nhau** làm câu đọc ra **nghĩa ngược**: dòng "mở được
  `kenney.nl`" dính liền dòng "chặn `sketchfab.com`". Nay cách ≤ 3 dòng thì lấy cả
  phần ở giữa, xa hơn thì chèn dấu `…`.
- **`includes()` khớp giữa từ**: "đẹp"→`dep` nằm trong `deploy`, "quá"→`qua` nằm
  trong `quốc`. Câu tán gẫu chấm điểm như câu hỏi thật. Nay so theo **từ riêng biệt**.
- **Bỏ dấu làm từ hỏi đụng từ thật**: "đâu"→`dau` dính "đầu phiên". Vào `TU_RAC`.
- **Điểm không tách được** "hỏi đúng một từ hiếm" với "trúng vu vơ một từ". Thêm
  **bao phủ** ≥ 40% số từ đang tra.

Đo cuối: 8/8 thước đạt · hook chạy 67 ms · chèn ~150–230 tok/lần, không lặp lại
trong cùng phiên.
