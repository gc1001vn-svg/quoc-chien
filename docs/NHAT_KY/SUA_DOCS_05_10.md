# Sửa docs lệch 05/10 (lần 38) — theo rà xung đột 05/10

Anh giao 05/10: sửa 4 file docs lệch theo kho `ghi-nho`, `nang-cap/ra-soat-xung-dot-05-10.md` mục "Phiên 2".
Không đổi game, không đổi `data/`.

- **`docs/MOI_TRUONG.md`:** 3 chỗ trỏ "`docs/TIEN_DO.md` mục 3" (nội dung dời sang chính file này 29/09) → trỏ đúng mục
  "Đặt khoá vào môi trường", "Ô Allowed domains GHI ĐÈ" (bảng 18 host), và kho `cong-cu/allowed-domains.txt` (danh sách đủ).
  Khối "Sửa 17/09 … Không có mục đó" thêm dòng đính chính: CÓ `API credentials` (19/09), chỗ đúng vẫn `Environment variables`.
- **`docs/NO_KY_THUAT.md`:** gạch dòng "`session-start-hook` khai sai tên" — đo 05/10: thư mục `~/.claude/skills/session-start-hook/`,
  `name: startup-hook-skill`; `skillOverrides` khớp tên thư mục nên khoá đúng. Không phải nợ.
- **`docs/TECH_SPEC.md`** (file khoá, anh đồng ý 05/10, 3 vé): nợ xếp atlas trỏ `NO_KY_THUAT.md` · bỏ số gõ tay "1.855 model"
  · mục 10 lệnh trước commit → `npm run do`.
- **`docs/GAME_SPEC.md`** (file khoá, anh đồng ý, 1 vé): mục 12 thêm "(font thêm OFL)" cho khớp `AGENTS.md`.
- Kèm: 4 chú thích `scripts/` do `cai_dat.mjs` chép từ kho (sửa đếm hook, trỏ mục đã dời).

Số đo: `npm run do` 17 thước DAT, 2 BO QUA (`do:luat`, `luat:sau` — không đổi `AGENTS.md`, `src/sim/`, `data/`).
