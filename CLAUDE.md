# CLAUDE.md — QUỐC CHIẾN

Game chiến thuật offline, 2D isometric, PWA. Đẩy `main` là tự lên
https://gc1001vn-svg.github.io/quoc-chien/ — **xong việc tự gộp `main`**, không hỏi, không PR.

## Chủ dự án

Không biết lập trình, làm trên iPhone. Từng bước bấm gì ở đâu, link đầy đủ.
**Mỗi phiên một phase.** Đầu phiên đọc `docs/TIEN_DO.md` → Plan Mode chờ duyệt.
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
- Thư viện ngoài: đề xuất tên + license + lý do, **chờ đồng ý**.
- **Trước mỗi commit `npm run do`**. Sửa bằng Edit, đừng `python`/`sed` — tốn token.
- File khoá: `.claude/file_khoa.txt`. `KE_HOACH.md` mục 4 và `NHAT_KY/*` chỉ thêm.
- Mâu thuẫn `GAME_SPEC.md` / `TECH_SPEC.md` → hỏi lại, không tự quyết.
