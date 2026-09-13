# Phiên 12–13/09 — rà soát và đồng bộ bộ đồ nghề (không đụng game)

Chủ dự án dừng việc bàn "thứ dùng chung để ở đâu", bắt **đo thật toàn bộ lịch sử** trước
khi quyết. Phiên kéo hai ngày, không đụng một dòng nào của game.

**Đo được:** 38 phiên Claude Code (09/08→12/09) + 61 hội thoại claude.ai (09/06→26/08) —
lịch sử liền mạch. Token thật đọc được từ `external_metadata.context_usage.used_tokens`.

**Ba phát hiện đắt nhất:**
1. **Có NĂM chỗ để thứ dùng chung, không phải ba** — thiếu **cài đặt cá nhân** (tự nạp cả
   claude.ai lẫn Claude Code) và **bộ nhớ claude.ai** (Claude tự ghi, không tới Code).
   Cả 7 luật sở thích trong kho đã nằm sẵn ở cài đặt cá nhân → trả tiền hai lần.
2. **Một luật nằm 4–6 nơi.** Đã gộp: mỗi luật đúng một chỗ.
3. **`skillOverrides` 26/26 khoá đều có ăn** — 12.546 ký tự/phiên. Đo A/B làm được trong
   **một** phiên: đổi nhánh là harness nạp lại danh sách skill ngay.

**Đã làm:** gộp trùng lặp · hợp nhất ba bản `chan_file_khoa.mjs` thành một (`md5 cadf0d7e`)
· đồng bộ hook + `skillOverrides` sang **cả bốn repo** · `cong-cu/cai_dat.mjs` cài một lệnh
vào repo mới · `giam-token` thành **thước** `check:token` trong lệnh đo, hết cảnh phải nhớ
gọi · thang tra-trước-khi-viết và luật đọc file lớn vào kho, áp mọi repo.

**Số đo:** `npm run do` **6/6 → 7/7** · `CLAUDE.md` **101 dòng 2.237 token → 57 dòng 1.191**
· `ghi-nho` 27/27→28/28 · `vsp-fleet-safety` 1/3→4/4 (thiếu `httpx2` trong
`requirements.txt`, không phải lỗi code) · `tayvuc` 65→215 và 98→107 dòng hook.

**Sai của chính phiên này, đã sửa:** "42 phiên" → thật **38** · "18 skill" → **17** ·
"50 commit" → **141** (đếm trên kho nông) · "25 khoá" → **26** · "`ponytail` vô dụng" → nó
chính là thang tra-trước, thiếu là thiếu hook · "`ghi-nho` trùng 100%" → có ba luật riêng ·
lỡ commit vé duyệt lên git, đã gỡ.

**Còn treo:** bộ nhớ claude.ai lệch với kho về phương tiện du lịch (xe máy) — chờ chủ dự án.
