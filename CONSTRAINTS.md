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
| Lệnh vẽ mỗi khung, thư viện đồ hoạ ngoài, atlas trong bộ nhớ, `setPixelRatio`, nhịp mô phỏng, dòng mỗi `.ts` | `docs/TECH_SPEC.md` mục 2 | `check:tran` — đọc thẳng số từ bảng đó, không gõ cứng |
| Sprite động mỗi khung | `docs/TECH_SPEC.md` mục 2 | **máy ảo không đo được** — phải chạy `?do=sprite` trên iPhone thật. `check:tran` khai `BO QUA`, không im |
| Ngưỡng token `CLAUDE.md`, trần dòng kế hoạch, danh sách miễn | `.claude/nguong_goc.txt` | `check:nguong` |
| Cặp file phải đọc lại cùng nhau | `.claude/cap_file.txt` | `check:cap` |
| Tên biến: cấm ẩn dụ, tên mang đại lượng phải có đơn vị | `AGENTS.md` mục Quy ước | `check:ten` |
| File phải hỏi chủ dự án trước khi sửa | `.claude/file_khoa.txt` | hook `chan_file_khoa.mjs` |
| Ba luật kiến trúc (`src/sim/` thuần, cấm số cân bằng trong `.ts`) | `AGENTS.md` | `check:base`, `do:luat` |
| Sàn: cấm tắt kiểm tại chỗ, tắt test, để hàm rỗng | mục "Sàn" dưới | `check:san` |

Toàn bộ thước: `scripts/do.sh`. Chạy `npm run do` — số thước đạt in ra ở đó,
**đừng gõ tay vào tài liệu**.

## Sàn (floor)

Skill `constraint-driven-development` canh năm nước đi làm yếu thước. Bốn nước có máy
bắt, nước thứ năm **cố ý không cài**:

1. Hạ ngưỡng đã chốt — `check:nguong`, so với `.claude/nguong_goc.txt`.
2. Thêm dấu tắt kiểm: `@ts-ignore`, `@ts-expect-error`, `eslint-disable`, `# noqa` — `check:san`.
3. Làm test dễ đi: `it.skip`, `describe.only`, `xit` — `check:san`.
4. Hàm rỗng để đó: `catch {}` **rỗng hẳn**, `throw new Error("Not implemented")` — `check:san`.
5. Thêm dòng ngoại lệ mới — **không cài**: repo chưa có bảng ngoại lệ nào, chặn một thứ
   không tồn tại là thêm mã chết.

`catch { /* lý do */ }` **qua được** — 21/09 đếm 8 chỗ như vậy trong `scripts/`, đều là
fail-open cố ý của hook. Muốn nuốt lỗi thì phải viết ra vì sao.

Đo 21/09 lúc dựng thước: cả ba dấu **0 lần** trong `src/` `scripts/` `tools/` `tests/`.
Đây là **lưới dựng trước**, không phải dọn dẹp — bắt dấu đầu tiên ngay khi nó vào, chứ
không đợi đến lúc có một nắm rồi mới cắt.

Ba biểu thức của `check:san` có hàng rào riêng: `tests/CheckSan.test.ts`, mỗi mẫu một ca
PHẢI BẮT và một ca PHẢI CHO QUA (`disableTypeChecked` trong `eslint.config.js`,
`mang.skip(2)`, `catch` có ghi lý do). Sửa regex mà không thêm ca là tự bỏ lưới.

Không dùng bản `floor-guard.mjs` mẫu ở
`.claude/skills/constraint-driven-development/references/floor-guard.md`: nó diff-scoped,
cần mốc nhánh gốc, và regex viết cho JS/Python. Quét toàn repo đơn giản hơn và mã đang sạch.

Cùng loại nợ, đo cùng ngày, **đã bịt 21/09**: trần hiệu năng ở `TECH_SPEC.md` mục 2 khi
đó chỉ có cỡ bản build bị CI chặn — số có mà không có máy bắt, đúng thứ skill này gọi là
mùi hỏng (`SKILL.md` mục Red Flags). Nay `check:tran` đọc sáu dòng trong bảng đó và đối
chiếu với mã thật; hai dòng không kiểm tĩnh được thì nó khai `BO QUA` chứ không im.

Thêm ràng buộc mới thì thêm thước vào `scripts/do.sh` — **việc riêng, hỏi chủ dự án
trước**, đừng tiện tay làm khi đang làm việc khác.
