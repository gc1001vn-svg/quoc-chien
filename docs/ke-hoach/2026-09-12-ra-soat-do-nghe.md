# Rà soát lịch sử + đo thật bộ đồ nghề dùng chung — 12/09/2026

**Việc:** rà soát lịch sử mọi dự án/phase/phiên, kiểm kê và **đo thật** mọi thứ dùng chung
(skill · plugin · hook · kho `ghi-nho` · `skillOverrides` · `CLAUDE.md`), liệt kê đầy đủ.
**Không quyết gì** — chủ dự án chốt sau khi đọc số.

**Kết quả nằm ở:** `ghi-nho/nang-cap/ra-soat-do-nghe.md`.

## Hỏi — đáp

- Hỏi: Luật chung để quyết "thứ này để ở đâu" chốt theo hướng nào? → Đáp: **chưa trả lời** —
  chủ dự án dừng lại, yêu cầu rà soát và đo trước khi quyết.
- Hỏi: Skill trên claude.ai xử lý thế nào? → Đáp: **chưa trả lời**, lý do như trên.
- Hỏi: Chống lệch mồi giữa các repo bằng cách nào? → Đáp: **chưa trả lời**, lý do như trên.
- Hỏi: Lịch sử chat trên claude.ai có lấy được không? → Đáp: **chưa trả lời**; phiên này
  ghi vào mục "chưa đo được", không đoán thay.

## Cách đo — sáu thước

1. Cỡ thật từng khối nạp vào phiên — `wc -c`.
2. Lịch sử phiên — `list_sessions`, tách bằng `node`, đếm `d.ccr.data.length`;
   token thật lấy ở `external_metadata.context_usage.used_tokens`.
3. Hook — chạy lại `chan_file_khoa.mjs` và `chan_bao_xong.mjs` với input JSON thật.
4. `skillOverrides` — đối chiếu 25 khoá với `manifest.json` và danh sách harness in ra.
5. Lệnh đo repo — `npm run do` · `bash scripts/do.sh`.
6. Mồi vào kho — `grep -l 'git clone .*ghi-nho'` trên `CLAUDE.md` từng repo.

## Số đo ra được

- **38** phiên (09/08 → 12/09), **không phải 42** — 42 là đếm nhầm cả `parent_session_id`.
- Token: tổng **10.798.806**, trung bình **348.349**/phiên, max **745.344**.
- Commit: `quoc-chien` **141** · `ghi-nho` **77** · `vsp-fleet-safety` **51** ·
  `chung-cho-claude-code` **2**.
- Mồi vào kho ghi nhớ: **1/5 repo** có thật.
- `chan_file_khoa.mjs`: **3 bản khác nhau** ở 4 repo; bản gốc trong `cong-cu/` **lạc hậu
  41 dòng**. Bản mới **9/9 ca đúng**; `chan_bao_xong` **8/8 ca đúng**.
- `skillOverrides`: **11/25 khoá có ăn**, tiết kiệm **5.450 ký tự**/phiên; **1 khoá sai tên**.
- Lệnh đo: `npm run do` **6/6** · `bash scripts/do.sh` **27/27**.

## Đường lùi

Phiên này chỉ **thêm hai file mới**, không sửa hook, `settings.json` hay `CLAUDE.md` nào.
Lùi = xoá hai file.
