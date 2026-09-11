# CLAUDE.md — QUỐC CHIẾN

Game chiến thuật offline, 2D isometric, PWA. Đẩy `main` là tự lên
https://gc1001vn-svg.github.io/quoc-chien/ — **xong việc tự gộp `main`**, không hỏi, không PR.

## Chủ dự án

Không biết lập trình, làm trên iPhone. Từng bước bấm gì ở đâu, link đầy đủ.
**Mỗi phiên một phase.** Đầu phiên chạy `docs/DAU_PHIEN.md` → Plan Mode chờ duyệt.
Máy ảo mới mỗi phiên: `npm ci`; phiên có nướng sprite thì `npm run tai:tatca` (~440 MB).
**TIẾP** = phase kế · **ĐỔI…** = sửa trong phase này · **LỖI** = dừng sửa trước.
Nhìn được thì `npm run chup:man` gửi ảnh. **Cấm** báo "hoàn thành" khi chưa xác nhận trên
iPhone thật — ghi "chờ xác nhận".
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
     trong git của `tayvuc`, **1.310 model** máy nướng đọc được. Trúng thì
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
- Mâu thuẫn `GAME_SPEC.md` / `TECH_SPEC.md` → hỏi lại, không tự quyết.
