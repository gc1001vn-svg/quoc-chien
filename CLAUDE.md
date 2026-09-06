# CLAUDE.md — QUỐC CHIẾN

Game chiến thuật offline, 2D isometric, PWA trên iPhone.
Đẩy `main` là tự lên https://gc1001vn-svg.github.io/quoc-chien/

## Chủ dự án

Không biết lập trình, làm trên iPhone. **Tiếng Việt**, từng bước bấm gì ở đâu, link đầy đủ.
Nói rõ khi anh ấy sai.

**Mỗi phiên một phase.** Đầu phiên đọc `docs/TIEN_DO.md` → Plan Mode chờ duyệt.
**TIẾP** = phase kế · **ĐỔI…** = sửa trong phase này · **LỖI** = dừng sửa trước.

Nhìn được thì tự chụp `npm run chup:man` gửi ảnh. **Cấm** báo "hoàn thành" khi chưa
xác nhận trên iPhone thật — ghi "chờ xác nhận".

Cuối phiên: viết `docs/NHAT_KY/PHASE_<n>.md` (~15 dòng), ghi đè `docs/TIEN_DO.md` mục 1–5,
in khối `=== VIỆC CỦA ANH BÂY GIỜ ===`.

## Ba luật không được phá

1. **`src/sim/` là TypeScript thuần** — cấm `document`, `window`, WebGL, import `render/`
   `ui/` `bench/`. Nhờ vậy chạy 10 giờ game trong Node và test được logic.
2. **Cấm số cân bằng trong `.ts`** — sát thương, sản lượng, chi phí, tỉ lệ đọc từ
   `data/*.json`.
3. **Vượt trần hiệu năng là lỗi**, không phải "tối ưu sau" — `docs/TECH_SPEC.md` mục 2.

## Quy ước

- Comment tiếng Việt; tên biến, tên hàm tiếng Anh.
- Commit tiếng Việt **không dấu**, mỗi commit một việc: `feat: them he thong walker`.
- Asset chỉ CC0 · CC-BY · MIT. **CC-BY-SA cấm** — lây license sang cả dự án.
- Nội dung **nguyên gốc**: không copy tên, model, texture, bố cục từ game thương mại.
- Thư viện ngoài: đề xuất tên + license + lý do, **chờ đồng ý**, không tự cài.
- **Trước mỗi commit: `npm run do`**.

## Trước khi đụng

File phải hỏi trước: `.claude/file_khoa.txt`.
`docs/TIEN_DO.md`, `docs/KE_HOACH.md` mục 4, `docs/NHAT_KY/*`: chỉ **thêm**, không xoá.
Mâu thuẫn với `GAME_SPEC.md` / `TECH_SPEC.md` → **hỏi lại**, không tự quyết.
