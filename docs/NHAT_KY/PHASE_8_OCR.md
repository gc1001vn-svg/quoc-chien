# PHASE 8 — soát code bằng `open-code-review` (18/09/2026, lần 3)

Đồ nghề, **không chạm mã game**. Phiên thứ mười ba liền không đụng màn hình game.

Chủ dự án hỏi về `alibaba/open-code-review` (36.113 sao, Go, Apache-2.0, npm
`@alibaba-group/open-code-review` 1.12.5). Cài thử, đo, rồi cắm vào repo.

## Đo được gì

- **Delegation Mode chạy, không cần API key.** `ocr` lo phần tất định (chọn file, gom
  file, khớp luật), Claude tự đọc code tìm lỗi. `ocr delegate preview --commit <hash>`
  lọc đúng: commit docs ra `0 reviewable / 1 total`.
- **`ocr review` và `ocr scan` chết ở máy ảo**, cả hai trả
  `Error: resolve LLM endpoint: no valid LLM endpoint configured; ...`. Không có key.
  **Không lấy token đăng nhập của Claude Code đắp vào** — sai mục đích cấp quyền.
- Mạng: `api.anthropic.com` **401** (thông) · `api.openai.com` **000** ·
  `dashscope.aliyuncs.com` **000** · `open-codereview.ai` **chặn egress** (đọc tài liệu
  phải clone repo họ).
- **Luật hệ thống cho `.ts` toàn React** (Hooks, `useMemo`, XSS, `innerHTML`) — repo này
  không có React, nhiễu gần nửa. Và nó **mù ba luật của repo**.

## Làm gì

`.opencodereview/rule.json` — tầng 2 trong chuỗi bốn tầng, đè luật hệ thống, lên git.
Bảy nhóm xét theo thứ tự khai báo: `src/sim/**` · `src/render/**` · `src/ui/**` ·
`src/{core,bench}/**` · `src/**/*.ts` · `data/**/*.json` · `{scripts,tools}/**`.
**Thêm nhóm mới phải đặt trước `src/**/*.ts`**, không thì bị nó nuốt.

Nội dung lấy từ `CLAUDE.md` mục Ba luật và `TECH_SPEC` mục 1–2. Thêm hai thứ tài liệu
luật không ghi thẳng nhưng đã thành thước: cấm `Math.random()` trong `src/sim/` (phải qua
`core/Rng.ts`), và file `core/` vừa được sim import vừa chạm trình duyệt là lỗi.

`npm run soat` = `ocr delegate preview --format json`, `npm run soat:luat` =
`ocr rules check`. Cách dùng và ba bẫy: `docs/DAU_PHIEN.md` mục I.

## Kiểm

10/11 đường dẫn mẫu ra `Source: Project (.opencodereview/rule.json)`, đúng pattern.
Cái thứ 11 (`docs/TECH_SPEC.md`) rơi về `System built-in` nhưng nằm trong `exclude` nên
không soát tới — `preview` báo `(excluded: user_exclude)`.
Nhiễu React còn **1** hit, là dòng `innerHTML` cố ý viết cho `src/ui/`.

## Chưa xong

Chưa đo được nó **bắt thêm lỗi nào** so với soát tay — phải có diff thật của Phase 8B.
Skill `open-code-review-delegate` (Apache-2.0, 188 dòng) chưa tải lên tài khoản; chỉ làm
nếu bước đo trên thắng.

**Luật là chữ nhắc, không phải thước chặn.** Hàng rào thật vẫn là ESLint và `npm run do`.
