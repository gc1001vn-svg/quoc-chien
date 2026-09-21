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

## Bịt cả hai nợ ngay trong phiên

**Thước `check:tran`** (`scripts/check_tran.mjs`, `npm run do` giờ 16 thước). Đọc số
thẳng từ bảng `TECH_SPEC.md` mục 2 — không gõ cứng, sửa trần thì sửa một chỗ. Sáu dòng
kiểm tĩnh: dòng mỗi `.ts` · thư viện đồ hoạ ngoài (`dependencies` rỗng) · `Math.min(dpr, 2)`
trong `Gl.datKichThuoc` · `NHIP_MOI_GIAY` khớp Hz trong spec · số trang và cạnh atlas ·
số lớp trong `Perf.LayerName` (chặn trên của số lệnh vẽ mỗi khung). Hai dòng khai
`BO QUA`: sprite động (phải đo `?do=sprite` trên iPhone) và cỡ bản build (`ci.yml` chặn).
Thử âm: hạ trần dòng xuống 250 và đổi `NHIP_MOI_GIAY` thành 12 → thước bắt cả hai, `exit=1`.

**Hook `chan_vong_vo_han.mjs`** vào móc `PreToolUse` của bộ đồ nghề mọi repo. Vòng
`while`/`until` có chờ (`sleep` `curl` `wget` `git fetch`) mà không có trần — `timeout`
bọc ngoài, hoặc `for i in $(seq 1 N)` / `{1..N}` — thì chặn, kèm ba cách thay. Tám mẫu
thử trong `ghi-nho/scripts/do.sh` (`thu_vong`), 9/9 ca đúng.

Vì sao là hook chứ không phải thêm một dòng tài liệu: cùng lỗi đã ghi vào kho trước đó
mà vẫn tái diễn. Chữ không chặn được cái mình quên.

## Thước `check:san` — bịt nốt sàn

Chủ dự án chốt làm ngay. `scripts/check_san.mjs`, thước thứ 17. Ba mẫu: tắt kiểm tại chỗ
(`@ts-ignore` `@ts-expect-error` `eslint-disable` `# noqa`) · test bị tắt (`it.skip`
`describe.only` `xit`) · hàm rỗng (`catch {}` rỗng hẳn, `throw new Error("Not implemented")`).

Đo trước khi dựng: cả ba **0 lần** trong `src/` `scripts/` `tools/` `tests/`. Nhưng
`catch { /* lý do */ }` có **8 chỗ** ở `scripts/` — fail-open cố ý của hook. Nên luật là
cấm `catch` **rỗng hẳn**, có comment thì qua: ai nuốt lỗi phải viết ra vì sao. Nước thứ
năm của skill (thêm dòng ngoại lệ) **không cài** — repo không có bảng ngoại lệ nào.

Hai bẫy tự gây, sửa ngay trong phiên:
- Bộ thử `tests/CheckSan.test.ts` chứa đúng các dấu nó thử → thước bắt chính nó. Thêm
  file đó và `check_san.mjs` vào `BO_QUA`.
- `import { MAU }` trong test chạy luôn thân thước rồi `process.exit(0)` giữa bộ test.
  Bọc thân trong `do_repo()` và chỉ chạy khi `pathToFileURL(process.argv[1]).href ===
  import.meta.url`. Kèm `scripts/check_san.d.ts` để test import không phải dùng
  `@ts-expect-error` — chính dấu mà thước cấm.

Thử âm 10/10 ca (6 ca phải bắt, 4 ca phải cho qua: `catch` có lý do, `disableTypeChecked`
của `eslint.config.js`, `mang.skip(2)`, mã sạch). `tests/CheckSan.test.ts` 13 test xanh.

Số đo: 17/17 thước · `ghi-nho` 47/47 mẫu · `cai_dat.mjs` chạy lần hai 0 thay đổi.
