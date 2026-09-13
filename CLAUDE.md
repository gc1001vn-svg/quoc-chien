# CLAUDE.md — QUỐC CHIẾN

Game chiến thuật offline, 2D isometric, PWA. Đẩy `main` là tự lên
https://gc1001vn-svg.github.io/quoc-chien/ — **xong việc tự gộp `main`**, không hỏi, không PR.

## Đầu phiên — đọc kho ghi nhớ trước hết

Ba file, **đọc HẾT, cấm `head`/`tail`/`sed -n`** (thứ đắt nhất nằm cuối `trang-thai.md`):

```bash
git -C /home/user/ghi-nho pull -q 2>/dev/null \
  || git clone --depth 1 https://github.com/gc1001vn-svg/ghi-nho /home/user/ghi-nho
cat /home/user/ghi-nho/{so-thich,du-an,trang-thai}.md
```

Kho **Private**, clone hỏng thì `add_repo` với `access: read` — **đừng xin `push`**, bị
chặn thẳng. Hỏng tiếp thì **đổi cách hỏi**, đừng thử lại y hệt rồi kết luận là không có
quyền (mất một phiên 12/09 vì vậy, một phiên khác vì `head -120`).

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

## Tra trước, đừng tự viết — luật đắt nhất về token

Trước khi viết dòng code nào, leo thang, dừng ở bậc đầu tiên đỡ được:
**cần tồn tại không** → **repo đã có chưa** (`grep` trước) → **stdlib** → **nền tảng có sẵn**
→ **thư viện ĐÃ cài** → **một dòng** → mới viết tối thiểu.
Không có trong repo → tra **npm, GitHub, mã nguồn mở**. Vẫn không → tìm công cụ, học cách
người ta làm. **Tự viết là bậc cuối.** Đừng thêm thư viện mới cho thứ vài dòng làm xong.
Bộ đọc GLB từng bị ước "~200 dòng" nên bỏ nhiều phiên — làm thật **30 dòng**, phần khó đã
nằm sẵn trong `tools/lib/gltf.mjs`.

Thang rút ngắn lời giải, **không rút ngắn phần đọc**. Sửa lỗi thì **sửa gốc**: `grep` mọi
nơi gọi hàm sắp sửa, chốt chặn trong hàm dùng chung nhỏ hơn chốt ở từng nơi gọi.

**Đọc file lớn:** ước trên ~10.000 token thì **cấm `Read` trọn**. Lấy dàn bài
`grep -n '^#'` rồi `grep -A/-B` hoặc `Read` với `offset`/`limit`. File dữ liệu lớn trích
bằng `node -e`.

**Trước khi hỏi chủ dự án:** tra ba file kho, rồi tra máy (`manifest.json`, `git log`, tài
liệu chính thức). Chỉ hỏi thứ không tra được.

## Quy ước

- Comment tiếng Việt; tên biến, tên hàm tiếng Anh.
- Commit tiếng Việt **không dấu**, mỗi việc một commit: `feat: them he thong walker`.
- Asset CC0 · CC-BY · MIT. **CC-BY-SA cấm.** Không copy từ game thương mại.
- **Dò asset ba bước, cấm bỏ bước:** `KHO_ASSET.md` → `KHO_CHUNG.md` → `NGUON_MO.md` →
  báo chủ dự án quyết. **Cấm tự vẽ, tự ghép khi chưa đi hết ba bước.**
  Lệnh, cách `grep`, và bẫy từng bước: `docs/DAU_PHIEN.md` mục F.
- Thư viện ngoài: đề xuất tên + license + lý do, **chờ đồng ý**.
- **Trước mỗi commit `npm run do`**. Sửa bằng Edit, đừng `python`/`sed` — tốn token.
- File khoá: `.claude/file_khoa.txt`. `KE_HOACH.md` mục 4 và `NHAT_KY/*` chỉ thêm.
  **Hỏi chủ dự án trước; anh đồng ý rồi thì ghi một dòng đường dẫn vào
  `.claude/da_duyet.txt` là `Edit` qua được** — vé dùng một lần, mọi lần đụng đều vào sổ
  `.claude/nhat_ky_file_khoa.log`. Chưa hỏi thì không được tự ghi vé.
- Mâu thuẫn `GAME_SPEC.md` / `TECH_SPEC.md` → hỏi lại, không tự quyết.
