# Phiên 22/09 — tra Graft, rồi tự làm `ai_goi.mjs`

**Không mở phase mới** — phiên đồ nghề. Chủ dự án gửi ảnh một video giới thiệu
`@nanonets/graft` và bảo kiểm tra thật.

- **Chạy thật, không đọc quảng cáo.** `graft build` trên bản sao repo: 6,4 giây, 850 node,
  2.298 cạnh, ra `graft/` 3,9 MB. Cài chiếm **392 MB** (388 MB là binding tree-sitter 8
  ngôn ngữ repo này không dùng).
- **Card markdown của nó THUA `grep`.** Cùng câu hỏi "API của `City.ts`": đọc trọn file
  ~2.876 token · `grep` dàn ý **~322** · card graft ~428. Card structural chỉ là danh sách
  symbol; văn xuôi phải `--deep`, tốn tiền LLM.
- **`graft callers` thì THẮNG, và thắng đậm** — nhưng chỉ khi tên trùng nhiều: `ve`
  328 tok so `grep` 11.125 (**34×**), `doi` 428 so 8.623, `nhip` 295 so 2.049. Tên hiếm
  (`xayNha`) thì `grep` vẫn rẻ hơn. Ranh giới là **độ phổ biến của tên**, không phải cỡ repo.
- **Điểm trừ phải nhớ:** mỗi lệnh `graft callers` nhét vào ngữ cảnh trợ lý một dòng bảo
  nó **quảng cáo số token đã tiết kiệm** trong câu trả lời gửi chủ dự án
  (`dist/context/savings.js`, `savingsTurnNudge`, có cả nhánh quy ra USD). Và con số
  "98%" so với baseline họ tự chọn ("đọc trọn 4 file"), không phải so với `grep`.
- **Chốt: lấy ý, bỏ công cụ.** `scripts/ai_goi.mjs` dùng TypeScript Compiler API —
  `typescript` đã nằm sẵn trong `devDependencies`, **không thêm phụ thuộc nào**.
  `ve` **190** tok · `nhip` **192** · `doi` **110** · `xayNha` **93** — rẻ hơn Graft cả
  bốn ca, và ra đủ 4 chỗ gọi mà Graft gộp còn 3.
- **Bẫy đã sập:** `doi` có 8 khai báo trùng tên, chỉ 1 là method thật. Không lọc
  `VariableDeclaration`/`PropertyDeclaration` rỗng hàm thì chính script đẻ ra đúng cái
  nhiễu nó định cắt. `tests/AiGoi.test.ts` khoá cả hai nửa lời hứa.
- Vào `cai_dat.mjs` mục **1a**, chép **có điều kiện** (cần `tsconfig.json` + `typescript`),
  thiếu thì in lý do chứ không im. **Không phải thước** — không nối vào `do.sh`.

Số đo: `npm run do` **17/17 thước đạt**. Lý do đầy đủ, số đo Graft:
kho `ghi-nho`, `quyet-dinh/2026-09-22-graft-chua-dung.md`.
