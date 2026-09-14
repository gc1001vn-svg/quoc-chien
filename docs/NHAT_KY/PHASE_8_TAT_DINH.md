# Phiên 14/09 (lần 2) — luật tất định thành thước, và thước khởi động

Không đụng màn hình game. Phiên học luật từ `CLAUDE.md` của
[LivXue/dsh-plugin-shop](https://github.com/LivXue/dsh-plugin-shop) (Apache-2.0) rồi áp
vào repo. Sáu luật vào kho `ghi-nho` (`cong-cu/luat-chi-tiet.md`); hai thứ máy kiểm được
thì thành thước ở đây.

## Đổi gì

- **Luật 1 thêm ba nguồn lệch tất định.** `eslint.config.js` khối `src/sim/**`:
  `no-restricted-syntax` chặn `Math.random` · `Date` · `performance` · `Intl` ·
  `localeCompare` · `toLocale*` · `.sort()` trần; `process` vào `no-restricted-globals`.
  Hàng rào cũ chỉ chặn thứ của trình duyệt nên không thấy ba nguồn này.
- **Hàng rào thứ hai theo lệ sẵn có.** `tests/SimKhongDungTrinhDuyet.test.ts` thêm đúng
  bộ mẫu đó, kèm một test đối chiếu **từng** vi phạm với đúng tên nó phải dính. Lần đầu
  bỏ quên vế này — chủ dự án hỏi mới thấy.
- **Thước `khoi:dong`** (`scripts/khoi_dong.mjs`): mở bản đã build bằng Chromium thật
  trước khi đẩy. Hỏng khi có ngoại lệ chưa bắt · `console.error` · request trả từ
  HTTP 400 trở lên · `#app canvas` không hiện. `npm run do` 8/8 → **9/9**.
- `tools/lib/cdp.mjs` giữ ba loại sự kiện trang (lọc theo danh sách) và có `batMang()`.

## Đo được, không đoán

- **`Network.loadingFailed` KHÔNG báo HTTP 404** — với Chromium 404 là câu trả lời hợp lệ.
  Bản đầu chỉ nghe `loadingFailed` nên atlas thiếu lọt lưới; phải đọc thêm
  `Network.responseReceived` rồi tự xem mã. Cả bốn đường hỏng đã thử bằng vi phạm cố ý.
- **Xoá nhánh remote vẫn không được từ máy ảo** (đo lại 14/09):
  `error: RPC failed; HTTP 403` rồi `fatal: the remote end hung up unexpectedly`.
- Không trùng thước cũ: `check:sw` bắt atlas giữ mãi trên máy người chơi, `check:base`
  bắt nguyên nhân lệch đường dẫn gốc, bước curl trong `deploy.yml` chạy **sau** khi đẩy
  và chỉ đòi HTTP 200 — trang trắng tinh cũng trả 200.

## Còn lại

15 nhánh `claude/*` chết nằm trên remote, chỉ chủ dự án xoá được. Phase 8B không bị chặn.
