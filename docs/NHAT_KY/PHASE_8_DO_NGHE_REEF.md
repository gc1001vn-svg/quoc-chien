# Phiên 20–21/09 — đồ nghề: bốn thước mới, chép cách làm từ Reef

Không phải phase game. Phiên đồ nghề, `src/` không đổi một dòng.

**Khởi đầu:** tra hai repo — `headroomlabs-ai/headroom` (nén token) và
`Human-Agent-Society/reef` (agent tự cải tiến). **Loại cả hai công cụ**, giữ cách làm.
Lý do đo được: `ghi-nho/quyet-dinh/2026-09-20-headroom-khong-dung.md` và
`2026-09-20-reef-chua-dung.md`.

**Làm được**

- `AGENTS.md` thành bản gốc, `CLAUDE.md` là symlink trỏ vào nó — một file, hai tên.
- `check:nguong` — cấm nới ngưỡng / phình danh sách miễn cho thước khác xanh.
  Mốc `.claude/nguong_goc.txt`; `--ghi` **từ chối** dựng mốc từ số đã nới.
- `check:cap` — cặp file phụ thuộc nhau không được sửa một bên rồi quên bên kia.
- `check:ten` — cấm tên ẩn dụ, và bắt tên đại lượng thiếu đơn vị.
- `do:luat` + `docs/BO_DE.md` — đo xem luật trong `AGENTS.md` có thật đổi hành vi không.
- `scripts/do.sh` khai `BO QUA` trung thực, không tính vào mẫu số.

**Số đo cuối:** `npm run do` 15/15 · `do:luat` luật ăn 10, thừa 0, hỏng 0.

**Ba lần đo lật ngược ý kiến ban đầu**

1. Hai câu ra `THUA` hai lượt liền → định cắt luật. Sửa câu hỏi sang phần **không đoán
   được** thì cả hai thành `LUAT AN`. **Không cắt dòng nào.** Câu hỏi dở, không phải luật thừa.
2. `check:ten` bắt `timeout: 10` ở `ghi-nho/cong-cu/cai_dat.mjs:92` — **bắt oan**, đó là
   trường trong schema hook của Claude Code. Siết lại chỉ bắt khai báo của mình.
3. Dòng "đường về" `[nguon: …]` thêm cho `hoi_gemini.mjs` làm `do:luat` chấm nhầm chính nó
   — cả 10 câu tụt về 0. Thước bắt được. Không thước thì lặng lẽ sai.

**Ba lỗi của tôi trong phiên**

- Sửa `docs/BO_DE.md` bằng `python` (`AGENTS.md` cấm) — regex nuốt mất 4 dòng `## <mã>`.
- Đẩy `ghi-nho` khi thước đang đỏ: `bash scripts/do.sh | tail && git push` luôn qua vì
  `tail` trả 0.
- Viết `nguon.length` tưởng là byte — đó là ký tự UTF-16, tiếng Việt lệch 16%.

**Đo được, chưa sửa:** `get_session` trả `usage` thật — `cache_read` **98,55%** phía prompt,
quy đổi rẻ gấp ~8 lần. Dòng "token đắt ở SỐ LƯỢT gọi" trong `ghi-nho/so-thich.md` thiếu vế
cache. Chưa sửa vì còn thiếu phần trăm gói ở claude.ai → Settings → Usage.
