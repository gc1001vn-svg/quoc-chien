# Ràng buộc chất lượng — BẢNG CHỈ ĐƯỜNG, không phải nơi chứa số

File này tồn tại để skill `constraint-driven-development` **dừng lại và đọc chỗ đã có**,
thay vì mở một cuộc phỏng vấn rồi đẻ ra bộ ngưỡng thứ hai. Điều kiện dừng nằm trong
chính skill đó (`.claude/skills/constraint-driven-development/SKILL.md`, mục
**When NOT to use**): *"The project already has a `CONSTRAINTS.md` and the user isn't
changing it — read it and follow it instead."*

**Cấm chép số vào file này.** Repo chốt mỗi luật đúng một chỗ; chép sang chỗ thứ hai là
tự tạo chỗ lệch. Mọi con số nằm ở bảng dưới, trong file gốc của nó.

| Ràng buộc | Số gốc nằm ở | Máy bắt bằng |
|---|---|---|
| Cỡ bản build | `docs/TECH_SPEC.md` mục 2 | `.github/workflows/ci.yml` (CI, không phải `npm run do`) |
| Trần hiệu năng còn lại: lệnh vẽ mỗi khung, sprite động, atlas trong bộ nhớ, `setPixelRatio`, nhịp mô phỏng, dòng mỗi `.ts` | `docs/TECH_SPEC.md` mục 2 | **chưa có** — đo 21/09, xem mục "Sàn" dưới |
| Ngưỡng token `CLAUDE.md`, trần dòng kế hoạch, danh sách miễn | `.claude/nguong_goc.txt` | `check:nguong` |
| Cặp file phải đọc lại cùng nhau | `.claude/cap_file.txt` | `check:cap` |
| Tên biến: cấm ẩn dụ, tên mang đại lượng phải có đơn vị | `AGENTS.md` mục Quy ước | `check:ten` |
| File phải hỏi chủ dự án trước khi sửa | `.claude/file_khoa.txt` | hook `chan_file_khoa.mjs` |
| Ba luật kiến trúc (`src/sim/` thuần, cấm số cân bằng trong `.ts`) | `AGENTS.md` | `check:base`, `do:luat` |

Toàn bộ thước: `scripts/do.sh`. Chạy `npm run do` — số thước đạt in ra ở đó,
**đừng gõ tay vào tài liệu**.

## Sàn (floor) — phần skill có mà repo CHƯA có máy bắt

Skill `constraint-driven-development` canh năm nước đi làm yếu thước; `check:nguong`
mới canh được nước thứ nhất:

1. Hạ ngưỡng đã chốt — **đã có máy bắt** (`check:nguong` so với `.claude/nguong_goc.txt`).
2. Thêm dấu tắt kiểm: `@ts-ignore`, `eslint-disable`, `# noqa` — **chưa có máy bắt**.
3. Làm test dễ đi: `.skip`, xoá file test, bỏ `expect` — **chưa có máy bắt**.
4. Hàm rỗng để đó: `throw new Error("Not implemented")`, `catch {}` rỗng — **chưa có máy bắt**.
5. Thêm dòng ngoại lệ mới — **chưa có máy bắt**.

Đo 21/09: `grep` khắp `src/` và `scripts/` không ra dấu nào trong bốn nước còn lại — mã
đang sạch, nên đây là **nợ phòng ngừa**, không phải lỗi đang cháy. Bản `floor-guard.mjs`
mẫu (diff-scoped, đổi ba regex theo ngôn ngữ) có sẵn ở
`.claude/skills/constraint-driven-development/references/floor-guard.md`.

Cùng loại nợ, đo cùng ngày: **trần hiệu năng ở `TECH_SPEC.md` mục 2 phần lớn không có
thước nào đọc** — chỉ cỡ bản build bị CI chặn. Số có mà không có máy bắt là đúng thứ
skill này gọi là mùi hỏng (`SKILL.md` mục Red Flags).

Muốn bịt thì thêm thước vào `scripts/do.sh` — **việc riêng, hỏi chủ dự án trước**,
đừng tiện tay làm khi đang làm việc khác.
