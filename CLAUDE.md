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

Kho **Private**, clone hỏng thì gọi `add_repo` với `access: read` — **đừng xin `push`**,
xin quyền ghi cho repo ngoài phạm vi phiên là bị chặn thẳng, còn `read` qua ngay. Hỏng
tiếp thì **đổi cách hỏi**, đừng thử lại y hệt rồi kết luận là không có quyền: đã mất
nguyên một phiên vì nghĩ vậy (12/09), và một phiên khác vì cắt `head -120` (11/09).

Rồi chạy `docs/DAU_PHIEN.md` — lệnh và bẫy riêng repo này.

**Bảy bước đầu phiên · cách trả lời · luật báo "xong" · sở thích chủ dự án: ĐỀU Ở KHO,
không chép về đây.** Gộp 13/09 — trước đó cùng một luật nằm 4–6 nơi, sửa một nơi là lệch
với năm nơi kia.

**Mỗi phiên một phase.** **TIẾP** = phase kế · **ĐỔI…** = sửa trong phase này ·
**LỖI** = dừng sửa trước. Nhìn được thì `npm run chup:man` gửi ảnh.
Cuối phiên: `docs/NHAT_KY/PHASE_<n>.md` (~15 dòng), ghi đè `docs/TIEN_DO.md` mục 1–5,
in khối `=== VIỆC CỦA ANH BÂY GIỜ ===`.

## Ba luật không được phá

1. **`src/sim/` TypeScript thuần** — cấm `document` `window` WebGL, cấm import `render/`
   `ui/` `bench/`. Import ghi đủ đuôi `.ts`; cấm `constructor(readonly x: T)`.
2. **Cấm số cân bằng trong `.ts`** — mọi tỉ lệ vào `data/*.json`.
3. **Vượt trần hiệu năng là lỗi**, không "tối ưu sau" — `docs/TECH_SPEC.md` mục 2.

## Quy ước

- Comment tiếng Việt; tên biến, tên hàm tiếng Anh.
- Commit tiếng Việt **không dấu**, mỗi việc một commit: `feat: them he thong walker`.
- Asset CC0 · CC-BY · MIT. **CC-BY-SA cấm.** Không copy từ game thương mại.
- **Dò trước khi làm, ba bước, không được bỏ bước nào:**
  1. `grep -io '[a-z0-9_]*<từ khoá>[a-z0-9_]*' docs/KHO_ASSET.md | sort -u` — có thì dùng ngay.
     **Không ra thì dò tiếp `docs/KHO_CHUNG.md`** (cùng lệnh): kho model dùng chung, nằm
     trong git của `tayvuc`, số model đọc được ghi ở **dòng cuối `KHO_CHUNG.md`**. Trúng thì
     `git clone --depth 1 https://github.com/gc1001vn-svg/tayvuc /home/user/tayvuc`
     rồi `npm run kho:lay <gói>`. Kho đó giữ gói **đã lọc** — hầu hết chỉ có `glTF/`, mẻ
     mới trỏ thẳng vào đó (`"loai": "gltf"` hoặc `"glb"`).
     Kho to bao nhiêu thì **đọc dòng cuối `KHO_ASSET.md`**, đừng nhớ số — số gõ tay vào
     tài liệu đã sai ba lần. Chỉ tin dòng "model dùng được"; "lượt file" phồng ~3 lần
     vì mỗi model xuất ra `fbx/` `gltf/` `obj/`. **Cấm `grep -i` trần**: dòng dài 4.870
     ký tự, trúng một dòng mất ~3.300 token thay vì ~180.
  2. Không có → `grep -i '<từ khoá>' docs/NGUON_MO.md` — nguồn ngoài đã tra sẵn. Có thì tải về.
  3. Vẫn không có → **báo chủ dự án quyết**, ghi một dòng vào `NGUON_MO.md` mục 8.
  **Cấm tự vẽ, tự ghép khi chưa đi hết ba bước.** Tải gói mới xong chạy `npm run kho`.
- Thư viện ngoài: đề xuất tên + license + lý do, **chờ đồng ý**.
- **Trước mỗi commit `npm run do`**. Sửa bằng Edit, đừng `python`/`sed` — tốn token.
- File khoá: `.claude/file_khoa.txt`. `KE_HOACH.md` mục 4 và `NHAT_KY/*` chỉ thêm.
  **Hỏi chủ dự án trước; anh đồng ý rồi thì ghi một dòng đường dẫn vào
  `.claude/da_duyet.txt` là `Edit` qua được** — vé dùng một lần, mọi lần đụng đều vào sổ
  `.claude/nhat_ky_file_khoa.log`. Chưa hỏi thì không được tự ghi vé.
- Mâu thuẫn `GAME_SPEC.md` / `TECH_SPEC.md` → hỏi lại, không tự quyết.
