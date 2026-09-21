# AGENTS.md — QUỐC CHIẾN

**File này là bản gốc. `CLAUDE.md` là symlink trỏ vào đây — sửa file này, đừng sửa symlink.**

Game chiến thuật offline, 2D isometric, PWA. Đẩy `main` là tự lên
https://gc1001vn-svg.github.io/quoc-chien/ — **xong việc tự gộp `main`**, không hỏi, không PR.

## Đầu phiên — đọc kho ghi nhớ trước hết

Ba file, **đọc HẾT, cấm `head`/`tail`/`sed -n`** (thứ đắt nhất nằm cuối `trang-thai.md`):

Kho **Private** → phiên mới **không có credential** cho nó. Thứ tự đúng, đừng đảo:

1. Chưa có `/home/user/ghi-nho` → gọi tool **`add_repo`** trước
   (`owner: gc1001vn-svg` · `repo: ghi-nho` · **`access: read`**, đừng xin `push`), rồi
   `git clone --depth 1 https://github.com/gc1001vn-svg/ghi-nho /home/user/ghi-nho`.
2. Có rồi → `git -C /home/user/ghi-nho pull -q`.
3. `cat /home/user/ghi-nho/{so-thich,du-an,trang-thai}.md`

**Cấm `clone` trần khi chưa `add_repo`** — luôn trả
`fatal: could not read Username for 'https://github.com': terminal prompts disabled`,
mất 3 lượt gọi mỗi phiên (đo 20/09). Hỏng tiếp thì **đổi cách hỏi**, đừng thử lại y hệt
rồi kết luận là không có quyền (mất một phiên 12/09 vì vậy, một phiên khác vì `head -120`).

Rồi chạy `docs/DAU_PHIEN.md` — lệnh và bẫy riêng repo này.
**Bảy bước đầu phiên · cách trả lời · luật báo "xong" · sở thích chủ dự án: ĐỀU Ở KHO.**

**Mỗi phiên một phase.** **TIẾP** = phase kế · **ĐỔI…** = sửa trong phase này ·
**LỖI** = dừng sửa trước. Nhìn được thì `npm run chup:man` gửi ảnh.
Cuối phiên: `docs/NHAT_KY/PHASE_<n>.md` (~15 dòng), ghi đè `docs/TIEN_DO.md` mục 1–5,
in khối `=== VIỆC CỦA ANH BÂY GIỜ ===`.

## Ba luật không được phá

1. **`src/sim/` TypeScript thuần** — cấm `document` `window` WebGL, cấm import `render/`
   `ui/` `bench/`. Import ghi đủ đuôi `.ts`; cấm `constructor(readonly x: T)`.
2. **Cấm số cân bằng trong `.ts`** — mọi tỉ lệ vào `data/*.json`.
3. **Vượt trần hiệu năng là lỗi**, không "tối ưu sau" — `docs/TECH_SPEC.md` mục 2.

**Thang tra-trước-khi-viết · cấm đọc trọn file lớn · tra trước khi hỏi chủ dự án: Ở KHO**
(`so-thich.md`). Áp cho mọi repo, không chép về đây.

## Quy ước

- Comment tiếng Việt; tên biến, tên hàm tiếng Anh.
- Commit tiếng Việt **không dấu**, mỗi việc một commit: `feat: them he thong walker`.
- Asset CC0 · CC-BY · MIT. **CC-BY-SA cấm.** Không copy từ game thương mại.
- **Dò asset ba bước, cấm bỏ bước:** `KHO_ASSET.md` → `KHO_CHUNG.md` → `NGUON_MO.md` →
  báo chủ dự án quyết. **Cấm tự vẽ, tự ghép khi chưa đi hết ba bước.**
  Lệnh, cách `grep`, và bẫy từng bước: `docs/DAU_PHIEN.md` mục F.
- Thư viện ngoài: đề xuất tên + license + lý do, **chờ đồng ý**.
- **Trước mỗi commit `npm run do`**. Sửa bằng Edit, đừng `python`/`sed` — tốn token.
- **Mỗi dòng đổi phải truy được về việc được giao.** Cấm tiện tay sửa code, comment, format
  bên cạnh. Code chết có sẵn thì báo, đừng xoá.
- **Thước đỏ thì CẮT, cấm nới ngưỡng** — mốc gốc `.claude/nguong_goc.txt`, `check:nguong`
  bắt. Thước không chạy được thì
  khai `BO QUA`, cấm lờ. Cặp file phải khớp: `check:cap`. Chi tiết: `DAU_PHIEN.md` mục J.
- **Gọi đúng thứ có thật.** Cấm ẩn dụ `gate` `verdict` `ledger` `sidecar` `provenance`
  `evidence` → `check` `validation` `evaluation` `result` `metadata` `record`. Tên mang
  đơn vị: `timeout_seconds`, `token_count`. Thước `check:ten`.
- File khoá: `.claude/file_khoa.txt`. `KE_HOACH.md` mục 4 và `NHAT_KY/*` chỉ thêm.
  **Hỏi chủ dự án trước; anh đồng ý rồi thì ghi một dòng đường dẫn vào
  `.claude/da_duyet.txt` là `Edit` qua được** — vé dùng một lần, mọi lần đụng đều vào sổ
  `.claude/nhat_ky_file_khoa.log`. Chưa hỏi thì không được tự ghi vé.
- Mâu thuẫn `GAME_SPEC.md` / `TECH_SPEC.md` → hỏi lại, không tự quyết.
