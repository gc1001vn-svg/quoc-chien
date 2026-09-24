# AGENTS.md — QUỐC CHIẾN

**File này là bản gốc; `CLAUDE.md` là symlink trỏ vào đây — sửa file này.**

Game chiến thuật offline, 2D isometric, PWA. Đẩy `main` là tự lên
https://gc1001vn-svg.github.io/quoc-chien/ — **xong việc tự gộp `main`** luôn, không PR.

## Đầu phiên — đọc kho ghi nhớ trước hết

Ba file, **`cat` trọn từng file** — thứ đắt nhất nằm ở cuối `trang-thai.md`.

Kho **Private** → phiên mới chưa có credential cho nó. Làm đúng thứ tự:

1. Chưa có `/home/user/ghi-nho` → gọi tool **`add_repo`** trước
   (`owner: gc1001vn-svg` · `repo: ghi-nho` · **`access: read`** là đủ), rồi
   `git clone --depth 1 https://github.com/gc1001vn-svg/ghi-nho /home/user/ghi-nho`.
   **Không gọi `register_repo_root`** — nạp thừa `CLAUDE.md` của kho, thêm một hộp thoại.
2. Có rồi → `git -C /home/user/ghi-nho pull -q`.
3. `cat /home/user/ghi-nho/{so-thich,du-an,trang-thai}.md`

`add_repo` là thứ mở khoá: clone khi chưa gọi nó luôn trả
`fatal: could not read Username for 'https://github.com': terminal prompts disabled`,
mất 3 lượt gọi (đo 20/09). Hỏng tiếp thì **đổi cách hỏi** rồi mới kết luận về quyền
(mất một phiên 12/09 vì thử lại y hệt, một phiên khác vì `head -120`).

Rồi chạy `docs/DAU_PHIEN.md` — lệnh và bẫy riêng repo này.
**Bảy bước đầu phiên · cách trả lời · luật báo "xong" · sở thích chủ dự án: ĐỀU Ở KHO.**

**Mỗi phiên một phase.** **TIẾP** = phase kế · **ĐỔI…** = sửa trong phase này ·
**LỖI** = sửa lỗi trước hết, theo skill `diagnosing-bugs`: có lệnh bắt đỏ đúng lỗi rồi
mới đoán nguyên nhân. Nhìn được thì `npm run chup:man` gửi ảnh.
Cuối phiên: `docs/NHAT_KY/PHASE_<n>.md` (~15 dòng), ghi đè `docs/TIEN_DO.md` mục 1–5,
in khối `=== VIỆC CỦA ANH BÂY GIỜ ===`.

## Ba luật cứng

1. **`src/sim/` là TypeScript thuần** — chỉ import trong `src/sim/`, ghi đủ đuôi `.ts`.
   Cứng: không `document` `window` WebGL, không import `render/` `ui/` `bench/`,
   không `constructor(readonly x: T)` — khai trường trong thân lớp.
2. **Mọi số cân bằng, mọi tỉ lệ nằm trong `data/*.json`**; `.ts` chỉ đọc ra.
3. **Vượt trần hiệu năng là lỗi**, sửa ngay trong phase — `docs/TECH_SPEC.md` mục 2.

**Thang tra-trước-khi-viết · đọc file lớn theo từng đoạn · tra trước khi hỏi chủ dự án:
Ở KHO** (`so-thich.md`). Áp cho mọi repo; bản duy nhất nằm ở kho.

## Quy ước

- Comment tiếng Việt; tên biến, tên hàm tiếng Anh.
- Commit tiếng Việt **không dấu**, mỗi việc một commit: `feat: them he thong walker`.
- Asset chỉ nhận **CC0 · CC-BY · MIT**, tự tìm hoặc tải từ nguồn mở. CC-BY-SA và đồ
  chép từ game thương mại: loại.
- **Dò asset đủ ba bước:** `KHO_ASSET.md` → `KHO_CHUNG.md` → `NGUON_MO.md` → báo chủ dự
  án quyết. Tự vẽ, tự ghép chỉ sau khi anh quyết.
  Lệnh, cách `grep`, và bẫy từng bước: `docs/DAU_PHIEN.md` mục F.
- Thư viện ngoài: đề xuất tên + license + lý do + độ tin (sao, lượt cài, ai làm) + telemetry
  (bật sẵn? gửi gì? tắt sao?), **chờ đồng ý**.
- **Trước mỗi commit `npm run do`**. Sửa bằng Edit — rẻ token hơn `python`/`sed`.
- **Mỗi dòng đổi phải truy được về việc được giao.** Code, comment, format bên cạnh giữ
  nguyên. Code chết có sẵn thì báo, để chủ dự án quyết.
- **Thước đỏ thì CẮT cho xuống dưới ngưỡng**; ngưỡng giữ nguyên — mốc gốc
  `.claude/nguong_goc.txt`, `check:nguong` bắt. Thước không chạy được thì khai `BO QUA`.
  Cặp file phải khớp: `check:cap`. Chi tiết: `DAU_PHIEN.md` mục J.
- **Gọi đúng thứ có thật**, tên mang nghĩa đen: `check` `validation` `evaluation`
  `result` `metadata` `record` (thay ẩn dụ `gate` `verdict` `ledger` `sidecar`
  `provenance` `evidence`). Tên mang đơn vị: `timeout_seconds`, `token_count`.
  Thước `check:ten`.
- File khoá: `.claude/file_khoa.txt`. `KE_HOACH.md` mục 4 và `NHAT_KY/*` chỉ thêm.
  **Hỏi chủ dự án trước; anh đồng ý rồi thì ghi một dòng đường dẫn vào
  `.claude/da_duyet.txt` là `Edit` qua được** — vé dùng một lần, mọi lần đụng đều vào sổ
  `.claude/nhat_ky_file_khoa.log`. Vé chỉ ghi sau khi anh đồng ý.
- Mâu thuẫn `GAME_SPEC.md` / `TECH_SPEC.md` → hỏi lại chủ dự án.
