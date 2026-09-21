# Phiên 21/09 (lần 6) — ba skill ngoài vào bộ đồ nghề

Không chạm mã game. Chủ dự án gửi một bài quảng cáo `addyosmani/agent-skills`, bảo
tìm hiểu và kiểm tra.

## Kiểm cái repo đó

Thật, MIT, 25 skill (24 + meta `using-agent-skills`), 9 lệnh gạch chéo, 4 agent persona,
nội dung dẫn từ *Software Engineering at Google*. Bài quảng cáo nói lệch hai chỗ: khai
4 lệnh (thật 9), và "hơn 70 nền tảng" là của `skills` CLI bên `vercel-labs`, không phải
repo này. **Số star không xác minh được** — máy ảo chặn `api.github.com` cho repo ngoài
phiên, chặn cả HTML `github.com`, `codeload`, `img.shields.io`; web search trả 21k,
WebFetch trả 98k, lệch 4,7 lần. Chỉ `raw.githubusercontent.com` đi được.

## Lấy ba, không lấy 25

22 cái kia trùng với `AGENTS.md` + kho `ghi-nho` + hook + 15 thước + `KE_HOACH.md`, hoặc
mâu thuẫn luật đã chốt (`git-workflow-and-versioning` dạy commit tiếng Anh + trunk-based
PR review; repo này chốt commit tiếng Việt không dấu, đẩy `main` không PR).

Chi phí nạp mỗi phiên, đo theo byte dòng `description:`: `code-simplification` 257 ·
`doubt-driven-development` 500 · `constraint-driven-development` 899 → **1.656 byte
~415 token**. Cả 25 tự bật thì ~1.500 tok/phiên. Cả ba khoá `user-invocable-only`.

## Nghiệm thu đường đi — đạt

`.claude/skills/` trong repo **được harness nạp thật**: `Skill(code-simplification)` trả
`disabled for model invocation in skillOverrides settings`, tức nó biết tên, chỉ chặn
model gọi. Không dùng `npx skills add` — nó cài vào `~/.claude`, tài liệu Claude Code ghi
rõ bản đó "not loaded in Cowork or cloud sessions", và máy ảo dựng lại mỗi phiên.

Bản chuẩn ở `ghi-nho/cong-cu/skills/`, `cai_dat.mjs` mục 4b chép xuống mọi repo.
Chưa chạy lên `tayvuc` (kho cấm — rửa nợ ngưỡng token) và `vsp-fleet-safety` (bỏ hẳn).

## Hai thứ bắt được nhờ làm việc này

1. **`check_kho` đỏ** sau khi thêm: `so-thich.md` 8610/8500, `trang-thai.md` 9603/9000.
   Cắt thật ba đoạn, không nới ngưỡng; kiểm trước khi cắt thì thông tin còn đủ ở
   `cai_dat.mjs` và `quyet-dinh/2026-09-07-tu-mo-va-gop-pr.md:11`.
2. **Trần hiệu năng `TECH_SPEC.md` mục 2 phần lớn không có thước nào đọc** — chỉ cỡ bản
   build bị `ci.yml` chặn. `check:base` đọc `dist/`, `khoi:dong` mở Chromium, không cái
   nào bắt trần. Bắt được vì phải lập bảng "máy bắt bằng" trong `CONSTRAINTS.md`. Nợ mới.

Số đo: 15/15 thước · `ghi-nho` 36/36 mẫu · `cai_dat.mjs` chạy lần hai 0 thay đổi.
